import type { ClaveItinerario } from '../guia/itinerarios'
import { urlInstructivo } from './instructivos'

/**
 * Textos del plan de capacitación (bloque en "Sobre nosotros" y página #/nosotros/plan).
 * Salen de CMD/ALCANCE.md y de la presentación "Antes de empezar": si cambia el alcance, actualizá los tres.
 * Admiten **negrita**. Los nombres, módulos y duraciones de cada capacitación salen de ITINERARIOS.
 */

/** Infografía "El ciclo de tu inversión" (es el mismo archivo que CMD/A4 · El ciclo de tu inversión.png) */
export const INFOGRAFIA = {
  archivo: 'completo.png',
  titulo: 'El ciclo de tu inversión',
  alt: 'Infografía: el ciclo de tu inversión, desde el ingreso de dinero hasta el retiro',
  nombreDescarga: 'El-ciclo-de-tu-inversion-A4.png',
}
export const urlInfografia = () => urlInstructivo(INFOGRAFIA.archivo)

/** Presentación "Antes de empezar", para descargar (copia de CMD/Antes de empezar — Capacitación IOL.pptx) */
export const PRESENTACION = {
  url: `${import.meta.env.BASE_URL}materiales/antes-de-empezar.pptx`,
  nombreDescarga: 'Antes-de-empezar-Capacitacion-IOL.pptx',
}

export interface Modulo {
  codigo: string
  nombre: string
  /** "Al terminar, vas a poder…" */
  objetivo: string
  /** Capacitaciones donde se practica */
  capacitaciones: ClaveItinerario[]
}

export const PLAN = {
  titulo: 'Plan de capacitación',
  bajada: 'Capacitación en el uso de InvertirOnline (IOL): el ciclo completo de una inversión, practicado en un simulador sin riesgo.',
  institucion: 'Comunicación Multimedial en el Desarrollo de Sistemas de Información · UTN-FRC · 2026',

  /** Ficha resumen (también se muestra en "Sobre nosotros") */
  ficha: [
    { icono: '👥', titulo: 'Para quién', texto: 'Adultos de 45 a 65 años con capacidad de ahorro, que ya usan homebanking y billeteras virtuales pero nunca operaron en el mercado de capitales.' },
    { icono: '💻', titulo: 'Modalidad', texto: 'En línea y a tu ritmo. Sin registrarte y con dinero ficticio.' },
    { icono: '⏱️', titulo: 'Duración', texto: 'Entre 30 y 60 minutos, según la ruta que elijas. Podés hacerla en varias sesiones.' },
    { icono: '✅', titulo: 'Cómo se evalúa', texto: 'En cada capacitación: un cuestionario, un desafío práctico en el simulador y una autoevaluación.' },
  ],

  fundamentacion: [
    'Mucha gente que ahorra y se maneja bien con el homebanking nunca dio el paso de invertir, no por falta de interés sino porque la plataforma le resulta ajena: saldos que no se pueden retirar, órdenes que no se ejecutan, términos nuevos.',
    'Esta capacitación acorta esa distancia con un **simulador** que replica InvertirOnline, con dinero y precios ficticios, donde cada error es parte del aprendizaje y no cuesta nada.',
  ],
  objetivoGeneral: 'Que puedas operar por tu cuenta el ciclo completo de una inversión en InvertirOnline: ingresar dinero, comprar dólar MEP, comprar un activo, seguir tu tenencia, vender, esperar la liquidación y retirar el dinero.',
  aviso: 'Acá aprendés a usar la aplicación, no a elegir en qué invertir. Nada de lo que se enseña es una recomendación de inversión.',

  requisitos: [
    'Manejarte con el homebanking o una billetera virtual (transferencias, saldos, alias).',
    'Saber, en general, qué es un CEDEAR, un bono o el dólar MEP: acá te mostramos **dónde está cada cosa y cómo se opera**.',
    'Una computadora con navegador. Los videos y podcasts se pueden ver en el celular, pero el simulador se aprovecha mejor en pantalla grande.',
  ],

  modulos: [
    { codigo: 'M2', nombre: 'Ingresar dinero', objetivo: 'Transferir desde una cuenta bancaria a tu nombre a la cuenta de inversión, y entender por qué se rechaza la de otra persona.', capacitaciones: ['mep', 'completo'] },
    { codigo: 'M3', nombre: 'Comprar dólar MEP', objetivo: 'Convertir pesos a dólares con dólar MEP y reconocer las dos operaciones con el bono AL30 que hace el sistema por dentro.', capacitaciones: ['mep', 'completo'] },
    { codigo: 'M4', nombre: 'Comprar', objetivo: 'Buscar un activo en Cotizaciones, leer su ficha y armar una orden de compra de un CEDEAR o una obligación negociable, revisando los costos antes de confirmar.', capacitaciones: ['cedear', 'on', 'completo'] },
    { codigo: 'M5', nombre: 'Seguir tu inversión', objetivo: 'Leer el portafolio: tenencia, precio de compra, precio actual y resultado no realizado, en pesos y en dólares.', capacitaciones: ['cedear', 'completo'] },
    { codigo: 'M6', nombre: 'Vender', objetivo: 'Vender lo que tenés y entender por qué el dinero queda "a liquidar" hasta el día hábil siguiente (T+1).', capacitaciones: ['venta', 'completo'] },
    { codigo: 'M7', nombre: 'Retirar dinero', objetivo: 'Retirar el dinero disponible a una cuenta bancaria a tu nombre.', capacitaciones: ['venta', 'completo'] },
  ] satisfies Modulo[],
  cierreModulos: 'El ciclo termina donde empezó: con la plata disponible en tu cuenta. En **Movimientos** queda anotado cada paso, como una bitácora.',

  rutas: [
    { titulo: 'Ruta recomendada', texto: '**Ciclo completo** (18 min de práctica) y su evaluación. Recorre los seis módulos de una sola vez.' },
    { titulo: 'Ruta por tramos', texto: 'Las cuatro capacitaciones por separado (26 min de práctica en total), cada una con su evaluación. Sirve si preferís hacerla en varias sesiones.' },
  ],

  metodologia: [
    { titulo: 'Aprender haciendo', texto: 'Cada capacitación tiene un video corto, un instructivo y una práctica en el simulador, que replica las pantallas y las reglas de la plataforma real.' },
    { titulo: 'Guía paso a paso', texto: 'La pantalla se oscurece y queda iluminado el botón que tenés que tocar. La guía no avanza sola: espera tu clic y te explica qué pasó.' },
    { titulo: 'Errores a propósito', texto: 'La guía te pide que intentes algo que va a fallar, para que conozcas las reglas sin que te cueste nada.' },
    { titulo: 'Tiempos acelerados', texto: 'Lo que en el mercado real tarda un día hábil, acá pasa con el botón **Avanzar 1 día hábil** de la franja amarilla.' },
  ],
  erroresAProposito: [
    ['Ingresar plata desde la cuenta de otra persona', 'Solo se opera con cuentas a tu nombre'],
    ['Comprar fuera de la lámina mínima', 'La orden se rechaza y la corregís'],
    ['Poner un precio que nadie acepta', 'La orden queda esperando sin ejecutarse'],
    ['Retirar lo que vendiste hoy', 'Primero tiene que liquidar: un día hábil'],
  ] as [string, string][],
  tresSaldos: [
    { nombre: 'Disponible', texto: 'La podés usar ya, para comprar o para retirarla a tu banco.', banco: 'Como el saldo disponible de tu cuenta.' },
    { nombre: 'Comprometido', texto: 'Está reservada por una orden de compra que todavía no se liquidó.', banco: 'Como un pago que quedó en proceso.' },
    { nombre: 'A liquidar', texto: 'Es tuya, pero llega al día hábil siguiente: lo que cobrás por una venta.', banco: 'Como una transferencia que se acredita al otro día.' },
  ],

  evaluacion: [
    { titulo: 'Cuestionario', texto: 'Entre 6 y 8 preguntas de opción múltiple sobre el uso de la plataforma, con la explicación de cada respuesta. Se aprueba con el **70 %** de respuestas correctas y se puede repetir.' },
    { titulo: 'Desafío práctico', texto: 'Una consigna para resolver en el simulador **sin guía**. Al tocar "Verificar desafío", el sistema revisa tu cuenta y te dice qué falta.' },
    { titulo: 'Autoevaluación', texto: 'Antes de empezar y al terminar contás qué tan seguro te sentís, de 1 a 5. Así medimos cuánto te sirvió la capacitación.' },
    { titulo: 'Reseñas', texto: 'Al terminar cada práctica guiada podés dejar una reseña: es tu evaluación de la capacitación y nos ayuda a mejorarla.' },
  ],

  alcance: {
    dentro: [
      'Ingreso de dinero desde cuentas de tu misma titularidad',
      'Dólar MEP, con la vista "Ver por dentro"',
      'Compra de acciones, CEDEARs y obligaciones negociables',
      'Tenencia y portafolio, en pesos y en dólares',
      'Venta y liquidación T+1',
      'Retiro de dinero',
      'Movimientos y perfil de inversor',
    ],
    fuera: [
      ['Abrir la cuenta', 'Arrancás con la cuenta ya abierta.'],
      ['Reportes e impuestos', 'Se leen después del ciclo.'],
      ['Cuenta de Estados Unidos', 'Acá lo cubren los CEDEARs.'],
      ['Cauciones y opciones', 'Son instrumentos avanzados.'],
      ['Fondos, letras y bonos directos', 'Quedan fuera del ciclo que cubrimos.'],
      ['Estrategias, Academia y Portafolio Simple', 'Son asesoramiento: acá enseña el simulador.'],
    ] as [string, string][],
    notaFuera: 'En el simulador, esos botones dicen "Próximamente": si los tocás, te explican qué son y por qué no entran.',
  },

  recursos: [
    { icono: '🖥️', titulo: 'Simulador', texto: 'Réplica de la plataforma con dinero y precios ficticios.' },
    { icono: '🎬', titulo: 'Videos', texto: 'Uno por capacitación, de pocos minutos, con la operación de punta a punta.' },
    { icono: '🎧', titulo: 'Podcasts', texto: 'La misma capacitación en audio, para escuchar sin pantalla.' },
    { icono: '📋', titulo: 'Instructivos', texto: 'Los pasos de cada actividad y de cada pantalla, para tener a mano.' },
    { icono: '🖼️', titulo: 'Infografía', texto: 'El ciclo de tu inversión en una hoja A4, para imprimir y tener al lado mientras practicás.' },
    { icono: '📊', titulo: 'Presentación "Antes de empezar"', texto: 'Qué vas a aprender, qué no, y cómo se usa el simulador.' },
  ],
}
