import { useSimulador } from '../estado/simulador'
import { PERSONA } from '../mocks/persona'
import { AvisoCaja } from '../componentes/ui/AvisoCaja'

export function IngresarDinero() {
  const ingreso = useSimulador((s) => s.ingreso)
  const { elegirOrigen, setMontoIngreso, ingresarDinero } = useSimulador.getState()

  return (
    <section className="page">
      <div className="pagetop"><h1 className="ptitle">Ingresar dinero</h1></div>
      <p className="subt">Transferí desde tu banco o billetera a tu cuenta de inversión</p>
      <div className="grid12">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div className="lbl">Alias de tu cuenta comitente</div>
            <div className="mono" style={{ fontSize: '1.14rem', fontWeight: 600, marginTop: 4 }}>{PERSONA.alias}</div>
            <p className="hint" style={{ marginTop: 5 }}>Comitente Nº {PERSONA.comitente} · a nombre de {PERSONA.nombreCompleto}</p>
          </div>
          <div className="field">
            <label>Cuenta de origen</label>
            <div className="radio" data-tour="origen-list">
              {PERSONA.cuentasOrigen.map((c) => (
                <button key={c.id} type="button" data-tour={`origen-${c.id}`} aria-pressed={ingreso.origen === c.id} onClick={() => elegirOrigen(c.id)}>
                  <span className="bul" />
                  <span>
                    <span className="tt">{c.banco} · {c.tipo}</span>
                    <span className="ss">Titular: {c.titular} — {c.mismoTitular ? 'mismo CUIT que tu cuenta' : 'otro CUIT'}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          {ingreso.aviso && <AvisoCaja aviso={ingreso.aviso} />}
          <div className="field">
            <label htmlFor="inpIngreso">Monto a transferir</label>
            <input className="inp" id="inpIngreso" inputMode="decimal" data-tour="monto-ingreso"
              value={ingreso.monto} onChange={(e) => setMontoIngreso(e.target.value)} />
          </div>
          <button type="button" className="btn-s w" data-tour="confirmar-ingreso" onClick={ingresarDinero}>Confirmar transferencia</button>
        </div>
        <div className="panel">
          <div className="lbl">Qué tenés que saber</div>
          <ul style={{ margin: '10px 0 0', paddingLeft: 17, display: 'flex', flexDirection: 'column', gap: 9, fontSize: '.87rem', color: 'var(--tx2)', lineHeight: 1.45 }}>
            <li>La cuenta comitente <strong>no es una caja de ahorro</strong>: existe para comprar y vender títulos.</li>
            <li>Solo podés fondearla desde cuentas <strong>de tu misma titularidad</strong>. Es normativa de prevención de lavado.</li>
            <li>La primera transferencia puede demorar unas horas mientras se valida el origen. Las siguientes son inmediatas.</li>
            <li>El saldo sin invertir <strong>rinde automáticamente</strong> desde el día que entra.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
