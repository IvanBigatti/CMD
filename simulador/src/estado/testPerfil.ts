import type { NivelRiesgo } from '../dominio/tipos'
import { PERFILES, TEST_PERFIL } from '../mocks/perfiles'
import { useSimulador } from './simulador'
import { useUi } from './ui'

export function abrirTestPerfil() {
  useUi.getState().abrirModal({ tipo: 'testPerfil', pregunta: 0, suma: 0 })
}

/** Registra una respuesta y pasa a la siguiente pregunta (o muestra el resultado) */
export function responderTest(pregunta: number, suma: number, valor: NivelRiesgo) {
  const ui = useUi.getState()
  const total = suma + valor
  const siguiente = pregunta + 1
  ui.cerrarModal()
  setTimeout(() => {
    if (siguiente < TEST_PERFIL.length) {
      ui.abrirModal({ tipo: 'testPerfil', pregunta: siguiente, suma: total })
      return
    }
    const perfil = Math.max(1, Math.min(3, Math.round(total / TEST_PERFIL.length))) as NivelRiesgo
    useSimulador.getState().setPerfil(perfil)
    ui.mensaje({
      titulo: 'Tu perfil de inversor',
      parrafo: `Sos **${PERFILES[perfil].nombre}**. ${PERFILES[perfil].descripcion}.`,
      avisos: [{
        tono: 'info', titulo: 'Qué hace el perfil',
        texto: 'Ordena las sugerencias y te avisa cuando un activo es más riesgoso de lo que declaraste. En la plataforma real **no te bloquea**.',
      }],
      eyebrow: 'Test completado',
    })
  }, 180)
}
