# Silent version (2:58) that produced renders/video-3-on-mudo.mp4. Running it overwrites index.html and frames.
"""Video 3 · Invertir en obligaciones negociables (M4).

Escenas y tiempos de este video; el estilo vive en ../_serie/serie.py.
Para reajustar a la grabación de voz: editar dur / t / guide y correr `python tools/build.py`.
"""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "_serie"))
import serie
from serie import box, union

TITLE = "Invertir en Obligaciones Negociables"
IDEAS = ["En una ON, la cantidad va en VN, no en dólares.",
         "Tiene que respetar la lámina mínima.",
         "Sabés de antemano cuánto cobrás y cuándo."]
serie.configure(HERE.parent, TITLE, "M4", IDEAS)

SYMBOL = union(box("04-orden", "campo-simbolo"), box("04-orden", "simbolo-info"))
FORM_TOP = union(box("04-orden", "campo-simbolo"), box("04-orden", "campo-cantidad"))
QTY_1000 = union(box("06-orden-1000", "campo-cantidad"), box("06-orden-1000", "simbolo-info"))
FICHA_DATA = union(box("10-ficha-ymcjo", "ficha-renta"), box("10-ficha-ymcjo", "ficha-vto"))

SCENES = [
 dict(id="s01", kind="open", dur=6),
 dict(id="s02", kind="screen", dur=16, events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("label", 0.8, "ON (obligación negociable): deuda que emite una empresa"),
    ("cam", 1.4, box("01-inicio", "cuenta-arg"), 1.75),
    ("mark", 2.6, box("01-inicio", "bal-usd")),
  ], guide=[
    (0.5, 5.0, "Tenés tres mil dólares para practicar."),
    (5.5, 10.5, "Con una obligación negociable le prestás dólares a una empresa, y la empresa te paga un interés."),
  ]),
 dict(id="s03", kind="screen", dur=10, events=[
    ("show", 0, "02-inicio-operar"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.5, union(box("02-inicio-operar", "nav-operar"), box("03-menu-operar", "menu-comprar")), 2.0, 0.9),
    ("click", 2.0, box("02-inicio-operar", "nav-operar")),
    ("show", 2.7, "03-menu-operar"),
    ("click", 5.0, box("03-menu-operar", "menu-comprar")),
  ], guide=[
    (0.5, 3.5, "Esta vez vamos directo:"),
    (4.0, 6.0, "menú «Operar», y después «Comprar»."),
  ]),
 dict(id="s04", kind="screen", dur=22, events=[
    ("show", 0, "04-orden"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.6, SYMBOL, 2.2),
    ("mark", 1.6, box("04-orden", "campo-simbolo")),
    ("label", 9.5, "VN: valor nominal"),
    ("mark", 10.0, box("04-orden", "simbolo-info")),
  ], guide=[
    (0.5, 9.0, "El símbolo ya está cargado: YMCJO, una obligación negociable de YPF en dólares."),
    (9.5, 12.5, "Mirá abajo: cotiza cada cien VN y tiene una lámina mínima de cien VN."),
  ]),
 dict(id="s05", kind="screen", dur=26, events=[
    ("show", 0, "04-orden"), ("cam", 0, SYMBOL, 2.2, 0.01),
    ("cam", 0.6, FORM_TOP, 1.9),
    ("label", 1.0, "La cantidad va en VN, no en dólares"),
    ("mark", 1.6, box("04-orden", "cant-input")),
    ("mark", 6.0, box("04-orden", "simbolo-info")),
    ("label2", 10.5, "1.000 VN a US$ 99,45 cada 100 VN ≈ US$ 994,55 + costos"),
    ("mark", 11.0, box("04-orden", "simbolo-info")),
  ], guide=[
    (0.5, 5.0, "La cantidad no va en dólares:"),
    (5.5, 5.0, "va en valores nominales, en múltiplos de la lámina."),
    (10.5, 3.5, "Mil VN no son mil dólares:"),
    (14.0, 12.0, "a noventa y nueve con cuarenta y cinco cada cien VN, cuestan unos novecientos noventa y cuatro dólares, más los costos."),
  ]),
 dict(id="s06", kind="screen", dur=24, events=[
    ("show", 0, "04-orden"), ("cam", 0, FORM_TOP, 1.9, 0.01),
    ("mark", 4.5, box("04-orden", "cant-input")),
    ("cam", 8.0, union(box("04-orden", "campo-cantidad"), box("04-orden", "btn-comprar-submit")), 1.6),
    ("click", 9.4, box("04-orden", "btn-comprar-submit")),
    ("show", 10.1, "05-rechazo"),
    ("cam", 10.2, box("05-rechazo", "cmsg"), 2.0, 0.8),
    ("label", 11.0, "550 no es múltiplo de la lámina"),
    ("mark", 11.2, box("05-rechazo", "cmsg")),
  ], guide=[
    (0.5, 4.0, "Ahora, el error a propósito."),
    (4.5, 5.0, "Quinientos cincuenta VN no es múltiplo de la lámina."),
    (9.5, 14.5, "Mandamos la orden… y el sistema la rechaza."),
  ]),
 dict(id="s07", kind="screen", dur=26, events=[
    ("show", 0, "05-rechazo"), ("cam", 0, box("05-rechazo", "cmsg"), 2.0, 0.01),
    ("cam", 0.6, QTY_1000, 2.2),
    ("show", 1.4, "06-orden-1000"),
    ("label", 1.8, "1.000 VN: sí es múltiplo de 100"),
    ("mark", 2.2, box("06-orden-1000", "cant-input")),
    ("cam", 5.5, box("06-orden-1000", "btn-comprar-submit"), 2.0),
    ("click", 6.6, box("06-orden-1000", "btn-comprar-submit")),
    ("show", 7.3, "07-confirmacion"), ("cam", 7.3, box("07-confirmacion", "modal"), 1.4, 0.01),
    ("cam", 9.6, box("07-confirmacion", "costos"), 2.4),
    ("label", 10.0, "Comisión · Derechos de mercado · IVA"),
    ("mark", 10.6, box("07-confirmacion", "costos")),
    ("cam", 18.5, box("07-confirmacion", "modal"), 1.4),
    ("click", 21.0, box("07-confirmacion", "confirmar-orden")),
  ], guide=[
    (0.5, 6.5, "Corregimos a mil VN, que sí es múltiplo, y la mandamos de nuevo."),
    (9.5, 9.0, "Revisás los costos en el detalle,"),
    (18.5, 7.5, "y confirmás."),
  ]),
 dict(id="s08", kind="screen", dur=20, events=[
    ("show", 0, "08-boleto"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.5, box("08-boleto", "boleto"), 1.25),
    ("label", 1.0, "Boleto: 1.000 VN de YMCJO"),
    ("show", 6.0, "10-ficha-ymcjo"), ("cam", 6.0, "full", None, 0.01),
    ("cam", 6.5, FICHA_DATA, 2.4),
    ("label", 7.0, "Renta semestral: marzo y septiembre · Vence en 2031 (datos del simulador)"),
    ("mark", 8.0, FICHA_DATA),
    ("mark", 12.5, FICHA_DATA),
  ], guide=[
    (0.5, 5.5, "Listo: ahora sos acreedor de YPF."),
    (6.0, 6.5, "Según los datos del simulador, te paga intereses en dólares"),
    (12.5, 7.5, "dos veces por año, en marzo y en septiembre, hasta el vencimiento."),
  ]),
 dict(id="s09", kind="takeaways", dur=20),
 dict(id="s10", kind="final", dur=8),
]

NAMES = {"s01": "Apertura", "s02": "Introducción", "s03": "Ir a comprar", "s04": "El símbolo",
         "s05": "La cantidad va en VN", "s06": "Error a propósito", "s07": "Corregir y confirmar",
         "s08": "El boleto", "s09": "Para llevarte", "s10": "Placa final"}

if __name__ == "__main__":
    serie.main(SCENES)
    serie.guion(SCENES, NAMES, HERE.parent / "GUION-GRABACION.md")
