import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Video de cada actividad. Los archivos van en public/videos/ (local) y en el bucket "videos" de Supabase (producción).
 * Para cambiar o sumar un video: copiá el .mp4 a public/videos/, subilo al bucket y poné el nombre acá.
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

/** Bucket público (solo lectura) del proyecto de Supabase cmd-capacitacion-iol */
const VIDEOS_SUPABASE = 'https://vgpfpdjeialwhafctqzj.supabase.co/storage/v1/object/public/videos/'

/**
 * Carpeta desde donde se sirven los videos. Los .mp4 no se versionan, así que el build de producción
 * los toma de Supabase y el desarrollo local de public/videos/. VITE_VIDEOS_URL permite cambiar el origen.
 */
const BASE_VIDEOS = (import.meta.env.VITE_VIDEOS_URL as string | undefined)?.replace(/\/?$/, '/')
  ?? (import.meta.env.PROD ? VIDEOS_SUPABASE : `${import.meta.env.BASE_URL}videos/`)

/** Ruta pública del video de una actividad, o null si todavía no tiene */
export function urlVideo(clave: ClaveItinerario): string | null {
  const { archivo } = VIDEOS[clave]
  return archivo ? `${BASE_VIDEOS}${archivo}` : null
}
