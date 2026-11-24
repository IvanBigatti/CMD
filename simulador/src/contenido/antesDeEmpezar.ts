/**
 * Textos de la página "Antes de empezar". Los itinerarios (títulos, módulos y duraciones) no están acá:
 * salen de src/guia/itinerarios.ts para que no se desactualicen.
 * Admiten **negrita**.
 */
export const ANTES_DE_EMPEZAR = {
  titulo: 'Antes de empezar',
  bajada: 'Qué vas a aprender, qué no, y cómo se usa el simulador. Son cinco minutos de lectura que te ahorran dudas después.',
  online: 'La capacitación es **100% online y a tu ritmo**: tomate el tiempo que necesites, cambiá de itinerario o salí de la guía cuando quieras.',

  queEs: {
    titulo: 'Qué es esta capacitación',
    destacado: 'Acá aprendés a usar la aplicación, no a elegir en qué invertir.',
    aviso: {
      tono: 'warn',
      titulo: 'Importante',
      texto: 'Nada de lo que se enseña es una recomendación sobre cómo invertir ni sobre qué activos comprar.',
    },
    publico: 'Está pensada para quienes tienen interés en invertir pero poca o ninguna experiencia. Te mostramos dónde está cada cosa y cómo se opera, pero **no te enseñamos en qué invertir**.',
    rasgos: [
      { icono: '💵', titulo: 'Dinero ficticio', texto: 'Nada de lo que hagas mueve plata real.' },
      { icono: '📈', titulo: 'Precios simulados', texto: 'Los precios de los activos son de ejemplo.' },
      { icono: '⏩', titulo: 'Tiempos acelerados', texto: 'Un día hábil de espera se salta con un botón.' },
    ],
  },

  ciclo: {
    titulo: 'El ciclo completo de una inversión',
    bajada: 'Seis etapas, de la plata que entra a la plata que vuelve a salir.',
    etapas: [
      { modulo: 'M2', titulo: 'Ingresar dinero', texto: 'Desde tu banco a tu cuenta de inversión.' },
      { modulo: 'M3', titulo: 'Comprar dólar MEP', texto: 'Pesos a dólares, con dos operaciones de bonos.' },
      { modulo: 'M4', titulo: 'Comprar', texto: 'Acciones, CEDEARs u obligaciones negociables.' },
      { modulo: 'M5', titulo: 'Seguir tu inversión', texto: 'Cuánto vale y cuánto ganás o perdés.' },
      { modulo: 'M6', titulo: 'Vender', texto: 'Y esperar un día hábil a que se liquide.' },
      { modulo: 'M7', titulo: 'Retirar dinero', texto: 'De vuelta a una cuenta a tu nombre.' },
    ],
    cierre: 'El ciclo termina donde empezó: con la plata disponible en tu cuenta. En **Movimientos** queda anotado cada paso, como una bitácora.',
  },

  afuera: {
    titulo: 'Lo que queda afuera',
    bajada: 'Vas a ver estos botones en el simulador. Si les hacés clic, un aviso te cuenta qué son y por qué todavía no están.',
    items: [
      { titulo: 'Abrir la cuenta', texto: 'Arrancás con la cuenta ya abierta.' },
      { titulo: 'Reportes e impuestos', texto: 'Se leen después del ciclo.' },
      { titulo: 'Cuenta de Estados Unidos', texto: 'Acá lo cubren los CEDEARs.' },
      { titulo: 'Cauciones y opciones', texto: 'Son instrumentos avanzados.' },
      { titulo: 'Fondos, letras y bonos directos', texto: 'Quedan fuera del ciclo que cubrimos.' },
      { titulo: 'Portafolio Simple', texto: 'Acá armás tu cartera vos.' },
      { titulo: 'Estrategias y Academia', texto: 'Son asesoramiento: acá enseña el simulador.' },
      { titulo: 'Alertas y configuración', texto: 'No hacen falta para operar.' },
    ],
  },

  saldos: {
    titulo: 'Tu plata puede estar en tres lugares',
    bajada: 'Es la idea más importante de toda la capacitación. La ves en **Estado de cuenta → Detalle de saldos**.',
    items: [
      { tono: 'disponible', nombre: 'Disponible', frase: 'La podés usar ya.', texto: 'Para comprar o para retirarla a tu banco.', banco: 'En el homebanking: el saldo disponible de tu cuenta.' },
      { tono: 'comprometido', nombre: 'Comprometido', frase: 'Está reservada.', texto: 'Por una orden que mandaste y todavía no se ejecutó.', banco: 'En el homebanking: un pago que quedó en proceso.' },
      { tono: 'aliquidar', nombre: 'A liquidar', frase: 'Es tuya, pero llega mañana.', texto: 'Lo que cobrás por una venta. Al día hábil siguiente pasa a disponible.', banco: 'En el homebanking: una transferencia que se acredita al otro día.' },
    ],
  },

  itinerarios: {
    titulo: 'Elegí tu itinerario',
    bajada: 'Cada uno recorre un tramo del ciclo. Podés cambiarlo cuando quieras.',
  },

  guia: {
    titulo: 'La guía te lleva de la mano',
    pasos: [
      { titulo: 'Te marca dónde tocar', texto: 'La pantalla se oscurece y queda iluminado el botón que tenés que tocar.' },
      { titulo: 'Espera tu clic', texto: 'No avanza sola: el clic lo hacés vos, como en la aplicación real.' },
      { titulo: 'Te explica qué pasó', texto: 'Si hay algo para leer, tocás **Siguiente**. Podés salir cuando quieras.' },
      { titulo: 'Termina con una pregunta', texto: 'Cada itinerario cierra con una **pregunta de verificación**: tenés que responderla bien para terminar. Si te equivocás, te decimos dónde mirar en pantalla.' },
    ],
    reloj: {
      titulo: 'Avanzar 1 día hábil',
      texto: 'Lo que vendés se cobra al día hábil siguiente. Acá no tenés que esperar: tocás este botón de la franja amarilla y el reloj avanza un día.',
    },
  },

  errores: {
    titulo: 'Algunos errores son a propósito',
    bajada: 'Equivocarte acá no cuesta nada, y es la mejor forma de aprender las reglas. La guía te avisa antes con un paso que dice “Probá algo que va a fallar”.',
    columnas: ['Lo que vas a intentar', 'Lo que vas a aprender'],
    filas: [
      { intento: 'Ingresar plata desde la cuenta de otra persona', aprendizaje: 'Solo se opera con cuentas a tu nombre: el simulador rechaza la transferencia y la deja anotada como rechazada en Movimientos.' },
      { intento: 'Elegir KOD queriendo pagar en pesos', aprendizaje: 'Es el mismo activo en otra moneda: la **D** del final significa dólares. Para pagar en pesos se elige KO.' },
      { intento: 'Comprar una obligación negociable fuera de la lámina mínima', aprendizaje: 'La orden se rechaza, te sugiere una cantidad válida y la corregís. Se compra en múltiplos de VN, no en dólares.' },
      { intento: 'Retirar lo que vendiste hoy', aprendizaje: 'Primero tiene que liquidar: un día hábil. Hasta entonces figura como “a liquidar”.' },
    ],
    extra: {
      titulo: 'Probalo por tu cuenta',
      texto: 'Si en una compra ponés un precio límite muy por debajo del mercado, el simulador **no rechaza la orden**: la envía y te avisa que no se ejecuta. Queda anotada como “sin ejecutar”, esperando que alguien venda a ese precio, y puede no ejecutarse nunca. Este caso no está en las guías.',
    },
  },

  recursos: {
    titulo: 'Además del simulador',
    items: [
      { titulo: 'Videos', texto: 'Cinco videos cortos y narrados, uno por itinerario, para ver cómo se hace antes de practicar.' },
      { titulo: 'Podcasts', texto: 'Cinco podcasts, uno por itinerario, en tres voces a elección (Elena, Tomás e Iván). Para escuchar sin mirar la pantalla.' },
      { titulo: 'Guías en PDF', texto: 'Una guía paso a paso para descargar de cada actividad. La encontrás en la página de cada una.' },
      { titulo: 'Infografía', texto: 'El ciclo completo en una hoja A4, para imprimir y tener al lado mientras practicás.', enlace: { archivo: 'completo.png', texto: 'Ver o descargar la infografía' } },
    ],
    resena: 'Al terminar cada itinerario, **puntuá con estrellas de 1 a 5 y contanos qué te costó más**: nos ayuda a mejorarlo.',
  },

  cierre: {
    titulo: '¿Arrancamos?',
    texto: 'Elegí tu itinerario y empezá. Si es tu primera vez, te recomendamos **Ciclo completo**.',
    boton: 'Elegir mi capacitación',
  },
} as const
