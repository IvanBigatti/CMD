import type { ButtonHTMLAttributes } from 'react'
import { useUi } from '../../estado/ui'
import type { TemaProximamente } from '../../mocks/proximamente'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & { tema: TemaProximamente }

/** Control que existe en la plataforma real pero todavía no está en el simulador: abre un popup "Próximamente" */
export function BotonProximamente({ tema, type = 'button', ...resto }: Props) {
  return (
    <button
      type={type}
      data-pronto={tema}
      {...resto}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        useUi.getState().proximamente(tema)
      }}
    />
  )
}
