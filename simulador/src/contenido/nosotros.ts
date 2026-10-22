/**
 * Textos de la página "Sobre nosotros". Son de ejemplo: editalos con los datos reales del equipo.
 * Admiten **negrita**.
 */
export const NOSOTROS = {
  nombreEquipo: 'Equipo de Capacitación',
  bajada: 'Acompañamos a personas que nunca invirtieron a dar sus primeros pasos en el mercado de capitales, sin arriesgar su dinero.',
  quienesSomos: [
    'Somos un equipo que diseña capacitaciones prácticas para quienes ya se manejan con el homebanking y las billeteras virtuales, pero **nunca operaron en el mercado de capitales**.',
    'Creemos que a invertir se aprende haciendo. Por eso armamos un simulador que replica la plataforma real de InvertirOnline, con dinero y precios ficticios, donde podés equivocarte sin consecuencias.',
  ],
  valores: [
    { icono: '🧭', titulo: 'Paso a paso', texto: 'Cada actividad te lleva de la mano, con una guía que te señala dónde hacer clic y por qué.' },
    { icono: '🛡️', titulo: 'Sin riesgo', texto: 'Todo es ficticio: el dinero, los precios y las operaciones. Podés probar y volver a empezar cuantas veces quieras.' },
    { icono: '🗣️', titulo: 'En lenguaje llano', texto: 'Explicamos cada concepto anclado en algo que ya conocés del banco, sin tecnicismos innecesarios.' },
  ],
  capacitaciones: [
    'Videos cortos que muestran cada operación de punta a punta.',
    'Práctica guiada en el simulador, con errores a propósito para aprender de ellos.',
    'Instructivos con imágenes en cada sección para consultar cuando lo necesites.',
  ],
} as const
