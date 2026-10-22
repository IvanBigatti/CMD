import { Fragment } from 'react'

/** Muestra un texto con **negrita** y saltos de línea (\n) */
export function TextoRico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('\n').map((linea, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {linea.split('**').map((parte, i) => (i % 2 ? <strong key={i}>{parte}</strong> : parte))}
        </Fragment>
      ))}
    </>
  )
}
