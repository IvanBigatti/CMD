import { useEffect, useRef } from 'react'
import { useSimulador } from '../../estado/simulador'
import { useUi, type MenuId } from '../../estado/ui'
import { itinerarioActual, useGuia } from '../../guia/estadoGuia'
import { selectorTour, type PasoGuia } from '../../guia/itinerarios'

const buscarObjetivo = (paso: PasoGuia) =>
  paso.objetivo ? document.querySelector<HTMLElement>(selectorTour(paso.objetivo)) : null

/** Abre el desplegable o acordeón que contiene al elemento resaltado */
function revelar(el: HTMLElement) {
  const menu = el.closest('.dd-menu')
  const dd = menu?.closest<HTMLElement>('.dd')
  if (dd?.dataset.dd) useUi.getState().abrirMenu(dd.dataset.dd as MenuId)
  const acordeon = el.closest<HTMLElement>('details[data-acordeon]')?.dataset.acordeon
  if (acordeon === 'saldos' || acordeon === 'estadisticas') useSimulador.getState().setAcordeon(acordeon, true)
}

/** Ubica el anillo (spotlight) sobre el elemento y el globo cerca de él */
function posicionar(paso: PasoGuia, ring: HTMLDivElement, tip: HTMLDivElement) {
  const el = buscarObjetivo(paso)
  const vw = innerWidth
  const vh = innerHeight
  const tw = tip.offsetWidth || 320
  const th = tip.offsetHeight || 160
  const enModal = !!el?.closest('.veil')
  ring.style.zIndex = enModal ? '95' : '70'
  tip.style.zIndex = enModal ? '96' : '72'

  if (el && el.offsetParent !== null) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) ring.style.display = 'none'
    else {
      const p = 5
      ring.style.display = ''
      ring.style.top = `${r.top - p}px`
      ring.style.left = `${r.left - p}px`
      ring.style.width = `${r.width + p * 2}px`
      ring.style.height = `${r.height + p * 2}px`
    }
    let top = r.bottom + 14
    if (top + th > vh - 10) top = Math.max(10, r.top - th - 14)
    let left = r.left + r.width / 2 - tw / 2
    left = Math.max(12, Math.min(left, vw - tw - 12))
    tip.style.top = `${top}px`
    tip.style.left = `${left}px`
  } else {
    ring.style.display = 'none'
    tip.style.top = `${Math.max(12, (vh - th) / 2)}px`
    tip.style.left = `${Math.max(12, (vw - tw) / 2)}px`
  }
}

/** Guía paso a paso: resalta un elemento y espera el clic real (o el botón Siguiente) */
export function GuiaOverlay() {
  const activa = useGuia((s) => s.activa)
  const clave = useGuia((s) => s.clave)
  const nroPaso = useGuia((s) => s.paso)
  const it = itinerarioActual(clave)
  const paso = activa && it ? it.pasos[nroPaso] : null
  const ringRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  // Al cambiar de paso: ir a la pantalla del paso, abrir lo necesario y centrar el elemento
  useEffect(() => {
    if (!paso) return
    const sim = useSimulador.getState()
    if (sim.pantalla !== paso.pantalla) sim.irA(paso.pantalla)
    const t = setTimeout(() => {
      const el = buscarObjetivo(paso)
      if (!el) return
      revelar(el)
      if (!el.closest('.dd-menu')) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 60)
    return () => clearTimeout(t)
  }, [paso])

  // Reposiciona en cada cuadro (scroll, resize, cambios de layout)
  useEffect(() => {
    if (!paso) return
    let id = 0
    const loop = () => {
      if (ringRef.current && tipRef.current) posicionar(paso, ringRef.current, tipRef.current)
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [paso])

  // En los pasos de "clic", avanza cuando se hace clic en el elemento resaltado
  useEffect(() => {
    if (!paso || paso.accion !== 'clic' || !paso.objetivo) return
    const sel = selectorTour(paso.objetivo)
    let disparado = false
    const alClic = (e: MouseEvent) => {
      if (disparado) return
      if ((e.target as Element | null)?.closest?.(sel)) {
        disparado = true
        setTimeout(() => useGuia.getState().siguiente(), 240)
      }
    }
    document.addEventListener('click', alClic, true)
    return () => document.removeEventListener('click', alClic, true)
  }, [paso])

  if (!paso || !it) return null
  const esClic = paso.accion === 'clic'
  const { siguiente, salir } = useGuia.getState()

  return (
    <>
      <div className="tour-ring" ref={ringRef} />
      <div className="tour-tip" ref={tipRef}>
        <span className="step">Paso {nroPaso + 1} de {it.pasos.length}</span>
        <h4>{paso.titulo}</h4>
        <p>{paso.cuerpo}</p>
        {esClic && <div className="tapme">Hacé clic en lo que está resaltado</div>}
        <div className="acts">
          <button type="button" className="mini" onClick={salir}>Salir de la guía</button>
          <span className="sp" />
          {esClic
            ? <button type="button" className="mini" onClick={siguiente}>Saltar</button>
            : <button type="button" className="mini pri" onClick={siguiente}>Siguiente</button>}
        </div>
      </div>
    </>
  )
}
