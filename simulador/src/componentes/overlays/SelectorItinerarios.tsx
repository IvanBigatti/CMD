import { useUi } from '../../estado/ui'
import { ITINERARIOS, type ClaveItinerario, type Itinerario } from '../../guia/itinerarios'
import { practicar } from '../../sitio/acciones'

/** Lista de itinerarios guiados (se abre desde "Cambiar capacitación") */
export function SelectorItinerarios() {
  const abierto = useUi((s) => s.selectorAbierto)
  if (!abierto) return null

  const elegir = (clave: ClaveItinerario) => {
    useUi.getState().cerrarSelector()
    practicar(clave)
  }

  const lista = Object.entries(ITINERARIOS) as [ClaveItinerario, Itinerario][]

  return (
    <div className="veil">
      <div className="sheet ancha" role="dialog" aria-modal="true" aria-labelledby="selector-titulo">
        <div style={{ position: 'relative' }}>
          <button type="button" className="sheet-cerrar" aria-label="Cerrar" onClick={() => useUi.getState().cerrarSelector()}>✕</button>
          <span className="eyebrow" style={{ color: 'var(--violet)' }}>Elegí tu itinerario</span>
          <h3 id="selector-titulo" style={{ marginTop: 6 }}>¿Para qué te querés capacitar?</h3>
          <p style={{ marginTop: 6 }}>Cada itinerario te lleva de la mano por un tramo del ciclo. Podés cambiarlo cuando quieras.</p>
          <div className="tracks" style={{ marginTop: 15 }}>
            {lista.map(([clave, it], k) => (
              <button key={clave} type="button" className={`track${it.recomendado ? ' rec2' : ''}`} onClick={() => elegir(clave)}>
                <span className="n">{k + 1}</span>
                <span>
                  <span className="tt">{it.nombre}{it.recomendado ? ' · recomendado' : ''}</span>
                  <span className="ss">{it.descripcion}</span>
                  <span className="mods">{it.modulos} · {it.duracion}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
