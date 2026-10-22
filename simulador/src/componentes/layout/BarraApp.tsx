import { useState } from 'react'
import logo from '../../assets/logo-nombre.png'
import { instrumentoPorSimbolo, useSimulador } from '../../estado/simulador'
import { useUi } from '../../estado/ui'
import { SIMBOLOS_SUGERIDOS } from '../../mocks/instrumentos'
import { PERSONA } from '../../mocks/persona'
import { BotonProximamente } from '../ui/BotonProximamente'

export function BarraApp() {
  const inst = useSimulador((s) => s.inst)
  const verActivo = useSimulador((s) => s.verActivo)
  const [busqueda, setBusqueda] = useState('')

  const buscar = () => {
    const i = instrumentoPorSimbolo(inst, busqueda)
    if (!i) {
      useUi.getState().mensaje({
        titulo: 'No encontramos esa especie',
        parrafo: `Probá con ${SIMBOLOS_SUGERIDOS}. En el simulador hay ocho especies.`,
        eyebrow: 'Buscador',
      })
      return
    }
    setBusqueda('')
    verActivo(i.id)
  }

  return (
    <>
      <div className="appbar">
        <span className="brand"><img src={logo} alt="InvertirOnline" width={140} height={42} /></span>
        <span className="searchwrap">
          <input
            placeholder="Buscar Cotizaciones, Títulos o Empresas"
            list="simbolos"
            aria-label="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') buscar() }}
          />
          <button type="button" aria-label="Buscar" onClick={buscar}>🔍</button>
        </span>
        <span className="abicons">
          <BotonProximamente tema="favoritos" aria-label="Favoritos">★</BotonProximamente>
          <BotonProximamente tema="ultimasVistas">🕐</BotonProximamente>
          <BotonProximamente tema="ayuda">?</BotonProximamente>
          <BotonProximamente tema="notificaciones">🔔</BotonProximamente>
          <span className="hola">¡Hola, <b>{PERSONA.nombreSaludo}!</b></span>
        </span>
      </div>
      <datalist id="simbolos">
        {Object.values(inst).map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
      </datalist>
    </>
  )
}
