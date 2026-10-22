import { Instructivo } from '../../componentes/ui/Instructivo'
import { INSTRUCTIVOS_ACTIVIDAD } from '../../contenido/instructivos'
import { urlVideo } from '../../contenido/videos'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../../guia/itinerarios'
import { ACTIVIDADES, practicar } from '../acciones'
import { href } from '../ruta'

export function Actividad({ clave }: { clave: ClaveItinerario }) {
  const it: Itinerario = ITINERARIOS[clave]
  const video = urlVideo(clave)
  const i = ACTIVIDADES.findIndex(([c]) => c === clave)
  const anterior = ACTIVIDADES[i - 1]
  const siguiente = ACTIVIDADES[i + 1]
  const conGuia = it.pasos.length > 0

  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <a className="migas" href={href('/capacitaciones')}>← Todas las capacitaciones</a>
        <h1>{it.nombre}</h1>
        <p>{it.descripcion}</p>
        <p className="act-meta grande">
          {it.modulos} · {it.duracion}
          {it.recomendado && <span className="act-badge en-linea">Recomendada</span>}
        </p>
      </section>

      <section className="bloque actividad">
        <div className="act-video">
          {video ? (
            <video key={video} src={video} controls preload="metadata" playsInline>
              Tu navegador no puede reproducir este video.
            </video>
          ) : (
            <div className="video-vacio">
              <span aria-hidden="true">🎬</span>
              <b>Video próximamente</b>
              <span>Mientras tanto, seguí el instructivo y practicá en el simulador.</span>
            </div>
          )}
        </div>
        <aside className="act-practica">
          <h2>Practicalo vos</h2>
          <p>
            {conGuia
              ? 'Abrimos el simulador con una cuenta preparada y una guía que te marca dónde hacer clic. Podés salir cuando quieras.'
              : 'Abrimos el simulador con pesos y dólares acreditados para que pruebes lo que quieras, sin guía.'}
          </p>
          <button type="button" className="btn-s grande w" onClick={() => practicar(clave)}>
            Practicar en el simulador
          </button>
          <p className="nota">Al empezar, la cuenta simulada vuelve a cero y se prepara para esta actividad.</p>
        </aside>
      </section>

      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_ACTIVIDAD[clave]} />
      </section>

      <nav className="act-nav bloque" aria-label="Otras actividades">
        {anterior
          ? <a href={href(`/capacitaciones/${anterior[0]}`)}><small>← Anterior</small>{anterior[1].nombre}</a>
          : <span />}
        {siguiente
          ? <a className="sig" href={href(`/capacitaciones/${siguiente[0]}`)}><small>Siguiente →</small>{siguiente[1].nombre}</a>
          : <span />}
      </nav>
    </div>
  )
}
