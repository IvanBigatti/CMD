import { INDICES_BASE, TC_MEP } from '../mocks/mercado'
import type { Costos, Instrumento, Lado, TipoInstrumento } from './tipos'

/** Último precio en la moneda en que se opera. CEDEAR = (precio USD / ratio) × TC. */
export function precio(i: Instrumento): number {
  return i.tipo === 'cedear' ? (i.precioUsd / i.ratio) * TC_MEP : i.precio
}

/** Monto de una cantidad dada. Las ON cotizan cada 100 VN. */
export function montoOperado(i: Instrumento, cantidad: number, px = precio(i)): number {
  return i.tipo === 'on' ? (cantidad * px) / 100 : cantidad * px
}

const COMISION: Record<TipoInstrumento, number> = { accion: 0.005, cedear: 0.005, on: 0.0025 }

/** Comisión sobre monto operado + derechos de mercado + IVA 21% */
export function costos(monto: number, tipo: TipoInstrumento): Costos {
  const comision = monto * (COMISION[tipo] ?? 0.005)
  const derechos = monto * 0.0008
  const iva = (comision + derechos) * 0.21
  return { comision, derechos, iva, total: comision + derechos + iva }
}

/** Semilla determinística a partir de un texto */
export function semilla(texto: string): number {
  let h = 0
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) % 100000
  return h
}

export interface DatosMercado {
  px: number
  bid: number
  ask: number
  cierre: number
  apertura: number
  max: number
  min: number
  qBid: number
  qAsk: number
  monto: number
  tick: number
  spread: number
}

/** Datos de la rueda derivados del precio (determinísticos por especie y día) */
export function datosMercado(i: Instrumento, dia: number): DatosMercado {
  const px = precio(i)
  const s = semilla(i.id) + dia * 37
  const r = (n: number) => ((s * 9301 + 49297 * n) % 233280) / 233280
  const tick = i.moneda === 'USD' ? 0.01 : px > 1000 ? 10 : 0.01
  const spread = Math.max(tick, px * 0.0011)
  const bid = px - spread / 2
  const ask = px + spread / 2
  const cierre = px / (1 + i.variacion / 100)
  const apertura = cierre * (1 + (r(1) - 0.5) * 0.008)
  const max = Math.max(px, apertura) * (1 + r(2) * 0.006)
  const min = Math.min(px, apertura) * (1 - r(3) * 0.006)
  const qBid = Math.round(40 + r(4) * 900)
  const qAsk = Math.round(40 + r(5) * 900)
  const monto = Math.round(px * (500 + r(6) * 9000))
  return { px, bid, ask, cierre, apertura, max, min, qBid, qAsk, monto, tick, spread }
}

export interface Punta {
  cantidad: number
  precio: number
}

/** Cinco niveles de la caja de puntas */
export function cajaDePuntas(i: Instrumento, dia: number): { compra: Punta[]; venta: Punta[] } {
  const m = datosMercado(i, dia)
  const compra: Punta[] = []
  const venta: Punta[] = []
  for (let k = 0; k < 5; k++) {
    const s = semilla(i.id) + k * 13 + dia
    const r = ((s * 9301 + 49297) % 233280) / 233280
    compra.push({ cantidad: Math.round(30 + r * 1200), precio: m.bid - k * m.tick })
    venta.push({ cantidad: Math.round(30 + ((r * 7) % 1) * 1200), precio: m.ask + k * m.tick })
  }
  return { compra, venta }
}

/** Una orden a mercado se ejecuta contra la punta: compra al precio de venta, venta al de compra */
export function precioMercado(i: Instrumento, lado: Lado, dia: number): number {
  const m = datosMercado(i, dia)
  return lado === 'compra' ? m.ask : m.bid
}

export interface Indice {
  nombre: string
  valor: number
  variacion: number
}

export function indices(dia: number): Indice[] {
  const merval = INDICES_BASE.merval * (1 + (((semilla('MERVAL') + dia * 17) % 400) - 200) / 40000)
  const bolsa = INDICES_BASE.bolsa * (1 + (((semilla('BOLSA') + dia * 23) % 400) - 200) / 40000)
  const vMerval = (((semilla('MV') + dia * 11) % 300) - 150) / 100
  const vBolsa = (((semilla('BO') + dia * 7) % 300) - 150) / 100
  return [
    { nombre: 'Merval', valor: merval, variacion: vMerval },
    { nombre: 'Bolsa', valor: bolsa, variacion: vBolsa },
  ]
}

export interface OperacionIntradiaria {
  hora: string
  precio: number
  monto: number
  volumen: number
}

const HORAS_INTRADIARIAS = ['12:34', '12:24', '12:24', '12:18', '12:07']

export function operacionesIntradiarias(i: Instrumento, dia: number): OperacionIntradiaria[] {
  const m = datosMercado(i, dia)
  return HORAS_INTRADIARIAS.map((hora, k) => {
    const r = (((semilla(i.id) + k * 31) % 200) - 100) / 100
    const px = m.px * (1 + r / 1000)
    const volumen = Math.round(1 + ((semilla(i.id) + k * 7) % 120))
    return { hora, precio: px, monto: px * volumen, volumen }
  })
}

/** Serie simulada para el gráfico intradiario (puntos en un lienzo de 100×100) */
export function serieIntradiaria(seed: number, puntos = 48): [number, number][] {
  let v = 50
  let s = seed
  const out: [number, number][] = []
  for (let k = 0; k < puntos; k++) {
    s = (s * 9301 + 49297) % 233280
    v += (s / 233280 - 0.48) * 7
    v = Math.max(14, Math.min(86, v))
    out.push([(k / (puntos - 1)) * 100, 100 - v])
  }
  return out
}

/** Al avanzar un día hábil los precios se mueven al azar (muta el objeto recibido) */
export function moverPrecio(i: Instrumento): void {
  const d = (Math.random() - 0.47) * 2.4
  i.variacion = +(i.variacion * 0.4 + d).toFixed(2)
  if (i.tipo === 'cedear') i.precioUsd = +(i.precioUsd * (1 + d / 100)).toFixed(2)
  else i.precio = +(i.precio * (1 + d / 100)).toFixed(i.tipo === 'on' ? 2 : 0)
}
