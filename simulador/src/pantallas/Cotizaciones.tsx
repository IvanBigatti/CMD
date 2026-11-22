import { nf } from '../dominio/formato'
import { datosMercado, indices } from '../dominio/mercado'
import type { TipoInstrumento } from '../dominio/tipos'
import { useSimulador } from '../estado/simulador'
import { BotonProximamente } from '../componentes/ui/BotonProximamente'

const NOMBRE_PANEL: Record<TipoInstrumento, string> = { accion: 'Acciones', cedear: 'Cedears', on: 'Obligaciones Negociables' }
const ETIQUETA_TIPO: Record<TipoInstrumento, string> = { accion: 'ACCIÓN', cedear: 'CEDEAR', on: 'ON' }

function Variacion({ v }: { v: number }) {
  const sube = v >= 0
  return <span className={`varcell ${sube ? 'up' : 'dn'}`}>{sube ? '▲' : '▼'} {nf(v, 2)}%</span>
}

function Encabezado({ texto, className }: { texto: string; className?: string }) {
  return <th className={className}>{texto}<span className="srt">⇅</span></th>
}

export function Cotizaciones() {
  const dia = useSimulador((s) => s.dia)
  const inst = useSimulador((s) => s.inst)
  const cot = useSimulador((s) => s.cotizaciones)
  const { setCotizaciones, verActivo, prepararCompra } = useSimulador.getState()

  const filtro = cot.buscar.trim().toUpperCase()
  const especies = Object.values(inst)
    .filter((i) => i.tipo === cot.tab && (!filtro || i.id.includes(filtro)))
    .slice(0, cot.mostrar)

  const tab = (t: TipoInstrumento, texto: string, tour: string) => (
    <button type="button" data-tour={tour} aria-pressed={cot.tab === t} onClick={() => setCotizaciones({ tab: t, buscar: '' })}>{texto}</button>
  )

  return (
    <section className="page ancha">
      <div className="indices">
        {indices(dia).map((ix) => (
          <div key={ix.nombre} className="ix">
            <b>{ix.nombre}:</b> <span className="mono">{nf(ix.valor)}</span> <Variacion v={ix.variacion} />
          </div>
        ))}
      </div>
      <h1 className="ptitle">Cotización de {NOMBRE_PANEL[cot.tab]} Argentina - Panel {cot.panel}</h1>
      <div className="tabs1">
        <button type="button" aria-pressed="true">🇦🇷 Argentina</button>
        <BotonProximamente tema="cotizacionesUsa">🇺🇸 Estados Unidos</BotonProximamente>
        <BotonProximamente tema="favoritosPanel">☆ Favoritos</BotonProximamente>
        <BotonProximamente tema="indices">🌐 Índices</BotonProximamente>
      </div>
      <div className="tabs2">
        {tab('accion', 'Acciones', 'tab-acciones')}
        {tab('cedear', 'Cedears', 'tab-cedears')}
        <BotonProximamente tema="opcionesPanel">Opciones</BotonProximamente>
        <BotonProximamente tema="bonos">Bonos</BotonProximamente>
        <BotonProximamente tema="letras">Letras</BotonProximamente>
        {tab('on', 'Obligaciones Negociables', 'tab-ons')}
        <BotonProximamente tema="fondos">Fondos</BotonProximamente>
        <BotonProximamente tema="cauciones">Cauciones</BotonProximamente>
        <BotonProximamente tema="cheques">Cheques</BotonProximamente>
        <BotonProximamente tema="monedas">Monedas</BotonProximamente>
      </div>
      <div className="mktbar">
        <label>Mostrar{' '}
          <select className="fsel" value={cot.mostrar} onChange={(e) => setCotizaciones({ mostrar: Number(e.target.value) })}>
            <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
          </select>
        </label>
        <label>Cambiar Panel{' '}
          <select className="fsel" value={cot.panel} onChange={(e) => setCotizaciones({ panel: e.target.value })}>
            <option>Todos</option><option>Líderes</option>
          </select>
        </label>
        <button type="button" className="viewbtn" aria-pressed="true" title="Vista lista">☰</button>
        <BotonProximamente tema="vistaMosaico" className="viewbtn">▦</BotonProximamente>
        <span className="sp" />
        <span className="rtpill">Precios simulados</span>
        <label>Buscar:{' '}
          <input className="finp" placeholder="Símbolo - Ej: PAMP" style={{ fontSize: '.85rem' }}
            value={cot.buscar} onChange={(e) => setCotizaciones({ buscar: e.target.value })} />
        </label>
      </div>

      <div className="card p0 scroll-x">
        {especies.length ? (
          <>
            <table className="cot">
              <thead>
                <tr>
                  <Encabezado texto="Símbolo" /><Encabezado texto="Último Operado" /><Encabezado texto="Variación Diaria" />
                  <Encabezado texto="Cantidad Compra" className="qbid" /><Encabezado texto="Precio Compra" className="bid" />
                  <Encabezado texto="Precio Venta" className="ask" /><Encabezado texto="Cantidad Venta" className="qask" />
                  <Encabezado texto="Apertura" /><Encabezado texto="Mínimo" /><Encabezado texto="Máximo" />
                  <Encabezado texto="Último Cierre" /><Encabezado texto="Monto Operado" />
                  <th /><th />
                </tr>
              </thead>
              <tbody>
                {especies.map((i) => {
                  const m = datosMercado(i, dia)
                  return (
                    <tr key={i.id} className={i.variacion >= 0 ? 'up' : 'dn'} data-tour={`inst-${i.id}`} style={{ cursor: 'pointer' }}
                      onClick={() => verActivo(i.id)}>
                      <td className="sim">
                        <span className="simwrap">
                          <span className="simico">🏛</span>
                          <span>
                            <span className="simtk">{i.id} <span className="tipo-badge">{ETIQUETA_TIPO[i.tipo]}</span></span>
                            <span className="simnm">{i.nombre}</span>
                          </span>
                        </span>
                      </td>
                      <td className="num2">{nf(m.px)}</td>
                      <td><Variacion v={i.variacion} /></td>
                      <td className="num2 qbid">{nf(m.qBid, 0)}</td>
                      <td className="num2 bid">{nf(m.bid)}</td>
                      <td className="num2 ask">{nf(m.ask)}</td>
                      <td className="num2 qask">{nf(m.qAsk, 0)}</td>
                      <td className="num2">{nf(m.apertura)}</td>
                      <td className="num2">{nf(m.min)}</td>
                      <td className="num2">{nf(m.max)}</td>
                      <td className="num2">{nf(m.cierre)}</td>
                      <td className="num2">{nf(m.monto, 0)}</td>
                      <td>
                        <span className="lnkcomprar" onClick={(e) => { e.stopPropagation(); prepararCompra(i.id) }}>Comprar</span>
                      </td>
                      <td><BotonProximamente tema="favoritoEspecie" className="starbtn">☆</BotonProximamente></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {cot.tab === 'on' && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
                <p className="hint">Las obligaciones negociables cotizan por cada 100 valores nominales (VN) y en dólares. El precio de la columna “Último Operado” no es el de un dólar invertido, y solo se puede comprar en múltiplos de la lámina mínima.</p>
              </div>
            )}
            <div style={{ padding: '11px 16px', borderTop: '1px solid var(--line)' }}>
              <p className="hint">
                <strong>Precio Compra</strong> es lo máximo que alguien está dispuesto a pagar ahora; <strong>Precio Venta</strong>, lo mínimo que alguien pide.
                {' '}Una orden a mercado se ejecuta contra esas puntas, no contra el “Último Operado”.
              </p>
            </div>
          </>
        ) : (
          <div className="empty">No hay especies que coincidan con “{filtro}”.</div>
        )}
      </div>
    </section>
  )
}
