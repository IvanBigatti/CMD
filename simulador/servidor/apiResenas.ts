import { mkdirSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import type { Connect, Plugin } from 'vite'

/**
 * API local de reseñas: GET y POST en /api/resenas, guardadas en SQLite (datos/resenas.db).
 * Corre dentro de `npm run dev` y `npm run preview`; el build estático no la incluye.
 * La base se versiona: queda en modo de diario DELETE para que todo viva en un solo archivo (sin -wal ni -shm).
 */

const ARCHIVO = join(dirname(fileURLToPath(import.meta.url)), '..', 'datos', 'resenas.db')

/** Actividades que se pueden reseñar: las mismas claves de ITINERARIOS que tienen práctica guiada */
const CLAVES = new Set(['mep', 'cedear', 'on', 'venta', 'completo'])

const LIMITES = { nombre: 40, comentario: 500, cuerpo: 10_000 }

let db: DatabaseSync | null = null

function abrir(): DatabaseSync {
  if (db) return db
  mkdirSync(dirname(ARCHIVO), { recursive: true })
  db = new DatabaseSync(ARCHIVO)
  db.exec(`
    PRAGMA journal_mode = DELETE;
    CREATE TABLE IF NOT EXISTS resenas (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      clave      TEXT    NOT NULL,
      nombre     TEXT    NOT NULL CHECK (length(nombre) BETWEEN 1 AND ${LIMITES.nombre}),
      comentario TEXT    NOT NULL CHECK (length(comentario) BETWEEN 1 AND ${LIMITES.comentario}),
      puntuacion INTEGER NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
      fecha      TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE INDEX IF NOT EXISTS resenas_por_clave ON resenas (clave, fecha DESC);
  `)
  return db
}

const COLUMNAS = 'id, clave, nombre, comentario, puntuacion, fecha'

function listar(clave: string | null) {
  const base = abrir()
  return clave
    ? base.prepare(`SELECT ${COLUMNAS} FROM resenas WHERE clave = ? ORDER BY fecha DESC`).all(clave)
    : base.prepare(`SELECT ${COLUMNAS} FROM resenas ORDER BY fecha DESC`).all()
}

/** Valida lo que llega del formulario; devuelve el mensaje de error o los datos limpios */
function validar(datos: unknown): string | { clave: string; nombre: string; comentario: string; puntuacion: number } {
  if (!datos || typeof datos !== 'object') return 'Faltan los datos de la reseña.'
  const d = datos as Record<string, unknown>
  const clave = typeof d.clave === 'string' ? d.clave : ''
  const nombre = typeof d.nombre === 'string' ? d.nombre.trim() : ''
  const comentario = typeof d.comentario === 'string' ? d.comentario.trim() : ''
  const puntuacion = d.puntuacion
  if (!CLAVES.has(clave)) return 'La capacitación no existe.'
  if (!nombre || nombre.length > LIMITES.nombre) return `Escribí tu nombre (hasta ${LIMITES.nombre} letras).`
  if (!comentario || comentario.length > LIMITES.comentario) return `Escribí un comentario (hasta ${LIMITES.comentario} letras).`
  if (typeof puntuacion !== 'number' || !Number.isInteger(puntuacion) || puntuacion < 1 || puntuacion > 5) return 'Elegí de 1 a 5 estrellas.'
  return { clave, nombre, comentario, puntuacion }
}

function crear(datos: unknown) {
  const r = validar(datos)
  if (typeof r === 'string') return { error: r }
  const fila = abrir()
    .prepare(`INSERT INTO resenas (clave, nombre, comentario, puntuacion) VALUES (?, ?, ?, ?) RETURNING ${COLUMNAS}`)
    .get(r.clave, r.nombre, r.comentario, r.puntuacion)
  return { resena: fila }
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
    if (req.method === 'GET') {
      const clave = new URL(req.url ?? '/', 'http://local').searchParams.get('clave')
      return responder(res, 200, listar(clave))
    }
    if (req.method === 'POST') {
      let datos: unknown
      try { datos = JSON.parse(await leerCuerpo(req)) } catch { return responder(res, 400, { error: 'Los datos enviados no son válidos.' }) }
      const r = crear(datos)
      return 'error' in r ? responder(res, 400, r) : responder(res, 201, r.resena)
    }
    res.setHeader('Allow', 'GET, POST')
    responder(res, 405, { error: 'Método no permitido.' })
  } catch (e) {
    console.error('[api/resenas]', e)
    responder(res, 500, { error: 'No pudimos guardar la reseña. Probá de nuevo.' })
  }
}

/** Plugin de Vite que monta la API en /api/resenas */
export function apiResenas(): Plugin {
  return {
    name: 'api-resenas',
    configureServer(server) { server.middlewares.use('/api/resenas', manejar) },
    configurePreviewServer(server) { server.middlewares.use('/api/resenas', manejar) },
  }
}
