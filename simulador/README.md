# Simulador InvertirOnline (React + Vite + TypeScript)

Sitio de capacitación con un simulador de la plataforma de InvertirOnline. Solo frontend: la
persona, las cuentas, los precios y los testimonios son datos simulados. Nació como migración de
`../InvertOnlineSandBox.html`, que se conserva como referencia.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # chequeo de tipos + build de producción en dist/
npm run lint
```

## Páginas

La navegación usa el hash de la URL, así que funciona en cualquier hosting estático y con el
botón "atrás" del navegador (`src/sitio/ruta.ts`).

| URL | Página |
|---|---|
| `#/` | Inicio: bienvenida con carrusel de fotos, cómo funciona, actividades y opiniones |
| `#/capacitaciones` | Listado de actividades |
| `#/capacitaciones/<clave>` | Una actividad: video, instructivo y "Practicar en el simulador" |
| `#/simulador` | La plataforma simulada, a pantalla completa |
| `#/nosotros` | Sobre nosotros, opiniones y formulario "Valoranos" |

## Contenido editable (sin tocar componentes)

Todo está en `src/contenido/`:

- `carrusel.ts`: fotos de la portada (archivos en `public/img/inicio/`, créditos en `public/img/CREDITOS.md`).
- `videos.ts`: video de cada actividad (archivos en `public/videos/`). Con `archivo: null` se muestra "Video próximamente".
- `instructivos.ts`: instructivo de cada página, actividad y pantalla del simulador. Para sumar
  una imagen, copiala a `public/instructivos/` y agregá `imagen: { archivo, alt }`. Sin imagen se
  ve un recuadro "Imagen ilustrativa próximamente".
- `testimonios.ts` y `nosotros.ts`: textos de "Sobre nosotros" (de ejemplo, para editar).

`public/videos/` no se versiona: son copias de los renders de `../videos/`.

## Estructura

```
src/
  sitio/          Ruteo, encabezado, pie, tarjetas y páginas del sitio (paginas/)
  contenido/      Textos, fotos, videos e instructivos editables
  mocks/          Datos simulados: persona, instrumentos, perfiles, textos "próximamente", mercado
  dominio/        Reglas de negocio puras, sin React: precios, puntas, costos, órdenes, MEP, cartera, fechas
  estado/         Stores de Zustand
    simulador.ts    Saldos (disponible / comprometido / a liquidar), posiciones, órdenes, T+1, pantalla actual
    ui.ts           Modales, menú desplegable abierto, selector de itinerarios
    testPerfil.ts   Flujo del test de perfil de inversor
  guia/           Itinerarios guiados (pasos) y estado de la guía
  componentes/
    layout/       Plataforma (el simulador), franja de capacitación, barra con buscador, menú superior
    overlays/     ModalHost, SelectorItinerarios, GuiaOverlay (spotlight + globo)
    ui/           Piezas reutilizables: Instructivo, Carrusel, Estrellas, saldos, avisos, BotonProximamente…
  pantallas/      Una por pantalla del simulador: EstadoDeCuenta, Portafolio, Cotizaciones, FichaActivo,
                  Comprar, Vender, Boleto, IngresarDinero, DolarMep, RetirarDinero, Movimientos, PerfilInversor
  estilos/        CSS por área (tokens de color en base.css, sitio en sitio.css)
```

## Notas de diseño

- **Guía paso a paso**: cada paso apunta a un elemento por su atributo `data-tour`. Si se cambia
  un `data-tour` en una pantalla, hay que actualizar `guia/itinerarios.ts`. La guía solo se
  muestra en `#/simulador`; si salís a otra página queda en pausa en el mismo paso.
- **Próximamente**: los controles que no están en el temario usan `<BotonProximamente tema="…">`;
  el texto del popup vive en `mocks/proximamente.ts`.
- **Pantallas del simulador**: siguen siendo estado interno (`irA(pantalla)`), sin URL propia.
- **Valoraciones**: no hay servidor; cada valoración se guarda en el `localStorage` de quien la deja.
- Los textos admiten `**negrita**` y saltos de línea (`\n`), ver `ui/TextoRico.tsx`.
