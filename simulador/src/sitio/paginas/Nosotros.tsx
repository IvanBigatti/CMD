import { useState, type FormEvent } from 'react'
import { Estrellas, SelectorEstrellas } from '../../componentes/ui/Estrellas'
import { Instructivo } from '../../componentes/ui/Instructivo'
import { TextoRico } from '../../componentes/ui/TextoRico'
import { INSTRUCTIVOS_SITIO } from '../../contenido/instructivos'
import { NOSOTROS } from '../../contenido/nosotros'
import { TESTIMONIOS, type Testimonio } from '../../contenido/testimonios'
import { ACTIVIDADES } from '../acciones'
import { href } from '../ruta'

/** Valoración que deja quien visita el sitio. Sin servidor: queda guardada solo en su navegador. */
interface Valoracion {
  nombre: string
  estrellas: number
  actividad: string
  texto: string
  fecha: string
}

const CLAVE_LS = 'simulador.valoraciones'

function leerValoraciones(): Valoracion[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_LS) ?? '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function guardarValoraciones(v: Valoracion[]) {
  try { localStorage.setItem(CLAVE_LS, JSON.stringify(v)) } catch { /* sin almacenamiento: queda solo en memoria */ }
}

export function Nosotros() {
  const [propias, setPropias] = useState<Valoracion[]>(leerValoraciones)
  const [estrellas, setEstrellas] = useState(0)
  const [nombre, setNombre] = useState('')
  const [actividad, setActividad] = useState('')
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  const todas = [...propias.map((p) => p.estrellas), ...TESTIMONIOS.map((t) => t.estrellas)]
  const promedio = todas.reduce((a, b) => a + b, 0) / todas.length

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    if (!estrellas) { setError('Elegí cuántas estrellas nos das.'); return }
    const nueva: Valoracion = {
      nombre: nombre.trim() || 'Anónimo',
      estrellas,
      actividad,
      texto: texto.trim(),
      fecha: new Date().toISOString(),
    }
    const lista = [nueva, ...propias]
    setPropias(lista)
    guardarValoraciones(lista)
    setEstrellas(0); setNombre(''); setActividad(''); setTexto(''); setError('')
    setEnviado(true)
  }

  return (
    <div className="sitio-pagina">
      <section className="cabecera-pagina">
        <h1>Sobre nosotros</h1>
        <p>{NOSOTROS.bajada}</p>
      </section>

      <section className="bloque nos-quienes">
        <div>
          <h2 className="bloque-tit">Quiénes somos</h2>
          {NOSOTROS.quienesSomos.map((p, i) => <p key={i}><TextoRico texto={p} /></p>)}
        </div>
        <ul className="valores">
          {NOSOTROS.valores.map((v) => (
            <li key={v.titulo}>
              <span aria-hidden="true">{v.icono}</span>
              <div><h3>{v.titulo}</h3><p>{v.texto}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bloque fondo-lav">
        <div>
          <h2 className="bloque-tit">Nuestras capacitaciones</h2>
          <ul className="lista-check">
            {NOSOTROS.capacitaciones.map((c) => <li key={c}>{c}</li>)}
          </ul>
          <a className="btn-s" href={href('/capacitaciones')}>Ver las capacitaciones</a>
        </div>
      </section>

      <section className="bloque">
        <div className="bloque-cab">
          <h2 className="bloque-tit">Opiniones</h2>
          <span className="promedio">
            <b>{promedio.toLocaleString('es-AR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}</b>
            <Estrellas valor={promedio} />
            <span>{todas.length} opiniones</span>
          </span>
        </div>
        <div className="testi-grid">
          {propias.map((p) => (
            <figure key={p.fecha} className="testi propia">
              <Estrellas valor={p.estrellas} chico />
              {p.texto ? <blockquote>“{p.texto}”</blockquote> : <blockquote className="sin-texto">Sin comentario</blockquote>}
              <figcaption><b>{p.nombre}</b>{p.actividad && ` · ${p.actividad}`} · <span className="tu">Tu opinión</span></figcaption>
            </figure>
          ))}
          {TESTIMONIOS.map((t: Testimonio) => (
            <figure key={t.nombre} className="testi">
              <Estrellas valor={t.estrellas} chico />
              <blockquote>“{t.texto}”</blockquote>
              <figcaption><b>{t.nombre}</b>, {t.edad} años · {t.ciudad} · {t.actividad}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bloque valorar-wrap" id="valoranos">
        <form className="valorar" onSubmit={enviar} noValidate>
          <h2 className="bloque-tit">Valoranos</h2>
          <p>¿Te sirvió la capacitación? Tu opinión nos ayuda a mejorarla.</p>
          <SelectorEstrellas valor={estrellas} onCambio={(v) => { setEstrellas(v); setError(''); setEnviado(false) }} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <label>
            <span>Tu nombre <span className="opc">(opcional)</span></span>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoComplete="given-name" />
          </label>
          <label>
            <span>¿Qué actividad hiciste? <span className="opc">(opcional)</span></span>
            <select value={actividad} onChange={(e) => setActividad(e.target.value)}>
              <option value="">Elegí una</option>
              {ACTIVIDADES.map(([c, it]) => <option key={c} value={it.nombre}>{it.nombre}</option>)}
            </select>
          </label>
          <label>
            <span>Comentario <span className="opc">(opcional)</span></span>
            <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} maxLength={500} />
          </label>
          <button type="submit" className="btn-s grande">Enviar valoración</button>
          {enviado && <p className="form-ok" role="status">¡Gracias! Tu opinión ya aparece en la lista.</p>}
          <p className="nota">Tu valoración queda guardada en este navegador.</p>
        </form>
        <Instructivo contenido={INSTRUCTIVOS_SITIO.nosotros} />
      </section>
    </div>
  )
}
