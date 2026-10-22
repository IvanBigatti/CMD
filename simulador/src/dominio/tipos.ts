export type Moneda = 'ARS' | 'USD'
export type TipoInstrumento = 'accion' | 'cedear' | 'on'
/** 1 = conservador, 2 = moderado, 3 = agresivo */
export type NivelRiesgo = 1 | 2 | 3
export type Lado = 'compra' | 'venta'
/** '24' = Normal 24 hs (T+1) · 'ci' = Contado inmediato */
export type Plazo = '24' | 'ci'
export type Modalidad = 'mercado' | 'limite'

export type Pantalla =
  | 'inicio'
  | 'portafolio'
  | 'mercado'
  | 'activo'
  | 'comprar'
  | 'vender'
  | 'boleto'
  | 'ingresar'
  | 'mep'
  | 'retirar'
  | 'movimientos'
  | 'cuenta'

interface InstrumentoBase {
  id: string
  nombre: string
  moneda: Moneda
  /** Variación diaria, en % */
  variacion: number
  riesgo: NivelRiesgo
  descripcion: string
}

export interface Accion extends InstrumentoBase {
  tipo: 'accion'
  precio: number
}

export interface Cedear extends InstrumentoBase {
  tipo: 'cedear'
  /** Precio de la acción subyacente en EE.UU. */
  precioUsd: number
  /** Cantidad de CEDEARs que equivalen a una acción */
  ratio: number
}

export interface ObligacionNegociable extends InstrumentoBase {
  tipo: 'on'
  /** Precio cada 100 valores nominales */
  precio: number
  laminaMinima: number
  tna: number
  vencimiento: string
  renta: string
}

export type Instrumento = Accion | Cedear | ObligacionNegociable

/** Los tres saldos por moneda: el concepto central de la capacitación */
export interface Saldo {
  disponible: number
  comprometido: number
  aLiquidar: number
}
export type Saldos = Record<Moneda, Saldo>

export interface Posicion {
  cantidad: number
  precioPromedio: number
}

export type TonoEstado = 'neutro' | 'ok' | 'pendiente' | 'error'

export interface Movimiento {
  fecha: string
  titulo: string
  detalle: string
  importe: number
  moneda: Moneda
  estado?: { texto: string; tono: TonoEstado }
}

export interface Liquidacion {
  tipo: Lado
  moneda: Moneda
  monto: number
  /** Día hábil simulado en el que se liquida */
  dia: number
}

export interface Costos {
  comision: number
  derechos: number
  iva: number
  total: number
}

export interface Orden {
  lado: Lado
  instrumento: Instrumento
  cantidad: number
  precio: number
  bruto: number
  costos: Costos
  total: number
  contadoInmediato: boolean
  modalidad: Modalidad
}

export interface Boleto extends Orden {
  numero: number
  fechaConcertacion: string
  fechaLiquidacion: string
}

export type TonoAviso = 'bad' | 'warn' | 'info' | 'good'

/** Mensaje en caja de color. `texto` admite **negrita** y saltos de línea (\n). */
export interface Aviso {
  tono: TonoAviso
  titulo: string
  texto: string
}
