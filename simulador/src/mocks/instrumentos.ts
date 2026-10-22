import type { Instrumento } from '../dominio/tipos'

/** Las ocho especies del simulador, con precios ficticios */
export const INSTRUMENTOS: Record<string, Instrumento> = {
  GGAL: { id: 'GGAL', nombre: 'Grupo Financiero Galicia', tipo: 'accion', moneda: 'ARS', precio: 7450, variacion: 2.31, riesgo: 3,
    descripcion: 'Banco privado líder del sistema financiero argentino.' },
  YPFD: { id: 'YPFD', nombre: 'YPF S.A.', tipo: 'accion', moneda: 'ARS', precio: 48200, variacion: -1.14, riesgo: 3,
    descripcion: 'Principal productora de petróleo y gas del país.' },
  PAMP: { id: 'PAMP', nombre: 'Pampa Energía', tipo: 'accion', moneda: 'ARS', precio: 3980, variacion: 0.82, riesgo: 3,
    descripcion: 'Generación eléctrica y producción de gas.' },
  AAPL: { id: 'AAPL', nombre: 'Apple Inc.', tipo: 'cedear', moneda: 'ARS', precioUsd: 228.4, ratio: 20, variacion: 1.42, riesgo: 2,
    descripcion: 'CEDEAR de Apple, que cotiza en el Nasdaq.' },
  KO: { id: 'KO', nombre: 'Coca-Cola Company', tipo: 'cedear', moneda: 'ARS', precioUsd: 71.2, ratio: 5, variacion: 0.34, riesgo: 2,
    descripcion: 'CEDEAR de Coca-Cola, que cotiza en el NYSE.' },
  TSLA: { id: 'TSLA', nombre: 'Tesla Inc.', tipo: 'cedear', moneda: 'ARS', precioUsd: 342.9, ratio: 15, variacion: -2.61, riesgo: 3,
    descripcion: 'CEDEAR de Tesla. Históricamente muy volátil.' },
  YMCJO: { id: 'YMCJO', nombre: 'YPF ON Clase XXXIX', tipo: 'on', moneda: 'USD', precio: 99.4, variacion: 0.08, riesgo: 1,
    laminaMinima: 100, tna: 8.5, vencimiento: '2031', renta: 'Semestral · marzo y septiembre',
    descripcion: 'Deuda de YPF en dólares, con pago de interés dos veces por año.' },
  PNDCO: { id: 'PNDCO', nombre: 'Pan American Energy ON', tipo: 'on', moneda: 'USD', precio: 101.2, variacion: -0.12, riesgo: 1,
    laminaMinima: 1000, tna: 7.75, vencimiento: '2030', renta: 'Semestral · mayo y noviembre',
    descripcion: 'Deuda de Pan American Energy en dólares. Lámina mínima alta.' },
}

/** Texto de ayuda cuando no se encuentra un símbolo */
export const SIMBOLOS_SUGERIDOS = 'KO, AAPL, TSLA, GGAL, YPFD, PAMP, YMCJO o PNDCO'
