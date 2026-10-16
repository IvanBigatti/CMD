"""Video 5 · El ciclo completo de una inversión: seguí la plata (M2 → M7) — versión con la voz del usuario.

Voz (Audios/): cuatro partes, con tomas que se pisan. Qué se usa de cada una:
- Parte 1: apertura, introducción, «El ingreso» + capítulo 1. Descarta el intento cortado del capítulo 2 (55–68 s).
- Parte 2: «Dólar MEP» + capítulo 2, «Compra» + capítulo 3, «Tenencia» + capítulo 4.
  Descarta su toma del capítulo 5 (57–72 s): se usa la toma más nueva, de la Parte 3.
- Parte 3: «Venta» + capítulo 5, «Liquidación» + 6, «Retiro» + 7, cierre en Movimientos.
  Descarta el «Para llevarte» cortado del final (58–63 s).
- Parte 4: «Para llevarte» y placa final. Empieza con ~4,5 s de ruido parejo sin voz: queda afuera.
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

TITLE = "El ciclo completo de una inversión"
IDEAS = ["La plata pasa por tres estados: disponible, comprometida y a liquidar.",
         "Vender y cobrar no son lo mismo: entre uno y otro pasa un día hábil.",
         "Este recorrido no incluye las obligaciones negociables: eso está en el Video 3."]
serie.configure(ROOT, TITLE, "M2 → M7", IDEAS, subtitle="Seguí la plata",
                itinerary="Ciclo completo de una inversión", itinerary_note="Unos 18 minutos")

CAP = dict(antes=0.3, despues=0.4, min=2.0)  # placas de capítulo: el nombre dicho en voz
V = voz.Narracion(ROOT, {
 "s01": dict(parte=1, tramo=(0.00, 4.50), antes=0.6, despues=0, dur=6, frases=[
    "El ciclo completo de una inversión.",
    "Módulos del 2 al 7."]),
 "s02": dict(parte=1, tramo=(6.20, 24.20), antes=0.8, despues=0.6, frases=[
    "En este video vas a seguir la plata de punta a punta:",
    "desde que entra a tu cuenta de inversión hasta que vuelve a tu banco.",
    "Vamos rápido, tramo por tramo.",
    "Si querés ver alguna parte con más detalle, tenés un video para cada una."]),
 "c1": dict(parte=1, tramo=(27.40, 29.30), frases=["El ingreso."], **CAP),
 "k1": dict(parte=1, tramo=(29.70, 44.90), antes=0.3, despues=0.5, frases=[
    "Todo empieza con una transferencia desde tu banco.",
    "Solo se puede desde una cuenta a tu nombre:",
    "si probás con la de otra persona, el sistema la rechaza.",
    "Confirmás, y la plata entra como disponible."]),
 "c2": dict(parte=2, tramo=(1.20, 2.30), frases=["Dólar MEP."], **CAP),
 "k2": dict(parte=2, tramo=(2.60, 18.40), antes=0.3, despues=0.5, frases=[
    "Una parte de esos pesos la pasás a dólares con el dólar MEP.",
    "Por dentro son dos operaciones con un bono:",
    "lo compra en pesos y lo vende en dólares.",
    "Los dólares llegan en el día,",
    "y ahora tenés disponible en las dos monedas."]),
 "c3": dict(parte=2, tramo=(20.50, 21.65), frases=["Compra."], **CAP),
 "k3": dict(parte=2, tramo=(21.65, 39.30), antes=0.3, despues=0.5, frases=[
    "Con los pesos que te quedan, comprás un CEDEAR.",
    "Usamos Coca-Cola como un ejemplo.",
    "Antes de confirmar, el sistema te muestra el costo:",
    "comisión, derechos de mercado e IVA.",
    "Confirmás,",
    "y esa plata deja de estar disponible: ahora es tu inversión."]),
 "c4": dict(parte=2, tramo=(43.25, 44.30), frases=["Tenencia."], **CAP),
 "k4": dict(parte=2, tramo=(44.35, 55.40), antes=0.3, despues=0.6, frases=[
    "En «Portafolio» seguís tu inversión:",
    "cuánto vale y cuánto ganás o perdés.",
    "Lo podés mirar en pesos o en dólares,",
    "y el resultado cambia según cómo lo mirás."]),
 "c5": dict(parte=3, tramo=(1.60, 2.95), frases=["Venta."], **CAP),
 "k5": dict(parte=3, tramo=(3.40, 16.10), antes=0.3, despues=0.6, frases=[
    "Cuando vendés, la plata no vuelve enseguida.",
    "Con el plazo normal se cobra al día hábil siguiente,",
    "así que por ahora figura «a liquidar»:",
    "la ves, pero todavía no la podés sacar."]),
 "c6": dict(parte=3, tramo=(20.00, 21.45), frases=["Liquidación."], **CAP),
 "k6": dict(parte=3, tramo=(21.50, 34.70), antes=0.3, despues=0.6, frases=[
    "Si intentás retirarla ahora, no te deja.",
    "Tiene que pasar un día hábil;",
    "en el simulador lo hacés con el botón «Avanzar 1 día hábil».",
    "Y ahí está: la plata pasó de «a liquidar» a «disponible»."]),
 "c7": dict(parte=3, tramo=(38.00, 39.20), frases=["Retiro."], **CAP),
 "k7": dict(parte=3, tramo=(39.22, 45.50), antes=0.3, despues=0.6, frases=[
    "Recién ahora la podés retirar,",
    "y solo a una cuenta a tu nombre.",
    "La plata vuelve a tu banco."]),
 "s20": dict(parte=3, tramo=(48.40, 56.80), antes=0.5, despues=1.2, frases=[
    "Acá está anotado todo lo que hiciste, paso por paso.",
    "El ciclo termina donde empezó: con la plata disponible."]),
 "s21": dict(parte=4, tramo=(4.62, 23.95), antes=0.8, despues=0.8, frases=[
    "¿Qué te tenés que llevar de todo esto?",
    "La plata pasa por tres estados: disponible, comprometida y a liquidar.",
    "Vender y cobrar no son lo mismo: entre uno y otro pasa un día hábil.",
    "Este recorrido no incluye las obligaciones negociables: eso está en el Video 3."]),
 "s22": dict(parte=4, tramo=(25.30, 31.70), antes=0.6, despues=0, dur=8, frases=[
    "Ahora hacelo vos.",
    "Ciclo completo de una inversión.",
    "Al terminar, puntuá la sección del 1 al 10."]),
})
P = V.P

V1 = "En detalle: Video 1 · Ingresar dinero y comprar dólar MEP"
V2 = "En detalle: Video 2 · Comprar mi primer CEDEAR"
V4 = "En detalle: Video 4 · Vender, esperar la liquidación y retirar"

# Cajas fijas de la interfaz (iguales en todas las capturas) y medidas sobre las capturas
QA_ING = [687, 465, 225, 45]
QA_MEP = [620, 974, 105, 44]
NAV_COT = [629, 151, 126, 49]
NAV_PORT = [426, 151, 105, 49]
RELOJ = [1455, 60, 148, 21]
SALDO_CERO = [783, 378, 141, 66]
KO_CELDA = [336, 631, 220, 58]
PORT_CARDS = [380, 342, 1160, 136]
PORT_RESULT = [1162, 342, 378, 136]
BOLETO_PIE = [640, 600, 640, 304]
PLAZO_FILA = [396, 306, 368, 38]
AVISO_PLAZO = [762, 670, 396, 81]
MODAL_COSTOS = [762, 230, 396, 432]
A_LIQUIDAR = [380, 828, 684, 39]
MOV_ABAJO = [380, 640, 1160, 110]
MOV_ARRIBA = [380, 377, 1160, 110]

def capitulo(n, name, events, ars, usd, hi):
    return [
        V.escena(f"c{n}", kind="chapter", n=n, of=7, name=name, ring=n, guide_band=True),
        V.escena(f"k{n}", events=events, ring=n),
        dict(id=f"m{n}", kind="money", dur=3, n=n, name=name, ars=ars, usd=usd, hi=hi, ring=n),
    ]

SCENES = [
 V.escena("s01", kind="open", guide_band=True),
 V.escena("s02", ring="intro", events=[
    ("show", 0, "00-a-el-ciclo-completo"), ("cam", 0, "full", None, 0.01),
    ("cam", P("s02", 0, 0.4), box("00-a-el-ciclo-completo", "t:cuenta-arg"), 1.75),
    ("mark", P("s02", 0, 1.5), SALDO_CERO, P("s02", 2) - P("s02", 0, 1.5)),
    ("cam", P("s02", 2), "full"),
 ]),
 *capitulo(1, "Ingreso", [
    ("show", 0, "01-a-empeza-por-aca"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V1),
    ("click", P("k1", 0, 1.0), QA_ING),
    ("show", P("k1", 0, 1.7), "02-a-esto-no-es-una-cuenta-bancar"),
    ("cam", P("k1", 0, 1.8), union(box("02-a-esto-no-es-una-cuenta-bancar", "t:origen-list"), box("02-a-esto-no-es-una-cuenta-bancar", "t:confirmar-ingreso")), 1.6),
    ("click", P("k1", 2, 0.6), box("02-a-esto-no-es-una-cuenta-bancar", "t:origen-tercero")),
    ("show", P("k1", 2, 1.2), "03-c-tercero"),
    ("click", P("k1", 2, 1.8), box("03-c-tercero", "t:confirmar-ingreso")),
    ("show", P("k1", 2, 2.4), "03-d-rechazo"),
    ("cam", P("k1", 2, 2.5), box("03-d-rechazo", "origen-msg"), 2.4, 0.6),
    ("cam", P("k1", 3, -0.9), union(box("03-d-rechazo", "t:origen-list"), box("03-d-rechazo", "t:confirmar-ingreso")), 1.6, 0.5),
    ("click", P("k1", 3, -0.3), box("03-d-rechazo", "t:origen-propia")),
    ("show", P("k1", 3, 0.3), "04-c-despues"),
    ("click", P("k1", 3, 0.9), box("04-c-despues", "t:confirmar-ingreso")),
    ("show", P("k1", 3, 1.6), "05-c-despues"),
    ("cam", P("k1", 3, 1.7), box("05-c-despues", "modal-p"), 2.4),
    ("mark", P("k1", 3, 2.5), box("05-c-despues", "modal-p")),
 ], ars=["$ 600.000,00", None, None], usd=[None, None, None], hi=[(0, 0)]),
 *capitulo(2, "Dólar MEP", [
    ("show", 0, "06-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V1),
    ("cam", P("k2", 0, 0.2), box("06-b-sin-modal", "t:rec-mep"), 1.75),
    ("click", P("k2", 0, 1.4), QA_MEP),
    ("show", P("k2", 0, 2.1), "06-c-despues"), ("cam", P("k2", 0, 2.1), "full", None, 0.01),
    ("cam", P("k2", 0, 2.4), box("06-c-despues", "t:mep-tc"), 2.4),
    ("cam", P("k2", 1, -0.8), box("06-c-despues", "t:mep-verpordentro"), 1.9, 0.6),
    ("click", P("k2", 1, -0.1), box("06-c-despues", "t:mep-verpordentro")),
    ("show", P("k2", 1, 0.5), "08-c-despues"),
    ("cam", P("k2", 1, 0.6), box("08-c-despues", "patas-ops"), 2.5),
    ("mark", P("k2", 2), box("08-c-despues", "patas-ops"), P("k2", 3) - P("k2", 2)),
    ("cam", P("k2", 3), union(box("10-a-compra", "t:mep-tc"), box("10-a-compra", "t:mep-confirmar")), 1.9, 0.7),
    ("click", P("k2", 3, 0.9), box("10-a-compra", "t:mep-confirmar")),
    ("show", P("k2", 3, 1.5), "10-c-despues"),
    ("cam", P("k2", 3, 1.6), box("10-c-despues", "modal-p"), 2.4),
    ("mark", P("k2", 4, 0.3), box("10-c-despues", "modal-p")),
 ], ars=["$ 300.160,88", None, None], usd=["US$ 202,59", None, None], hi=[(0, 1)]),
 *capitulo(3, "Compra", [
    ("show", 0, "11-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V2),
    ("click", P("k3", 0, 0.3), NAV_COT),
    ("show", P("k3", 0, 1.0), "11-c-despues"), ("cam", P("k3", 0, 1.0), "full", None, 0.01),
    ("click", P("k3", 0, 1.8), box("11-c-despues", "t:tab-cedears")),
    ("show", P("k3", 0, 2.4), "12-c-despues"),
    ("cam", P("k3", 0, 2.5), union(box("12-c-despues", "t:tab-cedears"), box("12-c-despues", "t:inst-TSLA")), 1.35, 0.6),
    ("click", P("k3", 1, 0.3), KO_CELDA),
    ("show", P("k3", 1, 0.9), "13-c-despues"), ("cam", P("k3", 1, 0.9), "full", None, 0.01),
    ("click", P("k3", 2, -0.3), box("13-c-despues", "t:btn-comprar")),
    ("show", P("k3", 2, 0.3), "16-c-despues"), ("cam", P("k3", 2, 0.3), "full", None, 0.01),
    ("click", P("k3", 2, 1.1), box("16-c-despues", "t:btn-comprar-submit")),
    ("show", P("k3", 2, 1.7), "21-c-despues"),
    # Encuadre desde el título del modal hasta «Total a pagar»: deja fuera el aviso de perfil
    ("cam", P("k3", 2, 1.8), MODAL_COSTOS, 2.5),
    ("mark", P("k3", 3), box("21-c-despues", "t:costos-confirmacion"), P("k3", 4, 0.6) - P("k3", 3)),
    # El botón «Confirmar compra» queda debajo del aviso: corte directo al boleto
    ("show", P("k3", 4, 0.6), "23-c-despues"), ("cam", P("k3", 4, 0.6), "full", None, 0.01),
    ("cam", P("k3", 4, 1.0), BOLETO_PIE, 1.8),
 ], ars=["$ 87.813,10", "$ 212.347,78", None], usd=["US$ 202,59", None, None], hi=[(1, 0)]),
 *capitulo(4, "Tenencia", [
    ("show", 0, "24-a-el-boleto"), ("cam", 0, BOLETO_PIE, 1.8, 0.01),
    ("label", 0.3, V2),
    ("cam", 0.2, "full", None, 0.6),
    ("click", P("k4", 0, 0.3), NAV_PORT),
    ("show", P("k4", 0, 1.0), "25-c-despues"), ("cam", P("k4", 0, 1.0), "full", None, 0.01),
    ("cam", P("k4", 0, 1.2), PORT_CARDS, 1.6),
    ("mark", P("k4", 1, 0.3), PORT_RESULT, P("k4", 2, 0.2) - P("k4", 1, 0.3)),
    ("cam", P("k4", 2, -0.2), box("25-c-despues", "t:toggle-moneda"), 2.4, 0.7),
    ("click", P("k4", 2, 0.9), box("25-c-despues", "port-usd")),
    ("show", P("k4", 2, 1.5), "27-c-en-dolares"),
    ("cam", P("k4", 2, 1.6), PORT_CARDS, 1.6),
    ("mark", P("k4", 3, 0.3), PORT_RESULT),
 ], ars=["$ 87.813,10", "$ 212.347,78", None], usd=["US$ 202,59", None, None], hi=[(1, 0)]),
 *capitulo(5, "Venta", [
    ("show", 0, "28-a-abri-el-menu-operar"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V4),
    ("click", P("k5", 0, 0.2), box("28-a-abri-el-menu-operar", "t:nav-operar")),
    ("show", P("k5", 0, 0.8), "28-c-despues"),
    ("cam", P("k5", 0, 0.9), union(box("28-c-despues", "t:nav-operar"), box("28-c-despues", "t:menu-vender")), 1.8, 0.6),
    ("click", P("k5", 0, 1.6), box("28-c-despues", "t:menu-vender")),
    ("show", P("k5", 0, 2.2), "30-c-ko-elegido"), ("cam", P("k5", 0, 2.2), "full", None, 0.01),
    ("cam", P("k5", 1, -0.2), PLAZO_FILA, 2.5, 0.8),
    ("mark", P("k5", 1, 0.6), box("30-c-ko-elegido", "t:campo-plazo-venta"), P("k5", 2, -1.9) - P("k5", 1, 0.6)),
    ("cam", P("k5", 2, -1.9), union(box("30-c-ko-elegido", "t:form-vender"), box("30-c-ko-elegido", "t:btn-vender-submit")), 1.6, 0.4),
    ("click", P("k5", 2, -1.4), box("30-c-ko-elegido", "t:btn-vender-submit")),
    ("show", P("k5", 2, -0.9), "32-c-despues"),
    ("cam", P("k5", 2, -0.85), union(AVISO_PLAZO, box("32-c-despues", "t:confirmar-orden")), 2.0, 0.4),
    ("click", P("k5", 2, -0.35), box("32-c-despues", "t:confirmar-orden")),
    ("show", P("k5", 2, 0.25), "36-c-detalle-abierto"), ("cam", P("k5", 2, 0.25), "full", None, 0.01),
    ("cam", P("k5", 2, 0.35), box("36-c-detalle-abierto", "saldos"), 2.2, 0.8),
    ("mark", P("k5", 2, 1.2), A_LIQUIDAR, 6.0),
 ], ars=["$ 87.813,10", "$ 212.347,78", "$ 209.157,84"], usd=["US$ 202,59", None, None], hi=[(2, 0)]),
 *capitulo(6, "Liquidación", [
    ("show", 0, "40-a-el-monto-ya-esta-cargado"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V4),
    ("cam", 0.2, union(box("40-a-el-monto-ya-esta-cargado", "t:monto-retiro"), box("40-a-el-monto-ya-esta-cargado", "t:confirmar-retiro")), 2.0, 0.6),
    ("click", P("k6", 0, 0.6), box("40-a-el-monto-ya-esta-cargado", "t:confirmar-retiro")),
    ("show", P("k6", 0, 1.3), "41-c-despues"),
    ("cam", P("k6", 0, 1.4), box("41-c-despues", "ret-msg"), 2.3, 0.5),
    ("cam", P("k6", 1, 0.3), RELOJ, 2.5),
    ("mark", P("k6", 2, 0.4), RELOJ, 1.4),
    ("click", P("k6", 2, 1.6), RELOJ),
    ("show", P("k6", 2, 2.2), "42-c-despues"),
    ("cam", P("k6", 2, 2.3), box("42-c-despues", "modal"), 2.0, 0.6),
    ("show", P("k6", 3, 0.1), "43-c-retiro-limpio"), ("cam", P("k6", 3, 0.1), box("43-c-retiro-limpio", "ret-saldos"), 2.5, 0.01),
    ("mark", P("k6", 3, 0.9), box("43-c-retiro-limpio", "ret-saldos")),
 ], ars=["$ 296.970,94", None, None], usd=["US$ 202,59", None, None], hi=[(0, 0)]),
 *capitulo(7, "Retiro", [
    ("show", 0, "43-c-retiro-limpio"),
    ("cam", 0, union(box("43-c-retiro-limpio", "t:monto-retiro"), box("43-c-retiro-limpio", "t:confirmar-retiro")), 2.0, 0.01),
    ("click", P("k7", 0, 1.0), box("43-c-retiro-limpio", "t:confirmar-retiro")),
    ("show", P("k7", 0, 1.7), "44-c-despues"),
    ("cam", P("k7", 0, 1.8), box("44-c-despues", "modal-p"), 2.4),
    ("mark", P("k7", 2, -0.1), box("44-c-despues", "modal-p")),
 ], ars=["$ 0,94", None, None], usd=["US$ 202,59", None, None], hi=[(0, 0)]),
 V.escena("s20", ring="close", events=[
    ("show", 0, "45-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.3, MOV_ABAJO, 2.2),
    ("cam", P("s20", 0, 1.2), MOV_ARRIBA, 2.2, V.T["s20"][0] - P("s20", 0, 1.2) - 0.6, "none"),
 ]),
 V.escena("s21", kind="takeaways", guide_band=True,
          idea_t=[P("s21", 1, -0.1), P("s21", 2, -0.1), P("s21", 3, -0.1)]),
 V.escena("s22", kind="final", guide_band=True,
          t=[P("s22", 0, -0.2), P("s22", 1, -0.2), P("s22", 2, -0.2), P("s22", 2, 0.6)]),
]

# Música de fondo: la misma pista que el video 1 (biblioteca de HeyGen, ca26cc0c).
# En este video la voz arranca en la apertura: la música va baja desde el principio.
MUSICA_ORIGEN = HERE.parents[1] / "video-1-ingreso-mep/musica/candidatas/ca26cc0c.mp3"

if __name__ == "__main__":
    total = sum(sc["dur"] for sc in SCENES)
    # una sola pista de voz (23 clips sueltos hacían que el render bajara el volumen general)
    clips = voz.pista_unica(ROOT, V.audios(SCENES), total)
    (ROOT / "musica").mkdir(exist_ok=True)
    voz.preparar_musica(MUSICA_ORIGEN, ROOT / "musica/fondo.wav", total)
    serie.main(SCENES, audio=clips, music=voz.musica(SCENES, apertura=0.3, voz_desde=1.6))
    voz.carve(ROOT / "index.html", clips, SERIE)
