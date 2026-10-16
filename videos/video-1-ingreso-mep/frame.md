# Estilo de la serie · Capacitación en el uso de Invertir Online (IOL)

Serie de 5 videos tutoriales sobre el simulador `InvertOnlineSandBox.html`.
Este estilo se aplica igual en todos. El código que lo implementa está en `_serie/serie.py`.

## Formato
- 1920×1080, 30 fps, MP4. Español rioplatense, con voseo.
- Público: adultos de 45 a 65 años que nunca invirtieron.
- **Video mudo:** sin voz en off ni música. El usuario graba su voz después; entonces se transcribe la
  grabación y se reajustan escenas y subtítulos a esa voz (tiempos en el `tools/build.py` de cada video).
- **Duración máxima: 3:00** (pedido del usuario en el video 1).
- Ritmo pausado, un solo texto a la vez, sin efectos llamativos, sin emojis, sin confeti.

## Paleta y tipografía
| Token | Color | Uso |
|---|---|---|
| violeta | #6439FF | círculo de clic, recuadros, etiquetas mono sobre lavanda |
| índigo | #06083F | placas de apertura y final, banda inferior |
| lavanda | #EEEDF8 | placa «Para llevarte», tarjeta del itinerario |
| fondo claro | #F7F6FC | fondo de las escenas de pantalla |
| amarillo | #E8B23A (texto #20160A) | franja de apertura, etiquetas, numerales |

- Barlow (400–700, incluida en `_serie/fonts`) para títulos y textos.
- IBM Plex Mono en MAYÚSCULAS para etiquetas.
- Texto en pantalla ≥ 36 px y contraste AA (lo verifica `npx hyperframes check`).

## Escenas de pantalla
- Captura real del simulador en una caja de 1520×855 (x 200, y 84), esquinas redondeadas y sombra suave.
- Arriba a la izquierda, una sola etiqueta: recuadro amarillo, Barlow 600 de 36 px.
- Abajo, banda índigo (desde y = 960) con el **texto guía**: la frase a grabar, en Barlow 500 de 42 px, en el momento
  en que hay que decirla. Cuando exista la voz, pasa a ser el subtítulo sincronizado.
- Cámara: zoom suave (1,1 s, power2.inOut) al elemento de cada paso; la vista «completa» encuadra la ventana del simulador.
  Zoom máximo ≈ 2,5 (las capturas son @2x).
- Clic: círculo violeta que aparece sobre el control y se desvanece; después, fundido de 0,3 s a la pantalla siguiente.
- Recuadro violeta para señalar un dato sin clic.
- Mensaje de error: cámara quieta con zoom sobre el mensaje durante 3 s o más.
- Capturas sin el globo ni el anillo de la guía del simulador (se ocultan al capturar), para que haya un solo texto.

## Placas
- **Apertura (6 s):** fondo índigo; franja amarilla arriba «MODO CAPACITACIÓN · DINERO Y PRECIOS FICTICIOS»;
  etiqueta «CAPACITACIÓN EN EL USO DE INVERTIR ONLINE (IOL)»; título del itinerario; «MÓDULOS Mx · My» en amarillo.
- **Para llevarte (20 s):** fondo lavanda; etiqueta «PARA LLEVARTE»; las ideas aparecen de a una (una por vez),
  con numeral en círculo amarillo y puntos de progreso.
- **Final (8 s):** fondo índigo; «Ahora hacelo vos»; tarjeta lavanda «ITINERARIO DEL SIMULADOR» + nombre;
  «Al terminar, puntuá la sección del 1 al 10» en amarillo; abajo «Simulador de práctica · No es una recomendación de inversión».

## Regla de contenido
La capacitación enseña a usar la aplicación, no en qué invertir. Nunca decir ni mostrar que un instrumento conviene,
es mejor, es más seguro o es para principiantes, ni que conviene comprar, vender o quedarse con algo.

## Proceso por video
1. Capturar el itinerario con Playwright + Edge (`tools/capture.py` del video): una captura @2x por pantalla y
   `assets/captures/manifest.json` con las cajas de los elementos `data-tour`. Si existe `grabacion-N.mp4`, usarla de base.
2. Cifras: siempre las de la captura, nunca las del guion.
3. Plan de escenas en `STORYBOARD.md` → aprobación del usuario antes de armar y de renderizar.
4. `python tools/build.py` → `npx hyperframes check` → vista previa en Studio → render a `renders/<archivo>.mp4`.
5. Entregar `GUION-GRABACION.md` con cada frase y su tiempo.
