import { EVALUACIONES } from '../../contenido/evaluaciones'
import { fechaSimulada, formatoDia } from '../../dominio/fechas'
import { useDesafio, verificarDesafio } from '../../estado/desafio'
import { useSimulador } from '../../estado/simulador'
import { abrirSelectorItinerarios, useGuia } from '../../guia/estadoGuia'
import { useRelojMercado } from '../../estado/useMercadoVivo'

/** Franja amarilla: modo capacitación, progreso de la guía (o consigna del desafío), estado del mercado y reloj simulado */
export function FranjaCapacitacion() {
  const dia = useSimulador((s) => s.dia)
  const abierto = useSimulador((s) => s.mercadoAbierto)
  const avanzarDia = useSimulador((s) => s.avanzarDia)
  const hora = useRelojMercado()
  const progreso = useGuia((s) => s.progreso)
  const estado = useGuia((s) => s.estado)
  const desafio = useDesafio((s) => s.clave)
  return (
    <div className="strip">
      <span>● Modo capacitación · dinero y precios ficticios</span>
      {desafio ? (
        <span className="desafio-franja">
          <b>Desafío:</b> {EVALUACIONES[desafio].desafio.consigna}
        </span>
      ) : estado !== 'sin guía' && (
        <span className="prog">
          <span className="barra" aria-hidden="true"><i style={{ width: `${progreso}%` }} /></span>
          <span>Guía: {estado}</span>
        </span>
      )}
      <span className="sp" />
      <span className={`mkt${abierto ? '' : ' cerrado'}`}>
        <span className="dot" />
        <span>{abierto ? 'Mercado abierto' : 'Mercado cerrado'}</span>
      </span>
      <span className="mono">{formatoDia(fechaSimulada(dia))} · {hora}</span>
      <button type="button" data-tour="reloj-avanzar" onClick={avanzarDia}>Avanzar 1 día hábil</button>
      {desafio && <button type="button" className="verificar" onClick={verificarDesafio}>Verificar desafío</button>}
      <button type="button" className="cambiar" onClick={abrirSelectorItinerarios}>Cambiar capacitación</button>
    </div>
  )
}
