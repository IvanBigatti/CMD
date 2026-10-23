import { PODCASTS, urlPodcast } from '../contenido/podcasts'
import { useVozPodcast } from '../estado/vozPodcast'
import type { ClaveItinerario, Itinerario } from '../guia/itinerarios'
import { href } from './ruta'

/** Episodio de podcast de una actividad, con reproductor en la voz elegida o cartel de "próximamente" */
export function TarjetaPodcast({ clave, it }: { clave: ClaveItinerario; it: Itinerario }) {
  const voz = useVozPodcast((s) => s.voz)
  const audio = urlPodcast(clave, voz)
  const duracion = PODCASTS[clave]?.[voz]
  return (
    <article className="pod-card">
      <span className="pod-icono" aria-hidden="true">🎧</span>
      <div className="pod-cuerpo">
        <h3 className="act-nombre">{it.nombre}</h3>
        <p className="act-desc">{it.descripcion}</p>
        {audio ? (
          <audio key={audio} src={audio} controls preload="none">
            Tu navegador no puede reproducir este audio.
          </audio>
        ) : (
          <p className="pod-vacio"><b>Podcast próximamente.</b> Mientras tanto, mirá el video de la actividad.</p>
        )}
        <p className="act-meta">
          {it.modulos}{duracion && ` · ${duracion} min`} · <a href={href(`/capacitaciones/${clave}`)}>Ver la actividad</a>
        </p>
      </div>
    </article>
  )
}
