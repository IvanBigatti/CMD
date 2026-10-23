// Copia los renders finales de ../videos a public/videos con el nombre que espera src/contenido/videos.ts.
// Uso: npm run videos (volvé a correrlo cada vez que se re-renderiza un video)
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const origen = join(raiz, '..', 'videos')
const destino = join(raiz, 'public', 'videos')

/** Render con voz de cada actividad → nombre en public/videos */
const VIDEOS = {
  'video-1-ingreso-mep/renders/video-1-ingreso-mep.mp4': 'ingreso-mep.mp4',
  'video-2-cedear/renders/Video 2 con voz.mp4': 'cedear.mp4',
  'video-3-on/renders/Video 3 Con voz.mp4': 'on.mp4',
  'video-4-venta-retiro/renders/video-4-venta-retiro.mp4': 'venta-retiro.mp4',
  'video-5-ciclo-completo/renders/video-5-ciclo-completo.mp4': 'ciclo-completo.mp4',
}

mkdirSync(destino, { recursive: true })
let faltan = 0
for (const [desde, hacia] of Object.entries(VIDEOS)) {
  const archivo = join(origen, desde)
  if (!existsSync(archivo)) {
    console.error(`Falta: ${desde}`)
    faltan++
    continue
  }
  copyFileSync(archivo, join(destino, hacia))
  console.log(`${desde} → public/videos/${hacia}`)
}
process.exit(faltan ? 1 : 0)
