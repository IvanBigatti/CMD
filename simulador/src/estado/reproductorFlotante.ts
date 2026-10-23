import { create } from 'zustand'
import type { ClaveItinerario } from '../guia/itinerarios'

/** Qué acompaña la práctica en el recuadro del costado */
export type ModoReproductor = 'video' | 'podcast'

/** Con qué arranca el reproductor al abrir el simulador */
export interface InicioReproductor {
  modo: ModoReproductor
  /** Segundo desde el que se retoma */
  tiempo: number
}

interface EstadoReproductorFlotante {
  /** Actividad cuyo video y podcast acompañan la práctica, o null si no hay reproductor */
  clave: ClaveItinerario | null
  modo: ModoReproductor
  /** Segundo donde quedó cada uno, para retomarlo */
  tiempos: Record<ModoReproductor, number>
  minimizado: boolean
  abrir: (clave: ClaveItinerario, inicio?: InicioReproductor) => void
  cambiarModo: (modo: ModoReproductor) => void
  guardarTiempo: (modo: ModoReproductor, tiempo: number) => void
  alternarMinimizado: () => void
  cerrar: () => void
}

const SIN_TIEMPOS = { video: 0, podcast: 0 }

/** Video o podcast de la actividad, chico en un costado mientras se practica en el simulador */
export const useReproductorFlotante = create<EstadoReproductorFlotante>()((set) => ({
  clave: null,
  modo: 'video',
  tiempos: SIN_TIEMPOS,
  minimizado: false,
  abrir: (clave, inicio = { modo: 'video', tiempo: 0 }) =>
    set({ clave, modo: inicio.modo, tiempos: { ...SIN_TIEMPOS, [inicio.modo]: inicio.tiempo }, minimizado: false }),
  cambiarModo: (modo) => set({ modo }),
  guardarTiempo: (modo, tiempo) => set((s) => ({ tiempos: { ...s.tiempos, [modo]: tiempo } })),
  alternarMinimizado: () => set((s) => ({ minimizado: !s.minimizado })),
  cerrar: () => set({ clave: null, modo: 'video', tiempos: SIN_TIEMPOS, minimizado: false }),
}))
