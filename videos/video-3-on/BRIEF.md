---
workflow: general-video
flow: automation
storyboard: yes
message: "Cómo comprar una obligación negociable en IOL: leer símbolo y lámina, cargar la cantidad en VN, entender el rechazo por lámina, confirmar y leer el boleto."
destination: capacitación (serie de 5 videos, video 3)
aspect: "16:9 · 1920×1080 · 30 fps"
language: es-AR (rioplatense, voseo)
audience: adultos de 45 a 65 años que nunca invirtieron
length: "2 min 58 s (tope de la serie: 3:00; el pedido decía ≈ 4:20)"
output: video-3-on.mp4
recipe: capacitacion-iol
---

# Video 3 · Invertir en obligaciones negociables (M4)

## Intent
Tutorial de pantalla, mudo, sobre el itinerario «Invertir en Obligaciones Negociables» del simulador.
Arranca con US$ 3.000; la orden trae cargados YMCJO y 550 VN. Estilo y proceso: ../_serie/ESTILO.md
(video mudo, el usuario graba su voz; máximo 3:00). El pedido original pedía TTS y ≈ 4:20: se aplica la regla de la serie.

## Assets
- assets/captures/*.png — capturas reales (Playwright, 1920×1080 @2x) siguiendo la guía (tools/capture.py).
  09 y 10 salen de la guía: ficha real de YMCJO, de donde salen la renta y el vencimiento.
- No existe grabacion-3.mp4.

## Cifras (de las capturas)
- Cuenta: US$ 3.000,00 (valorizado AR$ 4.440.000,00).
- YMCJO · YPF ON Clase XXXIX: último US$ 99,40 · punta vendedora US$ 99,45 · cotiza cada 100 VN · lámina mínima 100 VN.
- Ficha: tasa anual 8,50 % · pago de renta semestral, marzo y septiembre · vencimiento 2031.
- Rechazo con 550 VN: «No se puede enviar la orden. Esta obligación negociable se opera en múltiplos de 100 VN. Probá con 600 VN.»
- Orden 1.000 VN a US$ 99,45: bruto US$ 994,55 · comisión US$ 2,49 · derechos US$ 0,80 · IVA US$ 0,69 · total US$ 998,52.
- Boleto Nº 100842: costos US$ 3,97 = 0,40 %.

## Notes
- El guion decía 99,40; la orden se ejecuta a la punta vendedora 99,45 → el ejemplo usa 99,45 y US$ 994,55.
- Después de corregir a 1.000 VN, el mensaje de rechazo sigue visible hasta reenviar: el zoom va solo al campo de cantidad.
- Regla de contenido: la descripción del itinerario en el simulador dice «el instrumento que mejor le calza a un ahorrista»
  y el último paso «instrumento de entrada para quien recién empieza». No aparecen en el video, pero contradicen la regla.
