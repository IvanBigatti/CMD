import { useRef, type SyntheticEvent } from 'react'
import { urlPodcast, VOCES_PODCAST } from '../../contenido/podcasts'
import { urlVideo } from '../../contenido/videos'
import { useReproductorFlotante, type ModoReproductor } from '../../estado/reproductorFlotante'
import { useVozPodcast } from '../../estado/vozPodcast'
import { ITINERARIOS } from '../../guia/itinerarios'

const MODOS: { id: ModoReproductor; nombre: string }[] = [
  { id: 'video', nombre: '🎬 Video' },
  { id: 'podcast', nombre: '🎧 Podcast' },
]

/**
 * Recuadro chico en un costado del simulador para retomar el video o escuchar el podcast de la actividad.
 * Minimizado queda montado pero oculto: así el podcast sigue sonando mientras se practica.
 */
export function ReproductorFlotante() {
  const clave = useReproductorFlotante((s) => s.clave)
  const modoElegido = useReproductorFlotante((s) => s.modo)
  const minimizado = useReproductorFlotante((s) => s.minimizado)
  const { cambiarModo, guardarTiempo, alternarMinimizado, cerrar } = useReproductorFlotante.getState()
  const voz = useVozPodcast((s) => s.voz)
  const elegirVoz = useVozPodcast((s) => s.elegir)
  const videoRef = useRef<HTMLVideoElement>(null)

  const urls = { video: clave && urlVideo(clave), podcast: clave && urlPodcast(clave, voz) }
  if (!clave || (!urls.video && !urls.podcast)) return null
  // Si la actividad no tiene lo elegido, muestra lo que haya
  const modo: ModoReproductor = urls[modoElegido] ? modoElegido : modoElegido === 'video' ? 'podcast' : 'video'
  const src = urls[modo]!
  const nombre = ITINERARIOS[clave].nombre
  const conAmbos = !!urls.video && !!urls.podcast

  const minimizar = () => {
    // El video no tiene sentido sin mirarlo; el podcast sí sigue sonando
    if (modo === 'video') videoRef.current?.pause()
    alternarMinimizado()
  }

  // Retoma donde quedó (al cambiar de modo, de voz o salir del simulador el reproductor se vuelve a montar)
  const alCargar = (e: SyntheticEvent<HTMLMediaElement>) => { e.currentTarget.currentTime = useReproductorFlotante.getState().tiempos[modo] }
  const alAvanzar = (e: SyntheticEvent<HTMLMediaElement>) => guardarTiempo(modo, e.currentTarget.currentTime)

  return (
    <>
      {minimizado && (
        <button type="button" className="vf-pastilla" onClick={alternarMinimizado} aria-label={`Mostrar el ${modo === 'video' ? 'video' : 'podcast'}: ${nombre}`}>
          {modo === 'video' ? <><span aria-hidden="true">▶</span> Ver video</> : <><span aria-hidden="true">🎧</span> Podcast</>}
        </button>
      )}
      <aside className={`vf${modo === 'podcast' ? ' vf-audio' : ''}`} aria-label={`Material de la actividad: ${nombre}`} hidden={minimizado}>
        <div className="vf-barra">
          <span className="vf-titulo">{nombre}</span>
          <button type="button" onClick={minimizar} aria-label="Minimizar" title="Minimizar">–</button>
          <button type="button" onClick={cerrar} aria-label="Cerrar" title="Cerrar">×</button>
        </div>
        {conAmbos && (
          <div className="vf-modos" role="group" aria-label="Qué querés usar mientras practicás">
            {MODOS.map((m) => (
              <button key={m.id} type="button" aria-pressed={modo === m.id} onClick={() => cambiarModo(m.id)}>{m.nombre}</button>
            ))}
          </div>
        )}
        {modo === 'video' ? (
          <video key={src} ref={videoRef} src={src} controls preload="metadata" playsInline onLoadedMetadata={alCargar} onTimeUpdate={alAvanzar}>
            Tu navegador no puede reproducir este video.
          </video>
        ) : (
          <div className="vf-podcast">
            <div className="vf-voces" role="radiogroup" aria-label="Voz del podcast">
              <span>Voz:</span>
              {VOCES_PODCAST.map((v) => (
                <button key={v.id} type="button" role="radio" aria-checked={voz === v.id} onClick={() => elegirVoz(v.id)}>{v.nombre}</button>
              ))}
            </div>
            <audio key={src} src={src} controls preload="metadata" onLoadedMetadata={alCargar} onTimeUpdate={alAvanzar}>
              Tu navegador no puede reproducir este audio.
            </audio>
          </div>
        )}
      </aside>
    </>
  )
}
