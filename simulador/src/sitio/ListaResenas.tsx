import { Estrellas } from '../componentes/ui/Estrellas'
import { promedioResenas, type Resena } from '../datos/resenas'
import { ITINERARIOS } from '../guia/itinerarios'

const formatoFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

/** Promedio de estrellas y cantidad de reseñas */
export function ResumenResenas({ resenas }: { resenas: Resena[] }) {
  if (!resenas.length) return null
  const promedio = promedioResenas(resenas)
  return (
    <span className="promedio">
      <b>{promedio.toLocaleString('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</b>
      <Estrellas valor={promedio} />
      <span>{resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'}</span>
    </span>
  )
}

/** Tarjetas de reseñas, con los estados de carga, error y lista vacía */
export function ListaResenas({ resenas, estado, conActividad, vacio }: {
  resenas: Resena[]
  estado: 'cargando' | 'listo' | 'error'
  /** Muestra el nombre de la capacitación en cada tarjeta */
  conActividad?: boolean
  vacio: string
}) {
  if (estado === 'cargando') return <p className="resenas-aviso" role="status">Cargando reseñas…</p>
  if (estado === 'error') return <p className="resenas-aviso" role="alert">No pudimos cargar las reseñas en este momento.</p>
  if (!resenas.length) return <p className="resenas-aviso">{vacio}</p>
  return (
    <div className="testi-grid">
      {resenas.map((r) => (
        <figure key={r.id} className="testi">
          <Estrellas valor={r.puntuacion} chico />
          <blockquote>“{r.comentario}”</blockquote>
          <figcaption>
            <b>{r.nombre}</b>
            {conActividad && ` · ${ITINERARIOS[r.clave]?.nombre ?? r.clave}`}
            {' · '}{formatoFecha(r.fecha)}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
