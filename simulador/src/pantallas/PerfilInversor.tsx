import { useSimulador } from '../estado/simulador'
import { abrirTestPerfil } from '../estado/testPerfil'
import { PERFILES } from '../mocks/perfiles'
import { PERSONA } from '../mocks/persona'

export function PerfilInversor() {
  const perfil = PERFILES[useSimulador((s) => s.perfil)]
  return (
    <section className="page">
      <div className="pagetop">
        <h1 className="ptitle">Mi perfil de inversor</h1>
        <div className="pmeta">Comitente Nº {PERSONA.comitente} · {PERSONA.nombreCompleto}</div>
      </div>
      <div className="grid12">
        <div className="panel" data-tour="perfil-card">
          <div className="lbl">Tu perfil</div>
          <div className="big" style={{ marginTop: 6, fontSize: '1.7rem', color: 'var(--violet)' }}>{perfil.nombre}</div>
          <p className="sub" style={{ marginTop: 4, fontSize: '.92rem' }}>{perfil.descripcion}</p>
          <p style={{ fontSize: '.87rem', color: 'var(--tx2)', lineHeight: 1.5, marginTop: 13 }}>
            El perfil ordena las sugerencias y te avisa cuando un activo es más volátil de lo que declaraste.
            En la plataforma real <strong>no te bloquea</strong>: podés comprar igual lo que quieras.
          </p>
          <button type="button" className="btn-s sm" style={{ marginTop: 15 }} data-tour="btn-test" onClick={abrirTestPerfil}>Rehacer el test</button>
        </div>
        <div className="card">
          <div className="lbl">Datos de la cuenta</div>
          <div className="kv" style={{ marginTop: 9 }}>
            <div className="r"><span className="k">Número de comitente</span><span className="v">{PERSONA.comitente}</span></div>
            <div className="r"><span className="k">Titular</span><span className="v texto">{PERSONA.nombreCompleto}</span></div>
            <div className="r"><span className="k">Cuentas</span><span className="v texto">Pesos y dólares</span></div>
            <div className="r"><span className="k">Custodia de títulos</span><span className="v texto">{PERSONA.custodia}</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
