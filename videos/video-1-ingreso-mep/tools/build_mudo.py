"""Genera index.html y compositions/frames/*.html a partir de las escenas de abajo.

Los tiempos de cada escena (dur), de cada evento (t) y del texto guía están en
este archivo: para reajustar el video a la grabación de voz, se editan acá y se
vuelve a correr `python tools/build.py`.
Cajas de los elementos: assets/captures/manifest.json (px CSS de la captura 1920x1080).
"""
import json, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAN = json.loads((ROOT / "assets/captures/manifest.json").read_text(encoding="utf-8"))
BOX = {s["id"]: s["boxes"] for s in MAN["shots"]}

C = dict(violet="#6439FF", indigo="#06083F", lavender="#EEEDF8", light="#F7F6FC",
         yellow="#E8B23A", yellowInk="#20160A")

def box(shot, key):
    b = BOX[shot][key]
    return [b["x"], b["y"], b["width"], b["height"]]

def union(*bs):
    x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs)
    x1 = max(b[0] + b[2] for b in bs); y1 = max(b[1] + b[3] for b in bs)
    return [x0, y0, x1 - x0, y1 - y0]

MEP_CARD = [380, 740, 372, 300]  # tarjeta «Dólar MEP Simple» en 09 (medida sobre la captura)

# ---------------------------------------------------------------- escenas
# Eventos de pantalla: show (cambia captura), cam (encuadre: "full" o caja [+ zoom]),
# click (círculo sobre la caja), mark (recuadro sobre la caja), label / label2 (chip de texto).
# guide: (t, dur, texto) — texto a grabar, en la banda inferior.
SCENES = [
 dict(id="s01", kind="open", dur=6),
 dict(id="s02", kind="screen", dur=16, events=[
    ("show", 0, "02-inicio-cero"), ("cam", 0, "full"),
    ("label", 1.2, "1. Ingresar dinero · 2. Comprar dólar MEP"),
    ("cam", 4.5, box("02-inicio-cero", "cuenta-arg"), 1.75),
  ], guide=[
    (0.6, 3.4, "En este video vas a hacer dos cosas:"),
    (4.0, 4.6, "pasar plata de tu banco a tu cuenta de inversión,"),
    (8.6, 4.4, "y convertir una parte de esos pesos a dólares."),
    (13.0, 3.0, "Arrancamos con la cuenta en cero."),
  ]),
 dict(id="s03", kind="screen", dur=22, events=[
    ("show", 0, "03-inicio-ingresar"), ("cam", 0, box("02-inicio-cero", "cuenta-arg"), 1.75),
    ("click", 1.6, box("03-inicio-ingresar", "qa-ingresar")),
    ("show", 2.5, "04-ingresar"), ("cam", 2.5, "full", None, 0.01),
    ("cam", 3.6, union(box("04-ingresar", "alias"), box("04-ingresar", "origen-list")), 1.7),
    ("mark", 5.2, box("04-ingresar", "origen-list")),
    ("cam", 14.2, box("04-ingresar", "alias"), 2.3),
    ("mark", 15.4, box("04-ingresar", "alias")),
  ], guide=[
    (0.5, 2.9, "Hacé clic en «Ingresar dinero»."),
    (3.4, 3.6, "Ojo con una cosa: esto no es una cuenta bancaria."),
    (7.0, 6.8, "Es una cuenta comitente, que sirve para comprar y vender títulos."),
    (13.8, 8.2, "El alias que ves acá es adonde vas a transferir desde tu banco."),
  ]),
 dict(id="s04", kind="screen", dur=24, events=[
    ("show", 0, "04-ingresar"),
    ("cam", 0, union(box("04-ingresar", "origen-list"), box("04-ingresar", "confirmar-ingreso")), 1.6, 0.01),
    ("click", 4.6, box("04-ingresar", "origen-tercero")),
    ("show", 5.4, "05-tercero-elegida"),
    ("cam", 5.6, union(box("05-tercero-elegida", "origen-list"), box("05-tercero-elegida", "confirmar-ingreso")), 1.6),
    ("click", 9.6, box("05-tercero-elegida", "confirmar-ingreso")),
    ("show", 10.4, "06-rechazo"),
    ("cam", 10.6, box("06-rechazo", "origen-msg"), 2.45, 0.8),
    ("label", 11.6, "Solo cuentas a tu nombre"),
    ("cam", 19.5, union(box("06-rechazo", "origen-list"), box("06-rechazo", "confirmar-ingreso")), 1.55),
  ], guide=[
    (0.5, 4.0, "Ahora nos vamos a equivocar a propósito."),
    (4.5, 5.5, "Elegimos la cuenta de María Suárez, que es de otra persona."),
    (10.6, 4.4, "¿Ves? El sistema la rechaza."),
    (15.0, 9.0, "A tu cuenta de inversión solo puede entrar plata desde cuentas a tu nombre."),
  ]),
 dict(id="s05", kind="screen", dur=14, events=[
    ("show", 0, "06-rechazo"),
    ("cam", 0, union(box("06-rechazo", "origen-list"), box("06-rechazo", "confirmar-ingreso")), 1.55, 0.01),
    ("click", 1.2, box("06-rechazo", "origen-propia")),
    ("show", 1.9, "07-propia-elegida"),
    ("cam", 2.0, union(box("07-propia-elegida", "origen-list"), box("07-propia-elegida", "confirmar-ingreso")), 1.6),
    ("click", 3.6, box("07-propia-elegida", "confirmar-ingreso")),
    ("show", 4.4, "08-acreditado"), ("cam", 4.5, box("08-acreditado", "modal"), 2.2),
    ("show", 8.4, "09-inicio-con-pesos"), ("cam", 8.4, box("09-inicio-con-pesos", "cuenta-arg"), 1.75, 0.01),
    ("cam", 9.2, union(box("09-inicio-con-pesos", "bal-ars"), [620, 384, 120, 24]), 2.4),
    ("mark", 10.4, [783, 378, 141, 36]),
  ], guide=[
    (0.5, 3.5, "Elegimos la cuenta propia, la del Banco Nación,"),
    (4.0, 3.6, "y confirmamos."),
    (8.0, 6.0, "Listo: la plata ya está en tu cuenta de inversión."),
  ]),
 dict(id="s06", kind="screen", dur=24, events=[
    ("show", 0, "09-inicio-con-pesos"), ("cam", 0, "full", None, 0.01),
    ("label", 0.8, "MEP: Mercado Electrónico de Pagos"),
    ("cam", 2.4, MEP_CARD, 1.75),
    ("mark", 3.6, MEP_CARD),
    ("show", 7.2, "10-menu-operar"), ("cam", 7.2, union(box("10-menu-operar", "nav-operar"), box("10-menu-operar", "menu-mep")), 1.6),
    ("mark", 8.2, box("10-menu-operar", "menu-mep")),
    ("show", 11.2, "09-inicio-con-pesos"), ("cam", 11.2, MEP_CARD, 1.75),
    ("click", 12.0, box("09-inicio-con-pesos", "qa-mep")),
    ("show", 12.8, "11-mep"), ("cam", 12.8, "full", None, 0.01),
    ("cam", 13.4, box("11-mep", "mep-tc"), 2.4),
    ("mark", 14.6, box("11-mep", "mep-tc")),
    ("cam", 19.4, union(box("11-mep", "mep-monto"), box("11-mep", "mep-min")), 2.1),
    ("mark", 20.4, [393, 472, 88, 24]),
  ], guide=[
    (0.5, 2.0, "Ahora, los dólares."),
    (2.5, 4.7, "En la pantalla de inicio está la tarjeta «Dólar MEP Simple»;"),
    (7.2, 5.4, "también la encontrás en el menú «Operar»."),
    (12.8, 6.6, "Acá ves a qué tipo de cambio comprás y cuántos dólares vas a recibir."),
    (19.4, 4.6, "El mínimo es de cinco mil pesos."),
  ]),
 dict(id="s07", kind="screen", dur=29, events=[
    ("show", 0, "11-mep"), ("cam", 0, union(box("11-mep", "mep-monto"), box("11-mep", "mep-min")), 2.1, 0.01),
    ("cam", 0.6, box("11-mep", "mep-verpordentro"), 1.9),
    ("click", 1.8, box("11-mep", "mep-verpordentro")),
    ("show", 2.6, "12-mep-por-dentro"),
    ("cam", 3.0, box("12-mep-por-dentro", "mep-patas-ops"), 2.5),
    ("mark", 10.6, box("12-mep-por-dentro", "patas-op1")),
    ("label", 10.6, "Compra de AL30 en pesos"),
    ("mark", 14.4, box("12-mep-por-dentro", "patas-op2")),
    ("label2", 14.4, "Compra de AL30 en pesos  →  Venta de AL30D en dólares"),
    ("mark", 19.0, box("12-mep-por-dentro", "patas-ci")),
  ], guide=[
    (0.5, 2.6, "Hacé clic en «Ver por dentro»,"),
    (3.1, 4.4, "porque esto no es como comprar en una casa de cambio."),
    (7.5, 3.1, "Por debajo, el sistema hace dos operaciones con un mismo bono:"),
    (10.6, 3.8, "lo compra en pesos, que es el AL30,"),
    (14.4, 4.6, "y lo vende en dólares, que es el AL30D."),
    (19.0, 4.2, "Las dos se hacen en contado inmediato,"),
    (23.2, 5.8, "y por eso los dólares llegan en el mismo día."),
  ]),
 dict(id="s08", kind="screen", dur=10, events=[
    ("show", 0, "12-mep-por-dentro"), ("cam", 0, union(box("12-mep-por-dentro", "mep-tc"), box("12-mep-por-dentro", "mep-confirmar")), 1.9, 0.01),
    ("click", 0.9, box("12-mep-por-dentro", "mep-confirmar")),
    ("show", 1.7, "13-mep-ok"), ("cam", 1.8, box("13-mep-ok", "modal"), 2.3),
    ("show", 5.0, "15-detalle-saldos"), ("cam", 5.0, "full", None, 0.01),
    ("cam", 5.4, box("15-detalle-saldos", "saldos"), 2.6),
    ("mark", 6.4, box("15-detalle-saldos", "saldos")),
  ], guide=[
    (0.5, 2.5, "Confirmamos,"),
    (3.0, 7.0, "y ahora tenés pesos y dólares en tu cuenta de inversión."),
  ]),
 dict(id="s09", kind="takeaways", dur=20),
 dict(id="s10", kind="final", dur=8),
]

TITLE = "Ingresar dinero y comprar dólar MEP"

# ---------------------------------------------------------------- layout
FW, FH = 1520, 855          # caja de la captura en el cuadro
FX, FY = 200, 84            # posición de la caja
BAND_Y = 960                # banda del texto guía

FONTS = """
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-400.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-600.woff2") format("woff2"); font-weight: 600; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-700.woff2") format("woff2"); font-weight: 700; }
"""

def wrap_sub(cid, style, body, script):
    return f"""<!doctype html>
<html lang="es">
  <head><meta charset="UTF-8" /></head>
  <body>
    <template>
      <style>
{FONTS}
        #root {{ position: absolute; inset: 0; overflow: hidden; font-family: "Barlow", sans-serif; }}
{style}
      </style>
      <div id="root" data-composition-id="{cid}" data-width="1920" data-height="1080">
{body}
      </div>
      <script>
{script}
      </script>
    </template>
  </body>
</html>
"""

def screen_scene(sc):
    cid = sc["id"]
    shots = []
    for ev in sc["events"]:
        if ev[0] == "show" and ev[2] not in shots:
            shots.append(ev[2])
    imgs = "\n".join(
        f'          <img class="{cid}-shot" id="{cid}-img-{i}" src="assets/captures/{s}.png" alt="" />'
        for i, s in enumerate(shots))
    cfg = {"shots": shots, "events": [list(e) for e in sc["events"]], "FW": FW, "FH": FH}
    style = f"""
        #{cid}-bg {{ position: absolute; inset: 0; background: {C['light']}; }}
        #{cid}-frame {{ position: absolute; left: {FX}px; top: {FY}px; width: {FW}px; height: {FH}px;
          overflow: hidden; border-radius: 14px; background: #fff;
          box-shadow: 0 10px 36px rgba(6, 8, 63, 0.16), 0 0 0 1px rgba(6, 8, 63, 0.08); }}
        #{cid}-cam {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }}
        .{cid}-shot {{ position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; opacity: 0; }}
        .{cid}-ring {{ position: absolute; border-radius: 50%; border: 5px solid {C['violet']};
          background: rgba(100, 57, 255, 0.14); opacity: 0; }}
        .{cid}-mark {{ position: absolute; border-radius: 10px; border: 4px solid {C['violet']}; opacity: 0; }}
        .{cid}-chip {{ position: absolute; left: {FX}px; top: 14px; height: 60px; padding: 0 22px;
          display: flex; align-items: center; border-radius: 8px; background: {C['yellow']};
          color: {C['yellowInk']}; font-size: 36px; font-weight: 600; white-space: nowrap; opacity: 0; }}
        #{cid}-band {{ position: absolute; left: 0; right: 0; top: {BAND_Y}px; bottom: 0; background: {C['indigo']}; }}
"""
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-frame">
          <div id="{cid}-cam" data-layout-allow-overflow>
{imgs}
            <div id="{cid}-fx"></div>
          </div>
        </div>
        <div id="{cid}-chips"></div>
        <div id="{cid}-band"></div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const CFG = {json.dumps(cfg, ensure_ascii=False)};
          const tl = gsap.timeline({{ paused: true }});
          const cam = document.getElementById(ID + "-cam");
          const fx = document.getElementById(ID + "-fx");
          const chips = document.getElementById(ID + "-chips");
          const base = CFG.FW / 1920;
          function frameFor(target, zoom) {{
            if (target === "full") {{ target = [288, 16, 1344, 756]; zoom = zoom || 1920 / 1344; }}
            const [bx, by, bw, bh] = target;
            const z = zoom || Math.max(1, Math.min(2.5, Math.min(0.62 * 1920 / bw, 0.62 * 1080 / bh)));
            const s = base * z;
            let x = CFG.FW / 2 - (bx + bw / 2) * s;
            let y = CFG.FH / 2 - (by + bh / 2) * s;
            x = Math.min(0, Math.max(CFG.FW - 1920 * s, x));
            y = Math.min(0, Math.max(CFG.FH - 1080 * s, y));
            return {{ x, y, scale: s }};
          }}
          gsap.set(cam, {{ transformOrigin: "0 0", x: 0, y: 0, scale: base }});
          let current = null, z = 1, n = 0, chipOn = null;
          CFG.events.forEach(function (ev) {{
            const type = ev[0], t = ev[1];
            if (type === "show") {{
              const img = document.getElementById(ID + "-img-" + CFG.shots.indexOf(ev[2]));
              img.style.zIndex = String(++z);
              if (current === null) tl.set(img, {{ opacity: 1 }}, 0);
              else {{
                tl.fromTo(img, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.3, ease: "none" }}, t);
                tl.set(current, {{ opacity: 0 }}, t + 0.3);
              }}
              current = img;
            }} else if (type === "cam") {{
              const f = frameFor(ev[2], ev[3]);
              const d = ev[4] === undefined ? 1.1 : ev[4];
              if (d <= 0.02) tl.set(cam, f, t);
              else tl.to(cam, Object.assign({{ duration: d, ease: "power2.inOut" }}, f), t);
            }} else if (type === "click") {{
              const [bx, by, bw, bh] = ev[2];
              const r = Math.max(30, Math.min(56, bh * 0.9));
              const el = document.createElement("div");
              el.className = ID + "-ring"; el.id = ID + "-fx-" + (n++);
              Object.assign(el.style, {{ left: (bx + bw / 2 - r) + "px", top: (by + bh / 2 - r) + "px",
                width: 2 * r + "px", height: 2 * r + "px", zIndex: "500" }});
              fx.appendChild(el);
              tl.fromTo(el, {{ opacity: 0, scale: 0.4 }}, {{ opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }}, t);
              tl.to(el, {{ opacity: 0, scale: 1.15, duration: 0.45, ease: "power1.in" }}, t + 0.55);
            }} else if (type === "mark") {{
              const [bx, by, bw, bh] = ev[2];
              const el = document.createElement("div");
              el.className = ID + "-mark"; el.id = ID + "-fx-" + (n++);
              Object.assign(el.style, {{ left: (bx - 6) + "px", top: (by - 6) + "px",
                width: (bw + 12) + "px", height: (bh + 12) + "px", zIndex: "400" }});
              fx.appendChild(el);
              tl.fromTo(el, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.4, ease: "power1.out" }}, t);
              tl.to(el, {{ opacity: 0, duration: 0.4, ease: "power1.in" }}, t + 3.2);
            }} else if (type === "label" || type === "label2") {{
              const el = document.createElement("div");
              el.className = ID + "-chip"; el.id = ID + "-chip-" + (n++);
              el.textContent = ev[2];
              chips.appendChild(el);
              if (chipOn) tl.to(chipOn, {{ opacity: 0, duration: 0.2, ease: "none" }}, t - 0.2);
              if (type === "label2") tl.fromTo(el, {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2, ease: "none" }}, t - 0.2);
              else tl.fromTo(el, {{ opacity: 0, y: 8 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }}, t);
              chipOn = el;
            }}
          }});
          tl.set({{}}, {{}}, {sc['dur']});
          window.__timelines[ID] = tl;
        }})();"""
    return wrap_sub(cid, style, body, script)

def open_scene(sc):
    cid = sc["id"]
    style = f"""
        #{cid}-bg {{ position: absolute; inset: 0; background: {C['indigo']}; }}
        #{cid}-strip {{ position: absolute; left: 0; right: 0; top: 0; height: 84px; background: {C['yellow']};
          display: flex; align-items: center; justify-content: center; }}
        #{cid}-strip span {{ font-family: "IBM Plex Mono", monospace; font-size: 36px; font-weight: 700;
          letter-spacing: 0.06em; color: {C['yellowInk']}; }}
        #{cid}-content {{ position: absolute; left: 200px; right: 200px; top: 250px; display: flex;
          flex-direction: column; gap: 40px; }}
        #{cid}-eyebrow {{ font-family: "IBM Plex Mono", monospace; font-size: 36px; letter-spacing: 0.05em;
          color: {C['lavender']}; }}
        #{cid}-title {{ font-size: 112px; line-height: 1.05; font-weight: 700; color: {C['light']}; max-width: 1400px; }}
        #{cid}-mods {{ font-family: "IBM Plex Mono", monospace; font-size: 44px; font-weight: 700;
          letter-spacing: 0.08em; color: {C['yellow']}; }}
        #{cid}-rule {{ width: 160px; height: 6px; background: {C['violet']}; border-radius: 3px; }}
"""
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-strip"><span>MODO CAPACITACIÓN · DINERO Y PRECIOS FICTICIOS</span></div>
        <div id="{cid}-content">
          <div id="{cid}-eyebrow">CAPACITACIÓN EN EL USO DE INVERTIR ONLINE (IOL)</div>
          <div id="{cid}-title">{html.escape(TITLE)}</div>
          <div id="{cid}-rule"></div>
          <div id="{cid}-mods">MÓDULOS M2 · M3</div>
        </div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const tl = gsap.timeline({{ paused: true }});
          tl.fromTo("#" + ID + "-eyebrow", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, 0.3);
          tl.fromTo("#" + ID + "-title", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }}, 0.6);
          tl.fromTo("#" + ID + "-rule", {{ scaleX: 0 }}, {{ scaleX: 1, transformOrigin: "0 50%", duration: 0.6, ease: "power2.inOut" }}, 1.1);
          tl.fromTo("#" + ID + "-mods", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 1.4);
          tl.to("#" + ID + "-content", {{ opacity: 0, duration: 0.4, ease: "power1.in" }}, {sc['dur'] - 0.45});
          tl.set({{}}, {{}}, {sc['dur']});
          window.__timelines[ID] = tl;
        }})();"""
    return wrap_sub(cid, style, body, script)

IDEAS = ["Solo podés ingresar plata desde cuentas a tu nombre.",
         "El dólar MEP son dos operaciones con un bono: AL30 en pesos y AL30D en dólares."]

def takeaways_scene(sc):
    cid = sc["id"]
    style = f"""
        #{cid}-bg {{ position: absolute; inset: 0; background: {C['lavender']}; }}
        #{cid}-eyebrow {{ position: absolute; left: 200px; top: 190px; font-family: "IBM Plex Mono", monospace;
          font-size: 40px; font-weight: 700; letter-spacing: 0.08em; color: {C['violet']}; }}
        .{cid}-idea {{ position: absolute; left: 200px; right: 200px; top: 360px; display: flex; gap: 44px;
          align-items: flex-start; opacity: 0; }}
        .{cid}-num {{ flex: none; width: 104px; height: 104px; border-radius: 50%; background: {C['yellow']};
          color: {C['yellowInk']}; font-size: 60px; font-weight: 700; display: flex; align-items: center;
          justify-content: center; }}
        .{cid}-tx {{ font-size: 72px; line-height: 1.18; font-weight: 600; color: {C['indigo']}; padding-top: 6px; }}
        #{cid}-dots {{ position: absolute; left: 200px; bottom: 150px; display: flex; gap: 16px; }}
        .{cid}-dot {{ width: 18px; height: 18px; border-radius: 50%; background: rgba(6, 8, 63, 0.18); }}
"""
    ideas = "\n".join(
        f'        <div class="{cid}-idea" id="{cid}-idea-{i}"><div class="{cid}-num">{i+1}</div>'
        f'<div class="{cid}-tx">{html.escape(t)}</div></div>' for i, t in enumerate(IDEAS))
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-eyebrow">PARA LLEVARTE</div>
{ideas}
        <div id="{cid}-dots"><div class="{cid}-dot" id="{cid}-dot-0"></div><div class="{cid}-dot" id="{cid}-dot-1"></div></div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const tl = gsap.timeline({{ paused: true }});
          tl.fromTo("#" + ID + "-eyebrow", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 0.2);
          tl.fromTo("#" + ID + "-idea-0", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, 0.8);
          tl.to("#" + ID + "-dot-0", {{ backgroundColor: "{C['violet']}", duration: 0.3 }}, 0.8);
          tl.to("#" + ID + "-idea-0", {{ opacity: 0, y: -16, duration: 0.45, ease: "power1.in" }}, 8.6);
          tl.fromTo("#" + ID + "-idea-1", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, 9.2);
          tl.to("#" + ID + "-dot-1", {{ backgroundColor: "{C['violet']}", duration: 0.3 }}, 9.2);
          tl.set({{}}, {{}}, {sc['dur']});
          window.__timelines[ID] = tl;
        }})();"""
    return wrap_sub(cid, style, body, script)

def final_scene(sc):
    cid = sc["id"]
    style = f"""
        #{cid}-bg {{ position: absolute; inset: 0; background: {C['indigo']}; }}
        #{cid}-content {{ position: absolute; left: 200px; right: 200px; top: 170px; display: flex;
          flex-direction: column; gap: 44px; }}
        #{cid}-title {{ font-size: 120px; font-weight: 700; line-height: 1; color: {C['light']}; }}
        #{cid}-card {{ align-self: flex-start; background: {C['lavender']}; border-radius: 16px; padding: 28px 40px;
          display: flex; flex-direction: column; gap: 10px; }}
        #{cid}-cardlbl {{ font-family: "IBM Plex Mono", monospace; font-size: 36px; letter-spacing: 0.06em;
          color: {C['violet']}; font-weight: 700; }}
        #{cid}-cardtx {{ font-size: 60px; font-weight: 600; color: {C['indigo']}; }}
        #{cid}-rate {{ font-size: 48px; font-weight: 500; color: {C['yellow']}; }}
        #{cid}-fine {{ position: absolute; left: 200px; right: 200px; bottom: 70px; font-size: 36px;
          color: #C9C6EE; }}
"""
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-content">
          <div id="{cid}-title">Ahora hacelo vos</div>
          <div id="{cid}-card"><div id="{cid}-cardlbl">ITINERARIO DEL SIMULADOR</div>
            <div id="{cid}-cardtx">{html.escape(TITLE)}</div></div>
          <div id="{cid}-rate">Al terminar, puntuá la sección del 1 al 10</div>
        </div>
        <div id="{cid}-fine">Simulador de práctica · No es una recomendación de inversión</div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const tl = gsap.timeline({{ paused: true }});
          tl.fromTo("#" + ID + "-title", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, 0.3);
          tl.fromTo("#" + ID + "-card", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, 0.9);
          tl.fromTo("#" + ID + "-rate", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 1.6);
          tl.fromTo("#" + ID + "-fine", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.5 }}, 2.0);
          tl.set({{}}, {{}}, {sc['dur']});
          window.__timelines[ID] = tl;
        }})();"""
    return wrap_sub(cid, style, body, script)

BUILDERS = dict(open=open_scene, screen=screen_scene, takeaways=takeaways_scene, final=final_scene)

def main():
    out = ROOT / "compositions/frames"
    out.mkdir(parents=True, exist_ok=True)
    hosts, caps, t = [], [], 0.0
    for sc in SCENES:
        name = f"{sc['id']}.html"
        (out / name).write_text(BUILDERS[sc["kind"]](sc), encoding="utf-8")
        hosts.append(f'      <div id="{sc["id"]}" data-composition-id="{sc["id"]}" '
                     f'data-composition-src="compositions/frames/{name}" data-start="{t:g}" '
                     f'data-duration="{sc["dur"]:g}" data-track-index="0" data-width="1920" data-height="1080"></div>')
        for i, (gt, gd, tx) in enumerate(sc.get("guide", [])):
            caps.append((round(t + gt, 2), round(gd, 2), tx, f'{sc["id"]}-g{i}'))
        t += sc["dur"]
    total = t
    cap_html = "\n".join(
        f'      <div class="clip guide" id="{cid}" data-start="{s:g}" data-duration="{d:g}" data-track-index="1">'
        f'<span class="guide-tx">{html.escape(tx)}</span></div>' for s, d, tx, cid in caps)
    index = f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Video 1 · {html.escape(TITLE)}</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
{FONTS}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: {C['light']}; }}
      #root {{ position: relative; width: 100%; height: 100%; overflow: hidden; font-family: "Barlow", sans-serif; }}
      .guide {{ position: absolute; left: 0; right: 0; top: {BAND_Y}px; bottom: 0; display: flex;
        align-items: center; justify-content: center; padding: 0 160px; z-index: 50; }}
      .guide-tx {{ display: block; font-size: 42px; line-height: 1.2; font-weight: 500; color: {C['light']};
        text-align: center; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total:g}" data-width="1920" data-height="1080">
{chr(10).join(hosts)}
{cap_html}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      document.querySelectorAll(".guide").forEach(function (el) {{
        const s = parseFloat(el.dataset.start);
        tl.fromTo(el.querySelector(".guide-tx"), {{ opacity: 0 }}, {{ opacity: 1, duration: 0.2, ease: "none" }}, s);
      }});
      tl.set({{}}, {{}}, {total:g});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
"""
    (ROOT / "index.html").write_text(index, encoding="utf-8")
    print(f"ok · {len(SCENES)} escenas · {len(caps)} textos guía · {total:g} s")

if __name__ == "__main__":
    main()
