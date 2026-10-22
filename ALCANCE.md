# Proyecto: simulador de capacitación en inversiones

## Contexto
Estoy desarrollando, con un equipo, una aplicación sandbox para capacitar a personas
que nunca operaron en el mercado de capitales. Está modelada sobre la plataforma real
de Invertir Online (IOL).

## Restricción de marca (importante, no la cambies)
La app se llama **InvertirOnline**,
funcional de IOL (navegación, pantallas, flujos, reglas de negocio)

## Objetivo de la aplicación modelada
Permitir invertir en el mercado de capitales argentino desde una plataforma propia,
sin intermediación presencial: gestionar el portafolio según el perfil de inversor,
operar Dólar MEP, CEDEARs, acciones y obligaciones negociables.

## Usuarios objetivo
Adultos de ~45 a 65 años con capacidad de ahorro, que ya se manejan con homebanking
y billeteras virtuales, pero que nunca operaron en el mercado de capitales.

## ALCANCE DE LA CAPACITACIÓN
Cubre el ciclo completo de una inversión, desde que se ingresa el dinero hasta que
se vende el activo y el dinero vuelve a estar disponible.

### Módulos DENTRO del alcance
- M2 · Ingreso de dinero (transferencia desde CBU/CVU de misma titularidad)
- M3 · Dólar MEP (compra y venta, con modo "ver por dentro" que muestra las dos patas)
- M4 · Compra (acciones, CEDEARs, obligaciones negociables)
- M5 · Tenencia y portafolio (valuación bimonetaria, resultado no realizado)
- M6 · Venta y liquidación T+1
- M7 · Retiro de dinero
- Movimientos (bitácora del ciclo: ingresos, órdenes, liquidaciones, retiros)
- Perfil de inversor (test + advertencia cuando el activo supera el perfil)

### Módulos FUERA del alcance (en la app se muestran como "Próximamente", con un popup que explica la función)
- Alta de cuenta / KYC (es anterior al ingreso de dinero)
- Reportes: estado de cuenta descargable e informes impositivos (son posteriores)
- Mercado y cuenta de inversión de Estados Unidos (se cubre vía CEDEARs)
- Cauciones, opciones, fondos comunes, letras y bonos directos
- Portafolio Simple, research, estrategias, academia, alertas, API, configuración

## Estado actual
Ya existe un simulador de escritorio funcionando, en un único archivo HTML
autocontenido (sin build, sin dependencias, sin servidor). Lo adjunto a este mensaje.

Incluye:
- Cartel inicial "Iniciar capacitación" + selector de 6 itinerarios guiados
- Guía paso a paso con spotlight: resalta el elemento y espera el clic real
- Popups de "fuera de alcance" en cada control que se sale del temario
- Navegación replicando la estructura real: appbar con buscador, y nav superior con
  Mi Cuenta ▾ · Portafolio · Operar ▾ · Cotizaciones · Herramientas ▾ ·
  Estrategias de Inversión · Academia
- Pantallas: Estado de cuenta, Portafolio, Cotizaciones, ficha del activo,
  Comprar, Vender, Dólar MEP, Ingresar dinero, Retirar dinero, Movimientos,
  Perfil de inversor, boleto

## Reglas de negocio ya implementadas y verificadas (no las simplifiques)
1. TRES SALDOS por moneda: disponible / comprometido / a liquidar. Es el concepto
   central de la capacitación.
2. Liquidación T+1 ("Normal — 24 hs") y Contado Inmediato. Un botón "Avanzar 1 día
   hábil" hace correr el reloj virtual y procesa las liquidaciones pendientes.
3. El dinero a liquidar se puede reinvertir a 24 hs pero NO retirar ni operar en CI.
   El bloque "Monto disponible por plazo" lo muestra explícitamente.
4. Una orden a mercado se ejecuta contra la PUNTA, no contra el último operado:
   compra al precio de venta, venta al precio de compra.
5. Titularidad: solo se fondea y se retira contra cuentas del mismo CUIT.
6. Obligaciones negociables: cotizan cada 100 VN, con lámina mínima; la cantidad va
   en valores nominales, no en dólares. Comprar por monto redondea al múltiplo válido.
7. CEDEARs: ratio de conversión por especie. Precio = (precio USD / ratio) × TC.
8. Confirmación en dos pasos: el botón Comprar/Vender no ejecuta, abre un detalle con
   el desglose de costos y recién ahí se confirma.
9. Costos: comisión sobre monto operado + derechos de mercado + IVA 21%, siempre
   visibles antes de confirmar y desglosados en el boleto.

## Datos operativos ya verificados contra fuentes reales
- Dólar MEP: dos patas en Contado Inmediato con AL30 / AL30D, mismo día.
  Sin parking para personas humanas. Mínimo $5.000 en la modalidad simple.
  Ventana de operatoria: días hábiles de 10:30 a 17:00.
- BYMA redujo el contado normal de T+2 a T+1.
- Comisiones: ~0,5% acciones y CEDEARs, ~0,25% ONs, + derechos de mercado + IVA 21%.
- Ratios de CEDEARs usados: AAPL 20:1, KO 5:1, TSLA 15:1.
- Persiste la restricción cruzada de 90 días entre dólar oficial y MEP/CCL.

## Criterios de diseño para el público 45-65
- Anclar cada concepto nuevo a algo que ya conocen del homebanking.
- Resumen post-operación en lenguaje llano.
- Nada de gamificación del riesgo: sin confeti, sin rachas, sin rankings.
- Cuerpo tipográfico ≥16px, contraste AA, áreas táctiles ≥44px.
- Errores dirigidos: la capacitación hace que el alumno se equivoque a propósito
  (fondear desde la cuenta de un tercero, orden límite que no se ejecuta, cantidad
  que no respeta la lámina mínima, intentar retirar dinero no liquidado).

## Cómo seguir
Trabajá sobre el archivo adjunto, no lo reescribas de cero. Es un HTML con esta
estructura interna: tokens de color en `:root`, instrumentos en `const INST`,
itinerarios en `const TOURS` con los bloques `S_INGRESO`, `S_MEP`, `S_COMPRA`,
`S_TENENCIA`, `S_ON`, `S_VENTA`, `S_RETIRO`, validaciones de orden en
`armarOrden()`, y textos de fuera de alcance en atributos `data-out="Título|Texto"`.