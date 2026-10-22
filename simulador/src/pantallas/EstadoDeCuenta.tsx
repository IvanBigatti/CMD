import { valorCartera } from '../dominio/cartera'
import { fechaSimulada, formatoFecha } from '../dominio/fechas'
import { nf } from '../dominio/formato'
import { useSimulador } from '../estado/simulador'
import { HORA_SIMULADA, TC_MEP } from '../mocks/mercado'
import { PERSONA } from '../mocks/persona'
import { BotonProximamente } from '../componentes/ui/BotonProximamente'
import { Estadisticas } from '../componentes/ui/Estadisticas'
import { Saldos } from '../componentes/ui/Saldos'

export function EstadoDeCuenta() {
  const dia = useSimulador((s) => s.dia)
  const saldo = useSimulador((s) => s.saldo)
  const posiciones = useSimulador((s) => s.posiciones)
  const inst = useSimulador((s) => s.inst)
  const acordeones = useSimulador((s) => s.acordeones)
  const { irA, setModoMep, setAcordeon } = useSimulador.getState()

  const irAMep = (modo: 'compra' | 'venta') => { setModoMep(modo); irA('mep') }

  return (
    <section className="page">
      <div className="pagetop">
        <h1 className="ptitle">Estado de cuenta</h1>
        <div className="pmeta">Saldo al {formatoFecha(fechaSimulada(dia))} {HORA_SIMULADA}hs | Cuenta comitente nro: {PERSONA.comitente}</div>
      </div>

      <div className="acctgrid">
        <div className="panel" data-tour="cuenta-arg">
          <div className="accthd">
            <span className="flag">🇦🇷</span><h2>Cuenta de inversión de Argentina</h2>
            <select className="selmini" defaultValue="Tradicional"><option>Tradicional</option><option>Simple</option></select>
          </div>
          <div className="balrow"><span className="k">Saldo total valorizado</span><span className="v">AR$ {nf(valorCartera(saldo, posiciones, inst, 'ARS'))}</span></div>
          <div className="balrow sec"><span className="k" /><span className="v">US$ {nf(valorCartera(saldo, posiciones, inst, 'USD'))}</span></div>
          <div className="acctbtns">
            <button type="button" className="btn-o" data-tour="btn-miportafolio" onClick={() => irA('portafolio')}>Mi Portafolio</button>
            <button type="button" className="btn-s" data-tour="qa-ingresar" onClick={() => irA('ingresar')}>Ingresar dinero</button>
          </div>
        </div>

        <div className="panel proximamente" data-tour="cuenta-usa">
          <div className="accthd">
            <span className="flag">🇺🇸</span><h2>Cuenta de inversión de Estados Unidos</h2>
            <span className="scope-chip" style={{ marginLeft: 'auto' }}>Próximamente</span>
          </div>
          <div className="balrow"><span className="k">Saldo total valorizado</span><span className="v">US$ 0,00</span></div>
          <div className="acctbtns">
            <BotonProximamente tema="cuentaUsa" className="btn-o">Mi Portafolio</BotonProximamente>
            <BotonProximamente tema="cuentaUsa" className="btn-s">Ingresar dinero</BotonProximamente>
          </div>
          <div className="acctbtns2">
            <BotonProximamente tema="cclCuenta" className="btn-s">Enviar dinero a Estados Unidos</BotonProximamente>
          </div>
          <p className="hint" style={{ marginTop: 14, borderTop: '1px dashed var(--line2)', paddingTop: 12 }}>
            Esta capacitación cubre solo la cuenta argentina. Para invertir en empresas del exterior vas a usar{' '}
            <strong>CEDEARs</strong>, que se compran en pesos desde acá.
          </p>
        </div>
      </div>

      <h2 className="sech">Te recomendamos</h2>
      <div className="recgrid">
        <div className="rec" data-tour="rec-mep">
          <div className="rhd"><span className="ric">💵</span><h3>Dólar MEP Simple</h3></div>
          <p>Dólar MEP al instante, sin parking. Comprás y vendés dólares legales con un solo clic.</p>
          <div className="rsp" />
          <div className="rpx">Ult. precio: <strong className="mono">AR$ {nf(TC_MEP)}</strong></div>
          <div className="rbtns">
            <button type="button" className="btn-o sm" data-tour="qa-mep-vender" onClick={() => irAMep('venta')}>Vender</button>
            <button type="button" className="btn-s sm" data-tour="qa-mep" onClick={() => irAMep('compra')}>Comprar</button>
          </div>
        </div>

        <div className="rec">
          <div className="rhd"><span className="ric">🥧</span><h3>Portafolio Simple</h3></div>
          <p>Son paquetes de inversión, armados por nuestro equipo experto, en los que podés invertir en pesos con un solo clic.</p>
          <div className="rsp" />
          <div className="rpx">Desde: <strong className="mono">AR$ 74.287,50</strong></div>
          <div className="rbtns">
            <BotonProximamente tema="portafolioSimple" className="btn-s sm">Comprar</BotonProximamente>
          </div>
        </div>

        <div className="rec">
          <div className="rhd"><h3>¿En qué invierto?</h3></div>
          <div className="reclinks">
            <BotonProximamente tema="inflacion">¿Cómo le gano a la inflación? &gt;</BotonProximamente>
            <BotonProximamente tema="invertirDolares">¿Cómo invertir tus dólares? &gt;</BotonProximamente>
            <BotonProximamente tema="cortoPlazo">Estrategias de corto plazo (AT) &gt;</BotonProximamente>
            <BotonProximamente tema="portafoliosSugeridos">Portafolios sugeridos &gt;</BotonProximamente>
          </div>
        </div>
      </div>

      <details
        className="acc"
        data-acordeon="saldos"
        data-tour="detalle-saldos"
        open={acordeones.saldos}
        onToggle={(e) => setAcordeon('saldos', e.currentTarget.open)}
      >
        <summary>Detalle de saldos</summary>
        <div className="accbody">
          <div className="grid12">
            <Saldos dataTour="saldo-detalle" />
            <div className="panel">
              <p style={{ fontSize: '.87rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                Tu dinero puede estar en tres estados a la vez. <strong>Disponible</strong> es lo único que podés usar o retirar hoy.{' '}
                <strong>Comprometido</strong> es lo que ya gastaste en una compra que todavía no liquidó.{' '}
                <strong>A liquidar</strong> es lo que cobraste por una venta y se acredita el día hábil siguiente.
              </p>
            </div>
          </div>
        </div>
      </details>

      <details
        className="acc"
        data-acordeon="estadisticas"
        open={acordeones.estadisticas}
        onToggle={(e) => setAcordeon('estadisticas', e.currentTarget.open)}
      >
        <summary>Estadísticas</summary>
        <div className="accbody"><div className="grid3"><Estadisticas moneda="ARS" /></div></div>
      </details>
    </section>
  )
}
