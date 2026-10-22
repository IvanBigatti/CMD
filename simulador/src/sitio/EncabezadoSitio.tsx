import { useState } from 'react'
import { href, useRuta, type Ruta } from './ruta'

const ENLACES: { ruta: string; texto: string; activo: (r: Ruta) => boolean }[] = [
  { ruta: '/', texto: 'Inicio', activo: (r) => r.pagina === 'inicio' },
  { ruta: '/capacitaciones', texto: 'Capacitaciones', activo: (r) => r.pagina === 'capacitaciones' || r.pagina === 'actividad' },
  { ruta: '/simulador', texto: 'Simulador', activo: (r) => r.pagina === 'simulador' },
  { ruta: '/nosotros', texto: 'Sobre nosotros', activo: (r) => r.pagina === 'nosotros' },
]

/** Encabezado del sitio: marca y menú principal (hamburguesa en celular) */
export function EncabezadoSitio() {
  const ruta = useRuta()
  const [abierto, setAbierto] = useState(false)
  const cerrar = () => setAbierto(false)

  return (
    <header className="sitio-header">
      <a className="sitio-marca" href={href('/')} onClick={cerrar}>
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={38} height={35} />
        <span>
          <b>Simulador</b>
          <small>InvertirOnline · Capacitación</small>
        </span>
      </a>
      <button
        type="button"
        className="sitio-hamburguesa"
        aria-expanded={abierto}
        aria-controls="menu-sitio"
        onClick={() => setAbierto((a) => !a)}
      >
        <span aria-hidden="true">{abierto ? '✕' : '☰'}</span>
        <span>Menú</span>
      </button>
      <nav id="menu-sitio" className={`sitio-nav${abierto ? ' abierto' : ''}`} aria-label="Principal">
        {ENLACES.map((e) => (
          <a key={e.ruta} href={href(e.ruta)} aria-current={e.activo(ruta) ? 'page' : undefined} onClick={cerrar}>
            {e.texto}
          </a>
        ))}
      </nav>
    </header>
  )
}
