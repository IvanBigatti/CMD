import { create } from 'zustand'
import type { ClaveItinerario } from '../guia/itinerarios'

/** Qué acompaña la práctica en el reproductor anclado abajo */
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
  abrir: (clave: ClaveItinerario, inicio?: InicioReproductor) => void
  cambiarModo: (modo: ModoReproductor) => void
  guardarTiempo: (modo: ModoReproductor, tiempo: number) => void
  cerrar: () => void
}

const SIN_TIEMPOS = { video: 0, podcast: 0 }

/** Video o podcast de la actividad, anclado abajo mientras se practica en el simulador */
export const useReproductorFlotante = create<EstadoReproductorFlotante>()((set) => ({
  clave: null,
  modo: 'video',
  tiempos: SIN_TIEMPOS,
  abrir: (clave, inicio = { modo: 'video', tiempo: 0 }) =>
    set({ clave, modo: inicio.modo, tiempos: { ...SIN_TIEMPOS, [inicio.modo]: inicio.tiempo } }),
  cambiarModo: (modo) => set({ modo }),
  guardarTiempo: (modo, tiempo) => set((s) => ({ tiempos: { ...s.tiempos, [modo]: tiempo } })),
  cerrar: () => set({ clave: null, modo: 'video', tiempos: SIN_TIEMPOS }),
}))

/** Variable CSS con el alto actual del reproductor anclado (0 si no hay). La define el propio reproductor */
export const VAR_ALTO_REPRODUCTOR = '--alto-reproductor'

/** Alto en px que el reproductor reserva abajo del viewport; la guía lo descuenta del espacio útil */
export function altoReproductor(): number {
  return parseFloat(document.documentElement.style.getPropertyValue(VAR_ALTO_REPRODUCTOR)) || 0
}
