# Simulador InvertirOnline (React + Vite + TypeScript)

Sitio de capacitación con un simulador de la plataforma de InvertirOnline. La persona, las
cuentas, los precios y los testimonios son datos simulados. Las reseñas de las capacitaciones se
guardan en una base SQLite local (ver "Reseñas"). Nació como migración de
`../InvertOnlineSandBox.html`, que se conserva como referencia.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173 (incluye la API local de reseñas)
npm run build    # chequeo de tipos + build de producción en dist/
npm run lint
```

## Páginas

La navegación usa el hash de la URL, así que funciona en cualquier hosting estático y con el
botón "atrás" del navegador (`src/sitio/ruta.ts`).

| URL | Página |
|---|---|
| `#/` | Inicio: bienvenida con carrusel de fotos, cómo funciona, actividades y opiniones |
| `#/capacitaciones` | Secciones Videos, Podcast y Reseñas |
| `#/capacitaciones/<clave>` | Una actividad: video, instructivo, "Practicar en el simulador" y sus reseñas |
| `#/simulador` | La plataforma simulada, a pantalla completa |
| `#/nosotros` | Sobre nosotros: quiénes somos y nuestras capacitaciones |

## Contenido editable (sin tocar componentes)

Todo está en `src/contenido/`:

- `carrusel.ts`: fotos de la portada (archivos en `public/img/inicio/`, créditos en `public/img/CREDITOS.md`).
- `podcasts.ts`: episodios de cada actividad en las dos voces, con su duración (archivos en `public/podcasts/`). Con `null` se muestra "Podcast próximamente".
- `videos.ts`: video de cada actividad (archivos en `public/videos/`). Con `archivo: null` se muestra "Video próximamente".
- `instructivos.ts`: instructivo de cada página, actividad y pantalla del simulador. Para sumar
  una imagen, copiala a `public/instructivos/` y agregá `imagen: { archivo, alt }`. Sin imagen se
  ve un recuadro "Imagen ilustrativa próximamente".
- `testimonios.ts`: opiniones de ejemplo de la portada. `nosotros.ts`: textos de "Sobre nosotros".

`public/videos/` no se versiona: son copias de los renders de `../videos/`. Para actualizarlas corré `npm run videos` (el mapeo render → archivo está en `scripts/copiar-videos.mjs`).

## Podcasts

Cada capacitación tiene un podcast en dos voces argentinas, Elena y Tomás, que se elige en la
sección Podcast (el navegador recuerda la elección). Los audios se generan con
[edge-tts](https://github.com/rany2/edge-tts), que usa las voces neuronales de Microsoft Edge:
es gratis y no necesita API key.

- **Guiones**: `podcasts/guiones/<clave>.txt`, un párrafo por bloque, separados por una línea en
  blanco. Los números y las siglas se escriben como se dicen ("A L treinta", "te más uno").
- **Generar**: `npm run podcasts` (todas) o `npm run podcasts -- mep on` (algunas). Escribe
  `public/podcasts/<clave>-elena.mp3` y `<clave>-tomas.mp3` y muestra la duración de cada uno.
  Después hay que actualizar las duraciones en `src/contenido/podcasts.ts`.
- **Requisitos** (una sola vez): ffmpeg y el entorno de Python:
  `python3 -m venv .venv-podcasts && .venv-podcasts/bin/pip install edge-tts`.
- Los `.mp3` generados se versionan y siguen funcionando aunque edge-tts deje de andar; si eso
  pasa, se puede reemplazar por [Piper](https://github.com/rhasspy/piper) (voz `es_AR-daniela`).

## Reseñas

Al terminar la práctica guiada de una capacitación se ofrece dejar una reseña (nombre, comentario
y de 1 a 5 estrellas, sin registrarse). Cada capacitación muestra las suyas y `#/capacitaciones`
las muestra todas con filtro.

- **Base**: `datos/resenas.db` (SQLite, se versiona). Usa el diario en modo `DELETE` para que todo
  quede en ese único archivo. Para ver o borrar reseñas: `sqlite3 datos/resenas.db`.
- **API**: `servidor/apiResenas.ts`, un plugin de Vite que monta `GET` y `POST /api/resenas` en
  `npm run dev` y `npm run preview`. Usa `node:sqlite` (Node 22.13 o más nuevo); el aviso
  "SQLite is an experimental feature" es normal.
- **Frontend**: todo el acceso pasa por `src/datos/resenas.ts`. Para publicar el sitio con otro
  backend (por ejemplo Supabase) alcanza con reescribir ese archivo.
- El build estático (`dist/`) no incluye la API: ahí las reseñas muestran "No pudimos cargar".

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
- Los textos admiten `**negrita**` y saltos de línea (`\n`), ver `ui/TextoRico.tsx`.
