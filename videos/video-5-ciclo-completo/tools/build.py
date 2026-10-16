"""Video 5 · El ciclo completo de una inversión: seguí la plata (M2 → M7).

Escenas y tiempos de este video; el estilo vive en ../_serie/serie.py.
Para reajustar a la grabación de voz: editar dur / t / guide y correr `python tools/build.py`.
Montos de los paneles: estado real del simulador en cada momento (assets/captures/manifest.json → saldo_tx).
"""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "_serie"))
import serie
from serie import box, union

TITLE = "El ciclo completo de una inversión"
IDEAS = ["La plata pasa por tres estados: disponible, comprometida y a liquidar.",
         "Vender y cobrar no son lo mismo: entre uno y otro pasa un día hábil.",
         "Este recorrido no incluye las obligaciones negociables: eso está en el Video 3."]
serie.configure(HERE.parent, TITLE, "M2 → M7", IDEAS, subtitle="Seguí la plata",
                itinerary="Ciclo completo de una inversión", itinerary_note="Unos 18 minutos")

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

def chapter(n, name, screen_dur, events, guide, ars, usd, hi):
    return [
        dict(id=f"c{n}", kind="chapter", dur=2, n=n, of=7, name=name, ring=n),
        dict(id=f"k{n}", kind="screen", dur=screen_dur, events=events, guide=guide, ring=n),
        dict(id=f"m{n}", kind="money", dur=3, n=n, name=name, ars=ars, usd=usd, hi=hi, ring=n),
    ]

SCENES = [
 dict(id="s01", kind="open", dur=6),
 dict(id="s02", kind="screen", dur=22, ring="intro", events=[
    ("show", 0, "00-a-el-ciclo-completo"), ("cam", 0, "full", None, 0.01),
    ("cam", 1.0, box("00-a-el-ciclo-completo", "t:cuenta-arg"), 1.75),
    ("mark", 2.2, SALDO_CERO),
    ("cam", 12.0, "full"),
  ], guide=[
    (0.5, 4.5, "En este video vas a seguir la plata de punta a punta:"),
    (5.0, 5.5, "desde que entra a tu cuenta de inversión hasta que vuelve a tu banco."),
    (10.5, 3.5, "Vamos rápido, tramo por tramo."),
    (14.0, 8.0, "Si querés ver alguna parte con más detalle, tenés un video para cada una."),
  ]),
 *chapter(1, "Ingreso", 20, [
    ("show", 0, "01-a-empeza-por-aca"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V1),
    ("click", 1.2, QA_ING),
    ("show", 1.9, "02-a-esto-no-es-una-cuenta-bancar"),
    ("cam", 2.0, union(box("02-a-esto-no-es-una-cuenta-bancar", "t:origen-list"), box("02-a-esto-no-es-una-cuenta-bancar", "t:confirmar-ingreso")), 1.6),
    ("click", 4.6, box("02-a-esto-no-es-una-cuenta-bancar", "t:origen-tercero")),
    ("show", 5.3, "03-c-tercero"),
    ("click", 6.6, box("03-c-tercero", "t:confirmar-ingreso")),
    ("show", 7.3, "03-d-rechazo"),
    ("cam", 7.4, box("03-d-rechazo", "origen-msg"), 2.4, 0.6),
    ("cam", 9.6, union(box("03-d-rechazo", "t:origen-list"), box("03-d-rechazo", "t:confirmar-ingreso")), 1.6, 0.6),
    ("click", 10.4, box("03-d-rechazo", "t:origen-propia")),
    ("show", 11.0, "04-c-despues"),
    ("click", 12.6, box("04-c-despues", "t:confirmar-ingreso")),
    ("show", 13.3, "05-c-despues"),
    ("cam", 13.4, box("05-c-despues", "modal-p"), 2.4),
    ("mark", 14.6, box("05-c-despues", "modal-p")),
  ], [
    (0.5, 3.5, "Todo empieza con una transferencia desde tu banco."),
    (4.0, 3.0, "Solo se puede desde una cuenta a tu nombre:"),
    (7.0, 5.0, "si probás con la de otra persona, el sistema la rechaza."),
    (12.0, 8.0, "Confirmás, y la plata entra como disponible."),
  ], ars=["$ 600.000,00", None, None], usd=[None, None, None], hi=[(0, 0)]),
 *chapter(2, "Dólar MEP", 24, [
    ("show", 0, "06-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V1),
    ("cam", 0.6, box("06-b-sin-modal", "t:rec-mep"), 1.75),
    ("click", 2.0, QA_MEP),
    ("show", 2.7, "06-c-despues"), ("cam", 2.7, "full", None, 0.01),
    ("cam", 3.0, box("06-c-despues", "t:mep-tc"), 2.4),
    ("mark", 4.2, box("06-c-despues", "t:mep-tc")),
    ("cam", 6.8, box("06-c-despues", "t:mep-verpordentro"), 1.9),
    ("click", 7.6, box("06-c-despues", "t:mep-verpordentro")),
    ("show", 8.3, "08-c-despues"),
    ("cam", 8.5, box("08-c-despues", "patas-ops"), 2.5),
    ("mark", 10.0, box("08-c-despues", "patas-ops")),
    ("cam", 15.6, union(box("10-a-compra", "t:mep-tc"), box("10-a-compra", "t:mep-confirmar")), 1.9),
    ("click", 16.8, box("10-a-compra", "t:mep-confirmar")),
    ("show", 17.5, "10-c-despues"),
    ("cam", 17.6, box("10-c-despues", "modal-p"), 2.4),
    ("mark", 18.8, box("10-c-despues", "modal-p")),
  ], [
    (0.5, 5.5, "Una parte de esos pesos la pasás a dólares con el dólar MEP."),
    (6.0, 4.0, "Por dentro son dos operaciones con un bono:"),
    (10.0, 5.5, "lo compra en pesos y lo vende en dólares."),
    (15.5, 3.5, "Los dólares llegan en el día,"),
    (19.0, 5.0, "y ahora tenés disponible en las dos monedas."),
  ], ars=["$ 300.160,88", None, None], usd=["US$ 202,59", None, None], hi=[(0, 1)]),
 *chapter(3, "Compra", 28, [
    ("show", 0, "11-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V2),
    ("click", 1.0, NAV_COT),
    ("show", 1.7, "11-c-despues"), ("cam", 1.7, "full", None, 0.01),
    ("click", 2.8, box("11-c-despues", "t:tab-cedears")),
    ("show", 3.5, "12-c-despues"),
    ("cam", 3.6, union(box("12-c-despues", "t:tab-cedears"), box("12-c-despues", "t:inst-TSLA")), 1.35),
    ("click", 5.0, KO_CELDA),
    ("show", 5.8, "13-c-despues"), ("cam", 5.8, "full", None, 0.01),
    ("click", 7.6, box("13-c-despues", "t:btn-comprar")),
    ("show", 8.3, "16-c-despues"), ("cam", 8.3, "full", None, 0.01),
    ("click", 10.4, box("16-c-despues", "t:btn-comprar-submit")),
    ("show", 11.1, "21-c-despues"),
    # Encuadre desde el título del modal hasta «Total a pagar»: deja fuera el aviso de perfil
    ("cam", 11.3, MODAL_COSTOS, 2.5),
    ("mark", 12.5, box("21-c-despues", "t:costos-confirmacion")),
    # El botón «Confirmar compra» queda debajo del aviso: corte directo al boleto
    ("show", 19.0, "23-c-despues"), ("cam", 19.0, "full", None, 0.01),
    ("cam", 20.2, BOLETO_PIE, 1.8),
  ], [
    (0.5, 3.5, "Con los pesos que quedan, comprás un CEDEAR."),
    (4.0, 3.5, "Usamos Coca-Cola solo como ejemplo."),
    (7.5, 4.0, "Antes de confirmar, el sistema te muestra el costo:"),
    (11.5, 5.0, "comisión, derechos de mercado e IVA."),
    (16.5, 3.5, "Confirmás,"),
    (20.0, 8.0, "y esa plata deja de estar disponible: ahora es tu inversión."),
  ], ars=["$ 87.813,10", "$ 212.347,78", None], usd=["US$ 202,59", None, None], hi=[(1, 0)]),
 *chapter(4, "Tenencia", 18, [
    ("show", 0, "24-a-el-boleto"), ("cam", 0, BOLETO_PIE, 1.8, 0.01),
    ("label", 0.3, V2),
    ("cam", 1.2, "full"),
    ("click", 2.4, NAV_PORT),
    ("show", 3.1, "25-c-despues"), ("cam", 3.1, "full", None, 0.01),
    ("cam", 3.4, PORT_CARDS, 1.6),
    ("mark", 4.6, PORT_RESULT),
    ("cam", 9.0, box("25-c-despues", "t:toggle-moneda"), 2.4),
    ("click", 10.0, box("25-c-despues", "port-usd")),
    ("show", 10.7, "27-c-en-dolares"),
    ("cam", 10.9, PORT_CARDS, 1.6),
    ("mark", 12.1, PORT_RESULT),
  ], [
    (0.5, 5.0, "En «Portafolio» seguís tu inversión:"),
    (5.5, 4.0, "cuánto vale y cuánto ganás o perdés."),
    (9.5, 3.5, "Lo podés mirar en pesos o en dólares,"),
    (13.0, 5.0, "y el resultado cambia según cómo lo midas."),
  ], ars=["$ 87.813,10", "$ 212.347,78", None], usd=["US$ 202,59", None, None], hi=[(1, 0)]),
 *chapter(5, "Venta", 22, [
    ("show", 0, "28-a-abri-el-menu-operar"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V4),
    ("click", 0.8, box("28-a-abri-el-menu-operar", "t:nav-operar")),
    ("show", 1.5, "28-c-despues"),
    ("cam", 1.6, union(box("28-c-despues", "t:nav-operar"), box("28-c-despues", "t:menu-vender")), 1.8),
    ("click", 2.8, box("28-c-despues", "t:menu-vender")),
    ("show", 3.5, "30-c-ko-elegido"), ("cam", 3.5, "full", None, 0.01),
    ("cam", 4.0, PLAZO_FILA, 2.5),
    ("mark", 5.2, box("30-c-ko-elegido", "t:campo-plazo-venta")),
    ("cam", 8.4, union(box("30-c-ko-elegido", "t:form-vender"), box("30-c-ko-elegido", "t:btn-vender-submit")), 1.6),
    ("click", 9.2, box("30-c-ko-elegido", "t:btn-vender-submit")),
    ("show", 9.9, "32-c-despues"),
    ("cam", 10.0, AVISO_PLAZO, 2.3),
    ("mark", 11.2, AVISO_PLAZO),
    ("cam", 12.8, union(AVISO_PLAZO, box("32-c-despues", "t:confirmar-orden")), 2.0),
    ("click", 13.6, box("32-c-despues", "t:confirmar-orden")),
    ("show", 14.3, "36-c-detalle-abierto"), ("cam", 14.3, "full", None, 0.01),
    ("cam", 14.6, box("36-c-detalle-abierto", "saldos"), 2.2),
    ("mark", 15.8, A_LIQUIDAR),
  ], [
    (0.5, 4.0, "Cuando vendés, la plata no vuelve enseguida."),
    (4.5, 5.5, "Con el plazo normal se cobra al día hábil siguiente,"),
    (10.0, 5.5, "así que por ahora figura «a liquidar»:"),
    (15.5, 6.5, "la ves, pero todavía no la podés sacar."),
  ], ars=["$ 87.813,10", "$ 212.347,78", "$ 209.157,84"], usd=["US$ 202,59", None, None], hi=[(2, 0)]),
 *chapter(6, "Liquidación", 22, [
    ("show", 0, "40-a-el-monto-ya-esta-cargado"), ("cam", 0, "full", None, 0.01),
    ("label", 0.3, V4),
    ("cam", 0.4, union(box("40-a-el-monto-ya-esta-cargado", "t:monto-retiro"), box("40-a-el-monto-ya-esta-cargado", "t:confirmar-retiro")), 2.0),
    ("click", 1.6, box("40-a-el-monto-ya-esta-cargado", "t:confirmar-retiro")),
    ("show", 2.3, "41-c-despues"),
    ("cam", 2.4, box("41-c-despues", "ret-msg"), 2.3, 0.5),
    ("cam", 4.6, RELOJ, 2.5),
    ("mark", 5.8, RELOJ),
    ("click", 8.6, RELOJ),
    ("show", 9.3, "42-c-despues"),
    ("cam", 9.4, box("42-c-despues", "modal"), 2.0),
    ("show", 12.6, "43-c-retiro-limpio"), ("cam", 12.6, box("43-c-retiro-limpio", "ret-saldos"), 2.5, 0.01),
    ("mark", 13.4, box("43-c-retiro-limpio", "ret-saldos")),
  ], [
    (0.5, 4.0, "Si intentás retirarla ahora, no te deja."),
    (4.5, 3.5, "Tiene que pasar un día hábil;"),
    (8.0, 4.6, "en el simulador lo hacés con el botón «Avanzar 1 día hábil»."),
    (12.6, 9.4, "Y ahí está: la plata pasó de «a liquidar» a «disponible»."),
  ], ars=["$ 296.970,94", None, None], usd=["US$ 202,59", None, None], hi=[(0, 0)]),
 *chapter(7, "Retiro", 11, [
    ("show", 0, "43-c-retiro-limpio"),
    ("cam", 0, union(box("43-c-retiro-limpio", "t:monto-retiro"), box("43-c-retiro-limpio", "t:confirmar-retiro")), 2.0, 0.01),
    ("click", 1.6, box("43-c-retiro-limpio", "t:confirmar-retiro")),
    ("show", 2.3, "44-c-despues"),
    ("cam", 2.4, box("44-c-despues", "modal-p"), 2.4),
    ("mark", 3.6, box("44-c-despues", "modal-p")),
  ], [
    (0.5, 5.0, "Recién ahora la podés retirar, y solo a una cuenta a tu nombre."),
    (5.5, 5.5, "La plata vuelve a tu banco."),
  ], ars=["$ 0,94", None, None], usd=["US$ 202,59", None, None], hi=[(0, 0)]),
 dict(id="s20", kind="screen", dur=14, ring="close", events=[
    ("show", 0, "45-b-sin-modal"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.4, MOV_ABAJO, 2.2),
    ("cam", 2.2, MOV_ARRIBA, 2.2, 9.0, "none"),
  ], guide=[
    (0.5, 6.5, "Acá queda anotado todo lo que hiciste, paso por paso."),
    (7.0, 7.0, "El ciclo termina donde empezó: con la plata disponible."),
  ]),
 dict(id="s21", kind="takeaways", dur=20),
 dict(id="s22", kind="final", dur=8),
]

NAMES = {"s01": "Apertura", "s02": "Introducción", "s20": "Cierre en Movimientos",
         "s21": "Para llevarte", "s22": "Placa final"}
for _n, _name in enumerate(["Ingreso", "Dólar MEP", "Compra", "Tenencia", "Venta", "Liquidación", "Retiro"], 1):
    NAMES[f"c{_n}"] = f"Capítulo {_n} · {_name} (placa)"
    NAMES[f"k{_n}"] = f"Capítulo {_n} · {_name}"
    NAMES[f"m{_n}"] = f"Capítulo {_n} · ¿Dónde está tu plata? (panel)"

if __name__ == "__main__":
    serie.main(SCENES)
    serie.guion(SCENES, NAMES, HERE.parent / "GUION-GRABACION.md")
