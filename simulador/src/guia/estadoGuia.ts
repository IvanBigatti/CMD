import { create } from 'zustand'
import { useSimulador } from '../estado/simulador'
import { useUi } from '../estado/ui'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from './itinerarios'

const TITULO_BASE = 'InvertirOnline — Simulador de capacitación'

interface EstadoGuia {
  clave: ClaveItinerario | null
  paso: number
  activa: boolean
  /** Texto a la derecha de la barra de progreso */
  estado: string
  /** 0 a 100 */
  progreso: number
  titulo: string
  iniciar: (clave: ClaveItinerario) => void
  siguiente: () => void
  salir: () => void
  ocultar: () => void
}

export const itinerarioActual = (clave: ClaveItinerario | null): Itinerario | null =>
  clave ? ITINERARIOS[clave] : null

export const useGuia = create<EstadoGuia>()((set, get) => ({
  clave: null,
  paso: 0,
  activa: false,
  estado: 'sin guía',
  progreso: 0,
  titulo: TITULO_BASE,

  iniciar: (clave) => {
    const it: Itinerario = ITINERARIOS[clave]
    const sim = useSimulador.getState()
    sim.reiniciar(it.preparar)
    sim.irA('inicio')
    const conPasos = it.pasos.length > 0
    set({
      clave, paso: 0, activa: conPasos, progreso: 0,
      estado: conPasos ? `1 / ${it.pasos.length}` : 'sin guía',
      titulo: `InvertirOnline — ${it.nombre}`,
    })
  },

  siguiente: () => {
    const { activa, clave, paso } = get()
    const it = itinerarioActual(clave)
    if (!activa || !it) return
    const n = paso + 1
    if (n >= it.pasos.length) {
      set({ activa: false, progreso: 100, estado: 'completado' })
      // Felicita y ofrece dejar una reseña de la capacitación
      if (clave) useUi.getState().abrirModal({ tipo: 'resena', clave })
      return
    }
    set({ paso: n, progreso: (n / it.pasos.length) * 100, estado: `${n + 1} / ${it.pasos.length}` })
  },

  salir: () => set({ activa: false, estado: 'guía cerrada' }),
  ocultar: () => set({ activa: false }),
}))

/** Abre el selector de itinerarios (oculta la guía en curso) */
export function abrirSelectorItinerarios() {
  useGuia.getState().ocultar()
  useUi.getState().abrirSelector()
}
