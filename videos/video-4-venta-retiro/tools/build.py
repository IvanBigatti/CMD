"""Video 4 · Vender, esperar la liquidación y retirar (M6 · M7).

Escenas y tiempos de este video; el estilo vive en ../_serie/serie.py.
Para reajustar a la grabación de voz: editar dur / t / guide y correr `python tools/build.py`.
"""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "_serie"))
import serie
from serie import box, union

TITLE = "Vender, esperar la liquidación y retirar"
IDEAS = ["Vender y cobrar no son lo mismo.",
         "La plata de una venta queda “a liquidar” un día hábil.",
         "Solo podés retirar lo disponible."]
serie.configure(HERE.parent, TITLE, "M6 · M7", IDEAS)

# Cajas medidas sobre las capturas (no las registra el manifest)
NAV_PORTAFOLIO = [426, 151, 105, 49]
KO_FILA = [381, 587, 420, 58]
KO_TABLA = [381, 500, 560, 146]
DISPONIBLE_OPERAR = [771, 342, 377, 136]
PLAZO_FILA = [396, 306, 368, 38]
RESUMEN_SALDOS = [380, 864, 260, 64]
A_LIQUIDAR = [380, 800, 684, 39]

SCENES = [
 dict(id="s01", kind="open", dur=6),
 dict(id="s02", kind="screen", dur=20, events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("click", 3.4, NAV_PORTAFOLIO),
    ("show", 4.1, "01b-portafolio"), ("cam", 4.1, "full", None, 0.01),
    ("cam", 4.6, KO_TABLA, 2.4),
    ("mark", 5.8, KO_FILA),
    ("cam", 12.6, DISPONIBLE_OPERAR, 2.2),
    ("mark", 13.8, DISPONIBLE_OPERAR),
  ], guide=[
    (0.5, 3.1, "Para esta práctica ya tenés una inversión hecha:"),
    (3.6, 4.4, "treinta CEDEARs de Coca-Cola, comprados hace unos días."),
    (8.0, 3.0, "Vas a venderlos y a sacar la plata."),
    (11.0, 3.2, "Y vas a ver la parte que más confunde:"),
    (14.2, 5.8, "vendés, ves la plata… y todavía no la podés retirar."),
  ]),
 dict(id="s03", kind="screen", dur=28, events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("click", 0.8, box("01-inicio", "nav-operar")),
    ("show", 1.5, "02-menu-operar"),
    ("cam", 1.6, union(box("02-menu-operar", "nav-operar"), box("02-menu-operar", "menu-vender")), 1.8),
    ("click", 3.0, box("02-menu-operar", "menu-vender")),
    ("show", 3.7, "04-vender-plazo"), ("cam", 3.7, "full", None, 0.01),
    ("cam", 4.6, union(box("04-vender-plazo", "simbolo-venta"), box("04-vender-plazo", "simbolo-info")), 2.2),
    ("mark", 5.8, union(box("04-vender-plazo", "simbolo-venta"), box("04-vender-plazo", "simbolo-info"))),
    ("cam", 12.6, PLAZO_FILA, 2.5),
    ("mark", 13.8, box("04-vender-plazo", "plazo-venta")),
    ("label", 17.6, "T+1: cobrás al día hábil siguiente"),
  ], guide=[
    (0.5, 4.0, "Menú «Operar», y después «Vender»."),
    (4.5, 4.1, "A diferencia de la compra, el símbolo es una lista:"),
    (8.6, 4.0, "solo podés vender lo que ya tenés."),
    (12.6, 5.0, "Ahora mirá el plazo: «Normal» quiere decir veinticuatro horas,"),
    (17.6, 3.0, "lo que se llama T más uno."),
    (20.6, 7.4, "La plata de la venta no queda disponible hoy, sino al día hábil siguiente."),
  ]),
 dict(id="s04", kind="screen", dur=12, events=[
    ("show", 0, "04-vender-plazo"), ("cam", 0, "full", None, 0.01),
    ("click", 0.9, box("04-vender-plazo", "vender-submit")),
    ("show", 1.6, "05-confirmar-venta"),
    ("cam", 1.7, box("05-confirmar-venta", "aviso-plazo"), 2.3),
    ("mark", 2.9, box("05-confirmar-venta", "aviso-plazo")),
    ("cam", 6.6, union(box("05-confirmar-venta", "aviso-plazo"), box("05-confirmar-venta", "confirmar-orden")), 2.0),
    ("click", 7.9, box("05-confirmar-venta", "confirmar-orden")),
    ("show", 8.6, "06-boleto"), ("cam", 8.6, "full", None, 0.01),
  ], guide=[
    (0.5, 2.0, "Mandamos la venta,"),
    (2.5, 5.0, "leemos el aviso sobre el plazo,"),
    (7.5, 4.5, "y confirmamos."),
  ]),
 dict(id="s05", kind="screen", dur=24, events=[
    ("show", 0, "06-boleto"), ("cam", 0, "full", None, 0.01),
    ("click", 0.8, box("06-boleto", "nav-micuenta")),
    ("show", 1.5, "07-menu-micuenta"),
    ("cam", 1.6, union(box("07-menu-micuenta", "nav-micuenta"), box("07-menu-micuenta", "menu-estado")), 1.8),
    ("click", 2.8, box("07-menu-micuenta", "menu-estado")),
    ("show", 3.5, "08b-acordeon"), ("cam", 3.5, "full", None, 0.01),
    ("cam", 3.9, RESUMEN_SALDOS, 1.8),
    ("click", 5.0, RESUMEN_SALDOS),
    ("show", 5.7, "09-detalle-saldos"),
    ("cam", 5.8, box("09-detalle-saldos", "saldos"), 2.4),
    ("mark", 8.0, A_LIQUIDAR),
    ("card", 13.0, dict(title="TUS TRES SALDOS EN PESOS", rows=[
        ["Disponible", "$ 40.000,00", "#0A7A57"],
        ["Comprometido", "$ 0,00", "#8A5B07"],
        ["A liquidar", "$ 627.473,53", "#6439FF"]], hi=2, tHi=15.2)),
  ], guide=[
    (0.5, 5.3, "Volvé al estado de cuenta y abrí «Detalle de saldos»."),
    (5.8, 2.2, "Acá está la clave:"),
    (8.0, 6.5, "la plata de la venta figura como «a liquidar», no como disponible."),
    (14.5, 9.5, "La ves, pero todavía no la podés sacar."),
  ]),
 dict(id="s06", kind="screen", dur=22, events=[
    ("show", 0, "09-detalle-saldos"), ("cam", 0, "full", None, 0.01),
    ("click", 0.8, box("09-detalle-saldos", "nav-micuenta")),
    ("show", 1.5, "10-menu-retirar"),
    ("cam", 1.6, union(box("10-menu-retirar", "nav-micuenta"), box("10-menu-retirar", "menu-retirar")), 1.8),
    ("click", 3.0, box("10-menu-retirar", "menu-retirar")),
    ("show", 3.7, "11-retirar"), ("cam", 3.7, "full", None, 0.01),
    ("cam", 4.2, union(box("11-retirar", "monto-retiro"), box("11-retirar", "ret-disp")), 2.2),
    ("mark", 5.4, box("11-retirar", "monto-retiro")),
    ("mark", 8.4, [520, 543, 100, 26]),
    ("cam", 11.0, union(box("11-retirar", "monto-retiro"), box("11-retirar", "confirmar-retiro")), 2.0),
    ("click", 12.0, box("11-retirar", "confirmar-retiro")),
    ("show", 12.7, "12-retiro-rechazado"),
    ("cam", 12.8, box("12-retiro-rechazado", "ret-msg"), 2.3, 0.8),
  ], guide=[
    (0.5, 3.7, "Probemos igual. Menú «Mi Cuenta», «Retirar dinero»."),
    (4.2, 2.2, "El monto ya está cargado:"),
    (6.4, 4.6, "es toda la plata de tu cuenta, incluida la de la venta."),
    (11.0, 4.0, "Confirmamos… y no nos deja."),
    (15.0, 7.0, "Está bien que falle: esa plata todavía no se liquidó."),
  ]),
 dict(id="s07", kind="screen", dur=24, events=[
    ("show", 0, "12-retiro-rechazado"), ("cam", 0, box("12-retiro-rechazado", "ret-msg"), 2.3, 0.01),
    ("cam", 2.2, box("12-retiro-rechazado", "reloj-avanzar"), 2.5),
    ("mark", 3.4, box("12-retiro-rechazado", "reloj-avanzar")),
    ("click", 7.0, box("12-retiro-rechazado", "reloj-avanzar")),
    ("show", 7.7, "13-paso-un-dia"),
    ("cam", 7.8, box("13-paso-un-dia", "modal"), 2.0),
    ("show", 10.8, "14-retirar-disponible"), ("cam", 10.8, box("14-retirar-disponible", "ret-panel"), 1.8, 0.01),
    ("cam", 11.2, box("14-retirar-disponible", "ret-saldos"), 2.5),
    ("mark", 12.4, box("14-retirar-disponible", "ret-saldos")),
    ("label", 12.4, "A liquidar → Disponible"),
  ], guide=[
    (0.5, 2.9, "En la vida real, esperarías hasta mañana."),
    (3.4, 7.4, "En el simulador, tocás «Avanzar 1 día hábil», en la franja amarilla de arriba."),
    (10.8, 7.2, "Mirá el panel: la plata pasó de «a liquidar» a «disponible»."),
    (18.0, 6.0, "Eso es la liquidación."),
  ]),
 dict(id="s08", kind="screen", dur=10, events=[
    ("show", 0, "14b-retirar-limpio"),
    ("cam", 0, union(box("14b-retirar-limpio", "monto-retiro"), box("14b-retirar-limpio", "confirmar-retiro")), 2.0, 0.01),
    ("click", 1.2, box("14b-retirar-limpio", "confirmar-retiro")),
    ("show", 1.9, "15-retiro-ok"), ("cam", 2.0, box("15-retiro-ok", "modal"), 2.2),
    ("mark", 3.2, box("15-retiro-ok", "modal-p")),
  ], guide=[
    (0.5, 3.0, "Ahora sí: confirmamos el retiro,"),
    (3.5, 6.5, "y la plata vuelve a tu cuenta del banco."),
  ]),
 dict(id="s09", kind="takeaways", dur=20),
 dict(id="s10", kind="final", dur=8),
]

NAMES = {"s01": "Apertura", "s02": "Introducción", "s03": "Vender", "s04": "Confirmar la venta",
         "s05": "Detalle de saldos", "s06": "El retiro que falla", "s07": "Pasa un día hábil",
         "s08": "Ahora sí, retirar", "s09": "Para llevarte", "s10": "Placa final"}

if __name__ == "__main__":
    serie.main(SCENES)
    serie.guion(SCENES, NAMES, HERE.parent / "GUION-GRABACION.md")
