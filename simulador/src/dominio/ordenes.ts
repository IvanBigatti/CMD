import { dinero, nf, parseNumero } from './formato'
import { costos, precioMercado } from './mercado'
import type { Aviso, Instrumento, Lado, Modalidad, Moneda, Orden, Plazo, Posicion, Saldos } from './tipos'

export interface DatosOrden {
  lado: Lado
  instrumento: Instrumento | null
  /** Solo compra: se eligió el mercado de Estados Unidos */
  mercadoEeuu?: boolean
  plazo: Plazo
  modalidad: Modalidad
  limite: string
  /** Solo compra: la cantidad se pide por monto en vez de por unidades */
  porMonto?: boolean
  cantidad: string
  monto?: string
}

export interface ContextoOrden {
  saldo: Saldos
  posiciones: Record<string, Posicion>
  mercadoAbierto: boolean
  dia: number
}

export type ResultadoOrden =
  | { tipo: 'ok'; orden: Orden }
  | { tipo: 'error'; aviso: Aviso }
  /** Orden límite muy lejos del mercado: se envía pero queda sin ejecutar */
  | { tipo: 'sinEjecutar'; aviso: Aviso; movimiento: { titulo: string; detalle: string; moneda: Moneda } }

const error = (texto: string): ResultadoOrden => ({
  tipo: 'error',
  aviso: { tono: 'bad', titulo: 'No se puede enviar la orden', texto },
})

/** Valida una orden y calcula su costo, sin ejecutarla */
export function armarOrden(d: DatosOrden, ctx: ContextoOrden): ResultadoOrden {
  const esCompra = d.lado === 'compra'
  const i = d.instrumento

  if (esCompra && d.mercadoEeuu)
    return error('El mercado de Estados Unidos estará disponible próximamente. Por ahora elegí Argentina.')
  if (!i) return error('Elegí un símbolo válido.')
  if (!ctx.mercadoAbierto) return error('El mercado está cerrado. Tu orden quedaría **pendiente** hasta la próxima rueda.')

  const contadoInmediato = d.plazo === 'ci'
  const mkt = precioMercado(i, d.lado, ctx.dia)
  const px = d.modalidad === 'limite' ? parseNumero(d.limite) : mkt
  if (d.modalidad === 'limite' && px <= 0) return error('Ingresá un precio límite mayor a cero.')

  let cantidad: number
  if (esCompra && d.porMonto) {
    const monto = parseNumero(d.monto ?? '')
    if (monto <= 0) return error('Ingresá un monto mayor a cero.')
    cantidad = i.tipo === 'on'
      ? Math.floor(monto / (px / 100) / i.laminaMinima) * i.laminaMinima
      : Math.floor(monto / px)
    if (cantidad <= 0)
      return error(i.tipo === 'on'
        ? `Con ${dinero(monto, i.moneda)} no alcanza para la lámina mínima de ${nf(i.laminaMinima, 0)} VN de ${i.id}, que cuesta ${dinero((i.laminaMinima * px) / 100, i.moneda)}.`
        : `Con ${dinero(monto, i.moneda)} no alcanza ni para una unidad de ${i.id}, que cotiza ${dinero(px, i.moneda)}.`)
  } else {
    cantidad = parseNumero(d.cantidad)
  }
  if (cantidad <= 0) return error('Ingresá una cantidad mayor a cero.')
  if (i.tipo === 'on' && cantidad % i.laminaMinima !== 0) {
    const sugerida = Math.max(i.laminaMinima, Math.round(cantidad / i.laminaMinima) * i.laminaMinima)
    return error(`Esta obligación negociable se opera en múltiplos de **${nf(i.laminaMinima, 0)} VN**. Probá con ${nf(sugerida, 0)} VN. Acordate: la cantidad va en valores nominales, no en dólares.`)
  }

  const bruto = i.tipo === 'on' ? (cantidad * px) / 100 : cantidad * px
  const c = costos(bruto, i.tipo)
  const total = esCompra ? bruto + c.total : bruto - c.total

  if (esCompra) {
    const s = ctx.saldo[i.moneda]
    const disponible = contadoInmediato ? s.disponible : s.disponible + s.aLiquidar
    if (total > disponible)
      return error(`Necesitás ${dinero(total, i.moneda)} y tenés ${dinero(disponible, i.moneda)} disponibles para operaciones en ${contadoInmediato ? 'contado inmediato' : '24 hs'}${i.moneda === 'USD' ? '. Comprá dólar MEP primero.' : '.'}`)
    if (d.modalidad === 'limite' && px < mkt * 0.985)
      return {
        tipo: 'sinEjecutar',
        aviso: {
          tono: 'warn',
          titulo: 'La orden se envía pero no se ejecuta',
          texto: `Pusiste un precio límite de ${dinero(px, i.moneda)} y el mercado está en ${dinero(mkt, i.moneda)}. Tu orden queda esperando a alguien que venda a ese precio, y puede no ejecutarse nunca.`,
        },
        movimiento: { titulo: `Orden de compra ${i.id}`, detalle: `Límite ${dinero(px, i.moneda)} — sin ejecutar`, moneda: i.moneda },
      }
  } else {
    const p = ctx.posiciones[i.id]
    if (!p || cantidad > p.cantidad)
      return error(`Tenés ${nf(p?.cantidad ?? 0, 0)} ${i.tipo === 'on' ? 'VN' : 'unidades'} en cartera.`)
  }

  return {
    tipo: 'ok',
    orden: { lado: d.lado, instrumento: { ...i }, cantidad, precio: px, bruto, costos: c, total, contadoInmediato, modalidad: d.modalidad },
  }
}
