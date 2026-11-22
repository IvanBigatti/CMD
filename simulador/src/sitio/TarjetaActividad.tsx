import { urlVideo } from '../contenido/videos'
import type { ClaveItinerario, Itinerario } from '../guia/itinerarios'
import { href } from './ruta'

/** Tarjeta de una actividad con miniatura del video (el cuadro del segundo 1) */
export function TarjetaActividad({ clave, it }: { clave: ClaveItinerario; it: Itinerario }) {
  const video = urlVideo(clave)
  return (
    <a className={`act-card${it.recomendado ? ' rec' : ''}`} href={href(`/capacitaciones/${clave}`)}>
      <span className="act-mini">
        {video
          ? <video src={`${video}#t=1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />
          : <span className="act-mini-vacia" aria-hidden="true">🧭</span>}
        {video && <span className="act-play" aria-hidden="true">▶</span>}
        {it.recomendado && <span className="act-badge">Recomendada</span>}
      </span>
      <span className="act-cuerpo">
        <span className="act-nombre">{it.nombre}</span>
        <span className="act-desc">{it.descripcion}</span>
        <span className="act-meta">{it.modulos} · {it.duracion} · {video ? 'con video' : 'sin video'}</span>
      </span>
    </a>
  )
}
