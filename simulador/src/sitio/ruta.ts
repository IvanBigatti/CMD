import { useSyncExternalStore } from 'react'
import { esEvaluable, type ClaveEvaluable } from '../contenido/evaluaciones'
import { ITINERARIOS, type ClaveItinerario } from '../guia/itinerarios'

/** Páginas del sitio. La URL vive en el hash (#/...) para funcionar en cualquier hosting estático. */
export type Ruta =
  | { pagina: 'inicio' }
  | { pagina: 'capacitaciones' }
  | { pagina: 'actividad'; clave: ClaveItinerario }
  | { pagina: 'evaluacion'; clave: ClaveEvaluable }
  | { pagina: 'simulador' }
  | { pagina: 'nosotros' }
  | { pagina: 'plan' }
  /** Resultados de las evaluaciones, para el equipo (no está en el menú) */
  | { pagina: 'resultados' }

export const esClaveItinerario = (x: string): x is ClaveItinerario => x in ITINERARIOS

function leerRuta(): Ruta {
  const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const [p0, p1, p2] = partes
  if (p0 === 'capacitaciones' && p1 && p2 === 'evaluacion' && esEvaluable(p1)) return { pagina: 'evaluacion', clave: p1 }
  if (p0 === 'capacitaciones' && p1 && esClaveItinerario(p1)) return { pagina: 'actividad', clave: p1 }
  if (p0 === 'capacitaciones') return { pagina: 'capacitaciones' }
  if (p0 === 'simulador') return { pagina: 'simulador' }
  if (p0 === 'nosotros' && p1 === 'plan') return { pagina: 'plan' }
  if (p0 === 'nosotros') return { pagina: 'nosotros' }
  if (p0 === 'resultados') return { pagina: 'resultados' }
  return { pagina: 'inicio' }
}

let actual = leerRuta()
const oyentes = new Set<() => void>()

function avisar() {
  actual = leerRuta()
  oyentes.forEach((f) => f())
}

addEventListener('hashchange', avisar)
addEventListener('popstate', avisar)

function suscribir(f: () => void) {
  oyentes.add(f)
  return () => { oyentes.delete(f) }
}

/** Ruta actual (se actualiza con los enlaces, el botón "atrás" y navegar()) */
export const useRuta = () => useSyncExternalStore(suscribir, () => actual)

/** Navega dentro del sitio. Ejemplo: navegar('/capacitaciones/mep') */
export function navegar(ruta: string) {
  const hash = `#${ruta}`
  if (location.hash === hash) return
  history.pushState(null, '', hash)
  avisar()
}

/** href para usar en <a>. Ejemplo: href('/nosotros') → '#/nosotros' */
export const href = (ruta: string) => `#${ruta}`
