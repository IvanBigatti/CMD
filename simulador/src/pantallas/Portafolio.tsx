import { costoPosicion } from '../dominio/cartera'
import { dinero, nf } from '../dominio/formato'
import { montoOperado, precio } from '../dominio/mercado'
import type { Moneda } from '../dominio/tipos'
import { useSimulador } from '../estado/simulador'
import { Estadisticas } from '../componentes/ui/Estadisticas'

export function Portafolio() {
  const moneda = useSimulador((s) => s.monedaVista)
  const posiciones = useSimulador((s) => s.posiciones)
  const inst = useSimulador((s) => s.inst)
  const { setMonedaVista, verActivo } = useSimulador.getState()
  const ids = Object.keys(posiciones)
  const monedas: [Moneda, string][] = [['ARS', 'Ver en pesos'], ['USD', 'Ver en dólares']]

  return (
    <section className="page">
      <div className="pagetop">
        <h1 className="ptitle">Mi Portafolio</h1>
        <div className="pmeta">Cuenta de inversión de Argentina</div>
      </div>
      <div className="row">
        <div className="sp"><p className="subt">Tenencia valorizada a precios de mercado</p></div>
        <div className="segment" data-tour="toggle-moneda">
          {monedas.map(([m, txt]) => (
            <button key={m} type="button" aria-pressed={moneda === m} onClick={() => setMonedaVista(m)}>{txt}</button>
          ))}
        </div>
      </div>
      <div className="grid3"><Estadisticas moneda={moneda} /></div>
      <div className="card p0" data-tour="pos-lista">
        <div className="cardhd">
          <h3>Tenencia</h3><span className="sp" />
          <span className="sub">{ids.length ? `${ids.length} especie${ids.length > 1 ? 's' : ''}` : ''}</span>
        </div>
        <div className="scroll-x">
          {ids.length ? (
            <table>
              <thead>
                <tr><th>Especie</th><th className="n">Cantidad</th><th className="n">Precio</th><th className="n">Valorizado</th><th className="n">Resultado</th></tr>
              </thead>
              <tbody>
                {ids.map((id) => {
                  const i = inst[id]
                  const p = posiciones[id]
                  const valor = montoOperado(i, p.cantidad)
                  const costo = costoPosicion(i, p)
                  const dif = valor - costo
                  const pct = costo ? (dif / costo) * 100 : 0
                  const color = dif >= 0 ? 'var(--up)' : 'var(--down)'
                  const signo = dif >= 0 ? '+' : ''
                  return (
                    <tr key={id} className="clk" data-tour={`pos-${id}`} onClick={() => verActivo(id)}>
                      <td><span className="tickcell">{id}</span><div className="namecell">{i.nombre}</div></td>
                      <td className="n">{nf(p.cantidad, 0)}{i.tipo === 'on' ? ' VN' : ''}</td>
                      <td className="n">
                        {dinero(precio(i), i.moneda)}
                        <div className="namecell" style={{ maxWidth: 'none' }}>compra {dinero(p.precioPromedio, i.moneda)}</div>
                      </td>
                      <td className="n">{dinero(valor, i.moneda)}</td>
                      <td className="n" style={{ color }}>
                        {signo}{nf(pct, 2)}%
                        <div className="namecell" style={{ maxWidth: 'none', color, opacity: 0.75 }}>{signo}{dinero(dif, i.moneda)}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty">Todavía no tenés inversiones.<br />Entrá a <strong>Cotizaciones</strong> para ver los instrumentos disponibles.</div>
          )}
        </div>
      </div>
    </section>
  )
}
