import type { Moneda } from './tipos'

const formatos = new Map<number, Intl.NumberFormat>()

/** Número con formato argentino (1.234,56) */
export function nf(n: number | undefined, decimales = 2): string {
  let f = formatos.get(decimales)
  if (!f) {
    f = new Intl.NumberFormat('es-AR', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
    formatos.set(decimales, f)
  }
  return f.format(n || 0)
}

export const dinero = (n: number, m: Moneda) => (m === 'USD' ? 'US$ ' : '$ ') + nf(n)
export const dineroAR = (n: number, m: Moneda) => (m === 'USD' ? 'US$ ' : 'AR$ ') + nf(n)

/** Lee lo que el usuario escribió en un campo numérico ("1.234,5" → 1234.5) */
export function parseNumero(valor: string): number {
  return parseFloat(String(valor).replace(/\./g, '').replace(',', '.')) || 0
}
