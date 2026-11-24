import type { ClaveItinerario } from '../guia/itinerarios'

/** Voces disponibles para escuchar los podcasts (Elena y Tomás las genera scripts/generar-podcasts.py; Iván, scripts/generar-voz-ivan.py) */
export type VozPodcast = 'elena' | 'tomas' | 'ivan'

const TODAS_LAS_VOCES: { id: VozPodcast; nombre: string }[] = [
  { id: 'elena', nombre: 'Elena' },
  { id: 'tomas', nombre: 'Tomás' },
  { id: 'ivan', nombre: 'Iván' },
]

/**
 * Podcast de cada actividad (la capacitación en formato audio), con la duración de cada voz.
 * Los archivos van en public/podcasts/<clave>-<voz>.mp3 y se generan desde podcasts/guiones/ con `npm run podcasts`.
 * Si una actividad no tiene episodio (null), se muestra el cartel "Podcast próximamente".
 */
export const PODCASTS: Record<ClaveItinerario, Partial<Record<VozPodcast, string>> | null> = {
  mep: { elena: '3:48', tomas: '3:33', ivan: '2:07' },
  cedear: { elena: '4:28', tomas: '4:11', ivan: '2:13' },
  on: { elena: '3:29', tomas: '3:16', ivan: '1:55' },
  venta: { elena: '3:19', tomas: '3:07', ivan: '1:57' },
  completo: { elena: '5:32', tomas: '5:09', ivan: '3:18' },
  libre: null,
}

/** Voces del selector: solo las que tienen episodio en alguna actividad (si falta el audio de una, no se ofrece) */
export const VOCES_PODCAST = TODAS_LAS_VOCES.filter((v) => Object.values(PODCASTS).some((p) => p?.[v.id]))

/** Ruta pública del podcast de una actividad en una voz, o null si todavía no tiene */
export function urlPodcast(clave: ClaveItinerario, voz: VozPodcast): string | null {
  return PODCASTS[clave]?.[voz] ? `${import.meta.env.BASE_URL}podcasts/${clave}-${voz}.mp3` : null
}

/** Ruta pública de los subtítulos (WebVTT) del podcast de una actividad en una voz, o null si todavía no tiene */
export function urlSubtitulosPodcast(clave: ClaveItinerario, voz: VozPodcast): string | null {
  return PODCASTS[clave]?.[voz] ? `${import.meta.env.BASE_URL}podcasts/${clave}-${voz}.vtt` : null
}
