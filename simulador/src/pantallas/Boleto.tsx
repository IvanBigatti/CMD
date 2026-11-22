import { dinero, nf } from '../dominio/formato'
import { useSimulador } from '../estado/simulador'

/** Comprobante de la última orden ejecutada */
export function Boleto() {
  const b = useSimulador((s) => s.boleto)
  const irA = useSimulador((s) => s.irA)
  const m = b?.instrumento.moneda ?? 'ARS'

  return (
    <section className="page">
      <div style={{ maxWidth: 640, margin: '0 auto', width: '100%' }} data-tour="boleto-detalle">
        {b && <>
          <div className="alert good"><span className="t">Orden ejecutada</span>Se emitió el boleto Nº {b.numero}. Es el comprobante de la operación.</div>
          <div className="panel" style={{ marginTop: 16 }}>
            <div className="lbl">Boleto de {b.lado === 'compra' ? 'compra' : 'venta'}</div>
            <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: 3 }}>Nº {b.numero}</div>
            <div className="kv" style={{ marginTop: 14 }}>
              <div className="r"><span className="k">Instrumento</span><span className="v texto">{b.instrumento.id} · {b.instrumento.nombre}</span></div>
              <div className="r"><span className="k">Cantidad</span><span className="v">{nf(b.cantidad, 0)} {b.instrumento.tipo === 'on' ? 'VN' : 'un.'}</span></div>
              <div className="r"><span className="k">Precio</span><span className="v">{dinero(b.precio, m)}</span></div>
              <div className="r"><span className="k">Fecha de concertación</span><span className="v">{b.fechaConcertacion}</span></div>
              <div className="r"><span className="k">Fecha de liquidación</span><span className="v">{b.fechaLiquidacion}{b.contadoInmediato ? ' (CI)' : ''}</span></div>
            </div>
            <div className="kv" style={{ marginTop: 11 }}>
              <div className="r"><span className="k">Monto bruto</span><span className="v">{dinero(b.bruto, m)}</span></div>
              <div className="r"><span className="k">Comisión</span><span className="v">{dinero(b.costos.comision, m)}</span></div>
              <div className="r"><span className="k">Derechos de mercado</span><span className="v">{dinero(b.costos.derechos, m)}</span></div>
              <div className="r"><span className="k">IVA 21%</span><span className="v">{dinero(b.costos.iva, m)}</span></div>
              <div className="r tot"><span className="k">{b.lado === 'compra' ? 'Debitado' : 'Acreditado'}</span><span className="v">{dinero(b.total, m)}</span></div>
            </div>
            <p className="hint" style={{ marginTop: 12 }}>
              Los costos totales fueron {dinero(b.costos.total, m)}, un {nf((b.costos.total / b.bruto) * 100, 2)}% del monto operado.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn-o" onClick={() => irA('movimientos')}>Ver movimientos</button>
            <button type="button" className="btn-s" onClick={() => irA('inicio')}>Ir al estado de cuenta</button>
          </div>
        </>}
      </div>
    </section>
  )
}
