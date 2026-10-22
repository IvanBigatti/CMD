import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Video de cada actividad. Los archivos van en public/videos/.
 * Para cambiar o sumar un video: copiá el .mp4 a public/videos/ y poné el nombre acá.
 * Si una actividad no tiene video (archivo: null), se muestra el cartel "Video próximamente".
 */
export const VIDEOS: Record<ClaveItinerario, { archivo: string | null; duracion?: string }> = {
  mep: { archivo: 'ingreso-mep.mp4' },
  cedear: { archivo: 'cedear.mp4' },
  on: { archivo: 'on.mp4' },
  venta: { archivo: 'venta-retiro.mp4' },
  completo: { archivo: 'ciclo-completo.mp4' },
  libre: { archivo: null },
}

/** Ruta pública del video de una actividad, o null si todavía no tiene */
export function urlVideo(clave: ClaveItinerario): string | null {
  const { archivo } = VIDEOS[clave]
  return archivo ? `${import.meta.env.BASE_URL}videos/${archivo}` : null
}
