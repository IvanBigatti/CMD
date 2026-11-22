import { useEffect, type ComponentType } from 'react'
import { INSTRUCTIVOS_PANTALLA } from '../../contenido/instructivos'
import type { Pantalla } from '../../dominio/tipos'
import { useSimulador } from '../../estado/simulador'
import { Boleto } from '../../pantallas/Boleto'
import { Comprar } from '../../pantallas/Comprar'
import { Cotizaciones } from '../../pantallas/Cotizaciones'
import { DolarMep } from '../../pantallas/DolarMep'
import { EstadoDeCuenta } from '../../pantallas/EstadoDeCuenta'
import { FichaActivo } from '../../pantallas/FichaActivo'
import { IngresarDinero } from '../../pantallas/IngresarDinero'
import { Movimientos } from '../../pantallas/Movimientos'
import { PerfilInversor } from '../../pantallas/PerfilInversor'
import { Portafolio } from '../../pantallas/Portafolio'
import { RetirarDinero } from '../../pantallas/RetirarDinero'
import { Vender } from '../../pantallas/Vender'
import { Instructivo } from '../ui/Instructivo'
import { BarraApp } from './BarraApp'
import { NavSuperior } from './NavSuperior'

const PANTALLAS: Record<Pantalla, ComponentType> = {
  inicio: EstadoDeCuenta,
  portafolio: Portafolio,
  mercado: Cotizaciones,
  activo: FichaActivo,
  comprar: Comprar,
  vender: Vender,
  boleto: Boleto,
  ingresar: IngresarDinero,
  mep: DolarMep,
  retirar: RetirarDinero,
  movimientos: Movimientos,
  cuenta: PerfilInversor,
}

/** La plataforma simulada, a todo el ancho de la página */
export function Plataforma() {
  const pantalla = useSimulador((s) => s.pantalla)
  const PantallaActual = PANTALLAS[pantalla]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pantalla])

  return (
    <div className="plataforma">
      <BarraApp />
      <NavSuperior />
      <main className="main">
        <div className="pliegue-wrap">
          {/* key: se vuelve a plegar al cambiar de pantalla */}
          <details className="pliegue" key={pantalla}>
            <summary>¿Cómo se usa esta pantalla?</summary>
            <Instructivo contenido={INSTRUCTIVOS_PANTALLA[pantalla]} plano />
          </details>
        </div>
        <PantallaActual />
      </main>
    </div>
  )
}
