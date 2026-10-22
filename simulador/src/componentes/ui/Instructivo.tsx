import { urlInstructivo, type ContenidoInstructivo } from '../../contenido/instructivos'
import { TextoRico } from './TextoRico'

interface Props {
  contenido: ContenidoInstructivo
  /** Sin tarjeta ni encabezado de sección (para usarlo dentro de un desplegable) */
  plano?: boolean
}

/** Instructivo estático: pasos numerados y una imagen (o el lugar reservado para ella) */
export function Instructivo({ contenido, plano }: Props) {
  const { titulo, intro, pasos, imagen } = contenido
  return (
    <section className={`instructivo${plano ? ' plano' : ''}`} aria-label={`Instructivo: ${titulo}`}>
      <div className="instr-texto">
        {!plano && <span className="instr-eyebrow">Instructivo</span>}
        <h3>{titulo}</h3>
        {intro && <p className="instr-intro"><TextoRico texto={intro} /></p>}
        <ol>
          {pasos.map((p, i) => <li key={i}><TextoRico texto={p} /></li>)}
        </ol>
      </div>
      <figure className="instr-img">
        {imagen ? (
          <a href={urlInstructivo(imagen.archivo)} target="_blank" rel="noreferrer" title="Abrir la imagen en grande">
            <img src={urlInstructivo(imagen.archivo)} alt={imagen.alt} loading="lazy" />
          </a>
        ) : (
          <div className="instr-vacia" role="img" aria-label="Imagen ilustrativa próximamente">
            <span aria-hidden="true">🖼️</span>
            <span>Imagen ilustrativa próximamente</span>
          </div>
        )}
      </figure>
    </section>
  )
}
