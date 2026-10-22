import { Instructivo } from '../../componentes/ui/Instructivo'
import { INSTRUCTIVOS_SITIO } from '../../contenido/instructivos'
import { ACTIVIDADES } from '../acciones'
import { TarjetaActividad } from '../TarjetaActividad'
import { TarjetaPodcast } from '../TarjetaPodcast'

/** Secciones de la página. Se navega con scroll: un ancla (#videos) pisaría la ruta del hash. */
const SECCIONES = [
  { id: 'cap-videos', nombre: 'Videos' },
  { id: 'cap-podcast', nombre: 'Podcast' },
]

const irA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export function Capacitaciones() {
  // La exploración libre no tiene contenido para escuchar
  const conPodcast = ACTIVIDADES.filter(([, it]) => it.pasos.length > 0)

  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <h1>Capacitaciones</h1>
        <p>Cada actividad tiene un video corto, un podcast para escuchar, un instructivo y una práctica guiada en el simulador. Si es tu primera vez, empezá por <b>Ciclo completo</b>.</p>
        <nav className="cap-secciones" aria-label="Secciones de capacitaciones">
          {SECCIONES.map((s) => (
            <button key={s.id} type="button" onClick={() => irA(s.id)}>{s.nombre}</button>
          ))}
        </nav>
      </section>
      <section className="bloque" id="cap-videos" aria-labelledby="cap-videos-tit">
        <h2 className="bloque-tit" id="cap-videos-tit">Videos</h2>
        <div className="act-grid">
          {ACTIVIDADES.map(([clave, it]) => <TarjetaActividad key={clave} clave={clave} it={it} />)}
        </div>
      </section>
      <section className="bloque fondo-lav" id="cap-podcast" aria-labelledby="cap-podcast-tit">
        <div>
          <h2 className="bloque-tit" id="cap-podcast-tit">Podcast</h2>
          <p className="cap-intro">La misma capacitación en audio, para escuchar cuando no podés mirar la pantalla.</p>
          <div className="pod-lista">
            {conPodcast.map(([clave, it]) => <TarjetaPodcast key={clave} clave={clave} it={it} />)}
          </div>
        </div>
      </section>
      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_SITIO.capacitaciones} />
      </section>
    </div>
  )
}
