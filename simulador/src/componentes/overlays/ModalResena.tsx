import { useState, type FormEvent } from 'react'
import { crearResena } from '../../datos/resenas'
import { useUi } from '../../estado/ui'
import { abrirSelectorItinerarios } from '../../guia/estadoGuia'
import { ITINERARIOS, type ClaveItinerario } from '../../guia/itinerarios'
import { SelectorEstrellas } from '../ui/Estrellas'

/** Al terminar una capacitación: felicita y ofrece dejar una reseña (sin registrarse) */
export function ModalResena({ clave }: { clave: ClaveItinerario }) {
  const cerrar = useUi((s) => s.cerrarModal)
  const [puntuacion, setPuntuacion] = useState(0)
  const [nombre, setNombre] = useState('')
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviada, setEnviada] = useState(false)
  const it = ITINERARIOS[clave]

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!puntuacion) return setError('Elegí cuántas estrellas le das.')
    if (!nombre.trim()) return setError('Escribí tu nombre.')
    if (!comentario.trim()) return setError('Escribí un comentario.')
    setError('')
    setEnviando(true)
    try {
      await crearResena({ clave, nombre: nombre.trim(), comentario: comentario.trim(), puntuacion })
      setEnviada(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos guardar la reseña. Probá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const elegirOtra = () => {
    cerrar()
    abrirSelectorItinerarios()
  }

  return (
    <div className="veil" onClick={(e) => { if (e.target === e.currentTarget && !enviando) cerrar() }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="resena-tit">
        <span className="eyebrow">Bien hecho</span>
        <h3 id="resena-tit">Capacitación completada</h3>
        {enviada ? (
          <>
            <p className="form-ok" role="status">¡Gracias! Tu reseña ya aparece en “{it.nombre}”.</p>
            <button type="button" className="btn-s w" onClick={elegirOtra}>Elegir otra capacitación</button>
            <button type="button" className="btn-o w" onClick={cerrar}>Seguir usando la cuenta</button>
          </>
        ) : (
          <form className="form-resena" onSubmit={enviar} noValidate>
            <p>Terminaste “{it.nombre}”. ¿Nos dejás una reseña? Ayuda a otras personas a elegir su capacitación.</p>
            <SelectorEstrellas valor={puntuacion} onCambio={(v) => { setPuntuacion(v); setError('') }} />
            <label>
              <span>Tu nombre</span>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoComplete="given-name" required />
            </label>
            <label>
              <span>Comentario</span>
              <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} rows={4} maxLength={500} required />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn-s w" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar reseña'}</button>
            <button type="button" className="btn-o w" onClick={cerrar} disabled={enviando}>Ahora no</button>
          </form>
        )}
      </div>
    </div>
  )
}
