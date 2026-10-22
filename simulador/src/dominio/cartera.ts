import { TC_MEP } from '../mocks/mercado'
import { montoOperado } from './mercado'
import type { Instrumento, Moneda, Posicion, Saldos } from './tipos'

type Posiciones = Record<string, Posicion>
type Instrumentos = Record<string, Instrumento>

const convertir = (monto: number, de: Moneda, a: Moneda) =>
  de === a ? monto : a === 'ARS' ? monto * TC_MEP : monto / TC_MEP

const totalSaldo = (s: Saldos[Moneda]) => s.disponible + s.comprometido + s.aLiquidar

/** Saldos (las dos monedas) + tenencia valuada a mercado, expresado en una moneda */
export function valorCartera(saldo: Saldos, posiciones: Posiciones, inst: Instrumentos, mon: Moneda): number {
  const otra: Moneda = mon === 'ARS' ? 'USD' : 'ARS'
  let total = totalSaldo(saldo[mon]) + convertir(totalSaldo(saldo[otra]), otra, mon)
  for (const [id, p] of Object.entries(posiciones)) {
    const i = inst[id]
    total += convertir(montoOperado(i, p.cantidad), i.moneda, mon)
  }
  return total
}

/** Costo de una posición al precio promedio de compra */
export function costoPosicion(i: Instrumento, p: Posicion): number {
  return (p.cantidad * p.precioPromedio) / (i.tipo === 'on' ? 100 : 1)
}

/** Resultado no realizado de toda la tenencia */
export function resultadoCartera(posiciones: Posiciones, inst: Instrumentos, mon: Moneda): number {
  let resultado = 0
  for (const [id, p] of Object.entries(posiciones)) {
    const i = inst[id]
    resultado += convertir(montoOperado(i, p.cantidad) - costoPosicion(i, p), i.moneda, mon)
  }
  return resultado
}
