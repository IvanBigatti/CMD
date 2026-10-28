import { mkdirSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'

/**
 * API local de evaluaciones, guardadas en SQLite (datos/evaluaciones.db):
 *   POST /api/evaluaciones           guarda un resultado (cuestionario, desafío o autoevaluación)
 *   GET  /api/evaluaciones/resumen   totales por capacitación, para la página #/resultados
 * Corre dentro de `npm run dev` y `npm run preview`; el build estático no la incluye.
 * Igual que la de reseñas, usa el diario DELETE para que todo viva en un solo archivo.
 */

const ARCHIVO = join(dirname(fileURLToPath(import.meta.url)), '..', 'datos', 'evaluaciones.db')

/** Las mismas claves que CLAVES_EVALUABLES en src/contenido/evaluaciones.ts */
const CLAVES = ['mep', 'cedear', 'on', 'venta', 'completo']
const TIPOS = new Set(['cuestionario', 'desafio', 'confianza'])
const MOMENTOS = new Set(['antes', 'despues'])
/** Igual que UMBRAL_APROBACION en src/contenido/evaluaciones.ts */
const UMBRAL_APROBACION = 0.7

const LIMITES = { cuerpo: 10_000, detalle: 6_000, total: 50 }

let db: DatabaseSync | null = null

function abrir(): DatabaseSync {
  if (db) return db
  mkdirSync(dirname(ARCHIVO), { recursive: true })
  db = new DatabaseSync(ARCHIVO)
  db.exec(`
    PRAGMA journal_mode = DELETE;
    CREATE TABLE IF NOT EXISTS evaluaciones (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      clave        TEXT    NOT NULL,
      participante TEXT    NOT NULL,
      tipo         TEXT    NOT NULL CHECK (tipo IN ('cuestionario', 'desafio', 'confianza')),
      momento      TEXT             CHECK (momento IN ('antes', 'despues')),
      puntaje      INTEGER NOT NULL CHECK (puntaje >= 0),
      total        INTEGER NOT NULL CHECK (total > 0 AND puntaje <= total),
      detalle      TEXT,
      fecha        TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE INDEX IF NOT EXISTS evaluaciones_por_clave ON evaluaciones (clave, tipo);
  `)
  return db
}

/** Una fila de la tabla (sin id ni fecha) */
interface Fila {
  clave: string
  participante: string
  tipo: string
  momento: string | null
  puntaje: number
  total: number
  detalle: string | null
}

const esEntero = (x: unknown): x is number => typeof x === 'number' && Number.isInteger(x)

/** Valida lo que llega del sitio; devuelve el mensaje de error o los datos limpios */
function validar(datos: unknown): string | Fila {
  if (!datos || typeof datos !== 'object') return 'Faltan los datos de la evaluación.'
  const d = datos as Record<string, unknown>
  const clave = typeof d.clave === 'string' ? d.clave : ''
  const participante = typeof d.participante === 'string' ? d.participante : ''
  const tipo = typeof d.tipo === 'string' ? d.tipo : ''
  const momento = typeof d.momento === 'string' ? d.momento : null
  const { puntaje, total } = d

  if (!CLAVES.includes(clave)) return 'La capacitación no existe.'
  if (!/^[A-Za-z0-9-]{8,64}$/.test(participante)) return 'Falta el código de participante.'
  if (!TIPOS.has(tipo)) return 'El tipo de evaluación no es válido.'
  if (!esEntero(total) || total < 1 || total > LIMITES.total) return 'El total no es válido.'
  if (!esEntero(puntaje) || puntaje < 0 || puntaje > total) return 'El puntaje no es válido.'
  if (tipo === 'confianza') {
    if (!momento || !MOMENTOS.has(momento)) return 'Falta indicar si la autoevaluación es de antes o de después.'
    if (total !== 5 || puntaje < 1) return 'La autoevaluación va de 1 a 5.'
  } else if (momento !== null) {
    return 'Solo la autoevaluación lleva momento.'
  }

  let detalle: string | null = null
  if (d.detalle !== undefined && d.detalle !== null) {
    detalle = JSON.stringify(d.detalle)
    if (detalle.length > LIMITES.detalle) return 'El detalle es demasiado largo.'
  }
  return { clave, participante, tipo, momento, puntaje, total, detalle }
}

function crear(datos: unknown) {
  const r = validar(datos)
  if (typeof r === 'string') return { error: r }
  abrir()
    .prepare('INSERT INTO evaluaciones (clave, participante, tipo, momento, puntaje, total, detalle) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(r.clave, r.participante, r.tipo, r.momento, r.puntaje, r.total, r.detalle)
  return { ok: true }
}

const promedio = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

/** Respuestas de un cuestionario guardado: [{ pregunta, correcta }] (ignora lo que no tenga esa forma) */
function respuestasDe(detalle: string | null): { pregunta: string; correcta: boolean }[] {
  if (!detalle) return []
  try {
    const d = JSON.parse(detalle) as { respuestas?: unknown }
    if (!Array.isArray(d.respuestas)) return []
    return d.respuestas.filter(
      (x): x is { pregunta: string; correcta: boolean } =>
        !!x && typeof x.pregunta === 'string' && typeof x.correcta === 'boolean',
    )
  } catch {
    return []
  }
}

/** Totales por capacitación (la forma está en ResumenCapacitacion, src/datos/evaluaciones.ts) */
function resumen() {
  const filas = abrir()
    .prepare('SELECT clave, participante, tipo, momento, puntaje, total, detalle FROM evaluaciones')
    .all() as unknown as Fila[]

  return CLAVES.map((clave) => {
    const propias = filas.filter((f) => f.clave === clave)
    const cuestionarios = propias.filter((f) => f.tipo === 'cuestionario')
    const desafios = propias.filter((f) => f.tipo === 'desafio')
    const confianza = (momento: string) => promedio(propias.filter((f) => f.tipo === 'confianza' && f.momento === momento).map((f) => f.puntaje))

    const porPregunta = new Map<string, { respuestas: number; aciertos: number }>()
    for (const c of cuestionarios) {
      for (const r of respuestasDe(c.detalle)) {
        const p = porPregunta.get(r.pregunta) ?? { respuestas: 0, aciertos: 0 }
        p.respuestas++
        if (r.correcta) p.aciertos++
        porPregunta.set(r.pregunta, p)
      }
    }

    return {
      clave,
      participantes: new Set(propias.map((f) => f.participante)).size,
      cuestionarios: cuestionarios.length,
      promedio: promedio(cuestionarios.map((f) => f.puntaje / f.total)),
      aprobados: cuestionarios.filter((f) => f.puntaje / f.total >= UMBRAL_APROBACION).length,
      desafios: new Set(desafios.map((f) => f.participante)).size,
      desafiosOk: new Set(desafios.filter((f) => f.puntaje === f.total).map((f) => f.participante)).size,
      confianzaAntes: confianza('antes'),
      confianzaDespues: confianza('despues'),
      preguntas: [...porPregunta].map(([id, p]) => ({ id, ...p })),
    }
  })
}

function leerCuerpo(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let cuerpo = ''
    req.setEncoding('utf8')
    req.on('data', (parte: string) => {
      cuerpo += parte
      if (cuerpo.length > LIMITES.cuerpo) reject(new Error('demasiado grande'))
    })
    req.on('end', () => resolve(cuerpo))
    req.on('error', reject)
  })
}

function responder(res: ServerResponse, estado: number, datos: unknown) {
  res.statusCode = estado
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(datos))
}

const manejar: Connect.NextHandleFunction = async (req, res) => {
  try {
    // Montada en /api/evaluaciones: acá req.url llega sin ese prefijo ("/" o "/resumen")
    const ruta = new URL(req.url ?? '/', 'http://local').pathname.replace(/\/+$/, '')
    if (req.method === 'GET' && ruta === '/resumen') return responder(res, 200, resumen())
    if (req.method === 'POST' && ruta === '') {
      let datos: unknown
      try { datos = JSON.parse(await leerCuerpo(req)) } catch { return responder(res, 400, { error: 'Los datos enviados no son válidos.' }) }
      const r = crear(datos)
      return 'error' in r ? responder(res, 400, r) : responder(res, 201, r)
    }
    if (ruta !== '' && ruta !== '/resumen') return responder(res, 404, { error: 'No existe.' })
    res.setHeader('Allow', ruta === '' ? 'POST' : 'GET')
    responder(res, 405, { error: 'Método no permitido.' })
  } catch (e) {
    console.error('[api/evaluaciones]', e)
    responder(res, 500, { error: 'No pudimos guardar el resultado. Probá de nuevo.' })
  }
}

/** Plugin de Vite que monta la API en /api/evaluaciones */
export function apiEvaluaciones(): Plugin {
  return {
    name: 'api-evaluaciones',
    configureServer(server) { server.middlewares.use('/api/evaluaciones', manejar) },
    configurePreviewServer(server) { server.middlewares.use('/api/evaluaciones', manejar) },
  }
}
