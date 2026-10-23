import { urlVideo } from '../../contenido/videos'
import { useVideoFlotante } from '../../estado/videoFlotante'
import { ITINERARIOS } from '../../guia/itinerarios'

/** Reproductor chico en un costado del simulador para retomar el video de la actividad */
export function VideoFlotante() {
  const clave = useVideoFlotante((s) => s.clave)
  const minimizado = useVideoFlotante((s) => s.minimizado)
  const { guardarTiempo, alternarMinimizado, cerrar } = useVideoFlotante.getState()
  const video = clave ? urlVideo(clave) : null
  if (!clave || !video) return null
  const nombre = ITINERARIOS[clave].nombre

  if (minimizado) {
    return (
      <button type="button" className="vf-pastilla" onClick={alternarMinimizado} aria-label={`Mostrar el video: ${nombre}`}>
        <span aria-hidden="true">▶</span> Ver video
      </button>
    )
  }

  return (
    <aside className="vf" aria-label={`Video: ${nombre}`}>
      <div className="vf-barra">
        <span className="vf-titulo">{nombre}</span>
        <button type="button" onClick={alternarMinimizado} aria-label="Minimizar el video" title="Minimizar">–</button>
        <button type="button" onClick={cerrar} aria-label="Cerrar el video" title="Cerrar">×</button>
      </div>
      <video
        key={video}
        src={video}
        controls
        preload="metadata"
        playsInline
        // Retoma donde quedó (al minimizar o salir del simulador el componente se desmonta)
        onLoadedMetadata={(e) => { e.currentTarget.currentTime = useVideoFlotante.getState().tiempo }}
        onTimeUpdate={(e) => guardarTiempo(e.currentTarget.currentTime)}
      >
        Tu navegador no puede reproducir este video.
      </video>
    </aside>
  )
}
