import { useEffect, type ReactNode } from 'react'
import type { Pantalla } from '../../dominio/tipos'
import type { ModoMep } from '../../dominio/mep'
import { useSimulador } from '../../estado/simulador'
import { useUi, type MenuId } from '../../estado/ui'
import { BotonProximamente } from '../ui/BotonProximamente'

/** Qué ítem del menú queda marcado en cada pantalla */
const NAV_POR_PANTALLA: Partial<Record<Pantalla, string>> = {
  inicio: 'nav-micuenta',
  portafolio: 'nav-portafolio',
  mercado: 'nav-cotizaciones',
  activo: 'nav-cotizaciones',
  comprar: 'nav-operar',
  vender: 'nav-operar',
  mep: 'nav-operar',
}

function useNavActual() {
  return useSimulador((s) => NAV_POR_PANTALLA[s.pantalla])
}

function Desplegable({ id, etiqueta, tour, children }: { id: MenuId; etiqueta: string; tour?: string; children: ReactNode }) {
  const abierto = useUi((s) => s.menuAbierto === id)
  const actual = useNavActual()
  return (
    <div className={`dd${abierto ? ' open' : ''}`} data-dd={id}>
      <button
        type="button"
        className="navitem"
        data-tour={tour}
        aria-current={tour && actual === tour ? 'true' : undefined}
        onClick={() => useUi.getState().alternarMenu(id)}
      >
        {etiqueta} <span className="cv">▾</span>
      </button>
      <div className="dd-menu">{children}</div>
    </div>
  )
}

function ItemNav({ ir, tour, children }: { ir: Pantalla; tour: string; children: ReactNode }) {
  const actual = useNavActual()
  const irA = useSimulador((s) => s.irA)
  return (
    <button type="button" className="navitem" data-tour={tour} aria-current={actual === tour ? 'true' : undefined} onClick={() => irA(ir)}>
      {children}
    </button>
  )
}

export function NavSuperior() {
  const irA = useSimulador((s) => s.irA)
  const setModoMep = useSimulador((s) => s.setModoMep)
  const irAMep = (modo: ModoMep) => { setModoMep(modo); irA('mep') }

  // Cierra los desplegables al hacer clic fuera de ellos
  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.('.dd')) useUi.getState().cerrarMenus()
    }
    document.addEventListener('click', cerrar)
    return () => document.removeEventListener('click', cerrar)
  }, [])

  return (
    <nav className="topnav">
      <Desplegable id="cuenta" etiqueta="Mi Cuenta" tour="nav-micuenta">
        <button type="button" data-tour="menu-estado" onClick={() => irA('inicio')}>Estado de cuenta</button>
        <button type="button" data-tour="menu-movimientos" onClick={() => irA('movimientos')}>Movimientos</button>
        <div className="dd-sep" />
        <button type="button" data-tour="menu-ingresar" onClick={() => irA('ingresar')}>Ingresar dinero</button>
        <button type="button" data-tour="menu-retirar" onClick={() => irA('retirar')}>Retirar dinero</button>
        <div className="dd-sep" />
        <button type="button" data-tour="menu-perfil" onClick={() => irA('cuenta')}>Mi perfil de inversor</button>
        <BotonProximamente tema="configuracion">Configuración</BotonProximamente>
      </Desplegable>

      <ItemNav ir="portafolio" tour="nav-portafolio">Portafolio</ItemNav>

      <Desplegable id="operar" etiqueta="Operar" tour="nav-operar">
        <button type="button" data-tour="menu-comprar" onClick={() => irA('comprar')}>Comprar</button>
        <button type="button" data-tour="menu-vender" onClick={() => irA('vender')}>Vender</button>
        <BotonProximamente tema="caucionar">Caucionar<span className="sub-arrow">›</span></BotonProximamente>
        <BotonProximamente tema="suscribir">Suscribir</BotonProximamente>
        <BotonProximamente tema="rescatar">Rescatar</BotonProximamente>
        <BotonProximamente tema="opciones">Opciones</BotonProximamente>
        <BotonProximamente tema="planes">Planes de Inversión</BotonProximamente>
        <div className="dd-sep" />
        <button type="button" data-tour="menu-mep" onClick={() => irAMep('compra')}>Compra Dólar MEP Simple</button>
        <button type="button" data-tour="menu-mep-venta" onClick={() => irAMep('venta')}>
          Venta Dólar MEP Simple <span className="badge-new">¡Nuevo!</span>
        </button>
        <BotonProximamente tema="portafolioSimple">Portafolio Simple <span className="badge-new">¡Nuevo!</span></BotonProximamente>
        <BotonProximamente tema="cclMenu">Envía dinero a EE.UU. (CCL) <span className="badge-new">¡Nuevo!</span></BotonProximamente>
      </Desplegable>

      <ItemNav ir="mercado" tour="nav-cotizaciones">Cotizaciones</ItemNav>

      <Desplegable id="herramientas" etiqueta="Herramientas">
        <BotonProximamente tema="descargarEstado">Descargar estado de cuenta</BotonProximamente>
        <BotonProximamente tema="simuladorRendimientos">Simulador de rendimientos</BotonProximamente>
        <BotonProximamente tema="alertas">Alertas de precio</BotonProximamente>
        <BotonProximamente tema="api">API</BotonProximamente>
      </Desplegable>

      <BotonProximamente tema="estrategias" className="navitem">Estrategias de Inversión</BotonProximamente>
      <BotonProximamente tema="academia" className="navitem">Academia</BotonProximamente>
    </nav>
  )
}
