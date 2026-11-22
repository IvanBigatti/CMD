import type { ReactNode } from 'react'
import { dinero, nf } from '../../dominio/formato'
import { fechaSimulada, formatoFecha } from '../../dominio/fechas'
import { useSimulador } from '../../estado/simulador'
import { responderTest } from '../../estado/testPerfil'
import { useUi, type ModalMensaje } from '../../estado/ui'
import { abrirSelectorItinerarios } from '../../guia/estadoGuia'
import { PERFILES, TEST_PERFIL } from '../../mocks/perfiles'
import { AvisoCaja } from '../ui/AvisoCaja'
import { TextoRico } from '../ui/TextoRico'
import { ModalResena } from './ModalResena'

function Hoja({ eyebrow, titulo, boton, alTocarBoton, children }: {
  eyebrow: string; titulo: string; boton: string; alTocarBoton: () => void; children: ReactNode
}) {
  const cerrar = useUi((s) => s.cerrarModal)
  return (
    <div className="veil" onClick={(e) => { if (e.target === e.currentTarget) cerrar() }}>
      <div className="sheet" role="dialog" aria-modal="true">
        <span className="eyebrow">{eyebrow}</span>
        <h3>{titulo}</h3>
        <div className="cuerpo-modal">{children}</div>
        <button type="button" className="btn-o w" onClick={alTocarBoton}>{boton}</button>
      </div>
    </div>
  )
}

function Mensaje({ m }: { m: ModalMensaje }) {
  const alTocar = () => {
    useUi.getState().cerrarModal()
    if (!m.alCerrar) return
    if ('ir' in m.alCerrar) useSimulador.getState().irA(m.alCerrar.ir)
    else abrirSelectorItinerarios()
  }
  return (
    <Hoja eyebrow={m.eyebrow} titulo={m.titulo} boton={m.boton} alTocarBoton={alTocar}>
      {m.parrafo && <p><TextoRico texto={m.parrafo} /></p>}
      {m.avisos?.map((a, k) => <AvisoCaja key={k} aviso={a} />)}
    </Hoja>
  )
}

/** Paso 2 de 2: detalle de la orden con el desglose de costos */
function ConfirmarOrden() {
  const o = useSimulador((s) => s.ordenPendiente)
  const perfil = useSimulador((s) => s.perfil)
  const dia = useSimulador((s) => s.dia)
  const ejecutar = useSimulador((s) => s.ejecutarOrden)
  const cerrar = useUi((s) => s.cerrarModal)
  if (!o) return null
  const esCompra = o.lado === 'compra'
  const i = o.instrumento
  const m = i.moneda
  return (
    <Hoja eyebrow="Paso 2 de 2 · revisá antes de enviar" titulo={`Confirmá tu ${esCompra ? 'compra' : 'venta'}`} boton="Cancelar" alTocarBoton={cerrar}>
      <div>
        <div className="kv">
          <div className="r"><span className="k">Especie</span><span className="v texto">{i.id} · {i.nombre}</span></div>
          <div className="r"><span className="k">Cantidad</span><span className="v">{nf(o.cantidad, 0)} {i.tipo === 'on' ? 'VN' : 'un.'}</span></div>
          <div className="r"><span className="k">Precio {o.modalidad === 'limite' ? 'límite' : 'estimado'}</span><span className="v">{dinero(o.precio, m)}</span></div>
          <div className="r"><span className="k">Plazo de liquidación</span><span className="v texto">{o.contadoInmediato ? 'Contado inmediato' : '24 hs (T+1)'}</span></div>
          <div className="r"><span className="k">Liquida el</span><span className="v">{formatoFecha(fechaSimulada(dia, o.contadoInmediato ? 0 : 1))}</span></div>
        </div>
        <div className="kv" style={{ marginTop: 11 }} data-tour="costos-confirmacion">
          <div className="r"><span className="k">Monto bruto</span><span className="v">{dinero(o.bruto, m)}</span></div>
          <div className="r"><span className="k">Comisión</span><span className="v">{dinero(o.costos.comision, m)}</span></div>
          <div className="r"><span className="k">Derechos de mercado</span><span className="v">{dinero(o.costos.derechos, m)}</span></div>
          <div className="r"><span className="k">IVA 21%</span><span className="v">{dinero(o.costos.iva, m)}</span></div>
          <div className="r tot"><span className="k">{esCompra ? 'Total a pagar' : 'Total a recibir'}</span><span className="v">{dinero(o.total, m)}</span></div>
        </div>
      </div>
      {esCompra && i.riesgo > perfil && (
        <AvisoCaja aviso={{ tono: 'warn', titulo: 'Supera tu perfil', texto: `Sos ${PERFILES[perfil].nombre} y este activo es más volátil. Podés seguir igual.` }} />
      )}
      {!esCompra && !o.contadoInmediato && (
        <AvisoCaja aviso={{
          tono: 'info', titulo: 'Ojo con el plazo',
          texto: `Con 24 hs el dinero queda “a liquidar”: lo vas a ver en tu cuenta, pero no lo vas a poder retirar hasta el ${formatoFecha(fechaSimulada(dia, 1))}.`,
        }} />
      )}
      <button type="button" className="btn-s w" style={{ marginTop: 3 }} data-tour="confirmar-orden" onClick={ejecutar}>
        Confirmar {esCompra ? 'compra' : 'venta'}
      </button>
    </Hoja>
  )
}

function TestPerfil({ pregunta, suma }: { pregunta: number; suma: number }) {
  const cerrar = useUi((s) => s.cerrarModal)
  const t = TEST_PERFIL[pregunta]
  return (
    <Hoja eyebrow={`Test de perfil · pregunta ${pregunta + 1} de ${TEST_PERFIL.length}`} titulo={t.pregunta} boton="Cancelar" alTocarBoton={cerrar}>
      <div className="radio">
        {t.opciones.map((o) => (
          <button key={o.texto} type="button" onClick={() => responderTest(pregunta, suma, o.valor)}>
            <span className="bul" /><span><span className="tt">{o.texto}</span></span>
          </button>
        ))}
      </div>
    </Hoja>
  )
}

export function ModalHost() {
  const modal = useUi((s) => s.modal)
  if (!modal) return null
  switch (modal.tipo) {
    case 'mensaje': return <Mensaje m={modal} />
    case 'confirmarOrden': return <ConfirmarOrden />
    case 'testPerfil': return <TestPerfil key={modal.pregunta} pregunta={modal.pregunta} suma={modal.suma} />
    case 'resena': return <ModalResena clave={modal.clave} />
  }
}
