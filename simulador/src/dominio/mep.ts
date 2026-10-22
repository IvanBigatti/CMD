import { AL30D_USD, AL30_ARS } from '../mocks/mercado'

export type ModoMep = 'compra' | 'venta'

export interface CalculoMep {
  /** Valores nominales de AL30 que se operan */
  vn: number
  /** Lo que entrega el cliente (pesos en la compra, dólares en la venta) */
  entrega: number
  /** Lo que recibe el cliente */
  recibe: number
  tipoDeCambio: number
}

/** Dólar MEP: dos patas de AL30 / AL30D en Contado Inmediato */
export function calcularMep(modo: ModoMep, monto: number): CalculoMep {
  if (modo === 'venta') {
    const vn = Math.floor(monto / (AL30D_USD / 100))
    const entrega = (vn * AL30D_USD) / 100
    const recibe = (vn * AL30_ARS) / 100
    return { vn, entrega, recibe, tipoDeCambio: recibe / (entrega || 1) }
  }
  const vn = Math.floor(monto / (AL30_ARS / 100))
  const entrega = (vn * AL30_ARS) / 100
  const recibe = (vn * AL30D_USD) / 100
  return { vn, entrega, recibe, tipoDeCambio: entrega / (recibe || 1) }
}
