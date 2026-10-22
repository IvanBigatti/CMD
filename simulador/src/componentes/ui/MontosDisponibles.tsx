import { nf } from '../../dominio/formato'
import type { Moneda } from '../../dominio/tipos'
import { useSimulador } from '../../estado/simulador'

export type PlazoMonto = 'ci' | '24' | '48'

const NOMBRE_PLAZO: Record<PlazoMonto, string> = { ci: 'contado inmediato', '24': '24hs', '48': '48hs' }

/**
 * Filas del bloque "Monto disponible por plazo". Lo cobrado por una venta a 24 hs
 * sirve para operar a 24 hs, pero no en contado inmediato.
 */
export function FilasMontos({ moneda, plazos, resaltado }: { moneda: Moneda; plazos: PlazoMonto[]; resaltado?: string | null }) {
  const s = useSimulador((st) => st.saldo[moneda])
  const valor: Record<PlazoMonto, number> = { ci: s.disponible, '24': s.disponible + s.aLiquidar, '48': s.disponible + s.aLiquidar }
  const nombreMoneda = moneda === 'ARS' ? 'Peso Argentino' : 'Dólar Estadounidense'
  return (
    <>
      {plazos.map((pl) => {
        const cls = resaltado === pl ? 'hi' : undefined
        return [
          <div key={pl + 'k'} className={cls}>Monto disponible para operaciones en {NOMBRE_PLAZO[pl]} en {nombreMoneda}</div>,
          <div key={pl + 'v'} className={cls}>{moneda === 'ARS' ? 'AR$ ' : 'US$ '}{nf(valor[pl])}</div>,
        ]
      })}
    </>
  )
}
