"""Video 3 · Invertir en obligaciones negociables (M4).

Escenas sincronizadas con la voz grabada (audio/voz.mp3). El estilo vive en ../_serie/serie.py.
Cada escena con voz lleva voice=(desde, hasta, demora): el tramo de la grabación que suena en esa escena
y cuántos segundos después de empezar la escena arranca. Los tiempos de los eventos y subtítulos se
escriben en segundos de la grabación con at(V, s) y say(V, ...), medidos con audio/transcript.json
(Parakeet) y los silencios del audio. Para regrabar: cambiar esos números y correr `python tools/build.py`.
"""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / "_serie"))
import serie, voz
from serie import box, union
ROOT = HERE.parent
SERIE = HERE.parents[1] / "_serie"

TITLE = "Invertir en Obligaciones Negociables"
IDEAS = ["En una ON, la cantidad va en VN, no en dólares.",
         "Tiene que respetar la lámina mínima.",
         "Sabés de antemano cuánto cobrás y cuándo."]
serie.configure(HERE.parent, TITLE, "M4", IDEAS)
VOICE_SRC = ROOT / "audio/voz.mp3"
# Same music bed as the rest of the series (HeyGen library, ca26cc0c), chosen for video 1.
MUSICA_ORIGEN = HERE.parents[1] / "video-1-ingreso-mep/musica/candidatas/ca26cc0c.mp3"

SYMBOL = union(box("04-orden", "campo-simbolo"), box("04-orden", "simbolo-info"))
FORM_TOP = union(box("04-orden", "campo-simbolo"), box("04-orden", "campo-cantidad"))
QTY_1000 = union(box("06-orden-1000", "campo-cantidad"), box("06-orden-1000", "simbolo-info"))
FICHA_DATA = union(box("10-ficha-ymcjo", "ficha-renta"), box("10-ficha-ymcjo", "ficha-vto"))


def at(v, s):
    """Scene time of second `s` of the recording, for a scene whose voice is v=(from, to, lead)."""
    return round(s - v[0] + v[2], 2)


def say(v, *phrases):
    """Subtitles from (from, to, text) in recording seconds; each holds until the next phrase (max +1.2 s)."""
    out = []
    for i, (f, t, tx) in enumerate(phrases):
        nxt = phrases[i + 1][0] if i + 1 < len(phrases) else None
        end = t + 1.2 if nxt is None else min(nxt, t + 1.2)
        out.append((at(v, f), round(end - f, 2), tx))
    return out


V1 = (0.4, 2.7, 1.2)        # «Invertir en obligaciones negociables»
V2 = (4.8, 13.4, 0.6)
V3 = (16.4, 21.7, 0.4)
V4 = (24.2, 37.5, 0.8)
V5 = (40.7, 59.3, 0.6)
V6 = (59.9, 69.3, 0.5)
V7 = (77.6, 91.9, 0.5)
V8 = (96.9, 109.5, 0.5)
V9 = (111.6, 124.7, 0.4)    # «Para llevarte» + the three ideas

SCENES = [
 dict(id="s01", kind="open", dur=6, voice=V1),
 dict(id="s02", kind="screen", dur=10.5, voice=V2, events=[
    ("show", 0, "01-inicio"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.6, box("01-inicio", "cuenta-arg"), 1.75),
    ("mark", at(V2, 5.5), box("01-inicio", "bal-usd")),
    ("label", at(V2, 8.9), "ON (obligación negociable): deuda que emite una empresa"),
  ], guide=say(V2,
    (4.9, 6.85, "Tenés tres mil dólares para practicar."),
    (8.9, 13.3, "Con una obligación negociable le prestás dólares a una empresa, y la empresa te paga un interés."),
  )),
 dict(id="s03", kind="screen", dur=7, voice=V3, events=[
    ("show", 0, "02-inicio-operar"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.3, union(box("02-inicio-operar", "nav-operar"), box("03-menu-operar", "menu-comprar")), 2.0, 0.9),
    ("click", at(V3, 19.0), box("02-inicio-operar", "nav-operar")),
    ("show", at(V3, 19.7), "03-menu-operar"),
    ("click", at(V3, 21.2), box("03-menu-operar", "menu-comprar")),
  ], guide=say(V3,
    (16.6, 17.9, "Esta vez vamos directo:"),
    (18.4, 21.6, "menú «Operar», y después «Comprar»."),
  )),
 dict(id="s04", kind="screen", dur=15.5, voice=V4, events=[
    ("show", 0, "04-orden"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.5, SYMBOL, 2.2),
    ("mark", at(V4, 24.8), box("04-orden", "campo-simbolo")),
    ("label", at(V4, 33.8), "VN: valor nominal"),
    ("mark", at(V4, 33.4), box("04-orden", "simbolo-info")),
  ], guide=say(V4,
    (24.5, 26.0, "El símbolo ya está cargado:"),
    (26.6, 30.3, "YMCJO, una obligación negociable de YPF en dólares."),
    (31.5, 37.4, "Mirá abajo: cotiza cada cien VN y tiene una lámina mínima de cien VN."),
  )),
 dict(id="s05", kind="screen", dur=20.5, voice=V5, events=[
    ("show", 0, "04-orden"), ("cam", 0, SYMBOL, 2.2, 0.01),
    ("cam", 0.3, FORM_TOP, 1.9),
    ("label", at(V5, 40.9), "La cantidad va en VN, no en dólares"),
    ("mark", at(V5, 41.1), box("04-orden", "cant-input")),
    ("mark", at(V5, 45.3), box("04-orden", "simbolo-info")),
    ("label2", at(V5, 51.8), "1.000 VN a US$ 99,45 cada 100 VN ≈ US$ 994,55 + costos"),
    ("mark", at(V5, 52.0), box("04-orden", "simbolo-info")),
  ], guide=say(V5,
    (40.9, 42.7, "La cantidad no va en dólares:"),
    (44.6, 48.3, "va en valores nominales, en múltiplos de la lámina."),
    (48.8, 51.0, "Mil VN no son mil dólares:"),
    (51.8, 59.2, "a noventa y nueve con cuarenta y cinco cada cien VN, cuestan unos novecientos noventa y cuatro dólares, más los costos."),
  )),
 dict(id="s06", kind="screen", dur=13.5, voice=V6, events=[
    ("show", 0, "04-orden"), ("cam", 0, FORM_TOP, 1.9, 0.01),
    ("mark", at(V6, 63.0), box("04-orden", "cant-input")),
    ("cam", at(V6, 66.2), union(box("04-orden", "campo-cantidad"), box("04-orden", "btn-comprar-submit")), 1.6),
    ("click", at(V6, 67.6), box("04-orden", "btn-comprar-submit")),
    ("show", at(V6, 68.3), "05-rechazo"),
    ("cam", at(V6, 68.4), box("05-rechazo", "cmsg"), 2.0, 0.8),
    ("label", at(V6, 68.9), "550 no es múltiplo de la lámina"),
    ("mark", at(V6, 69.0), box("05-rechazo", "cmsg")),
  ], guide=say(V6,
    (60.3, 62.4, "Ahora, el error a propósito."),
    (63.0, 66.2, "Quinientos cincuenta VN no es múltiplo de la lámina."),
    (66.9, 69.2, "Mandamos la orden… y el sistema la rechaza."),
  )),
 dict(id="s07", kind="screen", dur=15.5, voice=V7, events=[
    ("show", 0, "05-rechazo"), ("cam", 0, box("05-rechazo", "cmsg"), 2.0, 0.01),
    ("cam", 0.3, QTY_1000, 2.2),
    ("show", at(V7, 78.4), "06-orden-1000"),
    ("label", at(V7, 78.6), "1.000 VN: sí es múltiplo de 100"),
    ("mark", at(V7, 78.8), box("06-orden-1000", "cant-input")),
    ("cam", at(V7, 80.4), box("06-orden-1000", "btn-comprar-submit"), 2.0),
    ("click", at(V7, 81.2), box("06-orden-1000", "btn-comprar-submit")),
    ("show", at(V7, 81.9), "07-confirmacion"), ("cam", at(V7, 81.9), box("07-confirmacion", "modal"), 1.4, 0.01),
    ("cam", at(V7, 84.3), box("07-confirmacion", "costos"), 2.4),
    ("label", at(V7, 84.6), "Comisión · Derechos de mercado · IVA"),
    ("mark", at(V7, 85.0), box("07-confirmacion", "costos")),
    ("cam", at(V7, 89.6), box("07-confirmacion", "modal"), 1.4),
    ("click", at(V7, 91.2), box("07-confirmacion", "confirmar-orden")),
  ], guide=say(V7,
    (77.8, 81.7, "Corregimos a mil VN, que sí es múltiplo, y la mandamos de nuevo."),
    (84.6, 86.5, "Revisás los costos en el detalle,"),
    (90.8, 91.85, "y confirmás."),
  )),
 dict(id="s08", kind="screen", dur=14.5, voice=V8, events=[
    ("show", 0, "08-boleto"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.3, box("08-boleto", "boleto"), 1.25),
    ("label", at(V8, 97.2), "Boleto: 1.000 VN de YMCJO"),
    ("show", at(V8, 100.9), "10-ficha-ymcjo"), ("cam", at(V8, 100.9), "full", None, 0.01),
    ("cam", at(V8, 101.2), FICHA_DATA, 2.4),
    ("label", at(V8, 101.4), "Renta semestral: marzo y septiembre · Vence en 2031 (datos del simulador)"),
    ("mark", at(V8, 102.0), FICHA_DATA),
    ("mark", at(V8, 105.9), FICHA_DATA),
  ], guide=say(V8,
    (97.2, 99.7, "Listo: ahora sos acreedor de YPF."),
    (100.9, 104.6, "Según los datos del simulador, te paga intereses en dólares"),
    (105.9, 109.5, "dos veces por año, en marzo y en septiembre, hasta el vencimiento."),
  )),
 dict(id="s09", kind="takeaways", dur=15, voice=V9, idea_t=[at(V9, 112.8), at(V9, 116.9), at(V9, 121.3)]),
 dict(id="s10", kind="final", dur=8),
]

NAMES = {"s01": "Apertura", "s02": "Introducción", "s03": "Ir a comprar", "s04": "El símbolo",
         "s05": "La cantidad va en VN", "s06": "Error a propósito", "s07": "Corregir y confirmar",
         "s08": "El boleto", "s09": "Para llevarte", "s10": "Placa final"}

def voice_clips():
    """One normalized WAV per scene (voz/<id>.wav), cut at the recording's pauses, as serie.main audio clips."""
    wav = voz.preparar(VOICE_SRC, ROOT / "voz/voz.wav")
    clips, t = [], 0.0
    for sc in SCENES:
        if sc.get("voice"):
            a0, a1, lead = sc["voice"]
            voz.cortar(wav, a0, a1, ROOT / f"voz/{sc['id']}.wav")
            clips.append((f"voz-{sc['id']}", f"voz/{sc['id']}.wav", t + lead, a1 - a0))
        t += sc["dur"]
    return clips


def music(total, bajo_voz=0.3, sin_voz=0.5):
    """Bed under the voice the whole video (the user reads the title too); it rises on the silent final plate."""
    fin = total - SCENES[-1]["dur"]
    pts = [(0, bajo_voz), (fin, bajo_voz), (fin + 1.6, sin_voz), (total, sin_voz)] if not SCENES[-1].get("voice") \
        else [(0, bajo_voz), (total, bajo_voz)]
    return dict(src="musica/fondo.wav", dur=total, points=pts)


# This recording has more loose peaks than video 2's, so the same pipeline lands ~3.5 dB quieter (the true-peak ceiling eats part of the gain, hence 4.7 dB).
# The master bus brings it to the series level (−16 LUFS, like videos 2 and 4) with a true-peak ceiling.
MASTER_GAIN_DB = 4.7


def master_bus(index_html, gain_db, ceiling=-1.5):
    import html as _h, json as _j
    chain = {"version": 1, "nodes": [
        {"type": "gain", "id": "m1", "label": "Series level", "params": {"gain": gain_db}},
        {"type": "truepeak", "id": "m2", "label": "Peak Ceiling", "params": {"ceiling": ceiling}}]}
    s = index_html.read_text(encoding="utf-8")
    tag = '<div id="root" data-composition-id="main"'
    assert s.count(tag) == 1
    s = s.replace(tag, f'{tag} data-fx-chain="{_h.escape(_j.dumps(chain), quote=True)}"')
    index_html.write_text(s, encoding="utf-8")


if __name__ == "__main__":
    clips = voice_clips()
    total = sum(sc["dur"] for sc in SCENES)
    (ROOT / "musica").mkdir(exist_ok=True)
    voz.preparar_musica(MUSICA_ORIGEN, ROOT / "musica/fondo.wav", total)
    serie.main(SCENES, audio=clips, music=music(total))
    voz.carve(ROOT / "index.html", clips, SERIE)
    master_bus(ROOT / "index.html", gain_db=MASTER_GAIN_DB)
