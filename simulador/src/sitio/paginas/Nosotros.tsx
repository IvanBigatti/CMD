import { TextoRico } from '../../componentes/ui/TextoRico'
import { NOSOTROS } from '../../contenido/nosotros'
import { href } from '../ruta'

export function Nosotros() {
  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <h1>Sobre nosotros</h1>
        <p>{NOSOTROS.bajada}</p>
      </section>

      <section className="bloque nos-quienes">
        <div>
          <h2 className="bloque-tit">Quiénes somos</h2>
          {NOSOTROS.quienesSomos.map((p, i) => <p key={i}><TextoRico texto={p} /></p>)}
        </div>
        <ul className="valores">
          {NOSOTROS.valores.map((v) => (
            <li key={v.titulo}>
              <span aria-hidden="true">{v.icono}</span>
              <div><h3>{v.titulo}</h3><p>{v.texto}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bloque fondo-lav">
        <div>
          <h2 className="bloque-tit">Nuestras capacitaciones</h2>
          <ul className="lista-check">
            {NOSOTROS.capacitaciones.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <a className="btn-s" href={href('/capacitaciones')}>Ver las capacitaciones</a>
        </div>
      </section>
    </div>
  )
}
