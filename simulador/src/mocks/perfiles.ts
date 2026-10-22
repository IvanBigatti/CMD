import type { NivelRiesgo } from '../dominio/tipos'

export const PERFILES: Record<NivelRiesgo, { nombre: string; descripcion: string }> = {
  1: { nombre: 'Conservador', descripcion: 'Priorizás no perder capital por sobre el rendimiento' },
  2: { nombre: 'Moderado', descripcion: 'Aceptás algo de volatilidad a cambio de mayor rendimiento' },
  3: { nombre: 'Agresivo', descripcion: 'Tolerás caídas fuertes buscando el máximo rendimiento' },
}

export interface PreguntaTest {
  pregunta: string
  opciones: { texto: string; valor: NivelRiesgo }[]
}

export const TEST_PERFIL: PreguntaTest[] = [
  {
    pregunta: 'Si tu inversión cae 15% en un mes, ¿qué hacés?',
    opciones: [
      { texto: 'Vendo todo, no puedo dormir', valor: 1 },
      { texto: 'Espero, pero me preocupa', valor: 2 },
      { texto: 'Compro más, está barato', valor: 3 },
    ],
  },
  {
    pregunta: '¿En cuánto tiempo vas a necesitar esta plata?',
    opciones: [
      { texto: 'Menos de un año', valor: 1 },
      { texto: 'Entre uno y tres años', valor: 2 },
      { texto: 'Más de tres años', valor: 3 },
    ],
  },
  {
    pregunta: '¿Qué preferís?',
    opciones: [
      { texto: 'Ganar poco y seguro', valor: 1 },
      { texto: 'Ganar más aceptando altibajos', valor: 2 },
      { texto: 'Buscar el máximo rendimiento', valor: 3 },
    ],
  },
]
