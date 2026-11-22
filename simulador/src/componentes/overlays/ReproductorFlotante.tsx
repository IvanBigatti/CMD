import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { urlPodcast, VOCES_PODCAST, type VozPodcast } from '../../contenido/podcasts'
import { urlVideo } from '../../contenido/videos'
import { useReproductorFlotante, VAR_ALTO_REPRODUCTOR, type ModoReproductor } from '../../estado/reproductorFlotante'
import { useVozPodcast } from '../../estado/vozPodcast'
import { ITINERARIOS } from '../../guia/itinerarios'

const MODOS: { id: ModoReproductor; icono: string; nombre: string }[] = [
  { id: 'video', icono: '🎬', nombre: 'Video' },
  { id: 'podcast', icono: '🎧', nombre: 'Podcast' },
]

/** 83 -> "1:23" */
function formatear(seg: number): string {
  const s = Math.max(0, Math.floor(seg || 0))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
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
  const [expandido, setExpandido] = useState(false)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 })
  const seccionRef = useRef<HTMLElement>(null)
  const medioRef = useRef<HTMLMediaElement | null>(null)
  // Si al cambiar de modo o de voz estaba sonando, el nuevo medio sigue sonando
  const seguirRef = useRef(false)

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
  const elegirModo = (m: ModoReproductor) => { recordarSiSuena(); cambiarModo(m) }
  const cambiarVoz = (v: VozPodcast) => { recordarSiSuena(); elegirVoz(v) }

  // El componente sigue montado al cerrar el reproductor: se reinicia el estado para que no reabra con valores viejos
  const alCerrar = () => {
    setExpandido(false)
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
    <section ref={seccionRef} className="rp" role="region" aria-label="Reproductor" data-modo={modo} data-expandido={verVideo}>
      {modo === 'video' ? (
        <div className="rp-video">
          <video key={src} {...propsMedio} ref={(el) => { medioRef.current = el }} playsInline onClick={alternarReproduccion} aria-label={`Video: ${nombre}`}>
            Tu navegador no puede reproducir este video.
          </video>
        </div>
      ) : (
        <audio key={src} {...propsMedio} ref={(el) => { medioRef.current = el }} hidden>
          Tu navegador no puede reproducir este audio.
        </audio>
      )}
      <div className="rp-barra">
        <span className="rp-titulo">{nombre}</span>
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
        <div className="rp-ctl">
          <button type="button" className="rp-play" onClick={alternarReproduccion} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'}>
            <span aria-hidden="true">{reproduciendo ? '⏸' : '▶'}</span>
          </button>
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
          <span className="rp-sp" />
          {modo === 'video' && (
            <button
              type="button"
              className="rp-icono"
              aria-expanded={expandido}
              aria-label={expandido ? 'Contraer el video' : 'Expandir el video'}
              title={expandido ? 'Contraer el video' : 'Expandir el video'}
              onClick={() => setExpandido((v) => !v)}
            ><span aria-hidden="true">{expandido ? '⌄' : '⌃'}</span></button>
          )}
          <button type="button" className="rp-icono" onClick={alCerrar} aria-label="Cerrar el reproductor" title="Cerrar"><span aria-hidden="true">×</span></button>
        </div>
      </div>
    </section>
  )
}
