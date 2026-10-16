"""Genera index.html, compositions/frames/*.html y GUION-GRABACION.md a partir de las escenas de abajo.

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

COST_LINE = [678, 790, 360, 22]      # «Los costos totales fueron …» in 12 (measured on the capture)
RESULT_CARD = [1162, 342, 377, 136]  # «RESULTADO DE LA TENENCIA» card in 14/15 (measured)
# The KO detail shows a «Supera tu perfil» alert from y ≈ 828 in 05: these views end above it.
PUNTAS_VIEW = [335, 515, 615, 160]
PRICE_VS_ASK_VIEW = [335, 270, 1250, 530]  # in 06, whose alert starts at y ≈ 1012
COSTS_VIEW = [762, 410, 396, 96]     # frames the cost rows and keeps the profile alert (y ≥ 670) out

# ---------------------------------------------------------------- escenas
# Eventos de pantalla: show (cambia captura), cam (encuadre: "full" o caja [+ zoom]),
# click (círculo sobre la caja), mark (recuadro sobre la caja), label / label2 (chip de texto).
# guide: (t, dur, texto) — texto a grabar, en la banda inferior.
SCENES = [
 dict(id="s01", kind="open", dur=6),
 dict(id="s02", kind="screen", name="Introducción", dur=14, events=[
    ("show", 0, "00-inicio-900k"), ("cam", 0, "full"),
    ("label", 0.8, "CEDEAR: Certificado de Depósito Argentino"),
    ("cam", 1.5, box("00-inicio-900k", "cuenta-arg"), 1.75),
    ("mark", 2.5, box("00-inicio-900k", "bal-ars")),
    ("label", 7.0, "Representa acciones de una empresa del exterior"),
  ], guide=[
    (0.5, 5.5, "Tenés novecientos mil pesos para practicar."),
    (6.0, 8.0, "Con un CEDEAR comprás, en pesos, una parte de una empresa del exterior."),
  ]),
 dict(id="c1", kind="chapter", dur=3, num=1, title="Leer la ficha y armar la orden"),
 dict(id="s03", kind="screen", name="Buscar el CEDEAR", dur=14, events=[
    ("show", 0, "01-inicio-cotizaciones"), ("cam", 0, "full"),
    ("cam", 0.5, union(box("01-inicio-cotizaciones", "nav-portafolio"), box("01-inicio-cotizaciones", "nav-cotizaciones")), 2.2, 0.9),
    ("click", 1.8, box("01-inicio-cotizaciones", "nav-cotizaciones")),
    ("show", 2.5, "02-mercado"), ("cam", 2.5, "full", None, 0.01),
    ("cam", 3.0, box("02-mercado", "tab-cedears"), 2.2, 0.8),
    ("click", 4.2, box("02-mercado", "tab-cedears")),
    ("show", 4.9, "03-mercado-cedears"),
    ("cam", 5.3, box("03-mercado-cedears", "inst-KO"), 1.25),
    ("mark", 6.0, box("03-mercado-cedears", "inst-KO")),
    ("click", 12.6, box("03-mercado-cedears", "inst-KO")),
  ], guide=[
    (0.5, 5.5, "Entrá a «Cotizaciones», pestaña CEDEARs, y elegí Coca-Cola."),
    (6.0, 8.0, "Es solo un ejemplo: el proceso es igual con cualquiera."),
  ]),
 dict(id="s04", kind="screen", name="El ratio", dur=22, events=[
    ("show", 0, "06-ficha-comprar"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.6, box("06-ficha-comprar", "ficha-datos"), 2.0),
    ("mark", 2.0, box("06-ficha-comprar", "ficha-ratio")),
    ("label", 9.0, "Precio en pesos = precio en dólares ÷ ratio × tipo de cambio"),
    ("mark", 11.0, box("06-ficha-comprar", "ficha-pu")),
    ("mark", 15.0, box("06-ficha-comprar", "ficha-tc")),
    ("cam", 17.5, union(box("06-ficha-comprar", "ficha-head"), box("06-ficha-comprar", "ficha-datos")), 1.4),
    ("label2", 18.0, "US$ 71,20 ÷ 5 × $ 1.480 = $ 21.075,20"),
    ("mark", 18.5, box("06-ficha-comprar", "ficha-precio")),
  ], guide=[
    (0.5, 8.5, "Un CEDEAR no es una acción entera: en Coca-Cola, cinco CEDEARs equivalen a una acción."),
    (9.0, 6.0, "Por eso el precio en pesos es el precio en dólares, dividido por el ratio"),
    (15.0, 7.0, "y multiplicado por el tipo de cambio."),
  ]),
 dict(id="s05", kind="screen", name="Dos precios", dur=16, events=[
    ("show", 0, "05-ficha-puntas"), ("cam", 0, PUNTAS_VIEW, 2.4, 0.01),
    ("mark", 0.8, box("05-ficha-puntas", "puntas-tabla")),
    ("label", 3.0, "A mercado pagás la punta vendedora"),
    ("mark", 3.0, union(box("05-ficha-puntas", "puntas-venta-col"), [649.6, 532.6, 151.8, 214.5])),
    ("show", 8.5, "06-ficha-comprar"), ("cam", 8.5, PRICE_VS_ASK_VIEW, 1.4),
    ("mark", 9.5, box("06-ficha-comprar", "ficha-precio")),
    ("mark", 9.5, box("06-ficha-comprar", "puntas-venta-1")),
  ], guide=[
    (0.5, 2.5, "Hay dos precios."),
    (3.0, 5.5, "Si comprás a mercado, pagás el de venta,"),
    (8.5, 7.5, "un poco más alto que el último operado."),
  ]),
 dict(id="s06", kind="screen", name="La orden", dur=28, events=[
    ("show", 0, "06-ficha-comprar"),
    ("cam", 0, union(box("06-ficha-comprar", "ficha-precio"), box("06-ficha-comprar", "btn-comprar")), 2.2, 0.01),
    ("click", 1.2, box("06-ficha-comprar", "btn-comprar")),
    ("show", 1.9, "07-orden"), ("cam", 1.9, "full", None, 0.01),
    ("cam", 2.4, box("07-orden", "form-comprar"), None, 0.9),
    ("mark", 3.2, union(box("07-orden", "campo-simbolo"), box("07-orden", "campo-simbolo-info"))),
    ("cam", 6.0, box("07-orden", "campo-cantidad"), 2.2),
    ("label", 6.5, "Cantidad o monto"),
    ("mark", 6.5, box("07-orden", "campo-cantidad")),
    ("cam", 12.0, box("07-orden", "campo-modalidad"), 2.2),
    ("label", 12.5, "A mercado o con límite"),
    ("mark", 12.5, box("07-orden", "campo-modalidad")),
    ("mark", 16.5, box("07-orden", "campo-modalidad")),
    ("show", 21.0, "08-orden-montos"), ("cam", 21.0, "full", None, 0.01),
    ("cam", 21.4, box("08-orden-montos", "montos-disponibles"), None, 0.9),
    ("label", 21.8, "Un monto disponible para cada plazo"),
    ("mark", 22.4, box("08-orden-montos", "montos-disponibles")),
  ], guide=[
    (0.5, 5.5, "Hacé clic en «Comprar»: la orden ya trae el símbolo."),
    (6.0, 6.0, "En «cuánto» ponés una cantidad o un monto en pesos."),
    (12.0, 4.0, "A mercado se ejecuta enseguida;"),
    (16.0, 5.0, "con límite elegís vos el precio, pero puede no ejecutarse."),
    (21.0, 7.0, "Y fijate el dinero disponible para cada plazo."),
  ]),
 dict(id="c2", kind="chapter", dur=3, num=2, title="Confirmar y seguir tu inversión"),
 dict(id="s07", kind="screen", name="Los costos", dur=22, events=[
    ("show", 0, "10-orden-enviar"),
    ("cam", 0, box("10-orden-enviar", "btn-comprar-submit"), 2.0, 0.01),
    ("click", 1.0, box("10-orden-enviar", "btn-comprar-submit")),
    ("show", 1.7, "11-confirmacion"), ("cam", 1.7, "full", None, 0.01),
    ("cam", 2.2, COSTS_VIEW, 2.6, 0.8),
    ("mark", 3.2, box("11-confirmacion", "costos-confirmacion")),
    ("label", 4.5, "Comisión · Derechos de mercado · IVA"),
    ("mark", 7.0, box("11-confirmacion", "costos-confirmacion")),
    ("cam", 12.5, box("11-confirmacion", "modal"), 1.3),
    ("label", 12.5, "Confirmar es mandar una orden al mercado"),
    ("click", 18.0, box("11-confirmacion", "confirmar-orden")),
  ], guide=[
    (0.5, 4.0, "Antes de salir, la orden te muestra el detalle:"),
    (4.5, 4.5, "comisión, derechos de mercado e IVA."),
    (9.0, 3.5, "Miralo antes de confirmar."),
    (12.5, 9.5, "Confirmar no es pagar: es mandar la orden al mercado."),
  ]),
 dict(id="s08", kind="screen", name="Boleto y portafolio", dur=22, events=[
    ("show", 0, "12-boleto"), ("cam", 0, "full", None, 0.01),
    ("cam", 0.5, box("12-boleto", "boleto-detalle"), 1.2, 0.9),
    ("cam", 3.0, COST_LINE, 2.4),
    ("label", 3.5, "Costo: $ 1.479,87 · 0,70 %"),
    ("mark", 3.5, COST_LINE),
    ("cam", 8.0, box("12-boleto", "nav-portafolio"), 2.0),
    ("click", 9.2, box("12-boleto", "nav-portafolio")),
    ("show", 9.9, "14-portafolio-ars"), ("cam", 9.9, "full", None, 0.01),
    ("cam", 10.4, union(box("14-portafolio-ars", "stats"), box("14-portafolio-ars", "pos-lista")), 1.25, 0.9),
    ("label", 10.4, "Tu inversión en el portafolio"),
    ("mark", 11.0, box("14-portafolio-ars", "pos-lista")),
    ("cam", 14.0, union(box("14-portafolio-ars", "toggle-moneda"), RESULT_CARD), None, 0.9),
    ("click", 15.2, box("14-portafolio-ars", "toggle-usd")),
    ("show", 15.9, "15-portafolio-usd"),
    ("label", 16.5, "$ -115,91  →  US$ -0,08"),
    ("mark", 16.5, RESULT_CARD),
    ("label", 19.5, "Depende de la acción y del dólar"),
  ], guide=[
    (0.5, 7.5, "El boleto es el comprobante, con lo que te costó operar en plata y en porcentaje."),
    (8.0, 6.0, "En «Portafolio» ves tu inversión."),
    (14.0, 3.5, "Pasá de pesos a dólares:"),
    (17.5, 4.5, "el resultado depende de la acción y del dólar."),
  ]),
 dict(id="s09", kind="takeaways", dur=20),
 dict(id="s10", kind="final", dur=8),
]

TITLE = "Comprar mi primer CEDEAR"
MODS = "MÓDULOS M4 · M5"
VIDEO_N = 2

# ---------------------------------------------------------------- layout
FW, FH = 1520, 855          # caja de la captura en el cuadro
FX, FY = 200, 84            # posición de la caja
BAND_Y = 960                # banda del texto guía

FONTS = """
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-400.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-500.woff2") format("woff2"); font-weight: 500; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-600.woff2") format("woff2"); font-weight: 600; }
@font-face { font-family: "Barlow"; src: url("assets/fonts/barlow-700.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/plexmono-400.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "IBM Plex Mono"; src: url("assets/fonts/plexmono-700.woff2") format("woff2"); font-weight: 700; }
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
          <div id="{cid}-mods">{html.escape(MODS)}</div>
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

IDEAS = ["Un CEDEAR es una parte de una acción: mirá el ratio.",
         "Hay dos precios: a mercado pagás el de venta.",
         "El costo se mira antes de confirmar."]

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
        <div id="{cid}-dots">{''.join(f'<div class="{cid}-dot" id="{cid}-dot-{i}"></div>' for i in range(len(IDEAS)))}</div>"""
    step = (sc["dur"] - 0.8) / len(IDEAS)
    lines = []
    for i in range(len(IDEAS)):
        t0 = 0.8 + i * step
        lines.append(f'          tl.fromTo("#" + ID + "-idea-{i}", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {t0:.2f});')
        lines.append(f'          tl.to("#" + ID + "-dot-{i}", {{ backgroundColor: "{C['violet']}", duration: 0.3 }}, {t0:.2f});')
        if i < len(IDEAS) - 1:
            lines.append(f'          tl.to("#" + ID + "-idea-{i}", {{ opacity: 0, y: -16, duration: 0.45, ease: "power1.in" }}, {t0 + step - 0.6:.2f});')
    idea_tl = "\n".join(lines)
    script = f"""        (function () {{
          const ID = "{cid}";
          const tl = gsap.timeline({{ paused: true }});
          tl.fromTo("#" + ID + "-eyebrow", {{ opacity: 0, y: 12 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 0.2);
{idea_tl}
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

def chapter_scene(sc):
    cid = sc["id"]
    style = f"""
        #{cid}-bg {{ position: absolute; inset: 0; background: {C['indigo']}; }}
        #{cid}-content {{ position: absolute; left: 200px; right: 200px; top: 380px; display: flex;
          flex-direction: column; gap: 32px; }}
        #{cid}-num {{ font-family: "IBM Plex Mono", monospace; font-size: 40px; font-weight: 700;
          letter-spacing: 0.08em; color: {C['yellow']}; }}
        #{cid}-title {{ font-size: 96px; line-height: 1.08; font-weight: 700; color: {C['light']}; }}
        #{cid}-rule {{ width: 160px; height: 6px; background: {C['violet']}; border-radius: 3px; }}
"""
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-content">
          <div id="{cid}-num">CAPÍTULO {sc['num']}</div>
          <div id="{cid}-title">{html.escape(sc['title'])}</div>
          <div id="{cid}-rule"></div>
        </div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const tl = gsap.timeline({{ paused: true }});
          tl.fromTo("#" + ID + "-content", {{ opacity: 0, y: 16 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, 0.15);
          tl.to("#" + ID + "-content", {{ opacity: 0, duration: 0.35, ease: "power1.in" }}, {sc['dur'] - 0.4});
          tl.set({{}}, {{}}, {sc['dur']});
          window.__timelines[ID] = tl;
        }})();"""
    return wrap_sub(cid, style, body, script)

BUILDERS = dict(chapter=chapter_scene, open=open_scene, screen=screen_scene, takeaways=takeaways_scene, final=final_scene)

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
    <title>Video {VIDEO_N} · {html.escape(TITLE)}</title>
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
    write_script(total)
    print(f"ok · {len(SCENES)} escenas · {len(caps)} textos guía · {total:g} s")

def mmss(x):
    return f"{int(x // 60)}:{x % 60:04.1f}"

NAMES = {"open": "Apertura", "chapter": "Placa de capítulo", "takeaways": "Para llevarte", "final": "Placa final"}

def write_script(total):
    out = [f"# Guion de grabación · Video {VIDEO_N} · {TITLE}", "",
           "Cada frase aparece en la banda inferior del video en el momento indicado. Grabá mirando el video;",
           "si tu ritmo es distinto no importa: después transcribo tu grabación y ajusto escenas y subtítulos a tu voz.", ""]
    t = 0.0
    for sc in SCENES:
        name = NAMES.get(sc["kind"]) or sc.get("name", sc["id"])
        if sc["kind"] == "chapter":
            name += f" {sc['num']} · {sc['title']}"
        out.append(f"## {mmss(t)} · {name} ({sc['dur']:g} s)")
        if sc.get("guide"):
            for gt, gd, tx in sc["guide"]:
                out.append(f"- {mmss(t + gt)} – {mmss(t + gt + gd)}  {tx}")
        elif sc["kind"] == "takeaways":
            step = (sc["dur"] - 0.8) / len(IDEAS)
            for i, tx in enumerate(IDEAS):
                out.append(f"- {mmss(t + 0.8 + i * step)} (en pantalla) {tx}")
        else:
            out.append("- Placa sin texto a grabar.")
        out.append("")
        t += sc["dur"]
    out.append(f"Duración total: {mmss(total)}")
    (ROOT / "GUION-GRABACION.md").write_text("\n".join(out) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
