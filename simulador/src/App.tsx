import { useEffect } from 'react'
import { FranjaCapacitacion } from './componentes/layout/FranjaCapacitacion'
import { Plataforma } from './componentes/layout/Plataforma'
import { GuiaOverlay } from './componentes/overlays/GuiaOverlay'
import { ModalHost } from './componentes/overlays/ModalHost'
import { SelectorItinerarios } from './componentes/overlays/SelectorItinerarios'
import { VideoFlotante } from './componentes/overlays/VideoFlotante'
import { useGuia } from './guia/estadoGuia'
import { ITINERARIOS } from './guia/itinerarios'
import { EncabezadoSitio } from './sitio/EncabezadoSitio'
import { Actividad } from './sitio/paginas/Actividad'
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
    case 'actividad': return `${ITINERARIOS[ruta.clave].nombre} · ${SITIO}`
    case 'nosotros': return `Sobre nosotros · ${SITIO}`
    case 'simulador': return tituloGuia
  }
}

function Pagina({ ruta }: { ruta: Ruta }) {
  switch (ruta.pagina) {
    case 'inicio': return <Inicio />
    case 'capacitaciones': return <Capacitaciones />
    case 'actividad': return <Actividad clave={ruta.clave} />
    case 'nosotros': return <Nosotros />
    case 'simulador': return <Plataforma />
  }
}

export default function App() {
  const ruta = useRuta()
  const tituloGuia = useGuia((s) => s.titulo)
  const enSimulador = ruta.pagina === 'simulador'

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
      {enSimulador && <VideoFlotante />}
      <ModalHost />
      <SelectorItinerarios />
    </>
  )
}
