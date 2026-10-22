import type { CSSProperties } from 'react'
import type { Aviso } from '../../dominio/tipos'
import { TextoRico } from './TextoRico'

export function AvisoCaja({ aviso, style }: { aviso: Aviso; style?: CSSProperties }) {
  return (
    <div className={`alert ${aviso.tono}`} style={style}>
      <span className="t">{aviso.titulo}</span>
      <TextoRico texto={aviso.texto} />
    </div>
  )
}
