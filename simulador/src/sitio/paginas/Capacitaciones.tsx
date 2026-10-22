import { Instructivo } from '../../componentes/ui/Instructivo'
import { INSTRUCTIVOS_SITIO } from '../../contenido/instructivos'
import { ACTIVIDADES } from '../acciones'
import { TarjetaActividad } from '../TarjetaActividad'

export function Capacitaciones() {
  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <h1>Capacitaciones</h1>
        <p>Cada actividad tiene un video corto, un instructivo y una práctica guiada en el simulador. Si es tu primera vez, empezá por <b>Ciclo completo</b>.</p>
      </section>
      <section className="bloque">
        <div className="act-grid">
          {ACTIVIDADES.map(([clave, it]) => <TarjetaActividad key={clave} clave={clave} it={it} />)}
        </div>
      </section>
      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_SITIO.capacitaciones} />
      </section>
    </div>
  )
}
