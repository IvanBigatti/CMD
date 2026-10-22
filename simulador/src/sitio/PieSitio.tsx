import { href } from './ruta'

export function PieSitio() {
  return (
    <footer className="sitio-pie">
      <div className="pie-in">
        <div>
          <b>Simulador de capacitación</b>
          <p>Un espacio para aprender a invertir practicando. Todo el dinero, los precios y las operaciones son ficticios.</p>
        </div>
        <nav aria-label="Pie de página">
          <a href={href('/')}>Inicio</a>
          <a href={href('/capacitaciones')}>Capacitaciones</a>
          <a href={href('/simulador')}>Simulador</a>
          <a href={href('/nosotros')}>Sobre nosotros</a>
        </nav>
      </div>
      <p className="pie-legal">
        Herramienta educativa. No es la plataforma oficial de InvertirOnline ni constituye una recomendación de inversión.
      </p>
    </footer>
  )
}
