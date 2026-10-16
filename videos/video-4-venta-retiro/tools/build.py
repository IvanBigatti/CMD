"""Video 4 · Vender, esperar la liquidación y retirar (M6 · M7) — versión con la voz del usuario.

Voz: Audios/Parte 1.ogg (escenas 2–5), Parte 2.ogg (6–8), Parte 3.ogg (Para llevarte + placa final).
- Parte 1 termina con un intento cortado de la escena 6 («…El monto está de…»): se descarta y se usa la
  toma completa del comienzo de la Parte 2.
- Parte 2: se recorta el tropiezo «hasta la ma…» (21,507–22,028 s) → «esperás hasta mañana».
- Las partes 2 y 3 empiezan con unos segundos de ruido parejo, sin voz: quedan fuera de los tramos.
Cada escena dura lo que su tramo de voz + un margen; zooms, clics y subtítulos se anclan a cada frase.
La versión muda anterior está en tools/build_mudo.py.
"""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
SERIE = HERE.parents[1] / "_serie"
sys.path.insert(0, str(SERIE))
import serie, voz
from serie import box, union

TITLE = "Vender, esperar la liquidación y retirar"
IDEAS = ["Vender y cobrar no son lo mismo.",
         "La plata de una venta queda “a liquidar” un día hábil.",
         "Solo podés retirar lo disponible."]
serie.configure(ROOT, TITLE, "M6 · M7", IDEAS)

V = voz.Narracion(ROOT, {
 "s02": dict(parte=1, tramo=(1.20, 13.80), antes=0.8, despues=0.6, frases=[
    "Para esta práctica ya tenés una inversión:",
    "treinta CEDEARs de Coca-Cola, comprados hace unos días.",
    "Vas a venderlos y sacar la plata.",
    "Y vas a ver la parte que más confunde:",
    "vendés, ves la plata… y todavía no la podés retirar."]),
 "s03": dict(parte=1, tramo=(13.80, 32.75), antes=0.3, despues=0.5, frases=[
    "Menú «Operar», y después «Vender».",
    "A diferencia de la compra, el símbolo es una lista:",
    "solo podés vender lo que ya tenés.",
    "Ahora mirá el plazo: «Normal» quiere decir 24 horas,",
    "lo que se llama T más uno.",
    "La plata de la venta no queda disponible hoy, sino al día hábil siguiente."]),
 "s04": dict(parte=1, tramo=(32.75, 39.60), antes=0.3, despues=0.6, frases=[
    "Mandamos la venta,",
    "leemos el aviso sobre el plazo,",
    "y confirmamos."]),
 "s05": dict(parte=1, tramo=(40.90, 53.20), antes=0.3, despues=1.6, frases=[
    "Volvé al estado de cuenta y abrí «Detalle de saldos».",
    "Acá está la clave:",
    "la plata de la venta figura como «a liquidar», no como disponible.",
    "La ves, pero todavía no la podés sacar."]),
 "s06": dict(parte=2, tramo=(5.30, 18.85), antes=0.3, despues=0.6, frases=[
    "Probemos igual. Menú «Mi Cuenta», «Retirar dinero».",
    "El monto ya está cargado:",
    "es toda la plata de tu cuenta, incluida la de la venta.",
    "Confirmamos… y no nos deja.",
    "Está bien que falle: esa plata todavía no se liquidó."]),
 "s07": dict(parte=2, tramo=(18.85, 35.00), antes=0.3, despues=0.4, quitar=[(21.507, 22.028)], frases=[
    "En la vida real, esperás hasta mañana.",
    "En el simulador, tocás «Avanzar 1 día hábil», en la franja amarilla de arriba.",
    "Mirá el panel: la plata pasó de «a liquidar» a «disponible».",
    "Eso es la liquidación."]),
 "s08": dict(parte=2, tramo=(35.00, 40.40), antes=0.3, despues=1.6, frases=[
    "Ahora sí: confirmamos el retiro,",
    "y la plata vuelve a tu cuenta del banco."]),
 "s09": dict(parte=3, tramo=(4.30, 15.60), antes=0.8, despues=0, dur=16, frases=[
    "¿Qué te tenés que llevar de todo esto?",
    "Vender y cobrar no son lo mismo.",
    "La plata de una venta queda “a liquidar” un día hábil.",
    "Solo podés retirar lo disponible."]),
 "s10": dict(parte=3, tramo=(17.85, 24.50), antes=0.6, despues=0, dur=8, frases=[
    "Ahora hacelo vos.",
    "Vender, esperar la liquidación y retirar.",
    "Al terminar, puntuá la sección del 1 al 10."]),
})
P = V.P

# Cajas medidas sobre las capturas (no las registra el manifest)
NAV_PORTAFOLIO = [426, 151, 105, 49]
KO_FILA = [381, 587, 420, 58]
KO_TABLA = [381, 500, 560, 146]
DISPONIBLE_OPERAR = [771, 342, 377, 136]
PLAZO_FILA = [396, 306, 368, 38]
RESUMEN_SALDOS = [380, 864, 260, 64]
A_LIQUIDAR = [380, 800, 684, 39]
RET_DISP = [520, 543, 100, 26]

SCENES = [
 dict(id="s01", kind="open", dur=6),
 V.escena("s02", events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("click", P("s02", 1, -0.9), NAV_PORTAFOLIO),
    ("show", P("s02", 1, -0.2), "01b-portafolio"), ("cam", P("s02", 1, -0.2), "full", None, 0.01),
    ("cam", P("s02", 1, 0.2), KO_TABLA, 2.4),
    ("mark", P("s02", 1, 1.2), KO_FILA, P("s02", 3) - P("s02", 1, 1.2)),
    ("cam", P("s02", 3, 0.0), DISPONIBLE_OPERAR, 2.2),
    ("mark", P("s02", 4, 0.3), DISPONIBLE_OPERAR),
 ]),
 V.escena("s03", events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("click", P("s03", 0, 0.3), box("01-inicio", "nav-operar")),
    ("show", P("s03", 0, 1.0), "02-menu-operar"),
    ("cam", P("s03", 0, 1.1), union(box("02-menu-operar", "nav-operar"), box("02-menu-operar", "menu-vender")), 1.8),
    ("click", P("s03", 1, -0.6), box("02-menu-operar", "menu-vender")),
    ("show", P("s03", 1, 0.1), "04-vender-plazo"), ("cam", P("s03", 1, 0.1), "full", None, 0.01),
    ("cam", P("s03", 1, 0.5), union(box("04-vender-plazo", "simbolo-venta"), box("04-vender-plazo", "simbolo-info")), 2.2),
    ("mark", P("s03", 1, 1.5), union(box("04-vender-plazo", "simbolo-venta"), box("04-vender-plazo", "simbolo-info")),
     P("s03", 3) - P("s03", 1, 1.5)),
    ("cam", P("s03", 3, -0.2), PLAZO_FILA, 2.5),
    ("mark", P("s03", 3, 0.9), box("04-vender-plazo", "plazo-venta"), P("s03", 5) - P("s03", 3, 0.9)),
    ("label", P("s03", 4), "T+1: cobrás al día hábil siguiente"),
 ]),
 V.escena("s04", events=[
    ("show", 0, "04-vender-plazo"), ("cam", 0, "full", None, 0.01),
    ("click", P("s04", 0, 0.5), box("04-vender-plazo", "vender-submit")),
    ("show", P("s04", 0, 1.2), "05-confirmar-venta"),
    ("cam", P("s04", 1, -0.3), box("05-confirmar-venta", "aviso-plazo"), 2.3),
    ("mark", P("s04", 1, 0.6), box("05-confirmar-venta", "aviso-plazo"), P("s04", 2) - P("s04", 1, 0.6)),
    ("cam", P("s04", 2, -0.5), union(box("05-confirmar-venta", "aviso-plazo"), box("05-confirmar-venta", "confirmar-orden")), 2.0, 0.6),
    ("click", P("s04", 2, 0.4), box("05-confirmar-venta", "confirmar-orden")),
    ("show", P("s04", 2, 1.1), "06-boleto"), ("cam", P("s04", 2, 1.1), "full", None, 0.01),
 ]),
 V.escena("s05", events=[
    ("show", 0, "06-boleto"), ("cam", 0, "full", None, 0.01),
    ("click", P("s05", 0, 0.3), box("06-boleto", "nav-micuenta")),
    ("show", P("s05", 0, 0.9), "07-menu-micuenta"),
    ("cam", P("s05", 0, 1.0), union(box("07-menu-micuenta", "nav-micuenta"), box("07-menu-micuenta", "menu-estado")), 1.8),
    ("click", P("s05", 0, 1.9), box("07-menu-micuenta", "menu-estado")),
    ("show", P("s05", 0, 2.5), "08b-acordeon"), ("cam", P("s05", 0, 2.5), "full", None, 0.01),
    ("cam", P("s05", 0, 2.6), RESUMEN_SALDOS, 1.8, 0.6),
    ("click", P("s05", 1, -0.2), RESUMEN_SALDOS),
    ("show", P("s05", 1, 0.5), "09-detalle-saldos"),
    ("cam", P("s05", 1, 0.6), box("09-detalle-saldos", "saldos"), 2.4),
    ("mark", P("s05", 2, 0.4), A_LIQUIDAR, P("s05", 3) - P("s05", 2, 0.4)),
    ("card", P("s05", 3, -0.2), dict(title="TUS TRES SALDOS EN PESOS", rows=[
        ["Disponible", "$ 40.000,00", "#0A7A57"],
        ["Comprometido", "$ 0,00", "#8A5B07"],
        ["A liquidar", "$ 627.473,53", "#6439FF"]], hi=2, tHi=P("s05", 3, 1.4))),
 ]),
 V.escena("s06", events=[
    ("show", 0, "09-detalle-saldos"), ("cam", 0, "full", None, 0.01),
    ("click", P("s06", 0, 1.0), box("09-detalle-saldos", "nav-micuenta")),
    ("show", P("s06", 0, 1.6), "10-menu-retirar"),
    ("cam", P("s06", 0, 1.7), union(box("10-menu-retirar", "nav-micuenta"), box("10-menu-retirar", "menu-retirar")), 1.8),
    ("click", P("s06", 1, -0.7), box("10-menu-retirar", "menu-retirar")),
    ("show", P("s06", 1, -0.1), "11-retirar"), ("cam", P("s06", 1, -0.1), "full", None, 0.01),
    ("cam", P("s06", 1, 0.2), union(box("11-retirar", "monto-retiro"), box("11-retirar", "ret-disp")), 2.2),
    ("mark", P("s06", 1, 0.8), box("11-retirar", "monto-retiro"), P("s06", 2, 0.6) - P("s06", 1, 0.8)),
    ("mark", P("s06", 2, 0.6), RET_DISP, P("s06", 3, -0.6) - P("s06", 2, 0.6)),
    ("cam", P("s06", 3, -0.6), union(box("11-retirar", "monto-retiro"), box("11-retirar", "confirmar-retiro")), 2.0, 0.6),
    ("click", P("s06", 3, 0.2), box("11-retirar", "confirmar-retiro")),
    ("show", P("s06", 3, 0.9), "12-retiro-rechazado"),
    # mensaje de error: zoom y cámara quieta hasta el final de la escena (≥ 3 s)
    ("cam", P("s06", 3, 1.0), box("12-retiro-rechazado", "ret-msg"), 2.3, 0.8),
 ]),
 V.escena("s07", events=[
    ("show", 0, "12-retiro-rechazado"), ("cam", 0, box("12-retiro-rechazado", "ret-msg"), 2.3, 0.01),
    ("cam", P("s07", 1, -0.3), box("12-retiro-rechazado", "reloj-avanzar"), 2.5),
    ("mark", P("s07", 1, 0.8), box("12-retiro-rechazado", "reloj-avanzar"), P("s07", 2, -1.2) - P("s07", 1, 0.8)),
    ("click", P("s07", 2, -1.4), box("12-retiro-rechazado", "reloj-avanzar")),
    ("show", P("s07", 2, -0.8), "13-paso-un-dia"),
    ("cam", P("s07", 2, -0.7), box("13-paso-un-dia", "modal"), 2.0, 0.6),
    ("show", P("s07", 2, 0.6), "14-retirar-disponible"), ("cam", P("s07", 2, 0.6), box("14-retirar-disponible", "ret-panel"), 1.8, 0.01),
    ("cam", P("s07", 2, 0.9), box("14-retirar-disponible", "ret-saldos"), 2.5),
    ("mark", P("s07", 2, 1.8), box("14-retirar-disponible", "ret-saldos")),
    ("label", P("s07", 2, 1.8), "A liquidar → Disponible"),
 ]),
 V.escena("s08", events=[
    ("show", 0, "14b-retirar-limpio"),
    ("cam", 0, union(box("14b-retirar-limpio", "monto-retiro"), box("14b-retirar-limpio", "confirmar-retiro")), 2.0, 0.01),
    ("click", P("s08", 0, 1.0), box("14b-retirar-limpio", "confirmar-retiro")),
    ("show", P("s08", 0, 1.7), "15-retiro-ok"), ("cam", P("s08", 0, 1.8), box("15-retiro-ok", "modal"), 2.2),
    ("mark", P("s08", 1, 0.6), box("15-retiro-ok", "modal-p")),
 ]),
 V.escena("s09", kind="takeaways", guide_band=True,
          idea_t=[P("s09", 1, -0.1), P("s09", 2, -0.1), P("s09", 3, -0.1)]),
 V.escena("s10", kind="final", guide_band=True,
          t=[P("s10", 0, -0.2), P("s10", 1, -0.2), P("s10", 2, -0.2), P("s10", 2, 0.6)]),
]

# Música de fondo: la misma pista que el video 1 (biblioteca de HeyGen, ca26cc0c)
MUSICA_ORIGEN = HERE.parents[1] / "video-1-ingreso-mep/musica/candidatas/ca26cc0c.mp3"

if __name__ == "__main__":
    clips = V.audios(SCENES)
    total = sum(sc["dur"] for sc in SCENES)
    (ROOT / "musica").mkdir(exist_ok=True)
    voz.preparar_musica(MUSICA_ORIGEN, ROOT / "musica/fondo.wav", total)
    serie.main(SCENES, audio=clips, music=voz.musica(SCENES))
    voz.carve(ROOT / "index.html", clips, SERIE)
