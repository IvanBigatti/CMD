/** Persona simulada: titular de la cuenta comitente del simulador */

export type OrigenFondos = 'propia' | 'tercero'

export interface CuentaBancaria {
  id: OrigenFondos
  banco: string
  tipo: string
  titular: string
  /** Si comparte CUIT con el titular de la cuenta comitente */
  mismoTitular: boolean
}

export const PERSONA = {
  nombreSaludo: 'Julián Andrés',
  nombreCompleto: 'Julián A. Ferreyra',
  comitente: '418.203',
  alias: 'rueda.ferreyra.ars',
  custodia: 'Caja de Valores',
  /** Cuentas desde las que se puede intentar fondear la comitente */
  cuentasOrigen: [
    { id: 'propia', banco: 'Banco Nación', tipo: 'Caja de ahorro $', titular: 'Julián A. Ferreyra', mismoTitular: true },
    { id: 'tercero', banco: 'Banco Galicia', tipo: 'Caja de ahorro $', titular: 'María G. Suárez', mismoTitular: false },
  ] satisfies CuentaBancaria[],
  /** Cuenta destino de los retiros, por moneda */
  cuentaRetiro: {
    ARS: 'Banco Nación · Caja de ahorro $',
    USD: 'Banco Nación · Caja de ahorro US$',
  },
  bancoRetiro: 'Banco Nación',
}
