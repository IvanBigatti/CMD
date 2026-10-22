import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Podcast de cada actividad (la capacitación en formato audio). Los archivos van en public/podcasts/.
 * Para cambiar o sumar un episodio: copiá el .mp3 a public/podcasts/ y poné el nombre acá.
 * Si una actividad no tiene episodio (archivo: null), se muestra el cartel "Podcast próximamente".
 */
export const PODCASTS: Record<ClaveItinerario, { archivo: string | null; duracion?: string }> = {
  mep: { archivo: null },
  cedear: { archivo: null },
  on: { archivo: null },
  venta: { archivo: null },
  completo: { archivo: null },
  libre: { archivo: null },
}

/** Ruta pública del podcast de una actividad, o null si todavía no tiene */
export function urlPodcast(clave: ClaveItinerario): string | null {
  const { archivo } = PODCASTS[clave]
  return archivo ? `${import.meta.env.BASE_URL}podcasts/${archivo}` : null
}
