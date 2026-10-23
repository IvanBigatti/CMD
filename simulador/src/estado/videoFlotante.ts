import { create } from 'zustand'
import type { ClaveItinerario } from '../guia/itinerarios'

interface EstadoVideoFlotante {
  /** Actividad cuyo video acompaña la práctica, o null si no hay video flotante */
  clave: ClaveItinerario | null
  /** Segundo donde quedó el video, para retomarlo */
  tiempo: number
  minimizado: boolean
  abrir: (clave: ClaveItinerario, tiempo?: number) => void
  guardarTiempo: (tiempo: number) => void
  alternarMinimizado: () => void
  cerrar: () => void
}

/** Video de la actividad que se ve chico en un costado mientras se practica en el simulador */
export const useVideoFlotante = create<EstadoVideoFlotante>()((set) => ({
  clave: null,
  tiempo: 0,
  minimizado: false,
  abrir: (clave, tiempo = 0) => set({ clave, tiempo, minimizado: false }),
  guardarTiempo: (tiempo) => set({ tiempo }),
  alternarMinimizado: () => set((s) => ({ minimizado: !s.minimizado })),
  cerrar: () => set({ clave: null, tiempo: 0, minimizado: false }),
}))
