---
workflow: general-video
flow: automation
storyboard: yes
message: "Cómo comprar un CEDEAR en IOL: leer la ficha (ratio y puntas), armar la orden, mirar los costos antes de confirmar y seguir la inversión en el portafolio."
destination: capacitación (serie de 5 videos, video 2)
aspect: "16:9 · 1920×1080 · 30 fps"
language: es-AR (rioplatense, voseo)
audience: adultos de 45 a 65 años que nunca invirtieron
length: "2 min 58 s (máximo 3:00; versión resumida aprobada 2026-10-16). Versión larga 5:53 en renders/video-2-cedear-largo.mp4"
output: video-2-cedear.mp4
---

# Video 2 · Comprar mi primer CEDEAR (M4 · M5)

## Intent
Tutorial de pantalla sobre el simulador InvertOnlineSandBox.html,
itinerario «Comprar mi primer CEDEAR» (arranca con $ 900.000 acreditados por el itinerario).
Mismo estilo, placas y tratamiento de capturas que el video 1 (videos/video-1-ingreso-mep).
Dos capítulos separados por una placa corta: «Leer la ficha y armar la orden» (escenas 3–6)
y «Confirmar y seguir tu inversión» (escenas 7–8).

SIN VOZ EN OFF NI MÚSICA (decisión del usuario, 2026-10-16, igual que el video 1): el usuario graba su propia voz.
La narración queda como texto a grabar en la banda inferior (GUION-GRABACION.md, generado por tools/build.py).
Después: transcribir la grabación y reajustar tiempos en tools/build.py.
Cambio de guion propuesto (pendiente de confirmar): escena 6 dice «hay un monto para cada plazo de la operación» (la captura muestra el mismo monto en los tres plazos).

## Estilo de la serie
- Ritmo pausado, un solo texto en pantalla a la vez, sin efectos llamativos, sin emojis, sin confeti.
- Paleta: violeta #6439FF, índigo #06083F, lavanda #EEEDF8, fondo claro #F7F6FC,
  amarillo #E8B23A (texto #20160A encima). Barlow para títulos y textos; IBM Plex Mono en mayúsculas para etiquetas.
- Textos en pantalla ≥ 36 px, buen contraste. Subtítulos quemados abajo, sincronizados con la voz.
- Solo capturas reales del simulador. Zoom suave al elemento de cada paso, círculo en cada clic,
  cortes o fundidos cortos. Momentos clave (costos): congelar 3 s con zoom.
- Placas: apertura (6 s), «Para llevarte» (20 s, lavanda), final (8 s, índigo).
- Regla de contenido: enseña a usar la app, no en qué invertir. Coca-Cola es solo un ejemplo para practicar.

## Assets
- assets/captures/*.png — capturas reales (Playwright + Chromium, 1920×1080 @2x), tomadas siguiendo
  la guía del itinerario (tools/capture.py). manifest.json guarda las cajas de cada elemento y el texto visible.
- No existe grabacion-2.mp4: se usan capturas.

## Cifras (tomadas de las capturas, no del guion)
- Saldo inicial: AR$ 900.000,00.
- KO: último AR$ 21.075,20 · ratio 5 : 1 · acción en EE.UU. US$ 71,20 · TC implícito $ 1.480,00
  (71,20 ÷ 5 × 1.480 = 21.075,20).
- Caja de puntas: mejor punta vendedora AR$ 21.086,79 · mejor punta compradora AR$ 21.063,61.
- Orden: 10 un. a mercado, 24 hs. Bruto $ 210.867,91 · comisión $ 1.054,34 · derechos $ 168,69 ·
  IVA $ 256,84 · total $ 212.347,78. Boleto Nº 100842: costos $ 1.479,87 = 0,70 %.
- Portafolio: resultado $ -115,91 en pesos → US$ -0,08 en dólares.
- Montos disponibles: AR$ 900.000,00 en los tres plazos (en esta práctica no difieren).

## Notes
- El simulador muestra avisos «Supera tu perfil» (ficha y confirmación). No se narran ni se enfocan.
- El tooltip del simulador para KO dice «la más tranquila del grupo»: no aparece en las capturas
  (tooltips ocultos), pero contradice la regla de contenido y conviene corregirlo en el simulador.
