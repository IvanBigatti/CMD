/** Estrellas de solo lectura (1 a 5, admite medias para promedios) */
export function Estrellas({ valor, chico }: { valor: number; chico?: boolean }) {
  const pct = Math.max(0, Math.min(5, valor)) / 5 * 100
  return (
    <span className={`estrellas${chico ? ' chico' : ''}`} role="img" aria-label={`${valor.toLocaleString('es-AR', { maximumFractionDigits: 1 })} de 5 estrellas`}>
      <span className="est-base" aria-hidden="true">★★★★★</span>
      <span className="est-llenas" aria-hidden="true" style={{ width: `${pct}%` }}>★★★★★</span>
    </span>
  )
}

const ETIQUETAS = ['', 'No me sirvió', 'Me sirvió poco', 'Me sirvió', 'Me sirvió mucho', 'Me sirvió muchísimo']

/** Selector de 1 a 5 estrellas con botones grandes */
export function SelectorEstrellas({ valor, onCambio }: { valor: number; onCambio: (v: number) => void }) {
  return (
    <div className="sel-estrellas">
      <div role="radiogroup" aria-label="Tu valoración">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={valor === v}
            aria-label={`${v} ${v === 1 ? 'estrella' : 'estrellas'}: ${ETIQUETAS[v]}`}
            className={v <= valor ? 'llena' : ''}
            onClick={() => onCambio(v)}
          >★</button>
        ))}
      </div>
      <span className="sel-etiqueta">{valor ? ETIQUETAS[valor] : 'Elegí de 1 a 5 estrellas'}</span>
    </div>
  )
}
