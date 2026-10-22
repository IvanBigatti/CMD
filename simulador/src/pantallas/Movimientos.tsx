import { dinero } from '../dominio/formato'
import type { TonoEstado } from '../dominio/tipos'
import { useSimulador } from '../estado/simulador'
import { BotonProximamente } from '../componentes/ui/BotonProximamente'

const CLASE_ESTADO: Record<TonoEstado, string> = { neutro: '', ok: 'g', pendiente: 'w', error: 'b' }

/** Bitácora de la cuenta: ingresos, órdenes, liquidaciones y retiros */
export function Movimientos() {
  const movimientos = useSimulador((s) => s.movimientos)
  return (
    <section className="page">
      <div className="pagetop">
        <h1 className="ptitle">Movimientos</h1>
        <div className="pmeta"><BotonProximamente tema="descargarEstado" className="btn-o sm">Descargar estado de cuenta</BotonProximamente></div>
      </div>
      <p className="subt">La bitácora de tu cuenta: cada ingreso, cada orden, cada liquidación y cada retiro, con su estado</p>
      <div className="card p0 scroll-x">
        {movimientos.length ? (
          <table>
            <thead><tr><th>Fecha</th><th>Movimiento</th><th>Detalle</th><th>Estado</th><th className="n">Importe</th></tr></thead>
            <tbody>
              {movimientos.map((m, k) => (
                <tr key={k}>
                  <td className="n" style={{ textAlign: 'left' }}>{m.fecha}</td>
                  <td style={{ fontWeight: 600 }}>{m.titulo}</td>
                  <td style={{ color: 'var(--tx3)', fontSize: '.82rem' }}>{m.detalle}</td>
                  <td>{m.estado && <span className={`pill ${CLASE_ESTADO[m.estado.tono]}`}>{m.estado.texto}</span>}</td>
                  <td className="n" style={{ color: m.importe > 0 ? 'var(--up)' : 'var(--tx)' }}>{m.importe > 0 ? '+' : ''}{dinero(m.importe, m.moneda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">Todavía no hay movimientos.</div>
        )}
      </div>
    </section>
  )
}
