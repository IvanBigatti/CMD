import { create } from 'zustand'
import type { Aviso, Pantalla } from '../dominio/tipos'
import { PROXIMAMENTE, type TemaProximamente } from '../mocks/proximamente'

export type MenuId = 'cuenta' | 'operar' | 'herramientas'

/** Qué pasa al tocar el botón principal de un modal de mensaje */
export type AlCerrar = { ir: Pantalla } | { elegirItinerario: true }

export interface ModalMensaje {
  tipo: 'mensaje'
  eyebrow: string
  titulo: string
  /** Admite **negrita** */
  parrafo?: string
  avisos?: Aviso[]
  boton: string
  alCerrar?: AlCerrar
}

export type Modal =
  | ModalMensaje
  | { tipo: 'confirmarOrden' }
  | { tipo: 'testPerfil'; pregunta: number; suma: number }

interface DatosMensaje {
  titulo: string
  parrafo?: string
  avisos?: Aviso[]
  eyebrow?: string
  boton?: string
  alCerrar?: AlCerrar
}

interface EstadoUi {
  modal: Modal | null
  menuAbierto: MenuId | null
  selectorAbierto: boolean
  abrirModal: (m: Modal) => void
  cerrarModal: () => void
  mensaje: (d: DatosMensaje) => void
  proximamente: (tema: TemaProximamente) => void
  alternarMenu: (id: MenuId) => void
  abrirMenu: (id: MenuId) => void
  cerrarMenus: () => void
  abrirSelector: () => void
  cerrarSelector: () => void
}

export const AVISO_PROXIMAMENTE: Aviso = {
  tono: 'info',
  titulo: 'Llega en una próxima versión',
  texto: 'Hoy el simulador cubre el ciclo completo de una inversión: ingreso de dinero, dólar MEP, compra, tenencia, venta y retiro. Estamos sumando más funciones.',
}

export const useUi = create<EstadoUi>()((set, get) => ({
  modal: null,
  menuAbierto: null,
  selectorAbierto: false,

  abrirModal: (modal) => set({ modal }),
  cerrarModal: () => set({ modal: null }),

  mensaje: ({ titulo, parrafo, avisos, eyebrow = 'Aviso', boton = 'Entendido', alCerrar }) =>
    set({ modal: { tipo: 'mensaje', titulo, parrafo, avisos, eyebrow, boton, alCerrar } }),

  proximamente: (tema) => {
    const [titulo, texto] = PROXIMAMENTE[tema]
    get().cerrarMenus()
    get().mensaje({ titulo, parrafo: texto, avisos: [AVISO_PROXIMAMENTE], eyebrow: 'Próximamente' })
  },

  alternarMenu: (id) => set((s) => ({ menuAbierto: s.menuAbierto === id ? null : id })),
  abrirMenu: (id) => set({ menuAbierto: id }),
  cerrarMenus: () => set({ menuAbierto: null }),

  abrirSelector: () => set({ selectorAbierto: true }),
  cerrarSelector: () => set({ selectorAbierto: false }),
}))
