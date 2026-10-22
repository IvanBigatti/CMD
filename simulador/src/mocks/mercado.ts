/** Datos de mercado simulados que no dependen de un instrumento puntual */

/** Precio del AL30 en pesos y del AL30D en dólares (cada 100 VN): las dos patas del dólar MEP */
export const AL30_ARS = 73852
export const AL30D_USD = 49.9
export const TC_MEP = AL30_ARS / AL30D_USD

/** Día 0 del reloj simulado: lunes 14 de septiembre de 2026 */
export const FECHA_INICIO: [number, number, number] = [2026, 8, 14]
export const HORA_SIMULADA = '11:42'

export const INDICES_BASE = { merval: 2933614, bolsa: 128374590 }
