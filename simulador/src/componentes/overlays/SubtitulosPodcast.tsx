import { useEffect, useMemo, useState } from 'react'

interface Cue { ini: number; fin: number; texto: string }

/** "00:01:02.500" o "01:02.500" -> segundos */
function aSegundos(marca: string): number {
  const partes = marca.trim().split(':').map(Number)
  return partes.reduce((acc, n) => acc * 60 + n, 0)
}

/** Parser mínimo de WebVTT: bloques "inicio --> fin" seguidos de una o más líneas de texto */
function parsearVtt(vtt: string): Cue[] {
  const cues: Cue[] = []
  for (const bloque of vtt.replace(/\r/g, '').split(/\n{2,}/)) {
    const lineas = bloque.split('\n')
    const i = lineas.findIndex((l) => l.includes('-->'))
    if (i < 0) continue
    const [ini, fin] = lineas[i].split('-->').map((m) => aSegundos(m.trim().split(/\s+/)[0]))
    const texto = lineas.slice(i + 1).join(' ').trim()
    if (texto && Number.isFinite(ini) && Number.isFinite(fin)) cues.push({ ini, fin, texto })
  }
  return cues.sort((a, b) => a.ini - b.ini)
}

const SIN_CUES: Cue[] = []

// Tamaños de letra (px): la persona elige con A− / A+ y se recuerda entre sesiones
const TAMANOS = [18, 22, 26, 32, 38]
const TAMANO_INICIAL = 2
const CLAVE_TAMANO = 'reproductor-letra-subtitulos'

function indiceInicial(): number {
  try {
    const n = Number(localStorage.getItem(CLAVE_TAMANO))
    if (Number.isInteger(n) && n >= 0 && n < TAMANOS.length && localStorage.getItem(CLAVE_TAMANO) !== null) return n
  } catch { /* sin almacenamiento: queda el tamaño por defecto */ }
  return TAMANO_INICIAL
}

/**
 * Subtítulos sincronizados del podcast, sobre la barra del reproductor y alineados a la izquierda como el recuadro del video.
 * Si el .vtt no existe o falla la descarga, no muestra nada. El cue activo se calcula con el tiempo actual, así sirve al saltar.
 */
export function SubtitulosPodcast({ url, actual }: { url: string | null; actual: number }) {
  const [cargado, setCargado] = useState<{ url: string; cues: Cue[] } | null>(null)
  const [indice, setIndice] = useState(indiceInicial)

  useEffect(() => {
    if (!url) return
    const control = new AbortController()
    fetch(url, { signal: control.signal })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      // Si el servidor devuelve la página (SPA fallback) en vez del .vtt, no hay cues y el panel queda oculto
      .then((t) => setCargado({ url, cues: t.trimStart().startsWith('WEBVTT') ? parsearVtt(t) : [] }))
      .catch(() => { if (!control.signal.aborted) setCargado({ url, cues: [] }) })
    return () => control.abort()
  }, [url])

  // Al cambiar de voz se siguen mostrando los cues anteriores hasta que llegan los nuevos, así el panel no salta de alto
  const cues = cargado ? cargado.cues : SIN_CUES
  // Último cue que ya empezó: entre cues se queda el anterior, así el texto no parpadea
  const activo = useMemo(() => {
    let a: Cue | null = null
    for (const c of cues) { if (c.ini <= actual) a = c; else break }
    return a
  }, [cues, actual])

  const cambiar = (i: number) => {
    setIndice(i)
    try { localStorage.setItem(CLAVE_TAMANO, String(i)) } catch { /* sin almacenamiento */ }
  }

  if (!cues.length) return null
  return (
    <div className="rp-subs" role="region" aria-label="Subtítulos del podcast" style={{ '--letra-subs': `${TAMANOS[indice]}px` } as React.CSSProperties}>
      <p className="rp-subs-texto" data-cue-ini={activo?.ini} data-cue-fin={activo?.fin}>{activo?.texto ?? ''}</p>
      <div className="rp-subs-letra">
        <button type="button" aria-label="Achicar la letra de los subtítulos" disabled={indice === 0} onClick={() => cambiar(indice - 1)}>
          <span aria-hidden="true">A−</span>
        </button>
        <button type="button" aria-label="Agrandar la letra de los subtítulos" disabled={indice === TAMANOS.length - 1} onClick={() => cambiar(indice + 1)}>
          <span aria-hidden="true">A+</span>
        </button>
      </div>
    </div>
  )
}
