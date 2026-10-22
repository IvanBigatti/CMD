import { useEffect, useState } from 'react'
import { urlFoto, type FotoCarrusel } from '../../contenido/carrusel'

const INTERVALO_MS = 6000

const prefiereMenosMovimiento = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Carrusel de fotos con fundido. Pasa solo, salvo que el usuario prefiera menos movimiento o esté encima. */
export function Carrusel({ fotos }: { fotos: FotoCarrusel[] }) {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(prefiereMenosMovimiento)
  const n = fotos.length

  useEffect(() => {
    if (pausado || n < 2) return
    const id = setInterval(() => setActual((a) => (a + 1) % n), INTERVALO_MS)
    return () => clearInterval(id)
  }, [pausado, n])

  const ir = (i: number) => setActual((i + n) % n)

  return (
    <div
      className="carrusel"
      aria-roledescription="carrusel"
      aria-label="Fotos del mercado de capitales"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(prefiereMenosMovimiento())}
    >
      {fotos.map((f, i) => (
        <figure key={f.archivo} className={`car-foto${i === actual ? ' activa' : ''}`} aria-hidden={i !== actual}>
          <img src={urlFoto(f.archivo)} alt={f.alt} loading={i === 0 ? 'eager' : 'lazy'} />
        </figure>
      ))}
      <div className="car-velo" />
      <p className="car-leyenda" aria-live="polite">{fotos[actual]?.leyenda}</p>
      {n > 1 && (
        <div className="car-controles">
          <button type="button" className="car-flecha" aria-label="Foto anterior" onClick={() => ir(actual - 1)}>‹</button>
          <div className="car-puntos">
            {fotos.map((f, i) => (
              <button
                key={f.archivo}
                type="button"
                aria-label={`Ver foto ${i + 1} de ${n}`}
                aria-current={i === actual}
                onClick={() => ir(i)}
              ><i /></button>
            ))}
          </div>
          <button type="button" className="car-flecha" aria-label="Foto siguiente" onClick={() => ir(actual + 1)}>›</button>
        </div>
      )}
    </div>
  )
}
