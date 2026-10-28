import { agregarMovimiento, type DatosSimulador } from '../estado/simulador'
import { ITINERARIOS, type ClaveItinerario } from '../guia/itinerarios'

/**
 * Evaluación de cada capacitación: cuestionario, desafío práctico y autoevaluación.
 *
 * Criterio para todo el banco: se evalúa el USO de la plataforma (dónde está cada cosa y cómo se opera),
 * no conocimientos financieros ni recomendaciones de inversión.
 *
 * Cómo editar una pregunta: cambiá el texto, las opciones o la explicación. La opción correcta se indica
 * con su posición (0 = la primera). En pantalla las opciones se muestran mezcladas.
 * No cambies el `id` de una pregunta que ya tiene respuestas guardadas: los resultados se agrupan por ese id.
 */

export interface Opcion {
  id: string
  texto: string
}

export interface Pregunta {
  id: string
  texto: string
  opciones: Opcion[]
  /** id de la opción correcta */
  correcta: string
  /** Se muestra después de responder. Admite **negrita**. */
  explicacion: string
}

export interface CriterioDesafio {
  texto: string
  cumple: (s: DatosSimulador) => boolean
}

export interface Desafio {
  /** La consigna, en una línea: se muestra en la franja amarilla */
  consigna: string
  /** Lo que se cuenta en la página de la capacitación antes de empezar */
  detalle: string
  /** Cómo queda la cuenta simulada al empezar */
  preparar: (s: DatosSimulador) => void
  criterios: CriterioDesafio[]
}

export interface Evaluacion {
  /** Frase de la autoevaluación: "¿Qué tan seguro te sentís? …" */
  confianza: string
  preguntas: Pregunta[]
  desafio: Desafio
}

/** Capacitaciones que se evalúan: todas menos "Explorar por mi cuenta" */
export type ClaveEvaluable = Exclude<ClaveItinerario, 'libre'>
export const CLAVES_EVALUABLES: ClaveEvaluable[] = ['mep', 'cedear', 'on', 'venta', 'completo']
export const esEvaluable = (c: string): c is ClaveEvaluable => (CLAVES_EVALUABLES as string[]).includes(c)

/** Proporción de respuestas correctas para aprobar el cuestionario */
export const UMBRAL_APROBACION = 0.7
export const aprueba = (puntaje: number, total: number) => total > 0 && puntaje / total >= UMBRAL_APROBACION
/** Cuántas respuestas correctas hacen falta para aprobar */
export const minimoParaAprobar = (total: number) => Math.ceil(total * UMBRAL_APROBACION)

/** Escala de la autoevaluación (1 a 5) */
export const ESCALA_CONFIANZA = ['', 'Nada seguro', 'Poco seguro', 'Más o menos', 'Bastante seguro', 'Muy seguro']

/* ---------- ayudas para escribir el banco ---------- */

const LETRAS = ['a', 'b', 'c', 'd', 'e']

/** Pregunta con sus opciones; `correcta` es la posición de la opción correcta (0 = la primera) */
function p(id: string, texto: string, opciones: string[], correcta: number, explicacion: string): Pregunta {
  return {
    id, texto, explicacion,
    opciones: opciones.map((t, i) => ({ id: LETRAS[i], texto: t })),
    correcta: LETRAS[correcta],
  }
}

/** ¿Hay en la bitácora un movimiento cuyo título empieza así? */
const hizo = (s: DatosSimulador, titulo: string) => s.movimientos.some((m) => m.titulo.startsWith(titulo))

/** ¿Hay una compra o venta de un CEDEAR? Los títulos son "Compra KO", "Venta AAPL", etc. */
const operoCedear = (s: DatosSimulador, lado: 'Compra' | 'Venta') =>
  s.movimientos.some((m) => {
    if (!m.titulo.startsWith(`${lado} `)) return false
    const id = m.titulo.slice(lado.length + 1)
    return s.inst[id]?.tipo === 'cedear'
  })

/* ---------- banco de preguntas ---------- */

const MEP = {
  titularidad: p('mep-titularidad', '¿Desde qué cuentas podés transferir dinero a tu cuenta de inversión?', [
    'Desde cualquier cuenta bancaria',
    'Solo desde cuentas a tu nombre (misma titularidad)',
    'Desde cuentas de familiares directos',
    'Solo con depósitos en efectivo',
  ], 1, 'Solo se aceptan transferencias desde cuentas de tu **misma titularidad** (mismo CUIT). Si probás con la cuenta de otra persona, la transferencia se rechaza.'),

  comitente: p('mep-comitente', 'La cuenta de inversión (cuenta comitente) es…', [
    'Una caja de ahorro como la del banco',
    'Una cuenta para comprar y vender títulos',
    'Una billetera virtual',
    'Un plazo fijo',
  ], 1, 'No es una cuenta bancaria: la cuenta comitente existe para **comprar y vender títulos**. A ella transferís desde tu banco.'),

  al30: p('mep-al30', 'Cuando comprás dólar MEP, ¿qué hace el sistema por dentro?', [
    'Te vende dólares billete',
    'Compra el bono AL30 en pesos y lo vende como AL30D en dólares',
    'Le pide los dólares al Banco Central',
    'Cambia tus pesos con otro usuario de la plataforma',
  ], 1, 'Son **dos operaciones con bonos**: compra AL30 en pesos y lo vende en dólares (AL30D). Lo ves activando **Ver por dentro**.'),

  minimo: p('mep-minimo', '¿Cuál es el monto mínimo para comprar dólar MEP?', [
    '$1.000', '$5.000', '$50.000', 'No hay mínimo',
  ], 1, 'El mínimo es de **$5.000** (o US$ 5 para vender).'),

  hoy: p('mep-hoy', '¿Por qué los dólares MEP llegan a tu cuenta en el día?', [
    'Porque es una transferencia bancaria',
    'Porque las dos operaciones van en Contado Inmediato',
    'Porque es tu primera operación',
    'No llegan en el día: tardan 24 hs',
  ], 1, 'Las dos patas con el bono se hacen en **Contado Inmediato**, por eso los dólares están disponibles hoy.'),

  horario: p('mep-horario', '¿Cuándo se puede operar dólar MEP?', [
    'Las 24 horas, todos los días',
    'Los días hábiles de 10:30 a 17:00',
    'Todos los días de 9 a 18',
    'Solo los fines de semana',
  ], 1, 'Se opera los **días hábiles de 10:30 a 17:00**. Fuera de ese horario la orden queda para el próximo día hábil.'),
}

const CEDEAR = {
  donde: p('cedear-donde', '¿Dónde encontrás los CEDEARs para comprar?', [
    'En Cotizaciones, pestaña Cedears',
    'En Mi Cuenta → Movimientos',
    'En Portafolio',
    'En Herramientas',
  ], 0, 'En **Cotizaciones** elegís la pestaña **Cedears** y tocás una especie para abrir su ficha.'),

  ratio: p('cedear-ratio', 'Coca-Cola (KO) tiene un ratio de 5:1. ¿Qué significa?', [
    'Hacen falta 5 CEDEARs para equivaler a 1 acción',
    'Cada CEDEAR equivale a 5 acciones',
    'Pagás un 5 % de comisión',
    'Sube 5 veces más que la acción',
  ], 0, 'El ratio dice **cuántos CEDEARs equivalen a una acción**. Con 5:1, cinco CEDEARs de KO son una acción de Coca-Cola.'),

  punta: p('cedear-punta', 'Si comprás a mercado, ¿a qué precio comprás?', [
    'Al de la punta vendedora (lo que piden los que venden)',
    'Al último precio operado',
    'Al de la punta compradora',
    'Al precio que elijas',
  ], 0, 'Una compra a mercado se ejecuta contra la **punta vendedora**, que suele ser un poco más cara que el último operado.'),

  limite: p('cedear-limite', '¿Qué pasa con una orden con precio límite?', [
    'Solo se ejecuta si el precio llega al que fijaste, y puede no ejecutarse nunca',
    'Se ejecuta siempre, al instante',
    'Tiene menos comisión',
    'Solo sirve para vender',
  ], 0, 'Con **precio límite** ponés tu precio y esperás: si el mercado no llega, la orden **queda sin ejecutarse**.'),

  costos: p('cedear-costos', '¿Qué costos te muestra la plataforma antes de confirmar una compra?', [
    'Comisión, derechos de mercado e IVA',
    'Solo la comisión',
    'Ninguno: aparecen después',
    'El impuesto a las ganancias',
  ], 0, 'Antes de confirmar ves el detalle: **comisión, derechos de mercado e IVA**. También queda desglosado en el boleto.'),

  monto: p('cedear-monto', 'Si comprás "por monto" (por ejemplo, $200.000 de CEDEARs), el sistema…', [
    'Calcula cuántos entran y redondea para abajo',
    'Redondea para arriba',
    'Compra fracciones de CEDEAR',
    'Rechaza la orden',
  ], 0, 'Con monto, el sistema **calcula cuántos CEDEARs entran y redondea para abajo**, para no pasarse.'),

  resultado: p('cedear-resultado', 'En el portafolio, ¿de qué depende el resultado de un CEDEAR medido en pesos?', [
    'Solo de la acción',
    'Solo del dólar',
    'De la acción y del tipo de cambio',
    'De la comisión que pagaste',
  ], 2, 'Un CEDEAR depende de **dos cosas a la vez**: el precio de la acción afuera y el tipo de cambio. Probá cambiar la moneda del portafolio.'),
}

const ON = {
  ficha: p('on-ficha', 'Antes de comprar una ON, ¿qué tenés que mirar en su ficha?', [
    'La lámina mínima y el calendario de renta',
    'Solo la variación del día',
    'El ratio de conversión',
    'Nada: se compra por monto en dólares',
  ], 0, 'En la ficha de una ON fijate la **lámina mínima** (la cantidad mínima y sus múltiplos) y **cuándo paga renta**.'),

  vn: p('on-vn', 'En la orden de compra de una ON, la cantidad se carga en…', [
    'Dólares', 'Pesos', 'Valores nominales (VN)', 'Porcentaje',
  ], 2, 'La cantidad va en **valores nominales (VN)**, no en dólares.'),

  precio: p('on-precio', 'El precio de una ON se expresa…', [
    'Cada 100 VN', 'Por cada VN', 'Por lámina', 'En pesos por unidad',
  ], 0, 'Las ON **cotizan cada 100 VN**. Un precio de 99,40 significa US$ 99,40 por cada 100 VN.'),

  lamina: p('on-lamina', 'La ON YMCJO tiene una lámina mínima de 100 VN. ¿Cuál de estas cantidades es válida?', [
    '550 VN', '1.000 VN', '50 VN', '1.250 VN',
  ], 1, 'La cantidad tiene que ser **múltiplo de la lámina**: 1.000 VN sirve; 550, 50 y 1.250 no.'),

  noEsUsd: p('on-no-es-usd', '¿Comprar 1.000 VN de una ON es lo mismo que invertir US$ 1.000?', [
    'Sí, siempre',
    'No: lo que pagás depende del precio cada 100 VN',
    'Solo si la ON es en dólares',
    'Solo al vencimiento',
  ], 1, 'VN no es dinero: lo que pagás sale de **multiplicar los VN por el precio cada 100 VN**, más los costos.'),

  rechazo: p('on-rechazo', 'Si cargás una cantidad que no respeta la lámina mínima…', [
    'Se compra igual',
    'La orden se rechaza y tenés que corregirla',
    'Se redondea sola, sin avisarte',
    'Te cobran un recargo',
  ], 1, 'La plataforma **rechaza la orden** y te avisa. Corregís la cantidad a un múltiplo válido y la volvés a mandar.'),
}

const VENTA = {
  aLiquidar: p('venta-a-liquidar', 'Vendiste con plazo "Normal (24 hs)". ¿Dónde aparece el dinero de la venta?', [
    'En disponible', 'En a liquidar', 'En comprometido', 'Directamente en tu banco',
  ], 1, 'Queda **a liquidar**: lo ves en tu cuenta, pero recién al día hábil siguiente pasa a disponible.'),

  t1: p('venta-t1', '¿Qué significa T+1?', [
    'Que la operación se liquida un día hábil después',
    'Que se cobra un 1 % de comisión',
    'Que hay que esperar una semana',
    'Que la orden se manda al día siguiente',
  ], 0, 'T+1 es **un día hábil después** de operar. En el simulador lo hacés pasar con **Avanzar 1 día hábil**.'),

  retirar: p('venta-retirar', '¿Podés retirar a tu banco el dinero que está "a liquidar"?', [
    'Sí, en cualquier momento',
    'No: solo se puede retirar el disponible',
    'Sí, pagando una comisión',
    'Solo si es en dólares',
  ], 1, 'Solo se retira el **disponible**. Lo que está a liquidar tiene que esperar la liquidación.'),

  punta: p('venta-punta', 'Una venta a mercado se ejecuta…', [
    'Al precio de la punta compradora (lo que ofrecen los que compran)',
    'Al precio de la punta vendedora',
    'Al precio al que compraste',
    'Al precio que elijas',
  ], 0, 'Al vender a mercado, se ejecuta contra la **punta compradora**.'),

  simbolo: p('venta-simbolo', 'En la pantalla Vender, el símbolo…', [
    'Se escribe libremente',
    'Se elige de una lista con lo que ya tenés en cartera',
    'Es siempre el último que compraste',
    'No hace falta completarlo',
  ], 1, 'A diferencia de la compra, **solo podés elegir lo que tenés en cartera**.'),

  noRealizado: p('venta-no-realizado', 'Antes de vender, el resultado que muestra el portafolio es…', [
    'Realizado', 'No realizado', 'Dinero ya cobrado', 'Fijo, no cambia',
  ], 1, 'Es **no realizado**: cambia con el precio y se vuelve real recién cuando vendés.'),

  destino: p('venta-destino', '¿A dónde va el dinero cuando lo retirás?', [
    'A cualquier cuenta que elijas',
    'A una cuenta bancaria a tu nombre',
    'A una billetera virtual',
    'Se retira en efectivo',
  ], 1, 'El retiro va a una **cuenta bancaria a tu nombre**, igual que el ingreso.'),
}

const CICLO = {
  orden: p('completo-orden', '¿Cuál es el orden correcto del ciclo de una inversión?', [
    'Ingresar dinero → comprar → seguir la tenencia → vender → esperar la liquidación → retirar',
    'Comprar → ingresar dinero → vender → retirar → esperar la liquidación',
    'Ingresar dinero → vender → comprar → retirar',
    'Comprar → vender → retirar → ingresar dinero',
  ], 0, 'El ciclo empieza y termina igual: **con el dinero disponible**. Ingresás, comprás, seguís la tenencia, vendés, esperás la liquidación y retirás.'),

  comprometido: p('completo-comprometido', 'En el detalle de saldos, el dinero "comprometido" es…', [
    'Dinero reservado por una orden de compra que todavía no se liquidó',
    'Lo que podés retirar hoy',
    'Una deuda con la plataforma',
    'Lo que pagaste de comisión',
  ], 0, 'Está **reservado** por una orden que mandaste. Es como un pago que quedó en proceso en el homebanking.'),
}

/* ---------- evaluaciones ---------- */

export const EVALUACIONES: Record<ClaveEvaluable, Evaluacion> = {
  mep: {
    confianza: 'Puedo ingresar dinero y comprar dólar MEP sin ayuda.',
    preguntas: [MEP.titularidad, MEP.comitente, MEP.al30, MEP.minimo, MEP.hoy, MEP.horario],
    desafio: {
      consigna: 'Ingresá $500.000 desde tu cuenta y convertí una parte a dólar MEP',
      detalle: 'La cuenta arranca vacía. Ingresá $500.000 desde una cuenta a tu nombre y después comprá dólar MEP con una parte de esos pesos.',
      preparar: ITINERARIOS.mep.preparar,
      criterios: [
        { texto: 'Ingresaste dinero desde una cuenta a tu nombre', cumple: (s) => hizo(s, 'Ingreso de dinero') },
        { texto: 'Compraste dólar MEP', cumple: (s) => hizo(s, 'Compra de dólar MEP') },
        { texto: 'Tenés dólares disponibles en la cuenta', cumple: (s) => s.saldo.USD.disponible > 0 },
      ],
    },
  },

  cedear: {
    confianza: 'Puedo comprar un CEDEAR y revisar sus costos sin ayuda.',
    preguntas: [CEDEAR.donde, CEDEAR.ratio, CEDEAR.punta, CEDEAR.limite, CEDEAR.costos, CEDEAR.monto, CEDEAR.resultado],
    desafio: {
      consigna: 'Comprá CEDEARs de Apple (AAPL) por cerca de $200.000',
      detalle: 'Tenés $900.000 en la cuenta. Buscá Apple (AAPL), revisá los costos antes de confirmar y comprá por cerca de $200.000.',
      preparar: ITINERARIOS.cedear.preparar,
      criterios: [
        { texto: 'Compraste CEDEARs de Apple (AAPL)', cumple: (s) => (s.posiciones.AAPL?.cantidad ?? 0) > 0 },
      ],
    },
  },

  on: {
    confianza: 'Puedo invertir en una Obligación Negociable respetando la lámina mínima.',
    preguntas: [ON.ficha, ON.vn, ON.precio, ON.lamina, ON.noEsUsd, ON.rechazo],
    desafio: {
      consigna: 'Invertí en la ON de Pan American (PNDCO) respetando su lámina mínima',
      detalle: 'Tenés US$ 3.000. Buscá la ON PNDCO, fijate su lámina mínima en la ficha y comprá una cantidad válida.',
      // Solo los dólares: a diferencia de la práctica guiada, no dejamos ningún símbolo cargado
      preparar: (s) => {
        s.saldo.USD.disponible = 3000
        agregarMovimiento(s, 'Acreditación de dólares', 'Compra de dólar MEP', 3000, 'USD', ['Acreditado', 'ok'])
      },
      criterios: [
        { texto: 'Compraste la ON PNDCO con una cantidad válida', cumple: (s) => (s.posiciones.PNDCO?.cantidad ?? 0) > 0 },
      ],
    },
  },

  venta: {
    confianza: 'Puedo vender, esperar la liquidación y retirar el dinero sin ayuda.',
    preguntas: [VENTA.aLiquidar, VENTA.t1, VENTA.retirar, VENTA.punta, VENTA.simbolo, VENTA.noRealizado, VENTA.destino],
    desafio: {
      consigna: 'Vendé tus CEDEARs de Coca-Cola y transferí el dinero a tu banco',
      detalle: 'Tenés 30 CEDEARs de Coca-Cola (KO). Vendelos todos, esperá la liquidación y retirá el dinero a tu cuenta bancaria.',
      preparar: ITINERARIOS.venta.preparar,
      criterios: [
        { texto: 'Vendiste todos tus CEDEARs de Coca-Cola', cumple: (s) => hizo(s, 'Venta KO') && !s.posiciones.KO },
        { texto: 'Esperaste la liquidación (avanzaste un día hábil)', cumple: (s) => hizo(s, 'Liquidación de venta') },
        { texto: 'Retiraste el dinero a tu banco', cumple: (s) => hizo(s, 'Retiro de dinero') },
      ],
    },
  },

  completo: {
    confianza: 'Puedo hacer una inversión de punta a punta sin ayuda.',
    preguntas: [MEP.titularidad, MEP.al30, CEDEAR.punta, CEDEAR.costos, ON.vn, VENTA.aLiquidar, CICLO.orden, CICLO.comprometido],
    desafio: {
      consigna: 'Ingresá dinero, comprá dólar MEP, comprá un CEDEAR, vendelo y retirá',
      detalle: 'La cuenta arranca vacía. Hacé el ciclo entero por tu cuenta: ingresá dinero, comprá dólar MEP, comprá un CEDEAR, vendelo, esperá la liquidación y retirá.',
      preparar: ITINERARIOS.completo.preparar,
      criterios: [
        { texto: 'Ingresaste dinero', cumple: (s) => hizo(s, 'Ingreso de dinero') },
        { texto: 'Compraste dólar MEP', cumple: (s) => hizo(s, 'Compra de dólar MEP') },
        { texto: 'Compraste un CEDEAR', cumple: (s) => operoCedear(s, 'Compra') },
        { texto: 'Vendiste un CEDEAR', cumple: (s) => operoCedear(s, 'Venta') },
        { texto: 'Esperaste la liquidación de la venta', cumple: (s) => hizo(s, 'Liquidación de venta') },
        { texto: 'Retiraste el dinero', cumple: (s) => hizo(s, 'Retiro de dinero') },
      ],
    },
  },
}

/** Todas las preguntas por id (para mostrar los textos en la página de resultados) */
export const PREGUNTAS_POR_ID: Record<string, Pregunta> = Object.fromEntries(
  Object.values(EVALUACIONES).flatMap((e) => e.preguntas.map((q) => [q.id, q])),
)
