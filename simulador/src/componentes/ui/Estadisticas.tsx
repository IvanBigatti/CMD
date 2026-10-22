import { resultadoCartera, valorCartera } from '../../dominio/cartera'
import { dinero } from '../../dominio/formato'
import type { Moneda } from '../../dominio/tipos'
import { useSimulador } from '../../estado/simulador'

/** Valor de la cuenta, disponible para operar y resultado de la tenencia */
export function Estadisticas({ moneda }: { moneda: Moneda }) {
  const saldo = useSimulador((s) => s.saldo)
  const posiciones = useSimulador((s) => s.posiciones)
  const inst = useSimulador((s) => s.inst)
  const resultado = resultadoCartera(posiciones, inst, moneda)
  return (
    <>
      <div className="panel">
        <div className="lbl">Valor de tu cuenta</div>
        <div className="big" style={{ marginTop: 5 }}>{dinero(valorCartera(saldo, posiciones, inst, moneda), moneda)}</div>
        <div className="sub" style={{ marginTop: 3 }}>saldos + tenencia, valuado en {moneda === 'ARS' ? 'pesos' : 'dólares'}</div>
      </div>
      <div className="panel">
        <div className="lbl">Disponible para operar</div>
        <div className="big" style={{ marginTop: 5 }}>{dinero(saldo[moneda].disponible, moneda)}</div>
        <div className="sub" style={{ marginTop: 3 }}>sin contar comprometido ni a liquidar</div>
      </div>
      <div className="panel">
        <div className="lbl">Resultado de la tenencia</div>
        <div className="big" style={{ marginTop: 5, color: resultado >= 0 ? 'var(--up)' : 'var(--down)' }}>
          {resultado >= 0 ? '+' : ''}{dinero(resultado, moneda)}
        </div>
        <div className="sub" style={{ marginTop: 3 }}>no realizado — todavía no vendiste</div>
      </div>
    </>
  )
}
