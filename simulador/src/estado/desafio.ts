import { create } from 'zustand'
import { EVALUACIONES, type ClaveEvaluable } from '../contenido/evaluaciones'
import { registrarEvaluacion } from '../datos/evaluaciones'
import { useProgresoEvaluacion } from './progresoEvaluacion'
import { useSimulador } from './simulador'
import { useUi, type ResultadoCriterio } from './ui'

/**
 * Desafío práctico: la consigna de una capacitación, para hacer en el simulador sin guía.
 * La consigna se muestra en la franja amarilla, con un botón "Verificar".
 */
interface EstadoDesafio {
  /** Capacitación cuyo desafío está en curso, o null si no hay */
  clave: ClaveEvaluable | null
  iniciar: (clave: ClaveEvaluable) => void
  terminar: () => void
}

export const useDesafio = create<EstadoDesafio>()((set) => ({
  clave: null,
  iniciar: (clave) => {
    const sim = useSimulador.getState()
    sim.reiniciar(EVALUACIONES[clave].desafio.preparar)
    sim.irA('inicio')
    set({ clave })
  },
  terminar: () => set({ clave: null }),
}))

/** Revisa la cuenta simulada contra los criterios del desafío, guarda el intento y muestra el resultado */
export function verificarDesafio() {
  const clave = useDesafio.getState().clave
  if (!clave) return
  const s = useSimulador.getState()
  const criterios: ResultadoCriterio[] = EVALUACIONES[clave].desafio.criterios.map((c) => ({ texto: c.texto, cumple: c.cumple(s) }))
  const cumplidos = criterios.filter((c) => c.cumple).length
  if (cumplidos === criterios.length) useProgresoEvaluacion.getState().registrarDesafio(clave)
  void registrarEvaluacion({ clave, tipo: 'desafio', puntaje: cumplidos, total: criterios.length, detalle: { criterios } })
  useUi.getState().abrirModal({ tipo: 'desafio', clave, criterios })
}
