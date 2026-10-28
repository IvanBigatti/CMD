import { SelectorConfianza } from '../componentes/ui/SelectorConfianza'
import { ESCALA_CONFIANZA, EVALUACIONES, minimoParaAprobar, type ClaveEvaluable } from '../contenido/evaluaciones'
import { cuestionarioAprobado, guardarConfianza, useProgresoEvaluacion } from '../estado/progresoEvaluacion'
import { desafiar } from './acciones'
import { href } from './ruta'

/** Autoevaluación "antes": se responde una vez, antes de mirar el video */
export function ConfianzaAntes({ clave }: { clave: ClaveEvaluable }) {
  const antes = useProgresoEvaluacion((s) => s.progreso[clave]?.antes)
  const frase = EVALUACIONES[clave].confianza
  return (
    <section className="bloque conf-antes" aria-labelledby="conf-antes-tit">
      <div className="conf-antes-caja">
        <h2 id="conf-antes-tit">Antes de empezar: ¿qué tan seguro te sentís?</h2>
        <p className="conf-frase">“{frase}”</p>
        {antes ? (
          <p className="nota" role="status">
            Respondiste <b>{antes} · {ESCALA_CONFIANZA[antes]}</b>. Al final de la evaluación te lo volvemos a preguntar.
          </p>
        ) : (
          <>
            <SelectorConfianza valor={0} onElegir={(v) => guardarConfianza(clave, 'antes', v)} etiqueta={frase} />
            <p className="nota">Es opcional y no es una nota: nos ayuda a saber cuánto te sirvió la capacitación.</p>
          </>
        )}
      </div>
    </section>
  )
}

/** Sección "Evaluá lo que aprendiste": cuestionario, desafío práctico y autoevaluación, con su estado */
export function SeccionEvaluacion({ clave }: { clave: ClaveEvaluable }) {
  const p = useProgresoEvaluacion((s) => s.progreso[clave])
  const ev = EVALUACIONES[clave]
  const n = ev.preguntas.length
  const aprobado = cuestionarioAprobado(p)

  return (
    <section className="bloque fondo-lav" aria-labelledby="eval-tit">
      <div>
        <h2 className="bloque-tit" id="eval-tit">Evaluá lo que aprendiste</h2>
        <p className="cap-intro">Tres pasos cortos para comprobar que podés hacerlo por tu cuenta. Podés repetirlos las veces que quieras.</p>
        <ol className="eval-pasos">
          <li className={aprobado ? 'hecho' : ''}>
            <span className="eval-n" aria-hidden="true">{aprobado ? '✓' : '1'}</span>
            <h3>Cuestionario</h3>
            <p>{n} preguntas de opción múltiple sobre cómo se usa la plataforma. Se aprueba con {minimoParaAprobar(n)} respuestas correctas.</p>
            <p className="eval-estado">
              {p?.mejor
                ? <>Tu mejor resultado: <b>{p.mejor.puntaje} de {p.mejor.total}</b>{aprobado ? ' · aprobado' : ''}</>
                : 'Pendiente'}
            </p>
            <a className="btn-s" href={href(`/capacitaciones/${clave}/evaluacion`)}>
              {p?.mejor ? 'Volver a hacerlo' : 'Empezar el cuestionario'}
            </a>
          </li>
          <li className={p?.desafio ? 'hecho' : ''}>
            <span className="eval-n" aria-hidden="true">{p?.desafio ? '✓' : '2'}</span>
            <h3>Desafío práctico</h3>
            <p>{ev.desafio.detalle} Esta vez <b>sin guía</b>: cuando termines, tocá <b>Verificar desafío</b> en la franja amarilla.</p>
            <p className="eval-estado">{p?.desafio ? 'Superado' : 'Pendiente'}</p>
            <button type="button" className="btn-s" onClick={() => desafiar(clave)}>
              {p?.desafio ? 'Hacerlo de nuevo' : 'Hacer el desafío'}
            </button>
            <p className="nota">Al empezar, la cuenta simulada vuelve a cero y se prepara para el desafío.</p>
          </li>
          <li className={p?.despues ? 'hecho' : ''}>
            <span className="eval-n" aria-hidden="true">{p?.despues ? '✓' : '3'}</span>
            <h3>Autoevaluación</h3>
            <p>Al terminar el cuestionario te preguntamos otra vez qué tan seguro te sentís, para comparar con lo que respondiste al principio.</p>
            <p className="eval-estado">
              {p && (p.antes || p.despues)
                ?<>Antes: <b>{p.antes ?? '—'}</b> · Después: <b>{p.despues ?? '—'}</b> <span className="nota">(de 1 a 5)</span></>
                : 'Pendiente'}
            </p>
          </li>
        </ol>
      </div>
    </section>
  )
}
