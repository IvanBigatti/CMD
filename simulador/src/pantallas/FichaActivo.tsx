import type { ReactNode } from 'react'
import { fechaSimulada, formatoFecha } from '../dominio/fechas'
import { nf } from '../dominio/formato'
import { cajaDePuntas, datosMercado, operacionesIntradiarias, semilla } from '../dominio/mercado'
import { useSimulador } from '../estado/simulador'
import { HORA_SIMULADA, TC_MEP } from '../mocks/mercado'
import { PERFILES } from '../mocks/perfiles'
import { BotonProximamente } from '../componentes/ui/BotonProximamente'
import { GraficoArea } from '../componentes/ui/GraficoArea'

function Dato({ k, v }: { k: string; v: ReactNode }) {
  return <div className="dcrow"><span className="k">{k}</span><span className="v">{v}</span></div>
}

export function FichaActivo() {
  const id = useSimulador((s) => s.activo)
  const inst = useSimulador((s) => s.inst)
  const dia = useSimulador((s) => s.dia)
  const perfil = useSimulador((s) => s.perfil)
  const tiene = useSimulador((s) => (id ? !!s.posiciones[id] : false))
  const { irA, prepararCompra, prepararVenta } = useSimulador.getState()

  const i = id ? inst[id] : undefined
  if (!i) return <section className="page ancha" />

  const m = datosMercado(i, dia)
  const puntas = cajaDePuntas(i, dia)
  const cur = i.moneda === 'USD' ? 'US$ ' : 'AR$ '

  let propios: ReactNode
  if (i.tipo === 'cedear')
    propios = <>
      <Dato k="Ratio de conversión" v={`${i.ratio} : 1`} />
      <Dato k="Acción en EE.UU." v={`US$ ${nf(i.precioUsd)}`} />
      <Dato k="Tipo de cambio implícito" v={`$ ${nf(TC_MEP)}`} />
      <Dato k="Plazo de liquidación" v="24 hs (T+1)" />
    </>
  else if (i.tipo === 'on')
    propios = <>
      <Dato k="Tasa anual" v={`${nf(i.tna, 2)} %`} />
      <Dato k="Pago de renta" v={i.renta} />
      <Dato k="Vencimiento" v={i.vencimiento} />
      <Dato k="Lámina mínima" v={`${nf(i.laminaMinima, 0)} VN`} />
      <Dato k="Cotiza por" v="cada 100 VN" />
    </>
  else
    propios = <>
      <Dato k="Panel" v="Líder" />
      <Dato k="Moneda" v="Pesos" />
      <Dato k="Plazo de liquidación" v="24 hs (T+1)" />
    </>

  return (
    <section className="page ancha">
      <button type="button" className="mini" style={{ alignSelf: 'flex-start' }} onClick={() => irA('mercado')}>‹ Volver a Cotizaciones</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div className="sp">
            <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{i.id}</div>
            <div className="sub" style={{ fontSize: '.92rem' }}>{i.nombre}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="big" style={{ fontSize: '1.9rem' }}>{cur}{nf(m.px)}</div>
            <span className={`varcell ${i.variacion >= 0 ? 'up' : 'dn'}`} style={{ fontSize: '.95rem' }}>
              {i.variacion >= 0 ? '▲' : '▼'} {nf(i.variacion, 2)}%
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, flex: 'none' }}>
            <button type="button" className="btn-s" data-tour="btn-comprar" onClick={() => prepararCompra(i.id)}>Comprar</button>
            <button type="button" className="btn-o" data-tour="btn-vender" disabled={!tiene} onClick={() => prepararVenta(i.id)}>Vender</button>
          </div>
        </div>

        <div className="fgrid">
          <div className="fcard">
            <h3>Datos de cotizaciones</h3>
            <div className="fbody">
              <div className="dcgrid">
                <div>
                  <Dato k="Precio Apertura" v={cur + nf(m.apertura)} />
                  <Dato k="Último Cierre" v={cur + nf(m.cierre)} />
                  <Dato k="Máximo" v={cur + nf(m.max)} />
                  <Dato k="Mínimo" v={cur + nf(m.min)} />
                  <Dato k="Monto operado" v={cur + nf(m.monto, 0)} />
                </div>
                <div>
                  <Dato k="Fecha/Hora" v={`${formatoFecha(fechaSimulada(dia))} ${HORA_SIMULADA}`} />
                  {propios}
                </div>
              </div>
            </div>
          </div>

          <div className="fcard">
            <h3>Gráfico intradiario</h3>
            <div className="fbody">
              <GraficoArea seed={semilla(i.id) + dia * 97} />
              <p className="hint" style={{ marginTop: 8 }}>Serie simulada de la rueda de hoy. En la plataforma real acá hay datos históricos y análisis técnico.</p>
            </div>
          </div>

          <div className="fcard" data-tour="caja-puntas">
            <h3>Caja de Puntas</h3>
            <div className="fbody">
              <table className="mini2">
                <thead><tr><th>Cantidad Compra</th><th>Precio Compra</th><th>Precio Venta</th><th>Cantidad Venta</th></tr></thead>
                <tbody>
                  {puntas.compra.map((c, k) => (
                    <tr key={k}>
                      <td>{nf(c.cantidad, 0)}</td>
                      <td className="b">{cur}{nf(c.precio)}</td>
                      <td className="a">{cur}{nf(puntas.venta[k].precio)}</td>
                      <td>{nf(puntas.venta[k].cantidad, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="hint" style={{ marginTop: 10 }}>
                Si comprás a mercado, pagás la <strong>mejor punta vendedora</strong>: {cur}{nf(m.ask)}.
                {' '}Si vendés a mercado, cobrás la <strong>mejor punta compradora</strong>: {cur}{nf(m.bid)}. Por eso el precio de tu orden no es el “último operado”.
              </p>
            </div>
          </div>

          <div className="fcard">
            <h3>Operaciones Intradiarias</h3>
            <div className="fbody">
              <table className="mini2">
                <thead><tr><th>Hora</th><th>Precio</th><th>Monto</th><th>Volumen</th></tr></thead>
                <tbody>
                  {operacionesIntradiarias(i, dia).map((op, k) => (
                    <tr key={k}><td>{op.hora}</td><td>{cur}{nf(op.precio)}</td><td>{cur}{nf(op.monto, 0)}</td><td>{op.volumen}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {i.riesgo > perfil && (
          <div className="alert warn">
            <span className="t">Supera tu perfil de inversor</span>
            Tu perfil es {PERFILES[perfil].nombre} y este activo tiene un riesgo mayor. En la plataforma real esto no te bloquea: podés comprarlo igual.
          </div>
        )}
        <p className="hint">{i.descripcion}</p>
        <BotonProximamente tema="analisisTecnico" className="tile" style={{ alignItems: 'flex-start', maxWidth: 340 }}>
          <span className="tt">Datos históricos · Gráfico avanzado · Alarmas ›</span>
          <span className="ss">Herramientas de análisis</span>
        </BotonProximamente>
      </div>
    </section>
  )
}
