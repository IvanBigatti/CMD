import { useRef, type RefObject } from 'react'
import { dinero, nf } from '../dominio/formato'
import { precio, precioMercado } from '../dominio/mercado'
import type { Plazo } from '../dominio/tipos'
import { instrumentoPorSimbolo, useSimulador } from '../estado/simulador'
import { useUi } from '../estado/ui'
import { SIMBOLOS_SUGERIDOS } from '../mocks/instrumentos'
import { AvisoCaja } from '../componentes/ui/AvisoCaja'
import { BotonProximamente } from '../componentes/ui/BotonProximamente'
import { FilasMontos } from '../componentes/ui/MontosDisponibles'

function InfoSimbolo() {
  const simbolo = useSimulador((s) => s.compra.simbolo)
  const inst = useSimulador((s) => s.inst)
  const dia = useSimulador((s) => s.dia)
  const i = instrumentoPorSimbolo(inst, simbolo)
  if (!i)
    return (
      <div className="siminfo">
        {simbolo.trim()
          ? <><span className="err">No encontramos ese símbolo.</span> Probá {SIMBOLOS_SUGERIDOS}.</>
          : 'Escribí el símbolo de la especie. Si no lo sabés, buscala en Cotizaciones y entrá desde ahí.'}
      </div>
    )
  const extra = i.tipo === 'cedear' ? ` · ratio ${i.ratio}:1`
    : i.tipo === 'on' ? ` · cotiza cada 100 VN · lámina mínima ${nf(i.laminaMinima, 0)} VN` : ''
  return (
    <div className="siminfo">
      <span className="ok">{i.id}</span> — {i.nombre} · último {dinero(precio(i), i.moneda)} · punta vendedora{' '}
      <strong>{dinero(precioMercado(i, 'compra', dia), i.moneda)}</strong>{extra}
    </div>
  )
}

export function Comprar() {
  const f = useSimulador((s) => s.compra)
  const aviso = useSimulador((s) => s.avisoCompra)
  const { actualizarCompra, enviarOrden } = useSimulador.getState()
  const refCantidad = useRef<HTMLInputElement>(null)
  const refMonto = useRef<HTMLInputElement>(null)
  const refLimite = useRef<HTMLInputElement>(null)
  const enfocar = (r: RefObject<HTMLInputElement | null>) => setTimeout(() => r.current?.focus(), 0)

  return (
    <section className="page">
      <h1 className="ptitle">Comprar <BotonProximamente tema="ayudaComprar" className="qmark">?</BotonProximamente></h1>
      <div className="formpanel" data-tour="form-comprar">
        <div className="frow">
          <label>Mercado</label>
          <div>
            <select className="fsel" value={f.mercado} onChange={(e) => {
              if (e.target.value === 'us') {
                useUi.getState().mensaje({
                  titulo: 'Cuenta de inversión de Estados Unidos',
                  parrafo: 'Es una cuenta comitente aparte, con su propio fondeo, para comprar acciones, ETFs y bonos directamente en el mercado estadounidense.',
                  avisos: [{ tono: 'info', titulo: 'Llega en una próxima versión', texto: 'Por ahora invertís en empresas del exterior vía CEDEARs, que se compran en pesos desde la cuenta argentina.' }],
                  eyebrow: 'Próximamente',
                })
                return
              }
              actualizarCompra({ mercado: 'ar' })
            }}>
              <option value="ar">Argentina</option>
              <option value="us">Estados Unidos — próximamente</option>
            </select>
          </div>
        </div>
        <div className="frow">
          <label>Plazo de liquidación</label>
          <div>
            <select className="fsel" data-tour="campo-plazo" value={f.plazo} onChange={(e) => actualizarCompra({ plazo: e.target.value as Plazo })}>
              <option value="24">Normal — 24 hs (T+1)</option>
              <option value="ci">Contado inmediato</option>
            </select>
          </div>
        </div>
        <div className="frow">
          <label>Símbolo</label>
          <div>
            <input className="finp" list="simbolos" placeholder="Ej: KO" data-tour="campo-simbolo"
              value={f.simbolo} onChange={(e) => actualizarCompra({ simbolo: e.target.value })} />
            <InfoSimbolo />
          </div>
        </div>
        <div className="frow">
          <label>Cantidad/Monto</label>
          <div className="radiogrid" data-tour="campo-cantidad">
            <label className="rl">
              <input type="radio" name="cqm" checked={f.por === 'cantidad'}
                onChange={() => { actualizarCompra({ por: 'cantidad' }); enfocar(refCantidad) }} /> Cantidad
            </label>
            <input ref={refCantidad} className="finp" inputMode="numeric" disabled={f.por !== 'cantidad'}
              value={f.cantidad} onChange={(e) => actualizarCompra({ cantidad: e.target.value })} />
            <label className="rl">
              <input type="radio" name="cqm" checked={f.por === 'monto'}
                onChange={() => { actualizarCompra({ por: 'monto' }); enfocar(refMonto) }} /> Monto
            </label>
            <input ref={refMonto} className="finp" inputMode="decimal" disabled={f.por !== 'monto'}
              value={f.monto} onChange={(e) => actualizarCompra({ monto: e.target.value })} />
          </div>
        </div>
        <div className="frow">
          <label>Modalidad</label>
          <div className="radiogrid" data-tour="campo-modalidad">
            <label className="rl">
              <input type="radio" name="cmod" checked={f.modalidad === 'mercado'} onChange={() => actualizarCompra({ modalidad: 'mercado' })} /> Precio mercado
            </label>
            <span />
            <label className="rl">
              <input type="radio" name="cmod" checked={f.modalidad === 'limite'}
                onChange={() => { actualizarCompra({ modalidad: 'limite' }); enfocar(refLimite) }} /> Precio límite
            </label>
            <input ref={refLimite} className="finp" inputMode="decimal" disabled={f.modalidad !== 'limite'}
              value={f.limite} onChange={(e) => actualizarCompra({ limite: e.target.value })} />
          </div>
        </div>
        <div className="frow">
          <label>Validez</label>
          <div>
            <select className="fsel" value={f.validez} onChange={(e) => actualizarCompra({ validez: e.target.value })}>
              <option>Día</option><option>Hasta fin de mes</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 790 }}>{aviso && <AvisoCaja aviso={aviso} style={{ marginTop: 14 }} />}</div>
      <div className="submitrow">
        <button type="button" className="btn-s" style={{ padding: '11px 48px' }} data-tour="btn-comprar-submit" onClick={() => enviarOrden('compra')}>Comprar</button>
      </div>
      <div style={{ marginTop: 14 }}>
        <div className="montitulo"><span>🇦🇷</span>Monto disponible para Argentina</div>
        <div className="montos" data-tour="montos-disponibles">
          <FilasMontos moneda="ARS" plazos={['ci', '24', '48']} resaltado={f.plazo} />
          <FilasMontos moneda="USD" plazos={['ci', '24', '48']} resaltado={f.plazo} />
        </div>
        <p className="hint" style={{ marginTop: 12, maxWidth: 860 }}>
          El dinero que podés usar depende del plazo. Lo que cobraste por una venta a 24 hs
          ya sirve para comprar a 24 hs, pero todavía no para contado inmediato ni para retirar.
        </p>
      </div>
    </section>
  )
}
