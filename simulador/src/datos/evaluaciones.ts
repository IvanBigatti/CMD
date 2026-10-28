import { useEffect, useState } from 'react'
import type { ClaveEvaluable } from '../contenido/evaluaciones'
import { idParticipante } from './participante'

/**
 * Acceso a los resultados de las evaluaciones. Hoy habla con la API local (servidor/apiEvaluaciones.ts, SQLite).
 * Igual que las reseñas: para publicar el sitio con otro backend alcanza con cambiar este archivo.
 */

export type TipoEvaluacion = 'cuestionario' | 'desafio' | 'confianza'
export type MomentoConfianza = 'antes' | 'despues'

export interface EvaluacionNueva {
  clave: ClaveEvaluable
  tipo: TipoEvaluacion
  /** Solo para la autoevaluación */
  momento?: MomentoConfianza
  /** Cuestionario: respuestas correctas · desafío: criterios cumplidos · confianza: de 1 a 5 */
  puntaje: number
  total: number
  /** Cuestionario: { respuestas: [{ pregunta, opcion, correcta }] } · desafío: { criterios: [{ texto, cumple }] } */
  detalle?: unknown
}

/** Lo que devuelve GET /api/evaluaciones/resumen, una fila por capacitación */
export interface ResumenCapacitacion {
  clave: ClaveEvaluable
  participantes: number
  cuestionarios: number
  /** Promedio de respuestas correctas, de 0 a 1 (null si nadie lo hizo) */
  promedio: number | null
  /** Cuestionarios aprobados (≥ 70 %) */
  aprobados: number
  /** Personas que intentaron el desafío / que lo lograron */
  desafios: number
  desafiosOk: number
  /** Promedio de la autoevaluación, de 1 a 5 (null si nadie respondió) */
  confianzaAntes: number | null
  confianzaDespues: number | null
  /** Aciertos por pregunta, contando todos los intentos */
  preguntas: { id: string; respuestas: number; aciertos: number }[]
}

const API = `${import.meta.env.BASE_URL}api/evaluaciones`

/**
 * Guarda un resultado. Nunca corta el flujo de quien está aprendiendo:
 * si el servidor no responde, devuelve false y la evaluación sigue igual.
 */
export async function registrarEvaluacion(e: EvaluacionNueva): Promise<boolean> {
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...e, participante: idParticipante() }),
    })
    if (!r.ok) console.warn('[evaluaciones] no se guardó el resultado', await r.text())
    return r.ok
  } catch (err) {
    console.warn('[evaluaciones] no se guardó el resultado', err)
    return false
  }
}

export async function leerResumen(): Promise<ResumenCapacitacion[]> {
  const r = await fetch(`${API}/resumen`)
  if (!r.ok) throw new Error('No pudimos cargar los resultados.')
  return r.json()
}

/** Carga el resumen al montar el componente; `recargar` lo vuelve a pedir */
export function useResumenEvaluaciones() {
  const [pedido, setPedido] = useState(0)
  const [cargado, setCargado] = useState<{ de: number; resumen: ResumenCapacitacion[]; error: boolean } | null>(null)

  useEffect(() => {
    let vigente = true
    leerResumen()
      .then((resumen) => { if (vigente) setCargado({ de: pedido, resumen, error: false }) })
      .catch(() => { if (vigente) setCargado({ de: pedido, resumen: [], error: true }) })
    return () => { vigente = false }
  }, [pedido])

  const actual = cargado?.de === pedido ? cargado : null
  const estado: 'cargando' | 'listo' | 'error' = !actual ? 'cargando' : actual.error ? 'error' : 'listo'
  return { resumen: actual?.resumen ?? [], estado, recargar: () => setPedido((n) => n + 1) }
}
