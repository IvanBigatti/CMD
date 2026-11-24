import { useEffect, useState } from 'react'
import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Acceso a las reseñas: tabla `resenas` en Supabase (proyecto cmd-capacitacion-iol), por su API REST.
 * La clave publicable es pública por diseño. Lo que protege los datos son los permisos de la tabla:
 * el público puede leer y agregar reseñas, pero no editarlas, borrarlas ni leer `costo_mas`.
 * Las pantallas no conocen el backend: alcanza con cambiar este archivo para usar otro.
 */

export interface Resena {
  id: number
  clave: ClaveItinerario
  nombre: string
  comentario: string
  /** 1 a 5 estrellas */
  puntuacion: number
  /** ISO 8601 */
  fecha: string
}

/** `costoMas` es privado: se guarda para mejorar el material y nunca se devuelve ni se muestra */
export type ResenaNueva = Pick<Resena, 'clave' | 'nombre' | 'comentario' | 'puntuacion'> & { costoMas?: string }

const API = 'https://vgpfpdjeialwhafctqzj.supabase.co/rest/v1/resenas'
const CLAVE_PUBLICABLE = 'sb_publishable_tyE6OtRi3QDyAKCGRJ0SgA_IGPwMF5e'

/** Columnas públicas: costo_mas es privado y la base no deja leerlo */
const COLUMNAS = 'id,clave,nombre,comentario,puntuacion,fecha'

/** Actividades que se pueden reseñar. La base tiene la misma restricción */
const CLAVES: readonly string[] = ['mep', 'cedear', 'on', 'venta', 'completo']
const LIMITES = { nombre: 40, comentario: 500, costoMas: 300 }
const ERROR_GUARDAR = 'No pudimos guardar la reseña. Probá de nuevo.'

/** Mismas reglas que las restricciones de la tabla, para mostrar un mensaje claro antes de enviar */
function validar(nueva: ResenaNueva): string | null {
  const nombre = nueva.nombre.trim()
  const comentario = nueva.comentario.trim()
  if (!CLAVES.includes(nueva.clave)) return 'La capacitación no existe.'
  if (!nombre || nombre.length > LIMITES.nombre) return `Escribí tu nombre (hasta ${LIMITES.nombre} letras).`
  if (!comentario || comentario.length > LIMITES.comentario) return `Escribí un comentario (hasta ${LIMITES.comentario} letras).`
  if (!Number.isInteger(nueva.puntuacion) || nueva.puntuacion < 1 || nueva.puntuacion > 5) return 'Elegí de 1 a 5 estrellas.'
  if ((nueva.costoMas?.trim().length ?? 0) > LIMITES.costoMas) return `“¿Qué te costó más?” admite hasta ${LIMITES.costoMas} letras.`
  return null
}

/** Reseñas de una capacitación (o de todas), de la más nueva a la más vieja */
export async function listarResenas(clave?: ClaveItinerario): Promise<Resena[]> {
  const filtro = clave ? `&clave=eq.${encodeURIComponent(clave)}` : ''
  const r = await fetch(`${API}?select=${COLUMNAS}${filtro}&order=fecha.desc`, { headers: { apikey: CLAVE_PUBLICABLE } })
  if (!r.ok) throw new Error('No pudimos cargar las reseñas.')
  return r.json()
}

/** Guarda una reseña; si algo falla, el error trae un mensaje para mostrar */
export async function crearResena(nueva: ResenaNueva): Promise<Resena> {
  const error = validar(nueva)
  if (error) throw new Error(error)
  const costoMas = nueva.costoMas?.trim()
  let r: Response
  try {
    r = await fetch(`${API}?select=${COLUMNAS}`, {
      method: 'POST',
      headers: { apikey: CLAVE_PUBLICABLE, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({
        clave: nueva.clave,
        nombre: nueva.nombre.trim(),
        comentario: nueva.comentario.trim(),
        puntuacion: nueva.puntuacion,
        costo_mas: costoMas || null,
      }),
    })
  } catch {
    // Sin conexión: el navegador tira un error en inglés que no sirve mostrar
    throw new Error(ERROR_GUARDAR)
  }
  if (!r.ok) throw new Error(ERROR_GUARDAR)
  const [fila] = (await r.json()) as Resena[]
  if (!fila) throw new Error(ERROR_GUARDAR)
  return fila
}

export const promedioResenas = (lista: Resena[]) =>
  lista.length ? lista.reduce((a, r) => a + r.puntuacion, 0) / lista.length : 0

/** Carga las reseñas al montar el componente (y otra vez si cambia la capacitación) */
export function useResenas(clave?: ClaveItinerario) {
  const pedido = clave ?? 'todas'
  // `de` indica a qué pedido corresponde lo cargado: si no coincide con el actual, todavía está cargando
  const [cargado, setCargado] = useState<{ de: string; resenas: Resena[]; error: boolean } | null>(null)

  useEffect(() => {
    let vigente = true
    listarResenas(clave)
      .then((resenas) => { if (vigente) setCargado({ de: pedido, resenas, error: false }) })
      .catch(() => { if (vigente) setCargado({ de: pedido, resenas: [], error: true }) })
    return () => { vigente = false }
  }, [clave, pedido])

  const actual = cargado?.de === pedido ? cargado : null
  const estado: 'cargando' | 'listo' | 'error' = !actual ? 'cargando' : actual.error ? 'error' : 'listo'
  return { resenas: actual?.resenas ?? [], estado }
}
