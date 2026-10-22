import { Fragment, type CSSProperties } from 'react'
import { dinero } from '../../dominio/formato'
import type { Moneda } from '../../dominio/tipos'
import { useSimulador } from '../../estado/simulador'

const MONEDAS: Moneda[] = ['ARS', 'USD']

/** Disponible / comprometido / a liquidar, por moneda */
export function Saldos({ dataTour, style }: { dataTour?: string; style?: CSSProperties }) {
  const saldo = useSimulador((s) => s.saldo)
  return (
    <div className="saldos" data-tour={dataTour} style={style}>
      {MONEDAS.map((m) => {
        const s = saldo[m]
        if (!(s.disponible || s.comprometido || s.aLiquidar || m === 'ARS')) return null
        const en = m === 'ARS' ? 'en pesos' : 'en dólares'
        return (
          <Fragment key={m}>
            <div className="sl"><span className="tag disp" />Disponible {en}<span className="n">{dinero(s.disponible, m)}</span></div>
            {!!s.comprometido && (
              <div className="sl"><span className="tag comp" />Comprometido {en}<span className="n">{dinero(s.comprometido, m)}</span></div>
            )}
            {!!s.aLiquidar && (
              <div className="sl"><span className="tag liq" />A liquidar {en}<span className="n">{dinero(s.aLiquidar, m)}</span></div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
