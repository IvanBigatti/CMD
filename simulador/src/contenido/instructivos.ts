import type { Pantalla } from '../dominio/tipos'
import type { ClaveItinerario } from '../guia/itinerarios'

/**
 * Instructivos estáticos de cada sección del sitio y de cada pantalla del simulador.
 *
 * Cómo sumar una imagen (captura de pantalla, infografía, etc.):
 *   1. Copiá el archivo a public/instructivos/ (por ejemplo public/instructivos/comprar.png).
 *   2. Agregá `imagen: { archivo: 'comprar.png', alt: 'Descripción de la imagen' }` en el instructivo.
 * Mientras no haya imagen, se muestra un recuadro "Imagen ilustrativa próximamente".
 *
 * Los textos admiten **negrita**.
 */
export interface ContenidoInstructivo {
  titulo: string
  intro?: string
  pasos: string[]
  imagen?: { archivo: string; alt: string }
}

/** Páginas del sitio */
export const INSTRUCTIVOS_SITIO: Record<'inicio' | 'capacitaciones' | 'nosotros', ContenidoInstructivo> = {
  inicio: {
    titulo: 'Cómo usar este sitio',
    intro: 'El sitio tiene tres partes. Podés recorrerlas en el orden que quieras.',
    pasos: [
      'En **Capacitaciones** elegís una actividad: cada una tiene un video corto y un instructivo.',
      'Tocá **Practicar en el simulador** para hacer la actividad con una guía que te indica dónde hacer clic.',
      'En el **Simulador** podés explorar libremente la plataforma. El dinero y los precios son ficticios.',
      'En **Sobre nosotros** conocés al equipo, leés opiniones de otros alumnos y nos podés dejar tu valoración.',
    ],
  },
  capacitaciones: {
    titulo: 'Cómo hacer una capacitación',
    pasos: [
      'Elegí una actividad. Si es tu primera vez, te recomendamos **Ciclo completo**.',
      'Mirá el video: dura pocos minutos y muestra la operación de punta a punta.',
      'Leé el instructivo de la actividad para tener a mano los pasos.',
      'Tocá **Practicar en el simulador**. Una guía resalta cada botón y espera a que hagas clic.',
      'Podés salir de la guía cuando quieras y retomarla desde **Cambiar capacitación**, en la franja amarilla.',
    ],
  },
  nosotros: {
    titulo: 'Cómo dejar tu valoración',
    pasos: [
      'Elegí de 1 a 5 estrellas según cuánto te sirvió la capacitación.',
      'Si querés, escribí tu nombre y un comentario.',
      'Tocá **Enviar valoración**: tu opinión aparece arriba de la lista.',
    ],
  },
}

/** Una por actividad (itinerario guiado) */
export const INSTRUCTIVOS_ACTIVIDAD: Record<ClaveItinerario, ContenidoInstructivo> = {
  mep: {
    titulo: 'Ingresar dinero y comprar dólar MEP, paso a paso',
    pasos: [
      'Desde **Estado de cuenta**, tocá **Ingresar dinero** en la tarjeta de Argentina.',
      'Elegí la cuenta de origen. Solo se aceptan cuentas **a tu nombre** (misma titularidad).',
      'Confirmá la transferencia: los pesos aparecen como **disponibles**.',
      'Volvé al estado de cuenta y, en **Te recomendamos**, tocá **Comprar** en Dólar MEP.',
      'Cargá el monto en pesos (mínimo $5.000) y confirmá. Activá **Ver por dentro** para ver las dos operaciones con el bono AL30.',
    ],
  },
  cedear: {
    titulo: 'Comprar un CEDEAR, paso a paso',
    pasos: [
      'Entrá a **Cotizaciones** y elegí la pestaña **Cedears**.',
      'Tocá una especie (por ejemplo AAPL) para abrir su ficha y ver precio, ratio y variación.',
      'Tocá **Comprar**. Elegí cantidad o monto, modalidad (a mercado o precio límite) y plazo.',
      'Revisá el detalle de costos (comisión, derechos de mercado e IVA) y confirmá.',
      'Mirá el boleto y después tu **Portafolio**: ahí ves la tenencia y el resultado.',
    ],
  },
  on: {
    titulo: 'Invertir en una Obligación Negociable, paso a paso',
    pasos: [
      'Entrá a **Cotizaciones** → pestaña **ONs** y abrí la ficha de una ON.',
      'Fijate la **lámina mínima** y el calendario de pago de renta.',
      'En **Comprar**, la cantidad va en **valores nominales (VN)**, no en dólares. El precio es cada 100 VN.',
      'Si cargás una cantidad que no respeta la lámina mínima, el simulador te avisa.',
      'Confirmá y revisá la tenencia en tu **Portafolio**.',
    ],
  },
  venta: {
    titulo: 'Vender, esperar la liquidación y retirar, paso a paso',
    pasos: [
      'Desde **Portafolio** o **Operar → Vender**, elegí la especie que querés vender.',
      'Cargá la cantidad y confirmá. El dinero queda **a liquidar** (T+1).',
      'Intentá retirar: no vas a poder, porque el dinero todavía no está disponible.',
      'Tocá **Avanzar 1 día hábil** en la franja amarilla para que pase un día.',
      'Ahora sí, el dinero está **disponible**: retiralo a tu cuenta bancaria.',
    ],
  },
  completo: {
    titulo: 'El ciclo completo de tu inversión',
    intro: 'Recorrés todas las etapas, desde que entra el dinero hasta que vuelve a estar disponible.',
    pasos: [
      '**Ingresás** dinero desde una cuenta bancaria a tu nombre.',
      'Comprás **dólar MEP** y ves qué pasa por dentro.',
      '**Comprás** un CEDEAR y revisás los costos antes de confirmar.',
      'Seguís tu **tenencia** en el portafolio.',
      '**Vendés**, esperás la **liquidación** de 24 hs y **retirás** el dinero.',
    ],
    imagen: { archivo: 'completo.png', alt: 'Infografía: el ciclo de tu inversión, desde el ingreso de dinero hasta el retiro' },
  },
  libre: {
    titulo: 'Explorar por tu cuenta',
    pasos: [
      'La cuenta arranca con **$1.200.000** y **US$ 2.000** acreditados.',
      'Usá el menú violeta para moverte: Mi Cuenta, Portafolio, Operar y Cotizaciones.',
      'Probá comprar, vender y operar dólar MEP sin guía.',
      'Si te perdés, abrí **¿Cómo se usa esta pantalla?** arriba de cada pantalla.',
    ],
  },
}

/** Uno por pantalla del simulador (se muestra plegado arriba de cada pantalla) */
export const INSTRUCTIVOS_PANTALLA: Record<Pantalla, ContenidoInstructivo> = {
  inicio: {
    titulo: 'Estado de cuenta',
    pasos: [
      'Es la pantalla principal: muestra cuánto dinero tenés en pesos y en dólares.',
      'Desplegá **Saldos** para ver los tres saldos: **disponible**, **comprometido** y **a liquidar**.',
      'Con **Ingresar dinero** fondeás la cuenta desde tu banco.',
      'En **Te recomendamos** tenés el acceso rápido a Dólar MEP.',
    ],
  },
  portafolio: {
    titulo: 'Mi Portafolio',
    pasos: [
      'Muestra todo lo que compraste y cuánto vale hoy.',
      'El **resultado** es la diferencia entre lo que pagaste y el precio actual. Es "no realizado" hasta que vendas.',
      'Podés ver la valuación en pesos o en dólares.',
    ],
  },
  mercado: {
    titulo: 'Cotizaciones',
    pasos: [
      'Elegí el panel: **Acciones**, **Cedears** u **ONs**.',
      'Cada fila muestra el último precio, la variación y las puntas de **compra** y **venta**.',
      'Tocá una especie para abrir su ficha.',
    ],
  },
  activo: {
    titulo: 'Ficha del activo',
    pasos: [
      'Muestra el precio, la variación del día y el gráfico de la especie.',
      'Las **puntas** te dicen a qué precio podés comprar (punta vendedora) y vender (punta compradora).',
      'Desde acá podés **Comprar** o, si ya la tenés, **Vender**.',
    ],
  },
  comprar: {
    titulo: 'Comprar',
    pasos: [
      'Elegí el **símbolo** y si querés comprar por **cantidad** o por **monto**.',
      '**A mercado** compra al mejor precio de venta disponible; **precio límite** solo compra si el precio llega al que fijaste.',
      'El **plazo** "Normal 24 hs" liquida al día hábil siguiente.',
      'Tocá **Comprar**: antes de ejecutar vas a ver el detalle de costos para confirmar.',
    ],
  },
  vender: {
    titulo: 'Vender',
    pasos: [
      'Elegí la especie que tenés y la cantidad a vender.',
      'Una venta a mercado se ejecuta al mejor precio de **compra** disponible.',
      'El dinero de la venta queda **a liquidar** hasta el día hábil siguiente.',
    ],
  },
  boleto: {
    titulo: 'Boleto',
    pasos: [
      'Es el comprobante de tu operación.',
      'Muestra precio, cantidad y el desglose de costos: comisión, derechos de mercado e IVA.',
    ],
  },
  ingresar: {
    titulo: 'Ingresar dinero',
    pasos: [
      'Transferí desde tu banco al alias de tu cuenta de inversión.',
      'Solo se aceptan transferencias desde cuentas **a tu nombre**.',
      'Elegí la cuenta de origen, el monto y confirmá.',
    ],
  },
  mep: {
    titulo: 'Dólar MEP',
    pasos: [
      'Elegí si querés **comprar** o **vender** dólares.',
      'Cargá el monto (mínimo $5.000 o US$ 5).',
      'Activá **Ver por dentro** para ver las dos operaciones con el bono AL30 que hace el sistema.',
      'Se opera los días hábiles de 10:30 a 17:00.',
    ],
  },
  retirar: {
    titulo: 'Retirar dinero',
    pasos: [
      'Solo podés retirar el dinero **disponible**: el que está "a liquidar" todavía no.',
      'El retiro va a una cuenta bancaria **a tu nombre**.',
      'Si no te alcanza, tocá **Avanzar 1 día hábil** en la franja amarilla para que se liquiden tus ventas.',
    ],
  },
  movimientos: {
    titulo: 'Movimientos',
    pasos: [
      'Es la bitácora de tu cuenta: ingresos, compras, ventas, liquidaciones y retiros.',
      'Cada movimiento muestra su estado (pendiente, liquidado, acreditado).',
    ],
  },
  cuenta: {
    titulo: 'Perfil de inversor',
    pasos: [
      'Respondé el test para conocer tu perfil: conservador, moderado o agresivo.',
      'Si comprás algo más riesgoso que tu perfil, la plataforma te avisa, pero no te bloquea.',
    ],
  },
}

export const urlInstructivo = (archivo: string) => `${import.meta.env.BASE_URL}instructivos/${archivo}`
