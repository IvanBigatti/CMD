import { EVALUACIONES, type ClaveEvaluable } from '../../contenido/evaluaciones'
import { useDesafio } from '../../estado/desafio'
import { useUi, type ResultadoCriterio } from '../../estado/ui'
import { navegar } from '../../sitio/ruta'

/** Resultado de "Verificar desafío": qué criterios se cumplen y cuáles faltan */
export function ModalDesafio({ clave, criterios }: { clave: ClaveEvaluable; criterios: ResultadoCriterio[] }) {
  const cerrar = useUi((s) => s.cerrarModal)
  const logrado = criterios.every((c) => c.cumple)
  const d = EVALUACIONES[clave].desafio

  const volver = () => {
    cerrar()
    useDesafio.getState().terminar()
    navegar(`/capacitaciones/${clave}`)
  }

  return (
    <div className="veil" onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="desafio-tit">
        <span className="eyebrow">Desafío práctico</span>
        <h3 id="desafio-tit">{logrado ? 'Desafío superado' : 'Todavía falta algo'}</h3>
        <p>{d.consigna}.</p>
        <ul className="criterios" aria-label="Lo que se revisó en tu cuenta">
          {criterios.map((c) => (
            <li key={c.texto} className={c.cumple ? 'ok' : 'falta'}>
              <span className="crit-marca" aria-hidden="true">{c.cumple ? '✓' : '•'}</span>
              <span>{c.texto}<span className="sr-only">{c.cumple ? ' (hecho)' : ' (pendiente)'}</span></span>
            </li>
          ))}
        </ul>
        {logrado ? (
          <>
            <p className="form-ok" role="status">Lo hiciste por tu cuenta, sin la guía. Ya quedó registrado.</p>
            <button type="button" className="btn-s w" onClick={volver}>Volver a la capacitación</button>
            <button type="button" className="btn-o w" onClick={() => { cerrar(); useDesafio.getState().terminar() }}>Seguir usando la cuenta</button>
          </>
        ) : (
          <>
            <p>Seguí en el simulador y volvé a tocar <b>Verificar desafío</b> cuando termines. Si te trabás, podés repasar el video o el instructivo.</p>
            <button type="button" className="btn-s w" onClick={cerrar}>Seguir intentando</button>
            <button type="button" className="btn-o w" onClick={volver}>Volver a la capacitación</button>
          </>
        )}
      </div>
    </div>
  )
}
