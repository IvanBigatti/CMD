import { ESCALA_CONFIANZA } from '../../contenido/evaluaciones'

/** Autoevaluación de 1 a 5 ("¿Qué tan seguro te sentís?"), con botones grandes y su etiqueta */
export function SelectorConfianza({ valor, onElegir, etiqueta }: {
  valor: number
  onElegir: (v: number) => void
  /** Texto para lectores de pantalla (la frase que se evalúa) */
  etiqueta: string
}) {
  return (
    <div className="sel-confianza" role="radiogroup" aria-label={etiqueta}>
      {[1, 2, 3, 4, 5].map((v) => (
        <button key={v} type="button" role="radio" aria-checked={valor === v} onClick={() => onElegir(v)}>
          <b>{v}</b>
          <span>{ESCALA_CONFIANZA[v]}</span>
        </button>
      ))}
    </div>
  )
}
