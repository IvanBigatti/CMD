import type { ClaveItinerario } from '../guia/itinerarios'

/** Voces disponibles para escuchar los podcasts (las genera scripts/generar-podcasts.py) */
export type VozPodcast = 'elena' | 'tomas'

export const VOCES_PODCAST: { id: VozPodcast; nombre: string }[] = [
  { id: 'elena', nombre: 'Elena' },
  { id: 'tomas', nombre: 'Tomás' },
]

/**
 * Podcast de cada actividad (la capacitación en formato audio), con la duración de cada voz.
 * Los archivos van en public/podcasts/<clave>-<voz>.mp3 y se generan desde podcasts/guiones/ con `npm run podcasts`.
 * Si una actividad no tiene episodio (null), se muestra el cartel "Podcast próximamente".
 */
export const PODCASTS: Record<ClaveItinerario, Record<VozPodcast, string> | null> = {
  mep: { elena: '3:48', tomas: '3:33' },
  cedear: { elena: '4:28', tomas: '4:11' },
  on: { elena: '3:29', tomas: '3:16' },
  venta: { elena: '3:19', tomas: '3:07' },
  completo: { elena: '5:32', tomas: '5:09' },
  libre: null,
}

/** Ruta pública del podcast de una actividad en una voz, o null si todavía no tiene */
export function urlPodcast(clave: ClaveItinerario, voz: VozPodcast): string | null {
  return PODCASTS[clave] ? `${import.meta.env.BASE_URL}podcasts/${clave}-${voz}.mp3` : null
}
