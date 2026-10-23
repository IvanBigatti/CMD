import { useReproductorFlotante, type InicioReproductor } from '../estado/reproductorFlotante'
import { useGuia } from '../guia/estadoGuia'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../guia/itinerarios'
import { navegar } from './ruta'

/**
 * Abre el simulador y arranca la guía de una actividad (reinicia la cuenta simulada).
 * El video o el podcast de la actividad quedan chicos en un costado, desde el segundo indicado en `inicio`.
 */
export function practicar(clave: ClaveItinerario, inicio?: InicioReproductor) {
  useGuia.getState().iniciar(clave)
  useReproductorFlotante.getState().abrir(clave, inicio)
  navegar('/simulador')
}

/** Actividades en el orden en que se muestran en el sitio */
export const ACTIVIDADES = Object.entries(ITINERARIOS) as [ClaveItinerario, Itinerario][]
