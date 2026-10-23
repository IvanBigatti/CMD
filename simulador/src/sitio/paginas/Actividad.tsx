import { useRef } from 'react'
import { Instructivo } from '../../componentes/ui/Instructivo'
import { INSTRUCTIVOS_ACTIVIDAD } from '../../contenido/instructivos'
import { urlVideo } from '../../contenido/videos'
import { useResenas } from '../../datos/resenas'
import { useReproductorFlotante } from '../../estado/reproductorFlotante'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../../guia/itinerarios'
import { ACTIVIDADES, practicar } from '../acciones'
import { ListaResenas, ResumenResenas } from '../ListaResenas'
import { href } from '../ruta'

/** Reseñas que dejaron quienes terminaron esta capacitación */
function ResenasActividad({ clave }: { clave: ClaveItinerario }) {
  const { resenas, estado } = useResenas(clave)
  return (
    <section className="bloque" aria-labelledby="act-resenas-tit">
      <div className="bloque-cab">
        <h2 className="bloque-tit" id="act-resenas-tit">Reseñas</h2>
        <ResumenResenas resenas={resenas} />
      </div>
      <ListaResenas
        resenas={resenas}
        estado={estado}
        vacio="Todavía no hay reseñas. Terminá la práctica guiada y dejá la primera."
      />
    </section>
  )
}

export function Actividad({ clave }: { clave: ClaveItinerario }) {
  const it: Itinerario = ITINERARIOS[clave]
  const video = urlVideo(clave)
  const i = ACTIVIDADES.findIndex(([c]) => c === clave)
  const anterior = ACTIVIDADES[i - 1]
  const siguiente = ACTIVIDADES[i + 1]
  const conGuia = it.pasos.length > 0
  const videoRef = useRef<HTMLVideoElement>(null)
  // Si ya se vio parte del video en el simulador, al volver acá retoma desde ese segundo
  const flotante = useReproductorFlotante.getState()

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
            <video
              key={video}
              ref={videoRef}
              src={video}
              controls
              preload="metadata"
              playsInline
              onLoadedMetadata={(e) => { if (flotante.clave === clave) e.currentTarget.currentTime = flotante.tiempos.video }}
            >
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
          <button type="button" className="btn-s grande w" onClick={() => practicar(clave, { modo: 'video', tiempo: videoRef.current?.currentTime ?? 0 })}>
            Practicar en el simulador
          </button>
          <p className="nota">Mientras practicás, el video y el podcast quedan en un recuadro al costado para retomarlos.</p>
          <p className="nota">Al empezar, la cuenta simulada vuelve a cero y se prepara para esta actividad.</p>
        </aside>
      </section>

      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_ACTIVIDAD[clave]} />
      </section>

      {conGuia && <ResenasActividad clave={clave} />}

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
