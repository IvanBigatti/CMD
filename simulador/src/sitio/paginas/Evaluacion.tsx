import { useEffect, useRef, useState, type RefObject } from 'react'
import { SelectorConfianza } from '../../componentes/ui/SelectorConfianza'
import { TextoRico } from '../../componentes/ui/TextoRico'
import {
  aprueba, ESCALA_CONFIANZA, EVALUACIONES, minimoParaAprobar, type ClaveEvaluable, type Opcion, type Pregunta,
} from '../../contenido/evaluaciones'
import { registrarEvaluacion } from '../../datos/evaluaciones'
import { guardarConfianza, useProgresoEvaluacion } from '../../estado/progresoEvaluacion'
import { ITINERARIOS } from '../../guia/itinerarios'
import { desafiar } from '../acciones'
import { href } from '../ruta'

interface Respuesta {
  pregunta: string
  opcion: string
  correcta: boolean
}

/** Copia mezclada (Fisher-Yates), para que la respuesta correcta no esté siempre en el mismo lugar */
function mezclar<T>(xs: T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const textoOpcion = (q: Pregunta, id: string) => q.opciones.find((o) => o.id === id)?.texto ?? ''

/** Página del cuestionario de una capacitación. "Reintentar" arma un intento nuevo con las opciones mezcladas otra vez. */
export function Evaluacion({ clave }: { clave: ClaveEvaluable }) {
  const [intento, setIntento] = useState(0)
  return <Cuestionario key={intento} clave={clave} reintentar={() => { setIntento((n) => n + 1); window.scrollTo(0, 0) }} />
}

function Cuestionario({ clave, reintentar }: { clave: ClaveEvaluable; reintentar: () => void }) {
  const it = ITINERARIOS[clave]
  const ev = EVALUACIONES[clave]
  const [preguntas] = useState(() => ev.preguntas.map((q) => ({ ...q, opciones: mezclar(q.opciones) })))
  const [indice, setIndice] = useState(0)
  const [elegida, setElegida] = useState<string | null>(null)
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [terminado, setTerminado] = useState(false)
  const tituloRef = useRef<HTMLHeadingElement>(null)

  const q = preguntas[indice]
  const respondida = respuestas.length > indice
  const ultima = indice === preguntas.length - 1

  // Al pasar de pregunta (o al resultado), el foco va al título para que se lea desde arriba
  useEffect(() => { if (indice > 0 || terminado) tituloRef.current?.focus() }, [indice, terminado])

  const responder = () => {
    if (!elegida || respondida) return
    setRespuestas((r) => [...r, { pregunta: q.id, opcion: elegida, correcta: elegida === q.correcta }])
  }

  const seguir = () => {
    if (!ultima) {
      setIndice((i) => i + 1)
      setElegida(null)
      return
    }
    const puntaje = respuestas.filter((r) => r.correcta).length
    useProgresoEvaluacion.getState().registrarCuestionario(clave, puntaje, preguntas.length)
    void registrarEvaluacion({ clave, tipo: 'cuestionario', puntaje, total: preguntas.length, detalle: { respuestas } })
    setTerminado(true)
  }

  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <a className="migas" href={href(`/capacitaciones/${clave}`)}>← Volver a la capacitación</a>
        <h1>Evaluación: {it.nombre}</h1>
        <p>{terminado ? 'Este es tu resultado.' : `Pregunta ${indice + 1} de ${preguntas.length}. Elegí una respuesta y tocá Responder.`}</p>
      </section>

      {terminado ? (
        <Resultado clave={clave} preguntas={preguntas} respuestas={respuestas} reintentar={reintentar} tituloRef={tituloRef} />
      ) : (
        <section className="bloque">
          <div className="quiz">
            <div className="quiz-avance" aria-hidden="true">
              <i style={{ width: `${((indice + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }} />
            </div>
            <h2 className="quiz-pregunta" ref={tituloRef} tabIndex={-1}>{q.texto}</h2>
            <div className="quiz-opciones" role="radiogroup" aria-label={q.texto}>
              {q.opciones.map((o) => (
                <BotonOpcion
                  key={o.id}
                  o={o}
                  elegida={elegida === o.id}
                  respondida={respondida}
                  esCorrecta={o.id === q.correcta}
                  onElegir={() => setElegida(o.id)}
                />
              ))}
            </div>

            {respondida ? (
              <div className={`quiz-devolucion ${respuestas[indice].correcta ? 'bien' : 'mal'}`} role="status">
                <b>{respuestas[indice].correcta ? 'Correcto.' : 'No es esa.'}</b> <TextoRico texto={q.explicacion} />
              </div>
            ) : null}

            <div className="quiz-acciones">
              {respondida ? (
                <button type="button" className="btn-s grande" onClick={seguir}>{ultima ? 'Ver mi resultado' : 'Siguiente pregunta'}</button>
              ) : (
                <button type="button" className="btn-s grande" onClick={responder} disabled={!elegida}>Responder</button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function BotonOpcion({ o, elegida, respondida, esCorrecta, onElegir }: {
  o: Opcion; elegida: boolean; respondida: boolean; esCorrecta: boolean; onElegir: () => void
}) {
  const clase = respondida ? (esCorrecta ? 'correcta' : elegida ? 'incorrecta' : 'apagada') : ''
  return (
    <button type="button" role="radio" aria-checked={elegida} className={clase} disabled={respondida} onClick={onElegir}>
      <span className="quiz-marca" aria-hidden="true">{respondida && esCorrecta ? '✓' : respondida && elegida ? '✕' : ''}</span>
      <span>{o.texto}</span>
      {respondida && esCorrecta && <span className="sr-only"> (respuesta correcta)</span>}
    </button>
  )
}

function Resultado({ clave, preguntas, respuestas, reintentar, tituloRef }: {
  clave: ClaveEvaluable
  preguntas: Pregunta[]
  respuestas: Respuesta[]
  reintentar: () => void
  tituloRef: RefObject<HTMLHeadingElement | null>
}) {
  const ev = EVALUACIONES[clave]
  const desafioHecho = useProgresoEvaluacion((s) => !!s.progreso[clave]?.desafio)
  const [despues, setDespues] = useState(0)
  const total = preguntas.length
  const puntaje = respuestas.filter((r) => r.correcta).length
  const aprobado = aprueba(puntaje, total)

  const elegirConfianza = (v: number) => {
    setDespues(v)
    guardarConfianza(clave, 'despues', v)
  }

  return (
    <>
      <section className="bloque">
        <div className="quiz-resultado">
          <h2 ref={tituloRef} tabIndex={-1}>Respondiste bien {puntaje} de {total}</h2>
          <p className={aprobado ? 'form-ok' : 'quiz-falta'}>
            {aprobado
              ? 'Aprobaste el cuestionario.'
              : `Para aprobar hacen falta ${minimoParaAprobar(total)} respuestas correctas. Repasá las explicaciones de abajo y probá de nuevo.`}
          </p>

          <div className="quiz-confianza">
            <h3>Ahora que terminaste: ¿qué tan seguro te sentís?</h3>
            <p className="conf-frase">“{ev.confianza}”</p>
            <SelectorConfianza valor={despues} onElegir={elegirConfianza} etiqueta={ev.confianza} />
            {despues > 0 && <p className="nota" role="status">Gracias. Respondiste {despues} · {ESCALA_CONFIANZA[despues]}.</p>}
          </div>

          <div className="quiz-acciones">
            {!desafioHecho && <button type="button" className="btn-s grande" onClick={() => desafiar(clave)}>Hacer el desafío práctico</button>}
            <button type="button" className={`${desafioHecho ? 'btn-s' : 'btn-o'} grande`} onClick={reintentar}>Volver a intentar</button>
            <a className="btn-o grande" href={href(`/capacitaciones/${clave}`)}>Volver a la capacitación</a>
          </div>
        </div>
      </section>

      <section className="bloque" aria-labelledby="repaso-tit">
        <h2 className="bloque-tit" id="repaso-tit">Repaso de tus respuestas</h2>
        <ol className="quiz-repaso">
          {preguntas.map((q, i) => {
            const r = respuestas[i]
            return (
              <li key={q.id} className={r?.correcta ? 'bien' : 'mal'}>
                <h3>{q.texto}</h3>
                <p>
                  <span aria-hidden="true">{r?.correcta ? '✓ ' : '✕ '}</span>
                  Tu respuesta: <b>{r ? textoOpcion(q, r.opcion) : '—'}</b>
                  {r?.correcta ? ' (correcta)' : ''}
                </p>
                {!r?.correcta && <p>Respuesta correcta: <b>{textoOpcion(q, q.correcta)}</b></p>}
                <p className="quiz-explicacion"><TextoRico texto={q.explicacion} /></p>
              </li>
            )
          })}
        </ol>
      </section>
    </>
  )
}
