import { useGuia } from '../guia/estadoGuia'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../guia/itinerarios'
import { navegar } from './ruta'

/** Abre el simulador y arranca la guía de una actividad (reinicia la cuenta simulada) */
export function practicar(clave: ClaveItinerario) {
  useGuia.getState().iniciar(clave)
  navegar('/simulador')
}

/** Actividades en el orden en que se muestran en el sitio */
export const ACTIVIDADES = Object.entries(ITINERARIOS) as [ClaveItinerario, Itinerario][]
