import { dinero, nf, parseNumero } from '../dominio/formato'
import { calcularMep, type ModoMep } from '../dominio/mep'
import { useSimulador } from '../estado/simulador'
import { TC_MEP } from '../mocks/mercado'

export function DolarMep() {
  const mep = useSimulador((s) => s.mep)
  const saldo = useSimulador((s) => s.saldo)
  const { setModoMep, setMontoMep, alternarVerDentro, operarMep } = useSimulador.getState()

  const venta = mep.modo === 'venta'
  const { vn, entrega, recibe, tipoDeCambio } = calcularMep(mep.modo, parseNumero(mep.monto))
  const modos: [ModoMep, string][] = [['compra', 'Comprar dólares'], ['venta', 'Vender dólares']]

  return (
    <section className="page">
      <div className="pagetop"><h1 className="ptitle">{venta ? 'Venta Dólar MEP Simple' : 'Compra Dólar MEP Simple'}</h1></div>
      <p className="subt">
        {venta ? 'Pasá tus dólares a pesos con un clic, al tipo de cambio del mercado' : 'Dólares legales, sin parking, acreditados hoy mismo en tu cuenta'}
      </p>
      <div className="grid12">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="segment" style={{ alignSelf: 'flex-start' }}>
            {modos.map(([m, txt]) => (
              <button key={m} type="button" aria-pressed={mep.modo === m} onClick={() => setModoMep(m)}>{txt}</button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="inpMep">{venta ? 'Cuántos dólares querés vender' : 'Cuánto querés convertir'}</label>
            <input className="inp" id="inpMep" inputMode="decimal" data-tour="mep-monto"
              value={mep.monto} onChange={(e) => setMontoMep(e.target.value)} />
            <p className="hint">
              {venta ? 'Mínimo US$ 5' : 'Mínimo $5.000'} · Disponible:{' '}
              <span className="mono">{venta ? dinero(saldo.USD.disponible, 'USD') : dinero(saldo.ARS.disponible, 'ARS')}</span>
            </p>
          </div>
          <div className="kv" data-tour="mep-tc">
            <div className="r"><span className="k">Tipo de cambio implícito</span><span className="v">$ {nf(TC_MEP)}</span></div>
            <div className="r tot"><span className="k">Vas a recibir</span><span className="v">{venta ? '$ ' : 'US$ '}{nf(recibe)}</span></div>
          </div>
          <button type="button" className="btn-s w" data-tour="mep-confirmar" onClick={operarMep}>
            {venta ? 'Vender dólar MEP' : 'Comprar dólar MEP'}
          </button>
          <p className="hint">Se opera de lunes a viernes de 10:30 a 17:00. Fuera de ese horario la orden queda para el próximo día hábil.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <button type="button" className="panel row" data-tour="mep-verpordentro" style={{ width: '100%', padding: '15px 18px' }} onClick={alternarVerDentro}>
            <span className="sp">
              <span style={{ fontWeight: 700, fontSize: '.95rem' }}>Ver por dentro</span>
              <span className="sub" style={{ display: 'block' }}>Qué hace el sistema en realidad</span>
            </span>
            <span style={{ color: 'var(--violet)', fontSize: '1.1rem' }}>{mep.verDentro ? '⌄' : '›'}</span>
          </button>
          {mep.verDentro && (
            <div data-tour="mep-patas">
              <div className="kv">
                <div className="r" style={{ background: 'var(--card2)' }}><span className="k" style={{ fontWeight: 700 }}>Lo que hace el sistema por vos</span></div>
                {venta ? <>
                  <div className="r"><span className="k">1 · Compra {nf(vn, 0)} VN de AL30D, en dólares</span><span className="v">US$ {nf(entrega)}</span></div>
                  <div className="r"><span className="k">2 · Vende esos {nf(vn, 0)} VN como AL30, en pesos</span><span className="v">$ {nf(recibe)}</span></div>
                </> : <>
                  <div className="r"><span className="k">1 · Compra {nf(vn, 0)} VN de AL30, en pesos</span><span className="v">$ {nf(entrega)}</span></div>
                  <div className="r"><span className="k">2 · Vende esos {nf(vn, 0)} VN como AL30D, en dólares</span><span className="v">US$ {nf(recibe)}</span></div>
                </>}
                <div className="r"><span className="k">Las dos patas en Contado Inmediato</span><span className="v texto">hoy</span></div>
                <div className="r tot"><span className="k">Tipo de cambio resultante</span><span className="v">$ {nf(tipoDeCambio)}</span></div>
              </div>
              <p className="hint" style={{ marginTop: 10 }}>
                AL30 es un bono del Estado argentino que cotiza en las dos monedas. Comprarlo en una y venderlo en la otra es, legalmente, operar dólar MEP.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
