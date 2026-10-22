import { useId } from 'react'
import { serieIntradiaria } from '../../dominio/mercado'

/** Gráfico intradiario simulado (decorativo) */
export function GraficoArea({ seed }: { seed: number }) {
  const id = useId()
  const linea = serieIntradiaria(seed).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg className="areachart" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8FA8DC" stopOpacity=".75" />
          <stop offset="100%" stopColor="#8FA8DC" stopOpacity=".05" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${linea} 100,100`} fill={`url(#${id})`} />
      <polyline points={linea} fill="none" stroke="#5B7FC7" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
