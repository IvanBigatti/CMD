/**
 * Código anónimo de quien usa el sitio en este navegador.
 * Sirve para unir sus resultados (autoevaluación antes y después, cuestionario y desafío) sin pedir registro.
 * Si el navegador no deja guardar, vale solo para esta visita.
 */

const CLAVE_LS = 'simulador.participante'
let enMemoria: string | null = null

function nuevoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

export function idParticipante(): string {
  if (enMemoria) return enMemoria
  try {
    const guardado = localStorage.getItem(CLAVE_LS)
    if (guardado) return (enMemoria = guardado)
  } catch { /* sin almacenamiento */ }
  enMemoria = nuevoId()
  try { localStorage.setItem(CLAVE_LS, enMemoria) } catch { /* sin almacenamiento */ }
  return enMemoria
}
