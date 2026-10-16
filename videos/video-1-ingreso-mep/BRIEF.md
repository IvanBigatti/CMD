---
workflow: general-video
flow: automation
storyboard: yes
message: "Cómo ingresar dinero desde una cuenta propia y comprar dólar MEP en IOL, entendiendo las dos operaciones que hace el sistema."
destination: capacitación (serie de 5 videos, video 1)
aspect: "16:9 · 1920×1080 · 30 fps"
language: es-AR (rioplatense, voseo)
audience: adultos de 45 a 65 años que nunca invirtieron
length: "2 min 53 s (máximo 3:00)"
output: video-1-ingreso-mep.mp4
---

# Video 1 · Ingresar dinero y comprar dólar MEP (M2 · M3)

## Intent
Tutorial de pantalla con voz en off sobre el simulador InvertOnlineSandBox.html,
itinerario «Ingresar dinero y comprar dólar MEP», con la cuenta en cero.
Sin voz en off ni música (decisión del usuario, 2026-10-16): «No quiero que haya voz porque después
necesito grabar con mi voz propia el paso a paso». El video no puede pasar los 3 minutos.
La narración del pedido queda como texto a grabar, mostrado en la banda inferior como guía de lectura.
Después: transcribir la grabación del usuario y reajustar escenas y subtítulos a su voz.

## Estilo de la serie (pedido del usuario, textual en lo esencial)
- Ritmo pausado, un solo texto en pantalla a la vez, sin efectos llamativos, sin emojis, sin confeti.
- Paleta: violeta #6439FF, índigo #06083F, lavanda #EEEDF8, fondo claro #F7F6FC,
  amarillo #E8B23A (texto #20160A encima). Barlow para títulos y textos; IBM Plex Mono en mayúsculas para etiquetas.
- Textos en pantalla ≥ 36 px, buen contraste. Subtítulos quemados abajo, sincronizados con la voz.
- Solo capturas reales del simulador. Zoom suave al elemento de cada paso, círculo en cada clic,
  cortes o fundidos cortos. Mensaje de error: congelar 3 s con zoom.
- Placas: apertura (6 s, índigo + franja amarilla), «Para llevarte» (20 s, lavanda), final (8 s, índigo).
- Regla de contenido: enseña a usar la app, no en qué invertir.

## Assets
- assets/captures/*.png — capturas reales (Playwright + Edge, 1920×1080 @2x) y manifest.json con las cajas de cada elemento.

## Notes
- Cifras tomadas de las capturas: ingreso $ 600.000; MEP $ 300.000 → TC $ 1.480,00 → US$ 202,59 (406 VN AL30/AL30D);
  saldo final disponible $ 300.160,88 y US$ 202,59.
- En el simulador, elegir la cuenta de María G. Suárez muestra un aviso; el rechazo aparece al tocar «Confirmar transferencia».
