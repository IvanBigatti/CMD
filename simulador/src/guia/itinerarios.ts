import { precio } from '../dominio/mercado'
import type { Pantalla } from '../dominio/tipos'
import { agregarMovimiento, type DatosSimulador } from '../estado/simulador'

export interface PasoGuia {
  titulo: string
  cuerpo: string
  /** Valor del atributo data-tour del elemento a resaltar (null = globo centrado) */
  objetivo: string | null
  pantalla: Pantalla
  /** 'siguiente': se avanza con el botón · 'clic': hay que hacer clic en el elemento resaltado */
  accion: 'siguiente' | 'clic'
}

export interface Itinerario {
  nombre: string
  descripcion: string
  modulos: string
  duracion: string
  recomendado?: boolean
  preparar: (s: DatosSimulador) => void
  pasos: PasoGuia[]
}

export const selectorTour = (objetivo: string) => `[data-tour="${objetivo}"]`

const info = (titulo: string, cuerpo: string, objetivo: string | null, pantalla: Pantalla): PasoGuia =>
  ({ titulo, cuerpo, objetivo, pantalla, accion: 'siguiente' })
const clic = (titulo: string, cuerpo: string, objetivo: string, pantalla: Pantalla): PasoGuia =>
  ({ titulo, cuerpo, objetivo, pantalla, accion: 'clic' })

/* ---------- tramos reutilizables ---------- */

const S_INGRESO = [
  clic('Empezá por acá', 'Para invertir, primero tiene que haber plata en tu cuenta de inversión. En la tarjeta de Argentina, hacé clic en “Ingresar dinero”.', 'qa-ingresar', 'inicio'),
  info('Esto no es una cuenta bancaria', 'Es una cuenta comitente: existe para comprar y vender títulos. El alias de la izquierda es adonde vas a transferir desde tu banco.', 'origen-list', 'ingresar'),
  clic('Probá algo que va a fallar', 'Elegí la cuenta de María G. Suárez, que está a nombre de otra persona. Quiero que veas qué pasa.', 'origen-tercero', 'ingresar'),
  clic('Ahora sí, la tuya', 'Solo podés fondear desde cuentas de tu misma titularidad. Elegí la del Banco Nación.', 'origen-propia', 'ingresar'),
  clic('Confirmá la transferencia', 'Ya está cargado un monto de ejemplo, podés cambiarlo. Cuando estés listo, confirmá.', 'confirmar-ingreso', 'ingresar'),
]

const S_MEP = [
  clic('Comprar dólares', 'En “Te recomendamos” está Dólar MEP Simple. Hacé clic en Comprar. También está en Operar → Compra Dólar MEP Simple.', 'qa-mep', 'inicio'),
  info('El tipo de cambio', 'Acá ves cuántos dólares vas a recibir y a qué tipo de cambio. No hay límite de monto ni trámite: el mínimo es $5.000.', 'mep-tc', 'mep'),
  clic('Mirá qué hace por debajo', 'Esto no es “comprar dólares” como en una casa de cambio. Hacé clic en “Ver por dentro”.', 'mep-verpordentro', 'mep'),
  info('Son dos operaciones de bonos', 'El sistema compra un bono en pesos (AL30) y lo vende en dólares (AL30D). Esa diferencia es el dólar MEP. Las dos patas van en Contado Inmediato, por eso los dólares llegan hoy.', 'mep-patas', 'mep'),
  clic('Comprá', 'Confirmá la operación.', 'mep-confirmar', 'mep'),
]

const S_COMPRA = [
  clic('Andá a Cotizaciones', 'En el menú de arriba, hacé clic en “Cotizaciones” para ver qué se puede comprar.', 'nav-cotizaciones', 'inicio'),
  clic('Buscá los CEDEARs', 'Un CEDEAR te deja comprar una empresa extranjera desde acá, en pesos.', 'tab-cedears', 'mercado'),
  clic('Elegí Coca-Cola', 'Vamos con KO, que es la más tranquila del grupo.', 'inst-KO', 'mercado'),
  info('El ratio es la clave', 'Un CEDEAR no es una acción entera: acá hacen falta 5 para equivaler a una acción de Coca-Cola. El precio en pesos sale de dividir el precio en dólares por el ratio y multiplicar por el tipo de cambio.', 'caja-puntas', 'activo'),
  info('Hay dos precios, no uno', 'La caja de puntas muestra a cuánto compran y a cuánto venden los demás. Si comprás a mercado vas a pagar la punta vendedora, que es un poco más cara que el último operado.', 'caja-puntas', 'activo'),
  clic('Comprar', 'Esto te lleva a la pantalla de orden con el símbolo ya cargado. También podés llegar por Operar → Comprar y escribirlo a mano.', 'btn-comprar', 'activo'),
  info('Esta es la orden', 'Seis campos. Mercado, plazo, símbolo, cuánto, a qué precio y hasta cuándo vale la orden.', 'form-comprar', 'comprar'),
  info('Cantidad o monto', 'Podés pedir “10 CEDEARs” o “$200.000 de CEDEARs”. Con monto, el sistema calcula cuántos entran y redondea para abajo.', 'campo-cantidad', 'comprar'),
  info('A mercado o con límite', 'A mercado se ejecuta ya, al mejor precio que haya. Con límite ponés tu precio y esperás: puede no ejecutarse nunca.', 'campo-modalidad', 'comprar'),
  info('Mirá esto antes de seguir', 'Tu dinero disponible cambia según el plazo. En contado inmediato tenés menos que a 24 hs, porque lo que cobraste por una venta reciente todavía no liquidó.', 'montos-disponibles', 'comprar'),
  clic('Enviá la orden', 'Hacé clic en Comprar. Todavía no se ejecuta: primero te muestra el detalle.', 'btn-comprar-submit', 'comprar'),
  info('Acá está el costo', 'Comisión, derechos de mercado e IVA. Este es el momento de mirarlo: es lo que te van a cobrar de verdad.', 'costos-confirmacion', 'comprar'),
  clic('Confirmá', 'Esto no es un pago: es una orden que sale al mercado.', 'confirmar-orden', 'comprar'),
]

const S_TENENCIA = [
  info('El boleto', 'Este es el comprobante de la operación. Abajo de todo ves cuánto te costó operar, en plata y en porcentaje.', 'boleto-detalle', 'boleto'),
  clic('Andá a Portafolio', 'En el menú de arriba, hacé clic en “Portafolio”.', 'nav-portafolio', 'boleto'),
  info('Tu cartera', 'Acá está tu inversión, con el precio de compra, el actual y el resultado. Si comprás un CEDEAR, ese resultado depende de dos cosas a la vez: la acción y el dólar.', 'pos-lista', 'portafolio'),
  info('Probá cambiar la moneda', 'El mismo portafolio rinde distinto medido en pesos y en dólares. Cambiá el selector y compará los tres números de arriba.', 'toggle-moneda', 'portafolio'),
]

const S_ON = [
  clic('Abrí el menú Operar', 'Esta vez vamos directo a la pantalla de compra.', 'nav-operar', 'inicio'),
  clic('Comprar', 'Entrá al formulario de orden.', 'menu-comprar', 'inicio'),
  info('Escribí el símbolo', 'Ya cargamos YMCJO, una obligación negociable de YPF en dólares. Fijate lo que aparece debajo del campo: cotiza cada 100 VN y tiene lámina mínima.', 'campo-simbolo', 'comprar'),
  info('La cantidad va en VN', 'No ponés dólares: ponés valores nominales, y en múltiplos de la lámina mínima. Comprar 1.000 VN no es comprar US$ 1.000.', 'campo-cantidad', 'comprar'),
  clic('Probá que falle', 'Dejá 550 VN, que no es múltiplo de la lámina de 100 VN, y mandá la orden. Quiero que veas el rechazo.', 'btn-comprar-submit', 'comprar'),
  info('Ahí está', 'Corregí la cantidad a un múltiplo válido — 1.000 VN sirve — y volvé a mandarla.', 'campo-cantidad', 'comprar'),
  clic('Mandala de nuevo', 'Con la cantidad corregida.', 'btn-comprar-submit', 'comprar'),
  clic('Confirmá', 'Revisá el detalle y confirmá.', 'confirmar-orden', 'comprar'),
  info('Ya sos acreedor de YPF', 'Desde ahora te van a pagar intereses dos veces por año, en dólares, hasta el vencimiento.', 'boleto-detalle', 'boleto'),
]

const S_VENTA = [
  clic('Abrí el menú Operar', 'La venta tiene su propia pantalla.', 'nav-operar', 'inicio'),
  clic('Vender', 'Entrá al formulario.', 'menu-vender', 'inicio'),
  info('Acá el símbolo es una lista', 'A diferencia de la compra, solo podés elegir entre lo que ya tenés en cartera.', 'campo-simbolo-venta', 'vender'),
  info('Mirá el plazo', '“Normal” son 24 hs (T+1): el dinero de la venta no queda disponible hoy. Dejalo así, es lo que hay que entender.', 'campo-plazo-venta', 'vender'),
  clic('Mandá la venta', 'Hacé clic en Vender.', 'btn-vender-submit', 'vender'),
  clic('Confirmá', 'Leé el aviso sobre el plazo y confirmá.', 'confirmar-orden', 'vender'),
  clic('Volvé al estado de cuenta', 'Abrí el menú “Mi Cuenta”.', 'nav-micuenta', 'boleto'),
  clic('Estado de cuenta', 'Entrá para ver qué pasó con tu plata.', 'menu-estado', 'boleto'),
  clic('Abrí “Detalle de saldos”', 'Es el acordeón de más abajo. Hacé clic para desplegarlo.', 'detalle-saldos', 'inicio'),
  info('Acá está la trampa', 'El dinero de la venta figura como “a liquidar”, no como disponible. Lo ves, pero todavía no es tuyo para sacarlo.', 'saldo-detalle', 'inicio'),
]

const S_RETIRO = [
  clic('Abrí el menú Mi Cuenta', 'El retiro de dinero vive acá arriba.', 'nav-micuenta', 'inicio'),
  clic('Retirar dinero', 'Quiero que veas que no te deja sacar todo.', 'menu-retirar', 'inicio'),
  info('El monto ya está cargado', 'Es el total que vendiste. Confirmá igual: va a fallar, y está bien que falle.', 'monto-retiro', 'retirar'),
  clic('Confirmá igual', 'Adelante, probá.', 'confirmar-retiro', 'retirar'),
  clic('Ahora hacé pasar un día', 'En el mercado real esperarías hasta mañana. Acá hacés clic en este botón.', 'reloj-avanzar', 'retirar'),
  info('Ahora sí está disponible', 'El dinero pasó de “a liquidar” a “disponible”. Eso es la liquidación en T+1. Mirá el panel de la derecha.', 'monto-retiro', 'retirar'),
  clic('Retiralo', 'Confirmá el retiro.', 'confirmar-retiro', 'retirar'),
]

/* ---------- itinerarios ---------- */

export const ITINERARIOS = {
  mep: {
    nombre: 'Ingresar dinero y comprar dólar MEP',
    descripcion: 'Fondeás la cuenta desde tu banco y convertís pesos a dólares legales, entendiendo qué hace el sistema por debajo.',
    modulos: 'M2 · M3', duracion: '6 min',
    preparar: () => {},
    pasos: [
      info('Vas a hacer entrar plata y comprar dólares', 'Dos cosas: transferir desde tu banco a la cuenta de inversión, y convertir parte de esos pesos a dólar MEP. Te voy indicando dónde hacer clic.', null, 'inicio'),
      ...S_INGRESO, ...S_MEP,
      info('Listo', 'Tenés pesos y dólares en tu cuenta de inversión. El dólar MEP no fue una compra de moneda: fueron dos operaciones de bonos hechas por vos.', null, 'inicio'),
    ],
  },
  cedear: {
    nombre: 'Comprar mi primer CEDEAR',
    descripcion: 'Recorrés el mercado, leés una ficha, entendés el ratio de conversión y ponés una orden de compra con sus costos.',
    modulos: 'M4 · M5', duracion: '7 min',
    preparar: (s) => {
      s.saldo.ARS.disponible = 900000
      agregarMovimiento(s, 'Ingreso de dinero', 'Banco Nación', 900000, 'ARS', ['Acreditado', 'ok'])
    },
    pasos: [
      info('Ya tenés pesos en la cuenta', 'Para esta práctica dejamos $900.000 acreditados. Vamos a comprar una empresa extranjera desde Argentina, en pesos.', null, 'inicio'),
      ...S_COMPRA, ...S_TENENCIA,
      info('Eso es un CEDEAR', 'Compraste una fracción de una acción del exterior, pagando en pesos. Tu resultado ahora depende de la acción y del dólar al mismo tiempo.', null, 'portafolio'),
    ],
  },
  on: {
    nombre: 'Invertir en Obligaciones Negociables',
    descripcion: 'El instrumento que mejor le calza a un ahorrista: renta previsible en dólares. Aprendés a leer VN, lámina mínima y calendario de renta.',
    modulos: 'M4', duracion: '6 min',
    preparar: (s) => {
      s.saldo.USD.disponible = 3000
      agregarMovimiento(s, 'Acreditación de dólares', 'Compra de dólar MEP', 3000, 'USD', ['Acreditado', 'ok'])
      s.compra.simbolo = 'YMCJO'
      s.compra.cantidad = '550'
    },
    pasos: [
      info('Tenés dólares para invertir', 'Dejamos US$ 3.000 en la cuenta. Vamos a prestárselos a una empresa a cambio de un interés fijo.', null, 'inicio'),
      ...S_ON,
      info('Renta en dólares', 'A diferencia de una acción, acá sabés de antemano cuánto vas a cobrar y cuándo. Por eso es el instrumento de entrada para quien recién empieza.', null, 'inicio'),
    ],
  },
  venta: {
    nombre: 'Vender, esperar la liquidación y retirar',
    descripcion: 'La parte que más confunde: vendés, ves la ganancia, y todavía no podés sacar la plata. Acá se entiende por qué.',
    modulos: 'M6 · M7', duracion: '7 min',
    preparar: (s) => {
      const costo = precio(s.inst.KO) * 0.94
      s.saldo.ARS.disponible = 40000
      s.posiciones.KO = { cantidad: 30, precioPromedio: costo }
      agregarMovimiento(s, 'Compra KO', '30 un. — operación anterior', -30 * costo, 'ARS', ['Liquidado', 'ok'])
      s.venta.simbolo = 'KO'
    },
    pasos: [
      info('Ya tenés una inversión hecha', 'Compraste 30 CEDEARs de Coca-Cola hace unos días y están en ganancia. Vamos a venderlos y a sacar la plata.', null, 'inicio'),
      ...S_VENTA, ...S_RETIRO,
      info('Eso es la liquidación', 'Vender y cobrar no son el mismo acto. Entre uno y otro pasa un día hábil, y durante ese día el dinero existe pero no se toca.', null, 'inicio'),
    ],
  },
  completo: {
    nombre: 'Ciclo completo de una inversión',
    descripcion: 'De punta a punta: entra el dinero, comprás dólares, invertís, seguís la tenencia, vendés, esperás la liquidación y el dinero vuelve a estar disponible.',
    modulos: 'M2 → M7', duracion: '18 min', recomendado: true,
    preparar: () => {},
    pasos: [
      info('El ciclo completo', 'Vamos a recorrer una inversión entera, desde que entra la plata hasta que la sacás. Ocho tramos. Tomate el tiempo que necesites.', null, 'inicio'),
      ...S_INGRESO, ...S_MEP, ...S_COMPRA, ...S_TENENCIA, ...S_VENTA, ...S_RETIRO,
      info('Cerraste el ciclo', 'Ingresaste dinero, compraste dólar MEP, invertiste, seguiste tu tenencia, vendiste, esperaste la liquidación y retiraste. El ciclo termina donde empezó: con la plata disponible.', null, 'movimientos'),
    ],
  },
  libre: {
    nombre: 'Explorar por mi cuenta',
    descripcion: 'Sin guía. La cuenta arranca con pesos y dólares acreditados para que pruebes lo que quieras.',
    modulos: 'Todo', duracion: '—',
    preparar: (s) => {
      s.saldo.ARS.disponible = 1200000
      s.saldo.USD.disponible = 2000
      agregarMovimiento(s, 'Ingreso de dinero', 'Banco Nación', 1200000, 'ARS', ['Acreditado', 'ok'])
      agregarMovimiento(s, 'Acreditación de dólares', 'Compra de dólar MEP', 2000, 'USD', ['Acreditado', 'ok'])
    },
    pasos: [],
  },
} satisfies Record<string, Itinerario>

export type ClaveItinerario = keyof typeof ITINERARIOS
