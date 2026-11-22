/** Testimonios de ejemplo (mockeados) que se muestran en "Sobre nosotros" y en la portada */
export interface Testimonio {
  nombre: string
  edad: number
  ciudad: string
  /** 1 a 5 */
  estrellas: number
  /** Actividad que hizo */
  actividad: string
  texto: string
}

export const TESTIMONIOS: Testimonio[] = [
  {
    nombre: 'Graciela M.', edad: 24, ciudad: 'Rosario', estrellas: 5, actividad: 'Ciclo completo',
    texto: 'Tenía la cuenta abierta hace meses y nunca me animé a usarla. Practicar con plata ficticia me sacó el miedo: ahora entiendo qué es disponible, comprometido y a liquidar.',
  },
  {
    nombre: 'Roberto A.', edad: 22, ciudad: 'Córdoba', estrellas: 5, actividad: 'Dólar MEP',
    texto: 'Por fin entendí cómo se compra el dólar MEP. Lo de "ver por dentro" con las dos patas del bono me aclaró todo. Después lo hice en mi cuenta real sin problemas.',
  },
  {
    nombre: 'Silvia R.', edad: 19, ciudad: 'CABA', estrellas: 4, actividad: 'Comprar mi primera acción o CEDEAR',
    texto: 'Me gustó que me deje equivocarme. Puse una orden límite que no se ejecutó y la guía me explicó por qué. Eso no lo aprendés leyendo.',
  },
  {
    nombre: 'Jorge L.', edad: 26, ciudad: 'Mendoza', estrellas: 5, actividad: 'Obligaciones Negociables',
    texto: 'No sabía qué era la lámina mínima ni el valor nominal. Con el video y la práctica lo entendí en diez minutos. Muy claro y sin apuro.',
  },
  {
    nombre: 'Mónica P.', edad: 21, ciudad: 'La Plata', estrellas: 4, actividad: 'Vender y retirar',
    texto: 'Siempre me preguntaba por qué no podía sacar la plata apenas vendía. La liquidación a 24 horas ahora tiene sentido. Muy útil.',
  },
  {
    nombre: 'Héctor D.', edad: 28, ciudad: 'Mar del Plata', estrellas: 5, actividad: 'Ciclo completo',
    texto: 'Lo hice a mi ritmo, un rato cada día. Los pasos de a uno y poder repetir cuando me trababa me ayudaron mucho. Recomendable si nunca tocaste la app.',
  },
]
