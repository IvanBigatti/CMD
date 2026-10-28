import { ImagenAmpliable } from '../../componentes/ui/ImagenAmpliable'
import { TextoRico } from '../../componentes/ui/TextoRico'
import { esEvaluable, EVALUACIONES } from '../../contenido/evaluaciones'
import { INFOGRAFIA, PLAN, PRESENTACION, urlInfografia } from '../../contenido/planCapacitacion'
import { PODCASTS } from '../../contenido/podcasts'
import { urlVideo } from '../../contenido/videos'
import { ITINERARIOS, type ClaveItinerario } from '../../guia/itinerarios'
import { ACTIVIDADES } from '../acciones'
import { href } from '../ruta'

const SECCIONES = [
  { id: 'plan-objetivo', nombre: 'Fundamentación y objetivo' },
  { id: 'plan-destinatarios', nombre: 'Destinatarios' },
  { id: 'plan-objetivos', nombre: 'Objetivos por módulo' },
  { id: 'plan-contenidos', nombre: 'Contenidos y ruta' },
  { id: 'plan-metodologia', nombre: 'Metodología' },
  { id: 'plan-evaluacion', nombre: 'Evaluación' },
  { id: 'plan-alcance', nombre: 'Alcance' },
  { id: 'plan-recursos', nombre: 'Recursos' },
]

// Un ancla (#seccion) pisaría la ruta del hash: se navega con scroll
const irA = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/** Abre la ventana de impresión solo con el plan; el título sugiere el nombre del PDF */
function descargarPlan() {
  const raiz = document.documentElement
  const tituloPrevio = document.title
  raiz.classList.add('imprimir-plan')
  document.title = 'Plan-de-capacitacion-IOL'
  addEventListener('afterprint', () => {
    raiz.classList.remove('imprimir-plan')
    document.title = tituloPrevio
  }, { once: true })
  print()
}

/** Recursos de una capacitación, según lo que tenga cargado */
function recursosDe(clave: ClaveItinerario): string {
  const r = [urlVideo(clave) && 'video', PODCASTS[clave] && 'podcast', 'instructivo', ITINERARIOS[clave].pasos.length > 0 && 'práctica guiada']
  return r.filter(Boolean).join(', ')
}

function evaluacionDe(clave: ClaveItinerario): string {
  if (!esEvaluable(clave)) return 'Sin evaluación (exploración libre)'
  return `${EVALUACIONES[clave].preguntas.length} preguntas, desafío práctico y autoevaluación`
}

/** Encabezado de cada sección, numerado como en un documento */
function Titulo({ n, id, children }: { n: number; id: string; children: string }) {
  return <h2 className="bloque-tit plan-tit" id={`${id}-tit`}><span className="plan-n">{n}</span>{children}</h2>
}

export function PlanCapacitacion() {
  return (
    <div className="sitio-pagina plan">
      <section className="cabecera-pagina">
        <a className="migas no-imprimir" href={href('/nosotros')}>← Sobre nosotros</a>
        <h1>{PLAN.titulo}</h1>
        <p>{PLAN.bajada}</p>
        <p className="plan-institucion">{PLAN.institucion}</p>
        <div className="hero-botones no-imprimir">
          <button type="button" className="btn-s grande" onClick={descargarPlan}>⬇ Descargar el plan (PDF)</button>
        </div>
      </section>

      <nav className="bloque plan-indice no-imprimir" aria-label="Secciones del plan">
        <h2>En este plan</h2>
        <ol>
          {SECCIONES.map((s) => <li key={s.id}><button type="button" onClick={() => irA(s.id)}>{s.nombre}</button></li>)}
        </ol>
      </nav>

      <section className="bloque plan-seccion" id="plan-objetivo" aria-labelledby="plan-objetivo-tit">
        <Titulo n={1} id="plan-objetivo">Fundamentación y objetivo general</Titulo>
        {PLAN.fundamentacion.map((p, i) => <p key={i}><TextoRico texto={p} /></p>)}
        <p className="plan-objetivo"><b>Objetivo general.</b> {PLAN.objetivoGeneral}</p>
        <p className="plan-aviso" role="note"><b>Importante:</b> {PLAN.aviso}</p>
      </section>

      <section className="bloque plan-seccion" id="plan-destinatarios" aria-labelledby="plan-destinatarios-tit">
        <Titulo n={2} id="plan-destinatarios">Destinatarios y requisitos previos</Titulo>
        <ul className="plan-ficha">
          {PLAN.ficha.map((f) => (
            <li key={f.titulo}><span aria-hidden="true">{f.icono}</span><div><h3>{f.titulo}</h3><p>{f.texto}</p></div></li>
          ))}
        </ul>
        <h3 className="plan-subtit">Antes de empezar, conviene que puedas…</h3>
        <ul className="lista-check">
          {PLAN.requisitos.map((r) => <li key={r}><TextoRico texto={r} /></li>)}
        </ul>
      </section>

      <section className="bloque plan-seccion" id="plan-objetivos" aria-labelledby="plan-objetivos-tit">
        <Titulo n={3} id="plan-objetivos">Objetivos específicos por módulo</Titulo>
        <p className="cap-intro">Al terminar cada módulo, vas a poder…</p>
        <ol className="plan-modulos">
          {PLAN.modulos.map((m) => (
            <li key={m.codigo}>
              <span className="plan-cod">{m.codigo}</span>
              <div>
                <h3>{m.nombre}</h3>
                <p>{m.objetivo}</p>
                <p className="plan-donde">
                  Se practica en:{' '}
                  {m.capacitaciones.map((c, i) => (
                    <span key={c}>{i > 0 && ' · '}<a href={href(`/capacitaciones/${c}`)}>{ITINERARIOS[c].nombre}</a></span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="plan-cierre"><TextoRico texto={PLAN.cierreModulos} /></p>
      </section>

      <section className="bloque plan-seccion" id="plan-contenidos" aria-labelledby="plan-contenidos-tit">
        <Titulo n={4} id="plan-contenidos">Contenidos y ruta</Titulo>
        <ImagenAmpliable src={urlInfografia()} alt={INFOGRAFIA.alt} titulo={INFOGRAFIA.titulo} nombreDescarga={INFOGRAFIA.nombreDescarga} />
        <div className="tabla-desliza">
          <table className="res-tabla plan-tabla">
            <thead>
              <tr>
                <th scope="col">Capacitación</th>
                <th scope="col">Módulos</th>
                <th scope="col">Duración</th>
                <th scope="col">Recursos</th>
                <th scope="col">Evaluación</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVIDADES.map(([clave, it]) => (
                <tr key={clave}>
                  <th scope="row"><a href={href(`/capacitaciones/${clave}`)}>{it.nombre}</a>{it.recomendado && <span className="act-badge en-linea">Recomendada</span>}</th>
                  <td>{it.modulos}</td>
                  <td>{it.duracion}</td>
                  <td>{recursosDe(clave)}</td>
                  <td>{evaluacionDe(clave)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="plan-rutas">
          {PLAN.rutas.map((r) => (
            <div key={r.titulo}><h3>{r.titulo}</h3><p><TextoRico texto={r.texto} /></p></div>
          ))}
        </div>
      </section>

      <section className="bloque plan-seccion" id="plan-metodologia" aria-labelledby="plan-metodologia-tit">
        <Titulo n={5} id="plan-metodologia">Metodología</Titulo>
        <ul className="plan-tarjetas">
          {PLAN.metodologia.map((m) => <li key={m.titulo}><h3>{m.titulo}</h3><p><TextoRico texto={m.texto} /></p></li>)}
        </ul>
        <h3 className="plan-subtit">Errores a propósito</h3>
        <div className="tabla-desliza">
          <table className="res-tabla">
            <thead><tr><th scope="col">Lo que vas a intentar</th><th scope="col">Lo que vas a aprender</th></tr></thead>
            <tbody>
              {PLAN.erroresAProposito.map(([intento, aprendizaje]) => (
                <tr key={intento}><th scope="row">{intento}</th><td>{aprendizaje}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="plan-subtit">La idea más importante: tu plata puede estar en tres lugares</h3>
        <ul className="plan-saldos">
          {PLAN.tresSaldos.map((s) => (
            <li key={s.nombre}><h4>{s.nombre}</h4><p>{s.texto}</p><p className="nota">En el homebanking: {s.banco.charAt(0).toLowerCase() + s.banco.slice(1)}</p></li>
          ))}
        </ul>
      </section>

      <section className="bloque plan-seccion" id="plan-evaluacion" aria-labelledby="plan-evaluacion-tit">
        <Titulo n={6} id="plan-evaluacion">Evaluación</Titulo>
        <ul className="plan-tarjetas">
          {PLAN.evaluacion.map((e) => <li key={e.titulo}><h3>{e.titulo}</h3><p><TextoRico texto={e.texto} /></p></li>)}
        </ul>
      </section>

      <section className="bloque plan-seccion" id="plan-alcance" aria-labelledby="plan-alcance-tit">
        <Titulo n={7} id="plan-alcance">Alcance</Titulo>
        <div className="plan-alcance">
          <div>
            <h3 className="plan-subtit">Qué vas a aprender</h3>
            <ul className="lista-check">{PLAN.alcance.dentro.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <div>
            <h3 className="plan-subtit">Qué queda afuera</h3>
            <ul className="plan-fuera">
              {PLAN.alcance.fuera.map(([t, motivo]) => <li key={t}><b>{t}.</b> {motivo}</li>)}
            </ul>
            <p className="nota">{PLAN.alcance.notaFuera}</p>
          </div>
        </div>
      </section>

      <section className="bloque plan-seccion" id="plan-recursos" aria-labelledby="plan-recursos-tit">
        <Titulo n={8} id="plan-recursos">Recursos y materiales</Titulo>
        <ul className="plan-ficha">
          {PLAN.recursos.map((r) => (
            <li key={r.titulo}><span aria-hidden="true">{r.icono}</span><div><h3>{r.titulo}</h3><p>{r.texto}</p></div></li>
          ))}
        </ul>
        <div className="hero-botones no-imprimir">
          <a className="btn-s" href={href('/capacitaciones')}>Ver las capacitaciones</a>
          <a className="btn-o" href={urlInfografia()} download={INFOGRAFIA.nombreDescarga}>⬇ Infografía (A4)</a>
          <a className="btn-o" href={PRESENTACION.url} download={PRESENTACION.nombreDescarga}>⬇ Presentación "Antes de empezar"</a>
        </div>
      </section>
    </div>
  )
}
