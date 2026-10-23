import { useState } from 'react'
import { Instructivo } from '../../componentes/ui/Instructivo'
import { INSTRUCTIVOS_SITIO } from '../../contenido/instructivos'
import { VOCES_PODCAST } from '../../contenido/podcasts'
import { useResenas } from '../../datos/resenas'
import { useVozPodcast } from '../../estado/vozPodcast'
import type { ClaveItinerario } from '../../guia/itinerarios'
import { ACTIVIDADES } from '../acciones'
import { ListaResenas, ResumenResenas } from '../ListaResenas'
import { TarjetaActividad } from '../TarjetaActividad'
import { TarjetaPodcast } from '../TarjetaPodcast'

/** Secciones de la página. Se navega con scroll: un ancla (#videos) pisaría la ruta del hash. */
const SECCIONES = [
  { id: 'cap-videos', nombre: 'Videos' },
  { id: 'cap-podcast', nombre: 'Podcast' },
  { id: 'cap-resenas', nombre: 'Reseñas' },
]

const irA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// La exploración libre no tiene contenido para escuchar ni práctica que terminar
const CON_GUIA = ACTIVIDADES.filter(([, it]) => it.pasos.length > 0)

/** Elige con qué voz se escuchan todos los podcasts */
function SelectorVoz() {
  const voz = useVozPodcast((s) => s.voz)
  const elegir = useVozPodcast((s) => s.elegir)
  return (
    <div className="chips" role="radiogroup" aria-label="Voz de los podcasts">
      <span className="chips-tit">Voz:</span>
      {VOCES_PODCAST.map((v) => (
        <button key={v.id} type="button" role="radio" aria-checked={voz === v.id} onClick={() => elegir(v.id)}>{v.nombre}</button>
      ))}
    </div>
  )
}

/** Todas las reseñas, con filtro por capacitación */
function SeccionResenas() {
  const { resenas, estado } = useResenas()
  const [filtro, setFiltro] = useState<ClaveItinerario | null>(null)
  const visibles = filtro ? resenas.filter((r) => r.clave === filtro) : resenas

  return (
    <section className="bloque" id="cap-resenas" aria-labelledby="cap-resenas-tit">
      <div className="bloque-cab">
        <h2 className="bloque-tit" id="cap-resenas-tit">Reseñas</h2>
        <ResumenResenas resenas={visibles} />
      </div>
      <p className="cap-intro">Opiniones de personas que terminaron cada capacitación.</p>
      <div className="chips" role="group" aria-label="Filtrar reseñas por capacitación">
        <button type="button" aria-pressed={filtro === null} onClick={() => setFiltro(null)}>Todas</button>
        {CON_GUIA.map(([clave, it]) => (
          <button key={clave} type="button" aria-pressed={filtro === clave} onClick={() => setFiltro(clave)}>{it.nombre}</button>
        ))}
      </div>
      <ListaResenas
        resenas={visibles}
        estado={estado}
        conActividad={!filtro}
        vacio={filtro ? 'Esta capacitación todavía no tiene reseñas.' : 'Todavía no hay reseñas. Terminá una capacitación y dejá la primera.'}
      />
    </section>
  )
}

export function Capacitaciones() {
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
          <SelectorVoz />
          <div className="pod-lista">
            {CON_GUIA.map(([clave, it]) => <TarjetaPodcast key={clave} clave={clave} it={it} />)}
          </div>
        </div>
      </section>
      <SeccionResenas />
      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_SITIO.capacitaciones} />
      </section>
    </div>
  )
}
