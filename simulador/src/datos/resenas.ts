import { useEffect, useState } from 'react'
import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Acceso a las reseñas. Hoy habla con la API local (servidor/apiResenas.ts, SQLite).
 * Para publicar el sitio alcanza con cambiar este archivo por otro backend: las pantallas no se enteran.
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

export type ResenaNueva = Pick<Resena, 'clave' | 'nombre' | 'comentario' | 'puntuacion'>

const API = `${import.meta.env.BASE_URL}api/resenas`

async function leerError(r: Response): Promise<string> {
  try {
    const { error } = await r.json()
    if (typeof error === 'string') return error
  } catch { /* la respuesta no es JSON */ }
  return 'No pudimos guardar la reseña. Probá de nuevo.'
}

/** Reseñas de una capacitación (o de todas), de la más nueva a la más vieja */
export async function listarResenas(clave?: ClaveItinerario): Promise<Resena[]> {
  const r = await fetch(clave ? `${API}?clave=${clave}` : API)
  if (!r.ok) throw new Error('No pudimos cargar las reseñas.')
  return r.json()
}

/** Guarda una reseña; si algo falla, el error trae un mensaje para mostrar */
export async function crearResena(nueva: ResenaNueva): Promise<Resena> {
  const r = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nueva),
  })
  if (!r.ok) throw new Error(await leerError(r))
  return r.json()
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
