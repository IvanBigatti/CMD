// Archivo generado por `npm run guias`: no lo edites a mano.
export const GUIAS_PDF: readonly string[] = ["mep","cedear","on","venta","completo","libre"]

/** Ruta pública de la guía en PDF de una actividad, o null si todavía no se generó */
export function urlGuia(clave: string): string | null {
  return GUIAS_PDF.includes(clave) ? `${import.meta.env.BASE_URL}guias/${clave}.pdf` : null
}
