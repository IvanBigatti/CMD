import { useEffect, useRef, useState } from 'react'
import { fechaSimulada, formatoDia } from '../../dominio/fechas'
import { useSimulador } from '../../estado/simulador'

const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DIAS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
/** Tiempo total en pantalla (ms); el CSS usa la misma duración */
const DURACION = 2400

interface Salto { id: number; desde: Date; hasta: Date }

/** Hoja de calendario que se da vuelta cuando se avanza un día hábil */
export function AvanceDia() {
  const dia = useSimulador((s) => s.dia)
  const previo = useRef(dia)
  const [salto, setSalto] = useState<Salto | null>(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    const anterior = previo.current
    previo.current = dia
    // Solo un avance de un día: reiniciar el simulador (vuelve a 0) no se anima
    if (dia !== anterior + 1) return
    const hasta = fechaSimulada(dia)
    // El lector de pantalla anuncia la fecha nueva aunque no haya animación
    setAviso(`Pasó un día hábil. Ahora es ${formatoDia(hasta)}.`)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setSalto({ id: dia, desde: fechaSimulada(anterior), hasta })
  }, [dia])

  useEffect(() => {
    if (!salto) return
    const t = setTimeout(() => setSalto(null), DURACION)
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setSalto(null) } }
    addEventListener('keydown', alTeclear, true)
    return () => { clearTimeout(t); removeEventListener('keydown', alTeclear, true) }
  }, [salto])

  const saltaFinde = salto ? (salto.hasta.getTime() - salto.desde.getTime()) / 86_400_000 > 1 : false

  return (
    <>
      <span className="sr-only" role="status">{aviso}</span>
      {salto && (
        <div key={salto.id} className="avance-dia" aria-hidden="true" onClick={() => setSalto(null)}>
          <div className="avd-tarjeta">
            <span className="avd-eyebrow">Reloj del simulador</span>
            <div className="avd-calendario">
              <span className="avd-mes">{MESES[salto.hasta.getMonth()]}</span>
              <span className="avd-hojas">
                <span className="avd-hoja nueva">
                  <b>{salto.hasta.getDate()}</b>
                  <small>{DIAS[salto.hasta.getDay()]}</small>
                </span>
                <span className="avd-hoja vieja">
                  <b>{salto.desde.getDate()}</b>
                  <small>{DIAS[salto.desde.getDay()]}</small>
                </span>
              </span>
            </div>
            <p className="avd-titulo">Pasó un día hábil</p>
            <p className="avd-texto">
              {saltaFinde && <>De viernes a lunes: el fin de semana no cuenta.<br /></>}
              Lo que operaste ayer se liquida hoy (T+1).
            </p>
          </div>
        </div>
      )}
    </>
  )
}
