import { useState, type ReactNode } from 'react'

interface Props {
  /** Número que se vigila: si sube destella verde, si baja, rojo */
  valor: number
  /** Si cambia (otra especie), no destella */
  clave?: string
  className?: string
  children: ReactNode
}

/** Envuelve un precio y lo hace destellar cuando cambia, como en una pantalla de trading */
export function PrecioVivo({ valor, clave, className, children }: Props) {
  const [previo, setPrevio] = useState({ valor, clave })
  const [destello, setDestello] = useState<{ dir: 'up' | 'dn'; n: number } | null>(null)

  if (previo.valor !== valor || previo.clave !== clave) {
    setPrevio({ valor, clave })
    if (previo.clave === clave) setDestello({ dir: valor > previo.valor ? 'up' : 'dn', n: (destello?.n ?? 0) + 1 })
    else setDestello(null)
  }

  // key nueva en cada cambio: reinicia la animación
  return (
    <span key={destello?.n ?? 0} className={['vivo', destello && `flash-${destello.dir}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
