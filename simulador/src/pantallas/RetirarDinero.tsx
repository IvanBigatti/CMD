import { dinero } from '../dominio/formato'
import type { Moneda } from '../dominio/tipos'
import { useSimulador } from '../estado/simulador'
import { PERSONA } from '../mocks/persona'
import { AvisoCaja } from '../componentes/ui/AvisoCaja'
import { Saldos } from '../componentes/ui/Saldos'

export function RetirarDinero() {
  const retiro = useSimulador((s) => s.retiro)
  const disponible = useSimulador((s) => s.saldo[s.retiro.moneda].disponible)
  const { setMonedaRetiro, setMontoRetiro, retirar } = useSimulador.getState()
  const m = retiro.moneda
  const monedas: [Moneda, string][] = [['ARS', 'Pesos'], ['USD', 'Dólares']]

  return (
    <section className="page">
      <div className="pagetop"><h1 className="ptitle">Retirar dinero</h1></div>
      <p className="subt">A una cuenta bancaria de tu misma titularidad</p>
      <div className="grid12">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="segment">
            {monedas.map(([mon, txt]) => (
              <button key={mon} type="button" aria-pressed={m === mon} onClick={() => setMonedaRetiro(mon)}>{txt}</button>
            ))}
          </div>
          <div>
            <div className="lbl">Cuenta destino</div>
            <div style={{ fontWeight: 600, fontSize: '.93rem', marginTop: 3 }}>{PERSONA.cuentaRetiro[m]}</div>
            <p className="hint">Titular: {PERSONA.nombreCompleto}</p>
          </div>
          <div className="field">
            <label htmlFor="inpRet">Monto a retirar</label>
            <input className="inp" id="inpRet" inputMode="decimal" data-tour="monto-retiro"
              value={retiro.monto} onChange={(e) => setMontoRetiro(e.target.value)} />
            <p className="hint">Disponible para retirar: <span className="mono">{dinero(disponible, m)}</span></p>
          </div>
          {retiro.aviso && <AvisoCaja aviso={retiro.aviso} />}
          <button type="button" className="btn-s w" data-tour="confirmar-retiro" onClick={retirar}>Confirmar retiro</button>
        </div>
        <div className="panel">
          <div className="lbl">Por qué a veces no te deja</div>
          <p style={{ fontSize: '.87rem', color: 'var(--tx2)', lineHeight: 1.5, marginTop: 8 }}>
            Solo se puede retirar el saldo <strong>disponible</strong>. El dinero de una venta a 24 h queda “a liquidar”
            hasta el día hábil siguiente: lo ves en tu cuenta, pero todavía no se puede sacar.
          </p>
          <Saldos style={{ marginTop: 13 }} />
        </div>
      </div>
    </section>
  )
}
