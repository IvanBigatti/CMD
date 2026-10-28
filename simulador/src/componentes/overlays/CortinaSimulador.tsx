import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { marcarCortinaVista, type ModoCortina } from '../../estado/cortina'

/** Cuánto tiempo tapa la pantalla y cuánto tarda en irse (ms) */
const DURACION: Record<ModoCortina, { cubre: number; sale: number }> = {
  'entrar': { cubre: 1800, sale: 550 },
  'entrar-corta': { cubre: 380, sale: 450 },
  'salir': { cubre: 450, sale: 450 },
}

const LINEAS = ['Abriendo cuenta de práctica', 'Cargando cotizaciones ficticias', 'Sincronizando reloj de mercado']

/** Pantalla completa que tapa el cambio de página al entrar o salir del simulador */
export function CortinaSimulador({ modo, alTerminar }: { modo: ModoCortina; alTerminar: () => void }) {
  const [fase, setFase] = useState<'cubre' | 'sale'>('cubre')
  const terminar = useRef(alTerminar)
  useEffect(() => { terminar.current = alTerminar })

  useEffect(() => { if (modo === 'entrar') marcarCortinaVista() }, [modo])

  // Cubre → sale → se desmonta
  useEffect(() => {
    const { cubre, sale } = DURACION[modo]
    const t = fase === 'cubre'
      ? setTimeout(() => setFase('sale'), cubre)
      : setTimeout(() => terminar.current(), sale + 80)
    return () => clearTimeout(t)
  }, [fase, modo])

  // Esc para saltar; sin scroll mientras está la cortina
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setFase('sale') }
    addEventListener('keydown', alTeclear)
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      removeEventListener('keydown', alTeclear)
      document.body.style.overflow = overflowPrevio
    }
  }, [])

  const entrando = modo !== 'salir'
  const estilo = { '--cubre': `${DURACION[modo].cubre}ms`, '--sale': `${DURACION[modo].sale}ms` } as CSSProperties

  return (
    <>
      <div
        className={`cortina ${modo}${fase === 'sale' ? ' sale' : ''}`}
        style={estilo}
        aria-hidden="true"
        onClick={() => setFase('sale')}
      >
        <div className="cortina-contenido">
          <img className="cortina-logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={64} height={59} />
          <span className="cortina-eyebrow">Simulador InvertirOnline</span>
          <h2 className="cortina-titulo">
            {entrando ? <>Entrando al <em>modo simulador</em></> : <>Saliendo del <em>modo simulador</em></>}
          </h2>

          {modo === 'entrar' && (
            <ul className="cortina-lineas">
              {LINEAS.map((texto, i) => (
                <li key={texto} style={{ '--i': i } as CSSProperties}>
                  <span className="txt">&gt; {texto}</span>
                  <span className="ok">✓</span>
                </li>
              ))}
            </ul>
          )}

          {entrando
            ? <span className="cortina-barra"><i /></span>
            : <p className="cortina-pie">Volviendo al sitio…</p>}

          {modo === 'entrar' && <p className="cortina-pie">Dinero y precios ficticios · Tocá o apretá Esc para saltar</p>}
        </div>
      </div>
      <span className="sr-only" role="status">
        {entrando ? 'Entraste al modo simulador: el dinero y los precios son ficticios' : 'Saliste del simulador'}
      </span>
    </>
  )
}
