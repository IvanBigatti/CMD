import { useRef } from 'react'

/** Imagen que se abre en grande al tocarla (dentro de un <dialog>), con enlace para descargarla */
export function ImagenAmpliable({ src, alt, titulo, nombreDescarga }: {
  src: string
  alt: string
  titulo: string
  /** Si está, se muestra el enlace "Descargar para imprimir (A4)" */
  nombreDescarga?: string
}) {
  const dialogo = useRef<HTMLDialogElement>(null)
  return (
    <figure className="img-ampliable">
      <button type="button" className="img-miniatura" onClick={() => dialogo.current?.showModal()} aria-label={`Ver en grande: ${titulo}`}>
        <img src={src} alt={alt} loading="lazy" />
        <span className="img-lupa" aria-hidden="true">🔍 Ver en grande</span>
      </button>
      <figcaption>
        <span>{titulo}</span>
        {nombreDescarga && <a className="enlace-flecha" href={src} download={nombreDescarga}>⬇ Descargar para imprimir (A4)</a>}
      </figcaption>

      <dialog
        ref={dialogo}
        className="img-dialogo"
        aria-label={titulo}
        // Un clic fuera de la imagen (sobre el fondo) cierra
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close() }}
      >
        <div className="img-dialogo-barra">
          <b>{titulo}</b>
          {nombreDescarga && <a href={src} download={nombreDescarga}>⬇ Descargar</a>}
          <button type="button" onClick={() => dialogo.current?.close()} aria-label="Cerrar">✕</button>
        </div>
        <img src={src} alt={alt} />
      </dialog>
    </figure>
  )
}
