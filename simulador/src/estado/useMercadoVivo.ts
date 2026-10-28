import { useEffect, useState } from 'react'
import { avanzarReloj, horaReloj } from './reloj'
import { useSimulador } from './simulador'

const LATIDO_MS = 2500

/** Mueve los precios cada pocos segundos mientras estás en el simulador (no corre con la pestaña oculta) */
export function useMercadoVivo() {
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) useSimulador.getState().latido()
    }, LATIDO_MS)
    return () => clearInterval(id)
  }, [])
}

/** Reloj de la rueda: avanza en tiempo real mientras el mercado está abierto */
export function useRelojMercado(): string {
  const abierto = useSimulador((s) => s.mercadoAbierto)
  useSimulador((s) => s.dia) // al pasar de día el reloj se reinicia: volver a dibujar
  const [, setTic] = useState(0)

  useEffect(() => {
    if (!abierto) return
    const id = setInterval(() => {
      avanzarReloj()
      setTic((t) => t + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [abierto])

  return horaReloj()
}
