import { nf } from '../../dominio/formato'
import { indices, precio } from '../../dominio/mercado'
import { useSimulador } from '../../estado/simulador'

function Var({ v }: { v: number }) {
  return <span className={v >= 0 ? 'up' : 'dn'}>{v >= 0 ? '▲' : '▼'}{nf(Math.abs(v), 2)}%</span>
}

/** Cinta de cotizaciones que corre de derecha a izquierda (se frena al pasar el mouse) */
export function CintaCotizaciones() {
  const inst = useSimulador((s) => s.inst)
  const dia = useSimulador((s) => s.dia)
  const pulso = useSimulador((s) => s.pulso)
  const verActivo = useSimulador((s) => s.verActivo)
  const [merval] = indices(dia, pulso)

  const tramo = (copia: boolean) => (
    <div className="cinta-tramo" aria-hidden={copia || undefined}>
      <span className="cinta-item indice"><b>MERVAL</b> {nf(merval.valor, 0)} <Var v={merval.variacion} /></span>
      {Object.values(inst).map((i) => (
        <button key={i.id} type="button" className="cinta-item" tabIndex={copia ? -1 : undefined} onClick={() => verActivo(i.id)}>
          <b>{i.id}</b> {i.moneda === 'USD' ? 'US$ ' : ''}{nf(precio(i))} <Var v={i.variacion} />
        </button>
      ))}
    </div>
  )

  return (
    <div className="cinta" role="region" aria-label="Cotizaciones simuladas">
      <div className="cinta-pista">
        {tramo(false)}
        {tramo(true)}
      </div>
    </div>
  )
}
