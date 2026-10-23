import { Carrusel } from '../../componentes/ui/Carrusel'
import { Estrellas } from '../../componentes/ui/Estrellas'
import { Instructivo } from '../../componentes/ui/Instructivo'
import { FOTOS_CARRUSEL } from '../../contenido/carrusel'
import { INSTRUCTIVOS_SITIO } from '../../contenido/instructivos'
import { TESTIMONIOS } from '../../contenido/testimonios'
import { ACTIVIDADES } from '../acciones'
import { href } from '../ruta'
import { TarjetaActividad } from '../TarjetaActividad'

const PASOS = [
  { n: 1, titulo: 'Elegís una actividad', texto: 'Ingresar dinero, comprar dólar MEP, un CEDEAR, una ON, vender y retirar… o el ciclo completo.' },
  { n: 2, titulo: 'Mirás el video', texto: 'Unos minutos que muestran la operación de punta a punta, con explicaciones simples.' },
  { n: 3, titulo: 'La practicás', texto: 'En el simulador, con una guía que te marca cada paso. Si te equivocás, no pasa nada.' },
]

export function Inicio() {
  // Primero la recomendada, después el resto
  const destacadas = [...ACTIVIDADES].sort(([, a], [, b]) => Number(!!b.recomendado) - Number(!!a.recomendado))

  return (
    <div className="sitio-pagina inicio">
      <section className="hero">
        <Carrusel fotos={FOTOS_CARRUSEL} />
        <div className="hero-texto">
          <span className="hero-eyebrow">Capacitación práctica · sin riesgo</span>
          <h1>Bienvenido al Simulador de <span>INVERTIR ONLINE</span></h1>
          <p>Aprendé a invertir sin arriesgar tu dinero. Practicá cada operación en una réplica de la plataforma, con dinero y precios ficticios.</p>
          <div className="hero-botones">
            <a className="btn-s grande" href={href('/capacitaciones')}>Empezar una capacitación</a>
            <a className="btn-o grande claro" href={href('/simulador')}>Explorar el simulador</a>
          </div>
        </div>
      </section>

      <div className="confianza">
        <span>💵 Dinero y precios ficticios</span>
        <span>🔓 No necesitás cuenta</span>
        <span>🛡️ Sin ningún riesgo</span>
      </div>

      <section className="bloque">
        <h2 className="bloque-tit">Cómo funciona</h2>
        <ol className="pasos3">
          {PASOS.map((p) => (
            <li key={p.n}>
              <span className="paso-n" aria-hidden="true">{p.n}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bloque fondo-lav">
        <div className="bloque-cab">
          <h2 className="bloque-tit">Actividades</h2>
          <a className="enlace-flecha" href={href('/capacitaciones')}>Ver todas →</a>
        </div>
        <div className="act-grid">
          {destacadas.slice(0, 3).map(([clave, it]) => <TarjetaActividad key={clave} clave={clave} it={it} />)}
        </div>
      </section>

      <section className="bloque">
        <div className="bloque-cab">
          <h2 className="bloque-tit">Lo que dicen quienes ya practicaron</h2>
          <a className="enlace-flecha" href={href('/capacitaciones')}>Ver reseñas →</a>
        </div>
        <div className="testi-grid">
          {TESTIMONIOS.slice(0, 3).map((t) => (
            <figure key={t.nombre} className="testi">
              <Estrellas valor={t.estrellas} chico />
              <blockquote>“{t.texto}”</blockquote>
              <figcaption><b>{t.nombre}</b>, {t.edad} años · {t.ciudad}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bloque">
        <Instructivo contenido={INSTRUCTIVOS_SITIO.inicio} />
      </section>
    </div>
  )
}
