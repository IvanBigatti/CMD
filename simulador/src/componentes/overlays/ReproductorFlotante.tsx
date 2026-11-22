import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { urlPodcast, urlSubtitulosPodcast, VOCES_PODCAST, type VozPodcast } from '../../contenido/podcasts'
import { urlVideo } from '../../contenido/videos'
import { useReproductorFlotante, VAR_ALTO_REPRODUCTOR, type ModoReproductor } from '../../estado/reproductorFlotante'
import { useVozPodcast } from '../../estado/vozPodcast'
import { ITINERARIOS } from '../../guia/itinerarios'
import { SubtitulosPodcast } from './SubtitulosPodcast'

const MODOS: { id: ModoReproductor; icono: string; nombre: string }[] = [
  { id: 'video', icono: '🎬', nombre: 'Video' },
  { id: 'podcast', icono: '🎧', nombre: 'Podcast' },
]

/** 83 -> "1:23" */
function formatear(seg: number): string {
  const s = Math.max(0, Math.floor(seg || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// Alto del video desplegado: lo elige la persona arrastrando la manija y se recuerda entre sesiones.
// El CSS además lo acota a la altura de la ventana, así nunca tapa todo el simulador.
const CLAVE_ALTO_VIDEO = 'reproductor-alto-video'
const ALTO_VIDEO_MIN = 160
const altoVideoMax = () => Math.max(ALTO_VIDEO_MIN, window.innerHeight - 420)
const acotarAlto = (px: number) => Math.min(altoVideoMax(), Math.max(ALTO_VIDEO_MIN, Math.round(px)))
const altoVideoInicial = () => {
  let guardado = 0
  try { guardado = Number(localStorage.getItem(CLAVE_ALTO_VIDEO)) || 0 } catch { /* sin almacenamiento: se usa el alto por defecto */ }
  return acotarAlto(guardado || window.innerHeight * 0.35)
}
// Solo se guarda cuando la persona elige un tamaño; el alto por defecto se sigue adaptando a cada pantalla
const guardarAltoVideo = (px: number) => {
  try { localStorage.setItem(CLAVE_ALTO_VIDEO, String(px)) } catch { /* sin almacenamiento */ }
}

/**
 * Reproductor anclado al borde de abajo para retomar el video o escuchar el podcast de la actividad mientras se practica.
 * Reserva su propio alto en el layout (variable CSS --alto-reproductor), así nunca tapa lo que se está practicando.
 * Plegado es una barra compacta; desplegado muestra el video. El mismo <video> sigue montado, así no se corta la reproducción.
 */
export function ReproductorFlotante() {
  const clave = useReproductorFlotante((s) => s.clave)
  const modoElegido = useReproductorFlotante((s) => s.modo)
  const { cambiarModo, guardarTiempo, cerrar } = useReproductorFlotante.getState()
  const voz = useVozPodcast((s) => s.voz)
  const elegirVoz = useVozPodcast((s) => s.elegir)
  // Abre con el video ampliado; arrastrando la manija hasta abajo se pliega y con un clic en la miniatura vuelve
  const [expandido, setExpandido] = useState(true)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 })
  const seccionRef = useRef<HTMLElement>(null)
  const medioRef = useRef<HTMLMediaElement | null>(null)
  // Si al cambiar de modo o de voz estaba sonando, el nuevo medio sigue sonando
  const seguirRef = useRef(false)
  const [altoVideo, setAltoVideo] = useState(altoVideoInicial)
  const arrastreRef = useRef<{ y: number; alto: number } | null>(null)
  // Arrastrar la manija bien por debajo del mínimo pliega el video a la barra (no hay botón para achicar)
  const plegarRef = useRef(false)

  // Si el reproductor se desmonta en pleno arrastre, no deja la página sin poder seleccionar texto
  useEffect(() => () => document.body.classList.remove('rp-arrastrando'), [])

  const urls = { video: clave && urlVideo(clave), podcast: clave && urlPodcast(clave, voz) }
  const visible = !!clave && (!!urls.video || !!urls.podcast)

  // Reserva el alto actual (plegado o desplegado) abajo del contenido y lo expone como variable CSS
  useEffect(() => {
    const el = seccionRef.current
    if (!visible || !el) return
    const raiz = document.documentElement
    const medir = () => raiz.style.setProperty(VAR_ALTO_REPRODUCTOR, `${el.offsetHeight}px`)
    medir()
    const obs = new ResizeObserver(medir)
    obs.observe(el)
    return () => { obs.disconnect(); raiz.style.removeProperty(VAR_ALTO_REPRODUCTOR) }
  }, [visible])

  if (!clave || !visible) return null
  // Si la actividad no tiene lo elegido, muestra lo que haya
  const modo: ModoReproductor = urls[modoElegido] ? modoElegido : modoElegido === 'video' ? 'podcast' : 'video'
  const src = urls[modo]!
  const nombre = ITINERARIOS[clave].nombre
  const conAmbos = !!urls.video && !!urls.podcast
  const verVideo = modo === 'video' && expandido

  const recordarSiSuena = () => { seguirRef.current = !!medioRef.current && !medioRef.current.paused }
  const elegirModo = (m: ModoReproductor) => { document.body.classList.remove('rp-arrastrando'); recordarSiSuena(); cambiarModo(m) }
  const cambiarVoz = (v: VozPodcast) => { recordarSiSuena(); elegirVoz(v) }

  // El componente sigue montado al cerrar el reproductor: se reinicia el estado para que no reabra con valores viejos
  const alCerrar = () => {
    setExpandido(true)
    setReproduciendo(false)
    setProgreso({ actual: 0, total: 0 })
    cerrar()
  }

  // Retoma donde quedó (al cambiar de modo o de voz el medio se vuelve a montar)
  const alCargar = (e: SyntheticEvent<HTMLMediaElement>) => {
    const medio = e.currentTarget
    medio.currentTime = useReproductorFlotante.getState().tiempos[modo]
    setProgreso({ actual: medio.currentTime, total: medio.duration || 0 })
    // Un medio recién montado arranca en pausa; onPlay lo vuelve a activar si se retoma
    setReproduciendo(false)
    if (seguirRef.current) { seguirRef.current = false; void medio.play().catch(() => {}) }
  }
  const alAvanzar = (e: SyntheticEvent<HTMLMediaElement>) => {
    guardarTiempo(modo, e.currentTarget.currentTime)
    setProgreso({ actual: e.currentTarget.currentTime, total: e.currentTarget.duration || 0 })
  }
  const alternarReproduccion = () => {
    const medio = medioRef.current
    if (!medio) return
    if (medio.paused) void medio.play().catch(() => {})
    else medio.pause()
  }
  const mover = (seg: number) => {
    if (medioRef.current) medioRef.current.currentTime = seg
    setProgreso((p) => ({ ...p, actual: seg }))
  }

  // Manija para cambiar el tamaño: arrastrar hacia arriba agranda el video
  const alPresionarManija = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastreRef.current = { y: e.clientY, alto: altoVideo }
    document.body.classList.add('rp-arrastrando')
  }
  const alMoverManija = (e: React.PointerEvent<HTMLDivElement>) => {
    const inicio = arrastreRef.current
    if (!inicio) return
    const alto = inicio.alto + inicio.y - e.clientY
    plegarRef.current = alto < ALTO_VIDEO_MIN - 60
    setAltoVideo(acotarAlto(alto))
  }
  const alSoltarManija = () => {
    const arrastraba = arrastreRef.current !== null
    arrastreRef.current = null
    document.body.classList.remove('rp-arrastrando')
    if (plegarRef.current) { plegarRef.current = false; setExpandido(false) }
    else if (arrastraba) guardarAltoVideo(altoVideo)
  }
  const alTeclaManija = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || (e.key === 'ArrowDown' && altoVideo <= ALTO_VIDEO_MIN)) {
      e.preventDefault()
      document.body.classList.remove('rp-arrastrando')
      setExpandido(false)
      return
    }
    const cambios: Record<string, number> = { ArrowUp: altoVideo + 24, ArrowDown: altoVideo - 24, Home: ALTO_VIDEO_MIN, End: altoVideoMax() }
    if (!(e.key in cambios)) return
    e.preventDefault()
    const alto = acotarAlto(cambios[e.key])
    setAltoVideo(alto)
    guardarAltoVideo(alto)
  }

  const propsMedio = {
    src,
    preload: 'metadata' as const,
    onLoadedMetadata: alCargar,
    onTimeUpdate: alAvanzar,
    onPlay: () => setReproduciendo(true),
    onPause: () => setReproduciendo(false),
    onEnded: () => setReproduciendo(false),
  }

  return (
    <section
      ref={seccionRef} className="rp" role="region" aria-label="Reproductor" data-modo={modo} data-expandido={verVideo}
      style={{ '--alto-video': `${altoVideo}px` } as React.CSSProperties}
    >
      {modo === 'video' ? (
        <div className="rp-video">
          {/* La manija va pegada al recuadro del video, que ocupa solo su ancho */}
          {verVideo && (
            <div
              className="rp-manija"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Tamaño del video: arrastrá o usá las flechas; hasta abajo o Esc lo achica"
              aria-valuemin={ALTO_VIDEO_MIN}
              aria-valuemax={altoVideoMax()}
              aria-valuenow={altoVideo}
              tabIndex={0}
              title="Arrastrá para cambiar el tamaño; llevala hasta abajo para achicar el video"
              onPointerDown={alPresionarManija}
              onPointerMove={alMoverManija}
              onPointerUp={alSoltarManija}
              onPointerCancel={alSoltarManija}
              onLostPointerCapture={alSoltarManija}
              onKeyDown={alTeclaManija}
            ><span aria-hidden="true" /></div>
          )}
          <video
            key={src} {...propsMedio} ref={(el) => { medioRef.current = el }} playsInline
            // Plegado, la miniatura amplía el video; ampliado, el clic pausa o reanuda como en cualquier reproductor
            onClick={expandido ? alternarReproduccion : () => setExpandido(true)}
            title={expandido ? undefined : 'Ampliar el video'}
            aria-label={`Video: ${nombre}`}
          >
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      ) : (
        <>
          <SubtitulosPodcast url={urlSubtitulosPodcast(clave, voz)} actual={progreso.actual} />
          <audio key={src} {...propsMedio} ref={(el) => { medioRef.current = el }} hidden>
            Tu navegador no puede reproducir este audio.
          </audio>
        </>
      )}
      <div className="rp-barra">
        <span className="rp-titulo">{nombre}</span>
        <div className="rp-centro">
          <button type="button" className="rp-play" onClick={alternarReproduccion} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}>
            {reproduciendo ? (
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8.5 5.6v12.8a.8.8 0 0 0 1.2.7l10-6.4a.8.8 0 0 0 0-1.4l-10-6.4a.8.8 0 0 0-1.2.7z" fill="currentColor" /></svg>
            )}
          </button>
          <div className="rp-prog">
            <span className="rp-tiempo" aria-hidden="true">{formatear(progreso.actual)}</span>
            <input
              type="range"
              aria-label="Posición"
              aria-valuetext={`${formatear(progreso.actual)} de ${formatear(progreso.total)}`}
              min={0}
              max={progreso.total || 0}
              step={1}
              value={Math.min(progreso.actual, progreso.total || 0)}
              disabled={!progreso.total}
              style={{ '--lleno': `${progreso.total ? (progreso.actual / progreso.total) * 100 : 0}%` } as React.CSSProperties}
              onChange={(e) => mover(Number(e.target.value))}
            />
            <span className="rp-tiempo" aria-hidden="true">{formatear(progreso.total)}</span>
          </div>
        </div>
        <div className="rp-ctl">
          {conAmbos && (
            <div className="rp-grupo" role="group" aria-label="Qué querés usar mientras practicás">
              {MODOS.map((m) => (
                <button key={m.id} type="button" aria-pressed={modo === m.id} aria-label={m.nombre} onClick={() => elegirModo(m.id)}>
                  <span aria-hidden="true">{m.icono}</span><span className="rp-txt" aria-hidden="true"> {m.nombre}</span>
                </button>
              ))}
            </div>
          )}
          {modo === 'podcast' && (
            <div className="rp-grupo" role="radiogroup" aria-label="Voz del podcast">
              {VOCES_PODCAST.map((v) => (
                <button key={v.id} type="button" role="radio" aria-checked={voz === v.id} onClick={() => cambiarVoz(v.id)}>{v.nombre}</button>
              ))}
            </div>
          )}
          {modo === 'video' && expandido && (
            <button
              type="button"
              className="rp-accion"
              aria-label="Ver el video en pantalla completa"
              title="Pantalla completa"
              onClick={() => void medioRef.current?.requestFullscreen?.().catch(() => {})}
            ><span aria-hidden="true">⛶</span></button>
          )}
          <button type="button" className="rp-icono" onClick={alCerrar} aria-label="Cerrar el reproductor" title="Cerrar"><span aria-hidden="true">×</span></button>
        </div>
      </div>
    </section>
  )
}
