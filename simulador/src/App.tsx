import { useEffect, useLayoutEffect, useState } from 'react'
import { FranjaCapacitacion } from './componentes/layout/FranjaCapacitacion'
import { Plataforma } from './componentes/layout/Plataforma'
import { AvanceDia } from './componentes/overlays/AvanceDia'
import { GuiaOverlay } from './componentes/overlays/GuiaOverlay'
import { CortinaSimulador } from './componentes/overlays/CortinaSimulador'
import { ModalHost } from './componentes/overlays/ModalHost'
import { SelectorItinerarios } from './componentes/overlays/SelectorItinerarios'
import { ReproductorFlotante } from './componentes/overlays/ReproductorFlotante'
import { modoDeEntrada, type ModoCortina } from './estado/cortina'
import { useGuia } from './guia/estadoGuia'
import { ITINERARIOS } from './guia/itinerarios'
import { EncabezadoSitio } from './sitio/EncabezadoSitio'
import { Actividad } from './sitio/paginas/Actividad'
import { AntesDeEmpezar } from './sitio/paginas/AntesDeEmpezar'
import { Capacitaciones } from './sitio/paginas/Capacitaciones'
import { Inicio } from './sitio/paginas/Inicio'
import { Nosotros } from './sitio/paginas/Nosotros'
import { PieSitio } from './sitio/PieSitio'
import { useRuta, type Ruta } from './sitio/ruta'

const SITIO = 'Simulador InvertirOnline'

function tituloDe(ruta: Ruta, tituloGuia: string): string {
  switch (ruta.pagina) {
    case 'inicio': return SITIO
    case 'capacitaciones': return `Capacitaciones · ${SITIO}`
    case 'antesDeEmpezar': return `Antes de empezar · ${SITIO}`
    case 'actividad': return `${ITINERARIOS[ruta.clave].nombre} · ${SITIO}`
    case 'nosotros': return `Sobre nosotros · ${SITIO}`
    case 'simulador': return tituloGuia
  }
}

function Pagina({ ruta }: { ruta: Ruta }) {
  switch (ruta.pagina) {
    case 'inicio': return <Inicio />
    case 'capacitaciones': return <Capacitaciones />
    case 'antesDeEmpezar': return <AntesDeEmpezar />
    case 'actividad': return <Actividad clave={ruta.clave} />
    case 'nosotros': return <Nosotros />
    case 'simulador': return <Plataforma />
  }
}

type Pagina = Ruta['pagina']

/** Qué cortina corresponde al pasar de una página a otra (null: ninguna) */
function cortinaEntre(previa: Pagina | null, actual: Pagina): ModoCortina | null {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  if (previa !== 'simulador' && actual === 'simulador') return modoDeEntrada()
  if (previa === 'simulador' && actual !== 'simulador') return 'salir'
  return null
}

export default function App() {
  const ruta = useRuta()
  const tituloGuia = useGuia((s) => s.titulo)
  const enSimulador = ruta.pagina === 'simulador'

  // La cortina se decide durante el render para que aparezca junto con la página nueva, sin parpadeo
  const [paginaPrevia, setPaginaPrevia] = useState<Pagina | null>(null)
  const [cortina, setCortina] = useState<{ modo: ModoCortina; id: number } | null>(null)
  if (paginaPrevia !== ruta.pagina) {
    setPaginaPrevia(ruta.pagina)
    const modo = cortinaEntre(paginaPrevia, ruta.pagina)
    if (modo) setCortina({ modo, id: (cortina?.id ?? 0) + 1 })
  }

  // Marco amarillo y encabezado oscuro mientras estás en el simulador
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('modo-simulador', enSimulador)
  }, [enSimulador])

  useEffect(() => { window.scrollTo(0, 0) }, [ruta])
  useEffect(() => { document.title = tituloDe(ruta, tituloGuia) }, [ruta, tituloGuia])

  return (
    <>
      <div className="cabecera-fija">
        <EncabezadoSitio />
        {enSimulador && <FranjaCapacitacion />}
      </div>
      <Pagina ruta={ruta} />
      {!enSimulador && <PieSitio />}
      {/* La guía solo se muestra dentro del simulador; si salís, queda en pausa en el mismo paso */}
      {enSimulador && <GuiaOverlay />}
      {enSimulador && <ReproductorFlotante />}
      {enSimulador && <AvanceDia />}
      <ModalHost />
      <SelectorItinerarios />
      {cortina && <CortinaSimulador key={cortina.id} modo={cortina.modo} alTerminar={() => setCortina(null)} />}
    </>
  )
}
