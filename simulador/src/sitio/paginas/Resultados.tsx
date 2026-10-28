import { EVALUACIONES } from '../../contenido/evaluaciones'
import { useResumenEvaluaciones, type ResumenCapacitacion } from '../../datos/evaluaciones'
import { ITINERARIOS } from '../../guia/itinerarios'

/**
 * Resultados de las evaluaciones para el equipo (#/resultados, no está en el menú).
 * Ojo: no pide contraseña. Sirve mientras el sitio corre localmente; antes de publicarlo hay que protegerla.
 */

const pct = (x: number | null) => (x === null ? '—' : `${Math.round(x * 100)} %`)
const uno = (x: number | null) => (x === null ? '—' : x.toLocaleString('es-AR', { maximumFractionDigits: 1 }))
const proporcion = (a: number, b: number) => (b ? a / b : null)

function FilaResumen({ r }: { r: ResumenCapacitacion }) {
  return (
    <tr>
      <th scope="row">{ITINERARIOS[r.clave].nombre}</th>
      <td>{r.participantes}</td>
      <td>{r.cuestionarios}</td>
      <td>{pct(r.promedio)}</td>
      <td>{pct(proporcion(r.aprobados, r.cuestionarios))}</td>
      <td>{r.desafiosOk} de {r.desafios}</td>
      <td>{uno(r.confianzaAntes)} → {uno(r.confianzaDespues)}</td>
    </tr>
  )
}

/** Preguntas de una capacitación, de la que más se falla a la que menos */
function Preguntas({ r }: { r: ResumenCapacitacion }) {
  const stats = new Map(r.preguntas.map((p) => [p.id, p]))
  const filas = EVALUACIONES[r.clave].preguntas
    .map((q) => {
      const s = stats.get(q.id)
      return { q, respuestas: s?.respuestas ?? 0, acierto: s ? proporcion(s.aciertos, s.respuestas) : null }
    })
    .sort((a, b) => (a.acierto ?? 2) - (b.acierto ?? 2))

  return (
    <section className="res-capacitacion" aria-labelledby={`res-${r.clave}`}>
      <h3 id={`res-${r.clave}`}>{ITINERARIOS[r.clave].nombre}</h3>
      <div className="tabla-desliza">
        <table className="res-tabla">
          <thead>
            <tr><th scope="col">Pregunta</th><th scope="col">Respuestas</th><th scope="col">Aciertos</th></tr>
          </thead>
          <tbody>
            {filas.map(({ q, respuestas, acierto }) => (
              <tr key={q.id} className={acierto !== null && acierto < 0.6 ? 'alerta' : ''}>
                <th scope="row">{q.texto}</th>
                <td>{respuestas}</td>
                <td>
                  <span className="res-barra" aria-hidden="true"><i style={{ width: `${(acierto ?? 0) * 100}%` }} /></span>
                  {pct(acierto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function Resultados() {
  const { resumen, estado, recargar } = useResumenEvaluaciones()
  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <h1>Resultados de las evaluaciones</h1>
        <p>Para el equipo de capacitación. Esta página no aparece en el menú y no muestra nombres: cada persona se cuenta por un código anónimo de su navegador.</p>
      </section>

      <section className="bloque">
        <div className="bloque-cab">
          <h2 className="bloque-tit">Resumen por capacitación</h2>
          <button type="button" className="btn-o" onClick={recargar}>Actualizar</button>
        </div>
        {estado === 'cargando' && <p className="resenas-aviso">Cargando resultados…</p>}
        {estado === 'error' && (
          <p className="resenas-aviso">No pudimos cargar los resultados. La API solo funciona con <code>npm run dev</code> o <code>npm run preview</code>.</p>
        )}
        {estado === 'listo' && (
          <>
            <div className="tabla-desliza">
              <table className="res-tabla">
                <thead>
                  <tr>
                    <th scope="col">Capacitación</th>
                    <th scope="col">Participantes</th>
                    <th scope="col">Cuestionarios</th>
                    <th scope="col">Promedio</th>
                    <th scope="col">Aprobados</th>
                    <th scope="col">Desafío superado</th>
                    <th scope="col">Confianza antes → después</th>
                  </tr>
                </thead>
                <tbody>
                  {resumen.map((r) => <FilaResumen key={r.clave} r={r} />)}
                </tbody>
              </table>
            </div>
            <ul className="res-notas nota">
              <li><b>Promedio</b> y <b>Aprobados</b> cuentan todos los intentos del cuestionario (se aprueba con 70 %).</li>
              <li><b>Desafío superado</b>: personas que lo lograron, sobre las que lo intentaron.</li>
              <li><b>Confianza</b>: promedio de la autoevaluación, de 1 (nada seguro) a 5 (muy seguro).</li>
            </ul>
          </>
        )}
      </section>

      {estado === 'listo' && (
        <section className="bloque" aria-labelledby="res-preguntas-tit">
          <h2 className="bloque-tit" id="res-preguntas-tit">Aciertos por pregunta</h2>
          <p className="cap-intro">Ordenadas de la que más se falla a la que menos. En rojo, las que aciertan menos del 60 %: conviene reforzar ese tema en el video o el instructivo.</p>
          {resumen.map((r) => <Preguntas key={r.clave} r={r} />)}
        </section>
      )}
    </div>
  )
}
