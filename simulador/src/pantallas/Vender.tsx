import { useRef } from 'react'
import { dinero, nf } from '../dominio/formato'
import { precioMercado } from '../dominio/mercado'
import type { Plazo } from '../dominio/tipos'
import { useSimulador } from '../estado/simulador'
import { AvisoCaja } from '../componentes/ui/AvisoCaja'
import { FilasMontos } from '../componentes/ui/MontosDisponibles'

export function Vender() {
  const f = useSimulador((s) => s.venta)
  const aviso = useSimulador((s) => s.avisoVenta)
  const posiciones = useSimulador((s) => s.posiciones)
  const inst = useSimulador((s) => s.inst)
  const dia = useSimulador((s) => s.dia)
  const { actualizarVenta, enviarOrden } = useSimulador.getState()
  const refLimite = useRef<HTMLInputElement>(null)

  const ids = Object.keys(posiciones)
  const i = inst[f.simbolo]
  const p = posiciones[f.simbolo]

  return (
    <section className="page">
      <h1 className="ptitle">Vender</h1>
      <div className="formpanel" data-tour="form-vender">
        <div className="frow">
          <label>Plazo de liquidación</label>
          <div>
            <select className="fsel" data-tour="campo-plazo-venta" value={f.plazo} onChange={(e) => actualizarVenta({ plazo: e.target.value as Plazo })}>
              <option value="24">Normal — 24 hs (T+1)</option>
              <option value="ci">Contado inmediato</option>
            </select>
          </div>
        </div>
        <div className="frow">
          <label>Símbolo</label>
          <div>
            <select className="fsel" data-tour="campo-simbolo-venta" value={f.simbolo} onChange={(e) => actualizarVenta({ simbolo: e.target.value })}>
              {ids.length
                ? <>
                    <option value="">(Seleccionar)</option>
                    {ids.map((id) => <option key={id} value={id}>{id} — {inst[id].nombre}</option>)}
                  </>
                : <option value="">(No tenés especies en cartera)</option>}
            </select>
            <div className="siminfo">
              {i && p
                ? <><span className="ok">{i.id}</span> — tenés <strong>{nf(p.cantidad, 0)}</strong> {i.tipo === 'on' ? 'VN' : 'unidades'} · punta compradora{' '}
                    <strong>{dinero(precioMercado(i, 'venta', dia), i.moneda)}</strong></>
                : ids.length
                  ? 'Elegí cuál de tus especies querés vender.'
                  : 'Todavía no tenés nada para vender. Comprá algo primero desde Operar → Comprar.'}
            </div>
          </div>
        </div>
        <div className="frow">
          <label>Cantidad</label>
          <div>
            <input className="finp" inputMode="numeric" data-tour="campo-cantidad-venta"
              value={f.cantidad} onChange={(e) => actualizarVenta({ cantidad: e.target.value })} />
          </div>
        </div>
        <div className="frow">
          <label>Modalidad</label>
          <div className="radiogrid">
            <label className="rl">
              <input type="radio" name="vmod" checked={f.modalidad === 'mercado'} onChange={() => actualizarVenta({ modalidad: 'mercado' })} /> Precio mercado
            </label>
            <span />
            <label className="rl">
              <input type="radio" name="vmod" checked={f.modalidad === 'limite'}
                onChange={() => { actualizarVenta({ modalidad: 'limite' }); setTimeout(() => refLimite.current?.focus(), 0) }} /> Precio límite
            </label>
            <input ref={refLimite} className="finp" inputMode="decimal" disabled={f.modalidad !== 'limite'}
              value={f.limite} onChange={(e) => actualizarVenta({ limite: e.target.value })} />
          </div>
        </div>
        <div className="frow">
          <label>Validez</label>
          <div>
            <select className="fsel" value={f.validez} onChange={(e) => actualizarVenta({ validez: e.target.value })}>
              <option>Día</option><option>Hasta fin de mes</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 790 }}>{aviso && <AvisoCaja aviso={aviso} style={{ marginTop: 14 }} />}</div>
      <div className="submitrow">
        <button type="button" className="btn-s" style={{ padding: '11px 48px' }} data-tour="btn-vender-submit" onClick={() => enviarOrden('venta')}>Vender</button>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="montitulo"><span>🇦🇷</span>Monto disponible para Argentina</div>
        <div className="montos">
          <FilasMontos moneda="ARS" plazos={['24', '48']} resaltado={f.plazo} />
          <FilasMontos moneda="USD" plazos={['24', '48']} resaltado={f.plazo} />
        </div>
      </div>
      <div>
        <div className="montitulo"><span>🇺🇸</span>Monto disponible para Estados Unidos<span className="scope-chip">Próximamente</span></div>
        <div className="montos">
          <FilasMontos moneda="USD" plazos={['ci', '24', '48']} />
        </div>
      </div>
    </section>
  )
}
