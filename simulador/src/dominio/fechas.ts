import { FECHA_INICIO } from '../mocks/mercado'

const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

/** Fecha del reloj simulado, salteando sábados y domingos. `extra` suma días hábiles. */
export function fechaSimulada(dia: number, extra = 0): Date {
  const [anio, mes, diaMes] = FECHA_INICIO
  const d = new Date(anio, mes, diaMes)
  let n = dia + extra
  while (n > 0) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) n--
  }
  return d
}

const dos = (n: number) => String(n).padStart(2, '0')

/** "LUN 14 SEP" */
export const formatoDia = (d: Date) => `${DIAS[d.getDay()]} ${dos(d.getDate())} ${MESES[d.getMonth()]}`

/** "14/09/2026" */
export const formatoFecha = (d: Date) => `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`
