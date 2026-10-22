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
    nombre: 'Graciela M.', edad: 58, ciudad: 'Rosario', estrellas: 5, actividad: 'Ciclo completo',
    texto: 'Tenía ahorros en plazo fijo y siempre me dio miedo invertir. Practicar con plata ficticia me sacó el miedo: ahora entiendo qué es disponible, comprometido y a liquidar.',
  },
  {
    nombre: 'Roberto A.', edad: 63, ciudad: 'Córdoba', estrellas: 5, actividad: 'Dólar MEP',
    texto: 'Por fin entendí cómo se compra el dólar MEP. Lo de "ver por dentro" con las dos patas del bono me aclaró todo. Después lo hice en mi cuenta real sin problemas.',
  },
  {
    nombre: 'Silvia R.', edad: 51, ciudad: 'CABA', estrellas: 4, actividad: 'Comprar mi primer CEDEAR',
    texto: 'Me gustó que me deje equivocarme. Puse una orden límite que no se ejecutó y la guía me explicó por qué. Eso no lo aprendés leyendo.',
  },
  {
    nombre: 'Jorge L.', edad: 60, ciudad: 'Mendoza', estrellas: 5, actividad: 'Obligaciones Negociables',
    texto: 'No sabía qué era la lámina mínima ni el valor nominal. Con el video y la práctica lo entendí en diez minutos. Muy claro y sin apuro.',
  },
  {
    nombre: 'Mónica P.', edad: 55, ciudad: 'La Plata', estrellas: 4, actividad: 'Vender y retirar',
    texto: 'Siempre me preguntaba por qué no podía sacar la plata apenas vendía. La liquidación a 24 horas ahora tiene sentido. Muy útil.',
  },
  {
    nombre: 'Héctor D.', edad: 67, ciudad: 'Mar del Plata', estrellas: 5, actividad: 'Ciclo completo',
    texto: 'Lo hice con mi hija al lado y después solo. Las letras grandes y los pasos de a uno me ayudaron mucho. Recomendable para gente de mi edad.',
  },
]
