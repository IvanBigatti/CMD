export type ModoCortina = 'entrar' | 'entrar-corta' | 'salir'

const CLAVE_VISTA = 'cortina-simulador-vista'
let vistaEnMemoria = false

/** La primera entrada de la sesión muestra la cortina completa; las siguientes, la corta */
export function modoDeEntrada(): ModoCortina {
  if (vistaEnMemoria) return 'entrar-corta'
  try {
    if (sessionStorage.getItem(CLAVE_VISTA)) return 'entrar-corta'
  } catch { /* sin sessionStorage: usamos solo la memoria */ }
  return 'entrar'
}

export function marcarCortinaVista() {
  vistaEnMemoria = true
  try { sessionStorage.setItem(CLAVE_VISTA, '1') } catch { /* nada */ }
}
