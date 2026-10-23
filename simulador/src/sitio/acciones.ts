import { useVideoFlotante } from '../estado/videoFlotante'
import { useGuia } from '../guia/estadoGuia'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../guia/itinerarios'
import { navegar } from './ruta'

/**
 * Abre el simulador y arranca la guía de una actividad (reinicia la cuenta simulada).
 * El video de la actividad queda chico en un costado, en el segundo `tiempoVideo`.
 */
export function practicar(clave: ClaveItinerario, tiempoVideo = 0) {
  useGuia.getState().iniciar(clave)
  useVideoFlotante.getState().abrir(clave, tiempoVideo)
  navegar('/simulador')
}

/** Actividades en el orden en que se muestran en el sitio */
export const ACTIVIDADES = Object.entries(ITINERARIOS) as [ClaveItinerario, Itinerario][]
