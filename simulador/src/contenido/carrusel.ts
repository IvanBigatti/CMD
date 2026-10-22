/**
 * Fotos del carrusel de la portada. Los archivos van en public/img/inicio/.
 * Para cambiar una foto: reemplazá el archivo (o agregá uno nuevo) y actualizá esta lista.
 * Fotos de Unsplash (licencia libre: https://unsplash.com/license). Ver public/img/CREDITOS.md.
 */
export interface FotoCarrusel {
  archivo: string
  alt: string
  /** Texto corto que acompaña la foto */
  leyenda: string
}

export const FOTOS_CARRUSEL: FotoCarrusel[] = [
  { archivo: 'pantalla-trading.jpg', alt: 'Pantalla con un gráfico de cotizaciones y puntas de compra y venta', leyenda: 'Aprendé a leer una cotización' },
  { archivo: 'velas.jpg', alt: 'Gráfico de velas japonesas de una acción', leyenda: 'Entendé cómo se mueve un precio' },
  { archivo: 'indices.jpg', alt: 'Mano señalando cotizaciones en un celular frente a un panel de índices', leyenda: 'Operá desde la computadora o el celular' },
  { archivo: 'grafico-monitor.jpg', alt: 'Monitor con un gráfico de velas en alza', leyenda: 'Seguí tu inversión día a día' },
  { archivo: 'analisis.jpg', alt: 'Notebook con un tablero de gráficos y estadísticas', leyenda: 'Mirá tu portafolio de un vistazo' },
]

export const urlFoto = (archivo: string) => `${import.meta.env.BASE_URL}img/inicio/${archivo}`
