import { AvisoCaja } from '../../componentes/ui/AvisoCaja'
import { TextoRico } from '../../componentes/ui/TextoRico'
import { ANTES_DE_EMPEZAR as A } from '../../contenido/antesDeEmpezar'
import { urlInstructivo } from '../../contenido/instructivos'
import { AVISO_SEGURIDAD } from '../../contenido/seguridad'
import { ACTIVIDADES } from '../acciones'
import { href } from '../ruta'

export function AntesDeEmpezar() {
  return (
    <div className="sitio-pagina ab">
      <section className="cabecera-pagina">
        <h1>{A.titulo}</h1>
        <p>{A.bajada}</p>
        <p><TextoRico texto={A.online} /></p>
        <AvisoCaja aviso={AVISO_SEGURIDAD} style={{ maxWidth: 640, marginTop: 14 }} />
      </section>

      <section className="bloque ab-que" aria-labelledby="ab-que-tit">
        <div>
          <h2 className="bloque-tit" id="ab-que-tit">{A.queEs.titulo}</h2>
          <p className="ab-destacado">{A.queEs.destacado}</p>
          <AvisoCaja aviso={A.queEs.aviso} />
          <p className="ab-texto"><TextoRico texto={A.queEs.publico} /></p>
        </div>
        <ul className="valores">
          {A.queEs.rasgos.map((r) => (
            <li key={r.titulo}>
              <span aria-hidden="true">{r.icono}</span>
              <div><h3>{r.titulo}</h3><p>{r.texto}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bloque fondo-lav" aria-labelledby="ab-ciclo-tit">
        <div>
          <h2 className="bloque-tit" id="ab-ciclo-tit">{A.ciclo.titulo}</h2>
          <p className="cap-intro">{A.ciclo.bajada}</p>
          <ol className="ab-ciclo">
            {A.ciclo.etapas.map((e) => (
              <li key={e.modulo}>
                <span className="ab-modulo">{e.modulo}</span>
                <div><h3>{e.titulo}</h3><p>{e.texto}</p></div>
              </li>
            ))}
          </ol>
          <p className="ab-texto"><TextoRico texto={A.ciclo.cierre} /></p>
        </div>
      </section>

      <section className="bloque" aria-labelledby="ab-afuera-tit">
        <h2 className="bloque-tit" id="ab-afuera-tit">{A.afuera.titulo}</h2>
        <p className="cap-intro">{A.afuera.bajada}</p>
        <dl className="ab-afuera">
          {A.afuera.items.map((x) => (
            <div key={x.titulo}><dt>{x.titulo}</dt><dd>{x.texto}</dd></div>
          ))}
        </dl>
      </section>

      <section className="bloque fondo-lav" aria-labelledby="ab-saldos-tit">
        <div>
          <h2 className="bloque-tit" id="ab-saldos-tit">{A.saldos.titulo}</h2>
          <p className="cap-intro"><TextoRico texto={A.saldos.bajada} /></p>
          <div className="ab-saldos">
            {A.saldos.items.map((s) => (
              <article key={s.tono} className={`ab-saldo ${s.tono}`}>
                <h3>{s.nombre}</h3>
                <p className="frase">{s.frase}</p>
                <p>{s.texto}</p>
                <p className="banco">{s.banco}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bloque" aria-labelledby="ab-itin-tit">
        <h2 className="bloque-tit" id="ab-itin-tit">{A.itinerarios.titulo}</h2>
        <p className="cap-intro">{A.itinerarios.bajada}</p>
        <table className="ab-tabla">
          <thead>
            <tr><th scope="col">Itinerario</th><th scope="col">Módulos</th><th scope="col">Duración</th></tr>
          </thead>
          <tbody>
            {ACTIVIDADES.map(([clave, it]) => {
              const libre = it.pasos.length === 0
              return (
                <tr key={clave}>
                  <th scope="row">
                    <a href={href(`/capacitaciones/${clave}`)}>{it.nombre}</a>
                    {libre && ' (sin guía)'}
                    {it.recomendado && <span className="act-badge en-linea">Recomendada</span>}
                  </th>
                  <td data-etiqueta="Módulos">{it.modulos}</td>
                  <td data-etiqueta="Duración">{libre ? 'Libre' : it.duracion}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      <section className="bloque fondo-lav" aria-labelledby="ab-guia-tit">
        <div className="ab-guia">
          <div>
            <h2 className="bloque-tit" id="ab-guia-tit">{A.guia.titulo}</h2>
            <ol className="ab-pasos">
              {A.guia.pasos.map((p) => (
                <li key={p.titulo}><h3>{p.titulo}</h3><p><TextoRico texto={p.texto} /></p></li>
              ))}
            </ol>
          </div>
          <aside className="ab-reloj">
            <h3>{A.guia.reloj.titulo}</h3>
            <p>{A.guia.reloj.texto}</p>
          </aside>
        </div>
      </section>

      <section className="bloque" aria-labelledby="ab-err-tit">
        <h2 className="bloque-tit" id="ab-err-tit">{A.errores.titulo}</h2>
        <p className="cap-intro">{A.errores.bajada}</p>
        <table className="ab-tabla">
          <thead>
            <tr>{A.errores.columnas.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
          </thead>
          <tbody>
            {A.errores.filas.map((f) => (
              <tr key={f.intento}>
                <th scope="row">{f.intento}</th>
                <td data-etiqueta={A.errores.columnas[1]}><TextoRico texto={f.aprendizaje} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ab-extra">
          <h3>{A.errores.extra.titulo}</h3>
          <p><TextoRico texto={A.errores.extra.texto} /></p>
        </div>
      </section>

      <section className="bloque fondo-lav" aria-labelledby="ab-rec-tit">
        <div>
          <h2 className="bloque-tit" id="ab-rec-tit">{A.recursos.titulo}</h2>
          <dl className="ab-recursos">
            {A.recursos.items.map((r) => (
              <div key={r.titulo}>
                <dt>{r.titulo}</dt>
                <dd>
                  {r.texto}
                  {'enlace' in r && (
                    <> <a href={urlInstructivo(r.enlace.archivo)} target="_blank" rel="noreferrer">{r.enlace.texto}</a>.</>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p className="ab-texto"><TextoRico texto={A.recursos.resena} /></p>
        </div>
      </section>

      <section className="bloque ab-cierre" aria-labelledby="ab-cierre-tit">
        <h2 className="bloque-tit" id="ab-cierre-tit">{A.cierre.titulo}</h2>
        <p className="ab-texto"><TextoRico texto={A.cierre.texto} /></p>
        <a className="btn-s grande" href={href('/capacitaciones')}>{A.cierre.boton}</a>
      </section>
    </div>
  )
}
