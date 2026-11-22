// Genera una guía en PDF por actividad a partir de src/contenido/instructivos.ts (fuente de verdad).
// Uso: npm run guias (funciona sin conexión; vuelve a correrlo cada vez que cambie un instructivo)
// Escribe public/guias/<clave>.pdf y src/contenido/guias.ts (lista de guías disponibles para el sitio).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import PDFDocument from 'pdfkit'
// Node quita los tipos al importar .ts (npm run guias pasa --experimental-strip-types)
import { INSTRUCTIVOS_ACTIVIDAD } from '../src/contenido/instructivos.ts'
import { AVISO_SEGURIDAD } from '../src/contenido/seguridad.ts'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const salida = join(raiz, 'public', 'guias')
const publico = join(raiz, 'public', 'instructivos')

const COLOR = { indigo: '#06083F', violeta: '#6439FF', texto: '#1A1A2E', suave: '#5B5C8C', linea: '#E2E0EE', lavanda: '#EEEDF8' }
const MARGEN = 56

/** Quita los ** de negrita para medir texto */
const plano = (t) => t.replaceAll('**', '')

/** Escribe un texto con **negrita** en el punto indicado, con corte de línea automático */
function textoRico(doc, texto, x, y, ancho, tam) {
  const partes = texto.split('**')
  doc.fontSize(tam).fillColor(COLOR.texto)
  let primero = true
  partes.forEach((parte, i) => {
    if (!parte) return
    doc.font(i % 2 ? 'Helvetica-Bold' : 'Helvetica')
    const ultima = i === partes.length - 1 || partes.slice(i + 1).every((p) => !p)
    const opc = { continued: !ultima, width: ancho, lineGap: 3 }
    // Solo el primer fragmento lleva posición; los siguientes continúan en la misma línea
    if (primero) doc.text(parte, x, y, opc)
    else doc.text(parte, opc)
    primero = false
  })
}

function dibujar(clave, c) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGEN, bottom: MARGEN + 12, left: MARGEN, right: MARGEN },
    bufferPages: true,
    info: { Title: c.titulo, Author: 'Capacitación InvertirOnline', Subject: 'Guía paso a paso del simulador' },
  })
  const chunks = []
  doc.on('data', (b) => chunks.push(b))
  const ancho = doc.page.width - MARGEN * 2
  const fondo = () => doc.page.height - doc.page.margins.bottom

  // Cabecera
  doc.rect(0, 0, doc.page.width, 8).fill(COLOR.violeta)
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COLOR.violeta)
    .text('GUÍA EN PDF · CAPACITACIÓN INVERTIRONLINE', MARGEN, MARGEN - 8, { characterSpacing: 1.2 })
  doc.moveDown(0.6)
  doc.font('Helvetica-Bold').fontSize(23).fillColor(COLOR.indigo).text(c.titulo, MARGEN, doc.y, { width: ancho, lineGap: 2 })
  if (c.intro) {
    doc.moveDown(0.6)
    textoRico(doc, c.intro, MARGEN, doc.y, ancho, 12)
  }
  doc.moveDown(1.2)
  doc.font('Helvetica-Bold').fontSize(13).fillColor(COLOR.indigo).text('Paso a paso', MARGEN, doc.y)
  doc.moveDown(0.6)

  // Pasos numerados
  c.pasos.forEach((paso, i) => {
    doc.font('Helvetica').fontSize(12)
    const alto = doc.heightOfString(plano(paso), { width: ancho - 34, lineGap: 3 })
    if (doc.y + alto > fondo()) doc.addPage()
    const y = doc.y
    doc.circle(MARGEN + 11, y + 8, 11).fill(COLOR.violeta)
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#FFFFFF')
      .text(String(i + 1), MARGEN, y + 3, { width: 22, align: 'center', lineBreak: false })
    textoRico(doc, paso, MARGEN + 34, y, ancho - 34, 12)
    doc.y = Math.max(doc.y, y + 22) + 9
  })

  // Aviso de seguridad (el mismo del sitio)
  doc.font('Helvetica').fontSize(10.5)
  const cuerpo = plano(AVISO_SEGURIDAD.texto)
  const altoAviso = 26 + doc.heightOfString(cuerpo, { width: ancho - 28 })
  if (doc.y + altoAviso + 10 > fondo()) doc.addPage()
  const ya = doc.y + 6
  doc.roundedRect(MARGEN, ya, ancho, altoAviso, 5).fill(COLOR.lavanda)
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(COLOR.indigo).text(AVISO_SEGURIDAD.titulo, MARGEN + 14, ya + 9, { width: ancho - 28 })
  doc.font('Helvetica').fontSize(10.5).fillColor(COLOR.texto).text(cuerpo, MARGEN + 14, doc.y + 2, { width: ancho - 28 })
  doc.y = ya + altoAviso + 8
  doc.font('Helvetica').fontSize(9.5).fillColor(COLOR.suave)
    .text('Todo lo que se practica en el simulador es ficticio: dinero, precios y operaciones.', MARGEN, doc.y, { width: ancho })

  // Infografía del módulo, si el instructivo la referencia
  if (c.imagen) {
    const archivo = join(publico, c.imagen.archivo)
    if (existsSync(archivo)) {
      doc.addPage()
      doc.font('Helvetica-Bold').fontSize(13).fillColor(COLOR.indigo).text('Infografía', MARGEN, MARGEN - 8)
      const arriba = doc.y + 8
      doc.image(archivo, MARGEN, arriba, { fit: [ancho, fondo() - arriba], align: 'center', valign: 'top' })
    } else {
      console.warn(`  (falta la imagen ${c.imagen.archivo}, se omite)`)
    }
  }

  // Pie con número de página
  const { count } = doc.bufferedPageRange()
  for (let p = 0; p < count; p++) {
    doc.switchToPage(p)
    doc.page.margins.bottom = 0 // evita que escribir en el pie agregue una página
    doc.font('Helvetica').fontSize(8.5).fillColor(COLOR.suave)
      .text(`Capacitación InvertirOnline · ${clave} · página ${p + 1} de ${count}`, MARGEN, doc.page.height - 34, { width: ancho, align: 'center', lineBreak: false })
  }
  doc.end()
  return new Promise((resolve) => doc.on('end', () => resolve({ buffer: Buffer.concat(chunks), paginas: count })))
}

mkdirSync(salida, { recursive: true })
const generadas = []
for (const [clave, contenido] of Object.entries(INSTRUCTIVOS_ACTIVIDAD)) {
  const { buffer, paginas } = await dibujar(clave, contenido)
  const archivo = join(salida, `${clave}.pdf`)
  writeFileSync(archivo, buffer)
  // Verificación: tamaño, cabecera y cantidad de páginas escritas en el propio archivo
  const leido = readFileSync(archivo)
  const real = (leido.toString('latin1').match(/\/Type \/Page\b(?!s)/g) ?? []).length
  if (leido.length === 0 || leido.subarray(0, 5).toString() !== '%PDF-' || real !== paginas) {
    console.error(`PDF inválido: ${clave}.pdf (tamaño ${leido.length}, páginas ${real}/${paginas})`)
    process.exit(1)
  }
  console.log(`public/guias/${clave}.pdf  ${(leido.length / 1024).toFixed(1)} KB  ${real} pág.`)
  generadas.push(clave)
}

// El sitio muestra el enlace de descarga solo para las claves de esta lista
writeFileSync(
  join(raiz, 'src', 'contenido', 'guias.ts'),
  `// Archivo generado por \`npm run guias\`: no lo edites a mano.
export const GUIAS_PDF: readonly string[] = ${JSON.stringify(generadas)}

/** Ruta pública de la guía en PDF de una actividad, o null si todavía no se generó */
export function urlGuia(clave: string): string | null {
  return GUIAS_PDF.includes(clave) ? \`\${import.meta.env.BASE_URL}guias/\${clave}.pdf\` : null
}
`,
)
