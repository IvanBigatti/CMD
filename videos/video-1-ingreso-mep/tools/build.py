"""Video 1 · Ingresar dinero y comprar dólar MEP (M2 · M3) — versión con la voz del usuario.

Voz: Audios/Parte 1.ogg (escenas 2–8) y Audios/Parte 2.ogg (Para llevarte + placa final).
- voz/parte1.wav, voz/parte2.wav: grabaciones normalizadas (−16 LUFS) — `serie/voz.preparar`.
- voz/tmp1|tmp2/transcript.json: palabras con tiempos (Parakeet).
- Cada escena toma un tramo de la grabación (CORTES, elegidos en silencios reales) y dura
  lo que dura ese tramo + un margen; los zooms, clics y subtítulos se anclan a cada frase (P(i)).
La versión muda anterior está en tools/build_mudo.py.
"""
import json, pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE.parents[1] / "_serie"))
import serie, voz
from serie import box, union

TITLE = "Ingresar dinero y comprar dólar MEP"
IDEAS = ["Solo podés ingresar plata desde cuentas a tu nombre.",
         "El dólar MEP son dos operaciones con un bono: AL30 en pesos y AL30D en dólares."]
serie.configure(ROOT, TITLE, "M2 · M3", IDEAS)

PARTES = {1: ROOT / "voz/parte1.wav", 2: ROOT / "voz/parte2.wav"}
PALABRAS = {n: json.loads((ROOT / f"voz/tmp{n}/transcript.json").read_text(encoding="utf-8")) for n in PARTES}

# Subtítulos = el guion, con lo que el usuario agregó («¿Qué te tenés que llevar…»).
# (parte, tramo [ini, fin] en la grabación, margen antes, margen después, frases)
VOZ = {
 "s02": (1, (0.00, 11.54), 0.8, 0.6, [
    "En este video vas a hacer dos cosas:",
    "pasar plata de tu banco a tu cuenta de inversión,",
    "y convertir una parte de esos pesos a dólares.",
    "Arrancamos con la cuenta en cero."]),
 "s03": (1, (11.54, 26.20), 0.3, 0.4, [
    "Hacé clic en «Ingresar dinero».",
    "Ojo con una cosa: esto no es una cuenta bancaria.",
    "Es una cuenta comitente, que sirve para comprar y vender títulos.",
    "El alias que ves acá es adonde vas a transferir desde tu banco."]),
 "s04": (1, (26.20, 41.90), 0.3, 0.6, [
    "Ahora nos vamos a equivocar a propósito.",
    "Elegimos la cuenta de María Suárez, que es de otra persona.",
    "¿Ves? El sistema la rechaza.",
    "A tu cuenta de inversión solo puede entrar plata desde cuentas a tu nombre."]),
 "s05": (1, (41.90, 51.50), 0.3, 1.2, [
    "Elegimos la cuenta propia, la del Banco Nación, y confirmamos.",
    "Listo: la plata ya está en tu cuenta de inversión."]),
 "s06": (1, (51.50, 67.40), 0.3, 0.5, [
    "Ahora, los dólares.",
    "En la pantalla de inicio está la tarjeta «Dólar MEP Simple»;",
    "también la encontrás en el menú «Operar».",
    "Acá ves a qué tipo de cambio comprás y cuántos dólares vas a recibir.",
    "El mínimo es de 5.000 pesos."]),
 "s07": (1, (67.40, 86.90), 0.3, 0.6, [
    "Hacé clic en «Ver por dentro»,",
    "porque esto no es como comprar en una casa de cambio.",
    "Por debajo, el sistema hace dos operaciones con un mismo bono:",
    "lo compra en pesos, que es el AL30,",
    "y lo vende en dólares, que es el AL30D.",
    "Las dos se hacen en contado inmediato,",
    "y por eso los dólares llegan en el mismo día."]),
 "s08": (1, (86.90, 92.40), 0.3, 1.8, [
    "Confirmamos,",
    "y ahora tenés pesos y dólares en tu cuenta de inversión."]),
 "s09": (2, (2.90, 19.50), 0.8, 2.6, [
    "¿Qué te tenés que llevar de todo esto?",
    "Solo podés ingresar plata desde cuentas a tu nombre.",
    "El dólar MEP son dos operaciones con un bono:",
    "AL30 en pesos y AL30D en dólares."]),
 "s10": (2, (23.30, 29.40), 0.6, 1.3, [
    "Ahora hacelo vos.",
    "Ingresar dinero y comprar dólar MEP.",
    "Al terminar, puntuá la sección del 1 al 10."]),
}

def tiempos(sid):
    """Duración de la escena, inicio local de cada frase y subtítulos (t, dur, texto)."""
    parte, (a, b), lead, tail, frases = VOZ[sid]
    # el transcriptor separa «AL30» en «al 30»: alinear con esa forma
    al = voz.alinear(PALABRAS[parte], [f.replace("AL30", "AL 30") for f in frases])
    dur = round(lead + (b - a) + tail, 2)
    P = [round(max(lead, lead + s - a), 2) for s, _ in al]
    guide = [(P[i], round((P[i + 1] if i + 1 < len(P) else dur - 0.15) - P[i], 2), f) for i, f in enumerate(frases)]
    return dur, P, guide

T = {sid: tiempos(sid) for sid in VOZ}
def P(sid, i, dt=0.0):
    return round(T[sid][1][i] + dt, 2)

MEP_CARD = [380, 740, 372, 300]
SALDO_CERO = [840, 380, 78, 64]

def scene(sid, kind="screen", events=None, **kw):
    dur, _, guide = T[sid]
    d = dict(id=sid, kind=kind, dur=dur, guide=guide, **kw)
    if events is not None:
        d["events"] = events
    return d

SCENES = [
 dict(id="s01", kind="open", dur=6),
 scene("s02", events=[
    ("show", 0, "02-inicio-cero"), ("cam", 0, "full", None, 0.01),
    ("label", P("s02", 0, 1.2), "1. Ingresar dinero · 2. Comprar dólar MEP"),
    ("cam", P("s02", 3, -0.6), box("02-inicio-cero", "cuenta-arg"), 1.75),
    ("mark", P("s02", 3, 0.6), SALDO_CERO),
 ]),
 scene("s03", events=[
    ("show", 0, "03-inicio-ingresar"), ("cam", 0, box("02-inicio-cero", "cuenta-arg"), 1.75, 0.01),
    ("click", P("s03", 0, 1.2), box("03-inicio-ingresar", "qa-ingresar")),
    ("show", P("s03", 0, 1.9), "04-ingresar"), ("cam", P("s03", 0, 1.9), "full", None, 0.01),
    ("cam", P("s03", 1, -0.2), union(box("04-ingresar", "alias"), box("04-ingresar", "origen-list")), 1.7),
    ("mark", P("s03", 1, 0.8), box("04-ingresar", "origen-list"), P("s03", 3) - P("s03", 1, 0.8)),
    ("cam", P("s03", 3, -0.2), box("04-ingresar", "alias"), 2.3),
    ("mark", P("s03", 3, 0.9), box("04-ingresar", "alias")),
 ]),
 scene("s04", events=[
    ("show", 0, "04-ingresar"),
    ("cam", 0, union(box("04-ingresar", "origen-list"), box("04-ingresar", "confirmar-ingreso")), 1.6, 0.01),
    ("click", P("s04", 1, 1.4), box("04-ingresar", "origen-tercero")),
    ("show", P("s04", 1, 2.1), "05-tercero-elegida"),
    ("cam", P("s04", 1, 2.2), union(box("05-tercero-elegida", "origen-list"), box("05-tercero-elegida", "confirmar-ingreso")), 1.6),
    ("click", P("s04", 2, -0.9), box("05-tercero-elegida", "confirmar-ingreso")),
    ("show", P("s04", 2, -0.2), "06-rechazo"),
    # mensaje de error: zoom y cámara quieta (≥ 3 s)
    ("cam", P("s04", 2, -0.1), box("06-rechazo", "origen-msg"), 2.45, 0.8),
    ("label", P("s04", 2, 0.8), "Solo cuentas a tu nombre"),
    ("cam", P("s04", 3, 2.8), union(box("06-rechazo", "origen-list"), box("06-rechazo", "confirmar-ingreso")), 1.55),
 ]),
 scene("s05", events=[
    ("show", 0, "06-rechazo"),
    ("cam", 0, union(box("06-rechazo", "origen-list"), box("06-rechazo", "confirmar-ingreso")), 1.55, 0.01),
    ("click", P("s05", 0, 1.0), box("06-rechazo", "origen-propia")),
    ("show", P("s05", 0, 1.7), "07-propia-elegida"),
    ("cam", P("s05", 0, 1.8), union(box("07-propia-elegida", "origen-list"), box("07-propia-elegida", "confirmar-ingreso")), 1.6),
    ("click", P("s05", 1, -1.0), box("07-propia-elegida", "confirmar-ingreso")),
    ("show", P("s05", 1, -0.3), "08-acreditado"), ("cam", P("s05", 1, -0.2), box("08-acreditado", "modal"), 2.2),
    ("show", P("s05", 1, 1.8), "09-inicio-con-pesos"), ("cam", P("s05", 1, 1.8), box("09-inicio-con-pesos", "cuenta-arg"), 1.75, 0.01),
    ("cam", P("s05", 1, 2.1), union(box("09-inicio-con-pesos", "bal-ars"), [620, 384, 120, 24]), 2.4),
    ("mark", P("s05", 1, 3.0), [783, 378, 141, 36]),
 ]),
 scene("s06", events=[
    ("show", 0, "09-inicio-con-pesos"), ("cam", 0, "full", None, 0.01),
    ("label", P("s06", 0, 0.2), "MEP: Mercado Electrónico de Pagos"),
    ("cam", P("s06", 1, -0.2), MEP_CARD, 1.75),
    ("mark", P("s06", 1, 0.9), MEP_CARD, P("s06", 2) - P("s06", 1, 0.9)),
    ("show", P("s06", 2), "10-menu-operar"),
    ("cam", P("s06", 2), union(box("10-menu-operar", "nav-operar"), box("10-menu-operar", "menu-mep")), 1.6),
    ("mark", P("s06", 2, 0.7), box("10-menu-operar", "menu-mep"), P("s06", 3, -1.6) - P("s06", 2, 0.7)),
    ("show", P("s06", 3, -1.5), "09-inicio-con-pesos"), ("cam", P("s06", 3, -1.5), MEP_CARD, 1.75, 0.01),
    ("click", P("s06", 3, -1.1), box("09-inicio-con-pesos", "qa-mep")),
    ("show", P("s06", 3, -0.4), "11-mep"), ("cam", P("s06", 3, -0.4), "full", None, 0.01),
    ("cam", P("s06", 3, 0.0), box("11-mep", "mep-tc"), 2.4),
    ("mark", P("s06", 3, 1.0), box("11-mep", "mep-tc"), P("s06", 4) - P("s06", 3, 1.0)),
    ("cam", P("s06", 4, -0.2), union(box("11-mep", "mep-monto"), box("11-mep", "mep-min")), 2.1),
    ("mark", P("s06", 4, 0.7), [393, 472, 88, 24]),
 ]),
 scene("s07", events=[
    ("show", 0, "11-mep"), ("cam", 0, union(box("11-mep", "mep-monto"), box("11-mep", "mep-min")), 2.1, 0.01),
    ("cam", 0.2, box("11-mep", "mep-verpordentro"), 1.9, 0.9),
    ("click", P("s07", 0, 1.3), box("11-mep", "mep-verpordentro")),
    ("show", P("s07", 0, 2.0), "12-mep-por-dentro"),
    ("cam", P("s07", 1, 0.2), box("12-mep-por-dentro", "mep-patas-ops"), 2.5),
    ("mark", P("s07", 3), box("12-mep-por-dentro", "patas-op1"), P("s07", 4) - P("s07", 3) - 0.1),
    ("label", P("s07", 3), "Compra de AL30 en pesos"),
    ("mark", P("s07", 4), box("12-mep-por-dentro", "patas-op2"), P("s07", 5) - P("s07", 4) - 0.1),
    ("label2", P("s07", 4), "Compra de AL30 en pesos  →  Venta de AL30D en dólares"),
    ("mark", P("s07", 5), box("12-mep-por-dentro", "patas-ci"), 4.0),
 ]),
 scene("s08", events=[
    ("show", 0, "12-mep-por-dentro"),
    ("cam", 0, union(box("12-mep-por-dentro", "mep-tc"), box("12-mep-por-dentro", "mep-confirmar")), 1.9, 0.01),
    ("click", P("s08", 0, 0.5), box("12-mep-por-dentro", "mep-confirmar")),
    ("show", P("s08", 0, 1.2), "13-mep-ok"), ("cam", P("s08", 0, 1.3), box("13-mep-ok", "modal"), 2.3),
    ("show", P("s08", 1, 1.2), "15-detalle-saldos"), ("cam", P("s08", 1, 1.2), "full", None, 0.01),
    ("cam", P("s08", 1, 1.5), box("15-detalle-saldos", "saldos"), 2.6),
    ("mark", P("s08", 1, 2.4), box("15-detalle-saldos", "saldos")),
 ]),
 scene("s09", kind="takeaways", guide_band=True,
       idea_t=[P("s09", 1, -0.1), P("s09", 2, -0.1)]),
 scene("s10", kind="final", guide_band=True,
       t=[P("s10", 0, -0.2), P("s10", 1, -0.2), P("s10", 2, -0.2), P("s10", 2, 0.6)]),
]

def audios():
    """Corta un WAV por escena (con fundidos de 30 ms) y devuelve los clips para la pista de voz."""
    clips, t = [], 0.0
    for sc in SCENES:
        if sc["id"] in VOZ:
            parte, (a, b), lead, _, _ = VOZ[sc["id"]]
            out = ROOT / f"voz/{sc['id']}.wav"
            voz.cortar(PARTES[parte], a, b, out)
            clips.append((f"voz-{sc['id']}", f"voz/{sc['id']}.wav", t + lead, b - a))
        t += sc["dur"]
    return clips

# Música de fondo (biblioteca de HeyGen, pista ca26cc0c: «soft unobtrusive instrumental, professional
# corporate e-learning, calm and steady»), recortada y normalizada en musica/fondo.wav.
# Más presente en la placa de apertura (sin voz) y muy baja debajo de la voz.
MUSICA_APERTURA, MUSICA_BAJO_VOZ = 0.5, 0.3

def musica():
    total = round(sum(sc["dur"] for sc in SCENES), 3)
    return dict(src="musica/fondo.wav", dur=total, points=[
        (0, MUSICA_APERTURA), (5.0, MUSICA_APERTURA), (6.6, MUSICA_BAJO_VOZ), (total, MUSICA_BAJO_VOZ)])

if __name__ == "__main__":
    import subprocess
    clips = audios()
    serie.main(SCENES, audio=clips, music=musica())
    # «carve»: le abre a la voz su lugar en la música (EQ dinámica), además del volumen bajo
    carve = pathlib.Path.home() / ".claude/skills/hyperframes-audio/scripts/carve.mjs"
    subprocess.run(["node", str(carve), "--comp", str(ROOT / "index.html"), "--core", str(HERE.parents[1] / "_serie"), "--bed", "musica",
                    *sum((["--voice", c[0]] for c in clips), [])], check=True)
