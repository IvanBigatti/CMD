import { create } from 'zustand'
import { VOCES_PODCAST, type VozPodcast } from '../contenido/podcasts'

const CLAVE_LS = 'simulador.vozPodcast'

function leerVoz(): VozPodcast {
  try {
    // Un valor guardado que ya no corresponde a una voz disponible vuelve a la primera voz disponible
    const guardada = VOCES_PODCAST.find((v) => v.id === localStorage.getItem(CLAVE_LS))
    return guardada ? guardada.id : (VOCES_PODCAST[0]?.id ?? 'elena')
  } catch {
    return VOCES_PODCAST[0]?.id ?? 'elena'
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
