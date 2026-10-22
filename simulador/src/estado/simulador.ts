import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { fechaSimulada, formatoDia, formatoFecha } from '../dominio/fechas'
import { dinero, nf, parseNumero } from '../dominio/formato'
import { calcularMep, type ModoMep } from '../dominio/mep'
import { moverPrecio, precioMercado } from '../dominio/mercado'
import { armarOrden } from '../dominio/ordenes'
import type {
  Aviso, Boleto, Instrumento, Liquidacion, Modalidad, Moneda, Movimiento, NivelRiesgo,
  Orden, Pantalla, Plazo, Posicion, Saldos, TipoInstrumento, TonoEstado,
} from '../dominio/tipos'
import { INSTRUMENTOS } from '../mocks/instrumentos'
import type { OrigenFondos } from '../mocks/persona'
import { PERSONA } from '../mocks/persona'
import { useUi } from './ui'

export interface FormCompra {
  mercado: 'ar' | 'us'
  plazo: Plazo
  simbolo: string
  por: 'cantidad' | 'monto'
  cantidad: string
  monto: string
  modalidad: Modalidad
  limite: string
  validez: string
}

export interface FormVenta {
  plazo: Plazo
  simbolo: string
  cantidad: string
  modalidad: Modalidad
  limite: string
  validez: string
}

/** Todo lo que se reinicia al empezar un itinerario */
interface DatosSesion {
  saldo: Saldos
  posiciones: Record<string, Posicion>
  movimientos: Movimiento[]
  pendientes: Liquidacion[]
  dia: number
  primerIngreso: boolean
  boleto: Boleto | null
  mercadoAbierto: boolean
  monedaVista: Moneda
  compra: FormCompra
  avisoCompra: Aviso | null
  venta: FormVenta
  avisoVenta: Aviso | null
  ingreso: { origen: OrigenFondos | null; monto: string; aviso: Aviso | null }
  mep: { modo: ModoMep; monto: string; verDentro: boolean }
  retiro: { moneda: Moneda; monto: string; aviso: Aviso | null }
  acordeones: { saldos: boolean; estadisticas: boolean }
  ordenPendiente: Orden | null
}

export interface DatosSimulador extends DatosSesion {
  inst: Record<string, Instrumento>
  perfil: NivelRiesgo
  nroBoleto: number
  pantalla: Pantalla
  activo: string | null
  cotizaciones: { tab: TipoInstrumento; buscar: string; mostrar: number; panel: string }
}

interface Acciones {
  irA: (p: Pantalla) => void
  verActivo: (id: string) => void
  prepararCompra: (id: string) => void
  prepararVenta: (id: string) => void
  actualizarCompra: (cambios: Partial<FormCompra>) => void
  actualizarVenta: (cambios: Partial<FormVenta>) => void
  enviarOrden: (lado: 'compra' | 'venta') => void
  ejecutarOrden: () => void
  elegirOrigen: (o: OrigenFondos) => void
  setMontoIngreso: (v: string) => void
  ingresarDinero: () => void
  setModoMep: (m: ModoMep) => void
  setMontoMep: (v: string) => void
  alternarVerDentro: () => void
  operarMep: () => void
  setMonedaRetiro: (m: Moneda) => void
  setMontoRetiro: (v: string) => void
  retirar: () => void
  avanzarDia: () => void
  setMonedaVista: (m: Moneda) => void
  setCotizaciones: (c: Partial<DatosSimulador['cotizaciones']>) => void
  setAcordeon: (k: keyof DatosSesion['acordeones'], abierto: boolean) => void
  setPerfil: (p: NivelRiesgo) => void
  /** Vuelve la cuenta a cero y aplica la preparación de un itinerario */
  reiniciar: (preparar?: (s: DatosSimulador) => void) => void
}

export type EstadoSimulador = DatosSimulador & Acciones

const formCompraVacio = (): FormCompra => ({
  mercado: 'ar', plazo: '24', simbolo: '', por: 'cantidad', cantidad: '10', monto: '',
  modalidad: 'mercado', limite: '', validez: 'Día',
})

const formVentaVacio = (): FormVenta => ({
  plazo: '24', simbolo: '', cantidad: '', modalidad: 'mercado', limite: '', validez: 'Día',
})

function sesionNueva(): DatosSesion {
  return {
    saldo: { ARS: { disponible: 0, comprometido: 0, aLiquidar: 0 }, USD: { disponible: 0, comprometido: 0, aLiquidar: 0 } },
    posiciones: {},
    movimientos: [],
    pendientes: [],
    dia: 0,
    primerIngreso: true,
    boleto: null,
    mercadoAbierto: true,
    monedaVista: 'ARS',
    compra: formCompraVacio(),
    avisoCompra: null,
    venta: formVentaVacio(),
    avisoVenta: null,
    ingreso: { origen: null, monto: '600000', aviso: null },
    mep: { modo: 'compra', monto: '300000', verDentro: false },
    retiro: { moneda: 'ARS', monto: '0', aviso: null },
    acordeones: { saldos: false, estadisticas: false },
    ordenPendiente: null,
  }
}

/* ---------- helpers que operan sobre el estado (borrador de immer) ---------- */

export function instrumentoPorSimbolo(inst: Record<string, Instrumento>, simbolo: string): Instrumento | null {
  const id = String(simbolo || '').trim().toUpperCase()
  return Object.hasOwn(inst, id) ? inst[id] : null
}

export function agregarMovimiento(
  s: DatosSimulador, titulo: string, detalle: string, importe: number, moneda: Moneda,
  estado?: [string, TonoEstado],
) {
  s.movimientos.unshift({
    fecha: formatoFecha(fechaSimulada(s.dia)), titulo, detalle, importe, moneda,
    estado: estado && { texto: estado[0], tono: estado[1] },
  })
}

/** Completa los valores sugeridos de los formularios de orden (precio límite, cantidad a vender) */
function completarFormularios(s: DatosSimulador) {
  const ic = instrumentoPorSimbolo(s.inst, s.compra.simbolo)
  if (ic && !s.compra.limite) s.compra.limite = nf(precioMercado(ic, 'compra', s.dia))

  if (s.venta.simbolo && !s.posiciones[s.venta.simbolo]) s.venta.simbolo = ''
  const iv = s.inst[s.venta.simbolo]
  const pv = s.posiciones[s.venta.simbolo]
  if (iv && pv) {
    if (!s.venta.cantidad) s.venta.cantidad = String(pv.cantidad)
    if (!s.venta.limite) s.venta.limite = nf(precioMercado(iv, 'venta', s.dia))
  }
}

const ui = () => useUi.getState()
const fecha = (s: DatosSimulador, extra = 0) => formatoFecha(fechaSimulada(s.dia, extra))

export const useSimulador = create<EstadoSimulador>()(
  immer((set, get) => ({
    ...sesionNueva(),
    inst: structuredClone(INSTRUMENTOS),
    perfil: 1,
    nroBoleto: 100841,
    pantalla: 'inicio',
    activo: null,
    cotizaciones: { tab: 'cedear', buscar: '', mostrar: 25, panel: 'Todos' },

    /* ---------- navegación ---------- */
    irA: (p) => {
      set((s) => {
        s.pantalla = p
        if (p === 'retirar') {
          const sal = s.saldo[s.retiro.moneda]
          s.retiro.monto = String(Math.floor(sal.disponible + sal.aLiquidar))
        }
        completarFormularios(s)
      })
      ui().cerrarMenus()
    },

    verActivo: (id) => {
      set((s) => { s.activo = id })
      get().irA('activo')
    },

    prepararCompra: (id) => {
      set((s) => {
        const i = s.inst[id]
        s.compra.simbolo = id
        s.compra.cantidad = String(i.tipo === 'on' ? i.laminaMinima : 10)
        s.compra.limite = ''
      })
      get().irA('comprar')
    },

    prepararVenta: (id) => {
      set((s) => {
        s.venta.simbolo = id
        s.venta.cantidad = ''
        s.venta.limite = ''
      })
      get().irA('vender')
    },

    /* ---------- formularios de orden ---------- */
    actualizarCompra: (cambios) =>
      set((s) => {
        Object.assign(s.compra, cambios)
        if ('simbolo' in cambios) s.compra.limite = ''
        if ('simbolo' in cambios || 'plazo' in cambios || 'modalidad' in cambios) completarFormularios(s)
      }),

    actualizarVenta: (cambios) =>
      set((s) => {
        Object.assign(s.venta, cambios)
        if ('simbolo' in cambios) { s.venta.cantidad = ''; s.venta.limite = '' }
        if ('simbolo' in cambios || 'plazo' in cambios || 'modalidad' in cambios) completarFormularios(s)
      }),

    enviarOrden: (lado) => {
      const s = get()
      const esCompra = lado === 'compra'
      const resultado = esCompra
        ? armarOrden({
            lado, instrumento: instrumentoPorSimbolo(s.inst, s.compra.simbolo), mercadoEeuu: s.compra.mercado === 'us',
            plazo: s.compra.plazo, modalidad: s.compra.modalidad, limite: s.compra.limite,
            porMonto: s.compra.por === 'monto', cantidad: s.compra.cantidad, monto: s.compra.monto,
          }, s)
        : armarOrden({
            lado, instrumento: s.inst[s.venta.simbolo] ?? null, plazo: s.venta.plazo,
            modalidad: s.venta.modalidad, limite: s.venta.limite, cantidad: s.venta.cantidad,
          }, s)

      set((d) => {
        const aviso = resultado.tipo === 'ok' ? null : resultado.aviso
        if (esCompra) d.avisoCompra = aviso
        else d.avisoVenta = aviso
        if (resultado.tipo === 'sinEjecutar') {
          const m = resultado.movimiento
          agregarMovimiento(d, m.titulo, m.detalle, 0, m.moneda, ['En mercado', 'pendiente'])
        }
        if (resultado.tipo === 'ok') d.ordenPendiente = resultado.orden
      })
      if (resultado.tipo === 'ok') ui().abrirModal({ tipo: 'confirmarOrden' })
    },

    ejecutarOrden: () => {
      const o = get().ordenPendiente
      if (!o) return
      ui().cerrarModal()
      set((s) => {
        const i = o.instrumento
        const sal = s.saldo[i.moneda]
        const ci = o.contadoInmediato
        const unidad = i.tipo === 'on' ? 'VN' : 'un.'
        if (o.lado === 'compra') {
          sal.disponible -= o.total
          if (sal.disponible < 0) { sal.aLiquidar += sal.disponible; sal.disponible = 0 }
          if (!ci) {
            sal.comprometido += o.total
            s.pendientes.push({ tipo: 'compra', moneda: i.moneda, monto: o.total, dia: s.dia + 1 })
          }
          const p = s.posiciones[i.id] ?? { cantidad: 0, precioPromedio: 0 }
          p.precioPromedio = (p.precioPromedio * p.cantidad + o.precio * o.cantidad) / (p.cantidad + o.cantidad)
          p.cantidad += o.cantidad
          s.posiciones[i.id] = p
          s.venta.simbolo = i.id
          agregarMovimiento(s, `Compra ${i.id}`,
            `${nf(o.cantidad, 0)} ${unidad} a ${dinero(o.precio, i.moneda)}${ci ? ' · CI' : ' · liquida ' + fecha(s, 1)}`,
            -o.total, i.moneda, ci ? ['Liquidado', 'ok'] : ['Liquida mañana', 'pendiente'])
        } else {
          const p = s.posiciones[i.id]
          p.cantidad -= o.cantidad
          if (p.cantidad <= 0) delete s.posiciones[i.id]
          if (ci) sal.disponible += o.total
          else {
            sal.aLiquidar += o.total
            s.pendientes.push({ tipo: 'venta', moneda: i.moneda, monto: o.total, dia: s.dia + 1 })
          }
          agregarMovimiento(s, `Venta ${i.id}`,
            `${nf(o.cantidad, 0)} ${unidad} a ${dinero(o.precio, i.moneda)}${ci ? ' · CI' : ' · acredita ' + fecha(s, 1)}`,
            o.total, i.moneda, ci ? ['Disponible', 'ok'] : ['A liquidar', 'pendiente'])
        }
        s.nroBoleto++
        s.boleto = { ...o, numero: s.nroBoleto, fechaConcertacion: fecha(s), fechaLiquidacion: fecha(s, ci ? 0 : 1) }
        s.ordenPendiente = null
        s.avisoCompra = null
        s.avisoVenta = null
        s.venta.cantidad = ''
        s.compra.monto = ''
        completarFormularios(s)
      })
      get().irA('boleto')
    },

    /* ---------- ingreso de dinero ---------- */
    elegirOrigen: (origen) =>
      set((s) => {
        s.ingreso.origen = origen
        s.ingreso.aviso = origen === 'tercero'
          ? { tono: 'warn', titulo: 'Atención', texto: 'Esta cuenta está a nombre de otra persona. Probá confirmar y mirá qué pasa.' }
          : null
      }),

    setMontoIngreso: (v) => set((s) => { s.ingreso.monto = v }),

    ingresarDinero: () => {
      const s = get()
      if (!s.ingreso.origen) {
        set((d) => { d.ingreso.aviso = { tono: 'warn', titulo: 'Elegí una cuenta de origen', texto: 'El dinero tiene que venir de una cuenta bancaria.' } })
        return
      }
      if (s.ingreso.origen === 'tercero') {
        set((d) => {
          d.ingreso.aviso = {
            tono: 'bad', titulo: 'Transferencia rechazada',
            texto: 'La cuenta de origen está a nombre de otra persona. Solo podés fondear tu cuenta de inversión desde cuentas de tu misma titularidad (mismo CUIT). Es una exigencia de la normativa de prevención de lavado.',
          }
          agregarMovimiento(d, 'Transferencia rechazada', 'Origen de otro titular', 0, 'ARS', ['Rechazada', 'error'])
        })
        return
      }
      const monto = parseNumero(s.ingreso.monto)
      if (monto <= 0) {
        set((d) => { d.ingreso.aviso = { tono: 'warn', titulo: 'Monto inválido', texto: 'Ingresá un monto mayor a cero.' } })
        return
      }
      const primera = s.primerIngreso
      set((d) => {
        d.saldo.ARS.disponible += monto
        agregarMovimiento(d, 'Ingreso de dinero', primera ? `${PERSONA.bancoRetiro} — primera acreditación` : PERSONA.bancoRetiro,
          monto, 'ARS', ['Acreditado', 'ok'])
        d.primerIngreso = false
        completarFormularios(d)
      })
      const avisos: Aviso[] = []
      if (primera)
        avisos.push({ tono: 'info', titulo: 'La primera vez demora', texto: 'En la plataforma real la primera transferencia puede tardar algunas horas mientras se valida la cuenta de origen. Las siguientes son inmediatas.' })
      avisos.push({ tono: 'good', titulo: 'Tu plata no queda quieta', texto: 'El saldo sin invertir rinde de forma automática desde hoy.' })
      ui().mensaje({
        titulo: 'Dinero acreditado',
        parrafo: `Se acreditaron **${dinero(monto, 'ARS')}** en tu cuenta comitente.`,
        avisos, eyebrow: 'Listo', boton: 'Ver estado de cuenta', alCerrar: { ir: 'inicio' },
      })
    },

    /* ---------- dólar MEP ---------- */
    setModoMep: (modo) => set((s) => { s.mep.modo = modo }),
    setMontoMep: (v) => set((s) => { s.mep.monto = v }),
    alternarVerDentro: () => set((s) => { s.mep.verDentro = !s.mep.verDentro }),

    operarMep: () => {
      const s = get()
      const venta = s.mep.modo === 'venta'
      const monto = parseNumero(s.mep.monto)
      const monOrigen: Moneda = venta ? 'USD' : 'ARS'
      const monDestino: Moneda = venta ? 'ARS' : 'USD'
      const minimo = venta ? 5 : 5000
      if (monto < minimo) {
        ui().mensaje({ titulo: 'Monto mínimo', parrafo: `El mínimo para operar dólar MEP es de ${venta ? 'US$ 5' : '$5.000'}.`, eyebrow: 'Revisá el monto' })
        return
      }
      if (monto > s.saldo[monOrigen].disponible) {
        ui().mensaje({
          titulo: 'Saldo insuficiente',
          parrafo: `Tenés ${dinero(s.saldo[monOrigen].disponible, monOrigen)} disponibles y estás pidiendo ${dinero(monto, monOrigen)}.`,
          eyebrow: 'No se puede operar',
        })
        return
      }
      if (!s.mercadoAbierto) {
        ui().mensaje({ titulo: 'Mercado cerrado', parrafo: 'El dólar MEP se opera de lunes a viernes de 10:30 a 17:00. Tu orden queda para el próximo día hábil.', eyebrow: 'Orden pendiente' })
        return
      }
      const { vn, entrega, recibe, tipoDeCambio } = calcularMep(s.mep.modo, monto)
      set((d) => {
        d.saldo[monOrigen].disponible -= entrega
        d.saldo[monDestino].disponible += recibe
        if (venta) {
          agregarMovimiento(d, 'Venta de dólar MEP', `${nf(vn, 0)} VN de AL30D · TC $${nf(tipoDeCambio)}`, -entrega, 'USD', ['Contado inmediato', 'neutro'])
          agregarMovimiento(d, 'Acreditación de pesos', 'Venta de AL30', recibe, 'ARS', ['Acreditado', 'ok'])
        } else {
          agregarMovimiento(d, 'Compra de dólar MEP', `${nf(vn, 0)} VN de AL30 · TC $${nf(tipoDeCambio)}`, -entrega, 'ARS', ['Contado inmediato', 'neutro'])
          agregarMovimiento(d, 'Acreditación de dólares', 'Venta de AL30D', recibe, 'USD', ['Acreditado', 'ok'])
        }
        completarFormularios(d)
      })
      ui().mensaje({
        titulo: venta ? 'Vendiste dólar MEP' : 'Compraste dólar MEP',
        parrafo: `Entregaste **${dinero(entrega, monOrigen)}** y recibiste **${dinero(recibe, monDestino)}**, a un tipo de cambio de $${nf(tipoDeCambio)}.`,
        avisos: [{ tono: 'info', titulo: 'Lo que pasó por debajo', texto: `El sistema operó ${nf(vn, 0)} VN de AL30 en sus dos especies, las dos patas en Contado Inmediato. Por eso el dinero está hoy en tu cuenta.` }],
        eyebrow: 'Operación ejecutada', boton: 'Ver estado de cuenta', alCerrar: { ir: 'inicio' },
      })
    },

    /* ---------- retiro ---------- */
    setMonedaRetiro: (moneda) =>
      set((s) => {
        s.retiro.moneda = moneda
        s.retiro.monto = String(Math.floor(s.saldo[moneda].disponible + s.saldo[moneda].aLiquidar))
        s.retiro.aviso = null
      }),

    setMontoRetiro: (v) => set((s) => { s.retiro.monto = v }),

    retirar: () => {
      const s = get()
      const m = s.retiro.moneda
      const monto = parseNumero(s.retiro.monto)
      if (monto <= 0) {
        set((d) => { d.retiro.aviso = { tono: 'warn', titulo: 'Monto inválido', texto: 'Ingresá cuánto querés retirar.' } })
        return
      }
      if (monto > s.saldo[m].disponible) {
        const liq = s.saldo[m].aLiquidar
        let texto = `Disponible: **${dinero(s.saldo[m].disponible, m)}**`
        if (liq)
          texto += `\nA liquidar: **${dinero(liq, m)}** — se acredita el ${fecha(s, 1)}.\n\nEl dinero de una venta a 24 h no se puede retirar el mismo día. Avanzá un día hábil con el botón de arriba y volvé a intentar.`
        set((d) => { d.retiro.aviso = { tono: 'bad', titulo: 'No tenés ese dinero disponible', texto } })
        return
      }
      set((d) => {
        d.saldo[m].disponible -= monto
        agregarMovimiento(d, 'Retiro de dinero', `${PERSONA.bancoRetiro} · misma titularidad`, -monto, m, ['Transferido', 'ok'])
        d.retiro.aviso = null
        d.retiro.monto = '0'
        completarFormularios(d)
      })
      ui().mensaje({
        titulo: 'Retiro enviado',
        parrafo: `Transferimos **${dinero(monto, m)}** a tu cuenta del ${PERSONA.bancoRetiro}. Sin costo.`,
        avisos: [{ tono: 'good', titulo: 'Cerraste el ciclo', texto: 'Ingresó plata, la invertiste, vendiste, esperaste la liquidación y la sacaste. Eso es una inversión completa.' }],
        eyebrow: 'Listo', boton: 'Ver movimientos', alCerrar: { ir: 'movimientos' },
      })
    },

    /* ---------- reloj: liquidación T+1 ---------- */
    avanzarDia: () => {
      let liquidadas = 0
      set((s) => {
        s.dia++
        s.pendientes = s.pendientes.filter((p) => {
          if (p.dia > s.dia) return true
          liquidadas++
          if (p.tipo === 'compra') {
            s.saldo[p.moneda].comprometido -= p.monto
            agregarMovimiento(s, 'Liquidación de compra', 'Débito efectivo del día', 0, p.moneda, ['Liquidado', 'ok'])
          } else {
            s.saldo[p.moneda].aLiquidar -= p.monto
            s.saldo[p.moneda].disponible += p.monto
            agregarMovimiento(s, 'Liquidación de venta', 'El dinero pasó a disponible', 0, p.moneda, ['Disponible', 'ok'])
          }
          return false
        })
        for (const i of Object.values(s.inst)) moverPrecio(i)
        completarFormularios(s)
      })
      if (liquidadas) {
        const n = liquidadas
        ui().mensaje({
          titulo: 'Pasó un día hábil',
          parrafo: `Es ${formatoDia(fechaSimulada(get().dia))}. Se liquidaron ${n} operación${n > 1 ? 'es' : ''} pendiente${n > 1 ? 's' : ''}.`,
          avisos: [{ tono: 'good', titulo: 'Esto es T+1', texto: 'En el mercado real esto pasa solo, un día hábil después de operar. Acá lo hacemos con un botón para no esperar.' }],
          eyebrow: 'Reloj del simulador',
        })
      }
    },

    /* ---------- varios ---------- */
    setMonedaVista: (m) => set((s) => { s.monedaVista = m }),
    setCotizaciones: (c) => set((s) => { Object.assign(s.cotizaciones, c) }),
    setAcordeon: (k, abierto) => set((s) => { s.acordeones[k] = abierto }),
    setPerfil: (p) => set((s) => { s.perfil = p }),

    reiniciar: (preparar) => {
      set((s) => {
        Object.assign(s, sesionNueva())
        preparar?.(s)
        completarFormularios(s)
      })
      ui().cerrarMenus()
    },
  })),
)
