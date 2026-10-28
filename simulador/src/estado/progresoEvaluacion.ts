import { create } from 'zustand'
import { aprueba, type ClaveEvaluable } from '../contenido/evaluaciones'
import { registrarEvaluacion, type MomentoConfianza } from '../datos/evaluaciones'

/**
 * Progreso de las evaluaciones en este navegador (solo para mostrar qué ya hiciste).
 * Los resultados para el equipo se guardan aparte, en la API (src/datos/evaluaciones.ts).
 */

export interface ProgresoCapacitacion {
  /** Mejor resultado del cuestionario */
  mejor?: { puntaje: number; total: number }
  desafio?: boolean
  antes?: number
  despues?: number
}

const CLAVE_LS = 'simulador.evaluaciones'

type Progreso = Partial<Record<ClaveEvaluable, ProgresoCapacitacion>>

function leer(): Progreso {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_LS) ?? '{}')
    return v && typeof v === 'object' ? v : {}
  } catch {
    return {}
  }
}

function guardar(p: Progreso) {
  try { localStorage.setItem(CLAVE_LS, JSON.stringify(p)) } catch { /* sin almacenamiento: vale solo para esta visita */ }
}

interface EstadoProgreso {
  progreso: Progreso
  registrarCuestionario: (clave: ClaveEvaluable, puntaje: number, total: number) => void
  registrarDesafio: (clave: ClaveEvaluable) => void
  registrarConfianza: (clave: ClaveEvaluable, momento: MomentoConfianza, valor: number) => void
}

export const useProgresoEvaluacion = create<EstadoProgreso>()((set, get) => {
  const cambiar = (clave: ClaveEvaluable, f: (p: ProgresoCapacitacion) => ProgresoCapacitacion) => {
    const progreso = { ...get().progreso, [clave]: f(get().progreso[clave] ?? {}) }
    guardar(progreso)
    set({ progreso })
  }
  return {
    progreso: leer(),
    registrarCuestionario: (clave, puntaje, total) =>
      cambiar(clave, (p) => {
        const anterior = p.mejor ? p.mejor.puntaje / p.mejor.total : -1
        return puntaje / total > anterior ? { ...p, mejor: { puntaje, total } } : p
      }),
    registrarDesafio: (clave) => cambiar(clave, (p) => ({ ...p, desafio: true })),
    registrarConfianza: (clave, momento, valor) =>
      cambiar(clave, (p) => (momento === 'antes' ? { ...p, antes: valor } : { ...p, despues: valor })),
  }
})

export const cuestionarioAprobado = (p?: ProgresoCapacitacion) => !!p?.mejor && aprueba(p.mejor.puntaje, p.mejor.total)

/** Evaluación completa: cuestionario aprobado y desafío superado */
export const evaluacionCompleta = (p?: ProgresoCapacitacion) => cuestionarioAprobado(p) && !!p?.desafio

/** Guarda la autoevaluación (en este navegador y en la API) */
export function guardarConfianza(clave: ClaveEvaluable, momento: MomentoConfianza, valor: number) {
  useProgresoEvaluacion.getState().registrarConfianza(clave, momento, valor)
  void registrarEvaluacion({ clave, tipo: 'confianza', momento, puntaje: valor, total: 5 })
}
