import { fechaSimulada, formatoDia } from '../../dominio/fechas'
import { useSimulador } from '../../estado/simulador'
import { abrirSelectorItinerarios, useGuia } from '../../guia/estadoGuia'
import { HORA_SIMULADA } from '../../mocks/mercado'

/** Franja amarilla: modo capacitación, progreso de la guía, estado del mercado y reloj simulado */
export function FranjaCapacitacion() {
  const dia = useSimulador((s) => s.dia)
  const abierto = useSimulador((s) => s.mercadoAbierto)
  const avanzarDia = useSimulador((s) => s.avanzarDia)
  const progreso = useGuia((s) => s.progreso)
  const estado = useGuia((s) => s.estado)
  return (
    <div className="strip">
      <span>● Modo capacitación · dinero y precios ficticios</span>
      {estado !== 'sin guía' && (
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
      <span className="mono">{formatoDia(fechaSimulada(dia))} · {HORA_SIMULADA}</span>
      <button type="button" data-tour="reloj-avanzar" onClick={avanzarDia}>Avanzar 1 día hábil</button>
      <button type="button" className="cambiar" onClick={abrirSelectorItinerarios}>Cambiar capacitación</button>
    </div>
  )
}
