import { HORA_SIMULADA } from '../mocks/mercado'

const [H0, M0] = HORA_SIMULADA.split(':').map(Number)
const SEGUNDOS_INICIO = H0 * 3600 + M0 * 60
const CIERRE = 17 * 3600

/** Reloj de la rueda, fuera de React: sigue corriendo aunque salgas y vuelvas al simulador */
const reloj = { segundos: SEGUNDOS_INICIO }

/** Cada día hábil nuevo la rueda arranca otra vez a la misma hora */
export function reiniciarReloj() {
  reloj.segundos = SEGUNDOS_INICIO
}

export function avanzarReloj() {
  reloj.segundos = Math.min(reloj.segundos + 1, CIERRE)
}

const dos = (n: number) => String(n).padStart(2, '0')

/** "11:42:07" */
export function horaReloj(): string {
  const s = reloj.segundos
  return `${dos(Math.floor(s / 3600))}:${dos(Math.floor(s / 60) % 60)}:${dos(s % 60)}`
}
