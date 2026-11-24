import { useEffect, useRef, useState } from 'react'
import { useSimulador } from '../../estado/simulador'
import { altoReproductor } from '../../estado/reproductorFlotante'
import { useUi, type MenuId } from '../../estado/ui'
import { itinerarioActual, useGuia } from '../../guia/estadoGuia'
import { selectorTour, type PasoGuia, type PreguntaGuia } from '../../guia/itinerarios'

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

/** Centra el elemento entre la cabecera fija y el reproductor anclado, para que quede siempre a la vista */
function centrar(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  const arriba = document.querySelector('.cabecera-fija')?.getBoundingClientRect().bottom ?? 0
  const abajo = innerHeight - altoReproductor()
  scrollBy({ top: r.top + r.height / 2 - (arriba + abajo) / 2, behavior: 'smooth' })
}

/** Ubica el anillo (spotlight) sobre el elemento y el globo cerca de él */
function posicionar(paso: PasoGuia, ring: HTMLDivElement, tip: HTMLDivElement) {
  const el = buscarObjetivo(paso)
  const vw = innerWidth
  // El reproductor anclado abajo reserva su alto: el globo nunca se ubica encima de él
  const vh = innerHeight - altoReproductor()
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
    // Preferencia: abajo, arriba, derecha, izquierda. Solo tapa el objetivo si no entra en ningún lado
    const techo = (document.querySelector('.cabecera-fija')?.getBoundingClientRect().bottom ?? 0) + 10
    const gap = 14
    let top: number
    let left = r.left + r.width / 2 - tw / 2
    if (r.bottom + gap + th <= vh - 10) top = r.bottom + gap
    else if (r.top - gap - th >= techo) top = r.top - gap - th
    else {
      top = r.top + r.height / 2 - th / 2
      if (r.right + gap + tw <= vw - 12) left = r.right + gap
      else if (r.left - gap - tw >= 12) left = r.left - gap - tw
      else top = r.bottom + gap
    }
    left = Math.max(12, Math.min(left, vw - tw - 12))
    top = Math.max(techo, Math.min(top, vh - th - 10))
    tip.style.top = `${top}px`
    tip.style.left = `${left}px`
  } else {
    ring.style.display = 'none'
    tip.style.top = `${Math.max(12, (vh - th) / 2)}px`
    tip.style.left = `${Math.max(12, (vw - tw) / 2)}px`
  }
}

/** Pregunta de opción múltiple: la guía no avanza hasta acertar. El estado se reinicia por paso (key) */
function PreguntaPaso({ pregunta, alAcertar }: { pregunta: PreguntaGuia; alAcertar: () => void }) {
  const [elegida, setElegida] = useState<number | null>(null)
  const [acertada, setAcertada] = useState(false)
  const primera = useRef<HTMLButtonElement>(null)

  useEffect(() => { primera.current?.focus({ preventScroll: true }) }, [])

  const elegir = (i: number) => {
    if (acertada) return
    setElegida(i)
    if (i === pregunta.correcta) { setAcertada(true); alAcertar() }
  }

  return (
    <div className="tour-pregunta" role="group" aria-labelledby="tour-pregunta-enun">
      <p className="enun" id="tour-pregunta-enun">{pregunta.enunciado}</p>
      <div className="opciones">
        {pregunta.opciones.map((op, i) => (
          <button
            key={op}
            ref={i === 0 ? primera : undefined}
            type="button"
            className={`opcion${elegida === i ? (i === pregunta.correcta ? ' ok' : ' mal') : ''}`}
            aria-disabled={acertada && i !== pregunta.correcta}
            onClick={() => elegir(i)}
          >{op}</button>
        ))}
      </div>
      <div className="feedback" role="status" aria-live="polite">
        {acertada && <span className="ok">¡Correcto! Podés seguir.</span>}
        {!acertada && elegida !== null && <span className="mal">Todavía no. {pregunta.explicacion} Probá de nuevo.</span>}
      </div>
    </div>
  )
}

/** Guía paso a paso: resalta un elemento y espera el clic real (o el botón Siguiente) */
export function GuiaOverlay() {
  const activa = useGuia((s) => s.activa)
  const clave = useGuia((s) => s.clave)
  const nroPaso = useGuia((s) => s.paso)
  const it = itinerarioActual(clave)
  const paso = activa && it ? it.pasos[nroPaso] : null
  const [pasoAcertado, setPasoAcertado] = useState<number | null>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const pendiente = useRef<{ paso: PasoGuia; desde: number } | null>(null)

  // Al cambiar de paso: ir a la pantalla del paso, abrir lo necesario y centrar el elemento
  useEffect(() => {
    if (!paso) return
    const sim = useSimulador.getState()
    if (sim.pantalla !== paso.pantalla) sim.irA(paso.pantalla)
    paso.alEntrar?.()
    const t = setTimeout(() => {
      const el = buscarObjetivo(paso)
      if (!el) return
      revelar(el)
      if (el.closest('.dd-menu')) return
      if (el.closest('.veil')) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); return }
      // Centra en el loop de abajo, cuando el elemento ya terminó de abrirse y no hay un modal (con modal la página no se desplaza)
      pendiente.current = { paso, desde: performance.now() }
    }, 60)
    return () => clearTimeout(t)
  }, [paso])

  // Reposiciona en cada cuadro (scroll, resize, cambios de layout)
  useEffect(() => {
    if (!paso) return
    let id = 0
    const loop = () => {
      if (pendiente.current?.paso === paso && performance.now() - pendiente.current.desde > 120 && !document.querySelector('.veil')) {
        pendiente.current = null
        const el = buscarObjetivo(paso)
        if (el) centrar(el)
      }
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
  const esPregunta = paso.accion === 'pregunta' && !!paso.pregunta
  const { siguiente, salir } = useGuia.getState()

  return (
    <>
      <div className="tour-ring" ref={ringRef} />
      <div className="tour-tip" ref={tipRef}>
        <span className="step">Paso {nroPaso + 1} de {it.pasos.length}</span>
        <h4>{paso.titulo}</h4>
        {esPregunta && paso.pregunta
          ? <PreguntaPaso key={nroPaso} pregunta={paso.pregunta} alAcertar={() => setPasoAcertado(nroPaso)} />
          : <p>{paso.cuerpo}</p>}
        {esClic && <div className="tapme">Hacé clic en lo que está resaltado</div>}
        <div className="acts">
          <button type="button" className="mini" onClick={salir}>Salir de la guía</button>
          <span className="sp" />
          {esClic
            ? <button type="button" className="mini" onClick={siguiente}>Saltar</button>
            : <button type="button" className="mini pri" onClick={siguiente} disabled={esPregunta && pasoAcertado !== nroPaso}>Siguiente</button>}
        </div>
      </div>
    </>
  )
}
