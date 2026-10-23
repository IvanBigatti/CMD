import { create } from 'zustand'
import type { VozPodcast } from '../contenido/podcasts'

const CLAVE_LS = 'simulador.vozPodcast'

function leerVoz(): VozPodcast {
  try {
    return localStorage.getItem(CLAVE_LS) === 'tomas' ? 'tomas' : 'elena'
  } catch {
    return 'elena'
  }
}

interface EstadoVozPodcast {
  voz: VozPodcast
  elegir: (voz: VozPodcast) => void
}

/** Voz elegida para los podcasts; el navegador la recuerda para la próxima visita */
export const useVozPodcast = create<EstadoVozPodcast>()((set) => ({
  voz: leerVoz(),
  elegir: (voz) => {
    set({ voz })
    try { localStorage.setItem(CLAVE_LS, voz) } catch { /* sin almacenamiento: vale solo para esta visita */ }
  },
}))
