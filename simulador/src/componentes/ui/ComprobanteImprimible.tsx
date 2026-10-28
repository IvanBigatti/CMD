import { createPortal } from 'react-dom'
import logo from '../../assets/logo-nombre.png'
import { dinero, nf } from '../../dominio/formato'
import type { Boleto, TipoInstrumento } from '../../dominio/tipos'
import { PERSONA } from '../../mocks/persona'

const TIPO: Record<TipoInstrumento, string> = { accion: 'Acción', cedear: 'CEDEAR', on: 'Obligación Negociable' }

function Fila({ k, v }: { k: string; v: string }) {
  return <tr><th>{k}</th><td>{v}</td></tr>
}

/**
 * Comprobante del boleto con formato de documento.
 * Está oculto en pantalla: solo aparece al imprimir o guardar como PDF.
 */
export function ComprobanteImprimible({ boleto: b }: { boleto: Boleto }) {
  const m = b.instrumento.moneda
  const unidad = b.instrumento.tipo === 'on' ? 'VN' : 'unidades'
  const operacion = b.lado === 'compra' ? 'compra' : 'venta'

  return createPortal(
    <div className="comprobante-print">
      <div className="cp-agua" aria-hidden="true">SIMULACIÓN · SIN VALIDEZ</div>

      <header className="cp-cabecera">
        <img src={logo} alt="InvertirOnline" width={150} height={45} />
        <div className="cp-cabecera-der">
          <span className="cp-etiqueta">Simulador de capacitación</span>
          <span>Emitido el {b.fechaConcertacion}</span>
        </div>
      </header>

      <div className="cp-titulo">
        <h1>Boleto de {operacion}</h1>
        <span className="cp-numero">Nº {b.numero}</span>
      </div>

      <section>
        <h2>Comitente</h2>
        <table className="cp-tabla">
          <tbody>
            <Fila k="Titular" v={PERSONA.nombreCompleto} />
            <Fila k="Cuenta comitente" v={PERSONA.comitente} />
            <Fila k="Agente de custodia" v={PERSONA.custodia} />
          </tbody>
        </table>
      </section>

      <section>
        <h2>Operación</h2>
        <table className="cp-tabla">
          <tbody>
            <Fila k="Especie" v={`${b.instrumento.id} · ${b.instrumento.nombre}`} />
            <Fila k="Tipo de instrumento" v={TIPO[b.instrumento.tipo]} />
            <Fila k="Mercado" v="BYMA · Bolsas y Mercados Argentinos" />
            <Fila k="Modalidad" v={b.modalidad === 'mercado' ? 'A mercado' : 'Precio límite'} />
            <Fila k="Plazo" v={b.contadoInmediato ? 'Contado inmediato (CI)' : '24 hs (T+1)'} />
            <Fila k="Cantidad" v={`${nf(b.cantidad, 0)} ${unidad}`} />
            <Fila k="Precio" v={dinero(b.precio, m)} />
            <Fila k="Fecha de concertación" v={b.fechaConcertacion} />
            <Fila k="Fecha de liquidación" v={b.fechaLiquidacion} />
          </tbody>
        </table>
      </section>

      <section>
        <h2>Liquidación</h2>
        <table className="cp-tabla cp-numeros">
          <tbody>
            <Fila k="Monto bruto" v={dinero(b.bruto, m)} />
            <Fila k="Comisión" v={dinero(b.costos.comision, m)} />
            <Fila k="Derechos de mercado" v={dinero(b.costos.derechos, m)} />
            <Fila k="IVA 21%" v={dinero(b.costos.iva, m)} />
          </tbody>
          <tfoot>
            <tr><th>Total {b.lado === 'compra' ? 'debitado' : 'acreditado'}</th><td>{dinero(b.total, m)}</td></tr>
          </tfoot>
        </table>
      </section>

      <footer className="cp-pie">
        Documento generado por un simulador con fines educativos. No corresponde a una operación real ni tiene validez comercial.
        Los precios, saldos y datos del titular son ficticios.
      </footer>
    </div>,
    document.body,
  )
}
