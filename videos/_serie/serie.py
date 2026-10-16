"""Estilo compartido de la serie «Capacitación en el uso de Invertir Online (IOL)».

Cada video tiene su propio tools/build.py con las escenas (SCENES), y llama a
serie.configure(...) y serie.main(SCENES). Todo lo visual vive acá: paleta,
tipografías, placas, cámara (zoom), círculo de clic, recuadros, etiquetas y
la banda inferior de texto guía. Ver _serie/ESTILO.md.
"""
import json, pathlib, html, shutil

ROOT = None
BOX = {}
TITLE = ""
MODULES = ""
IDEAS = []
APP = [288, 16, 1344, 756]   # ventana del simulador dentro de la captura (vista «full»)

C = dict(violet="#6439FF", indigo="#06083F", lavender="#EEEDF8", light="#F7F6FC",
         yellow="#E8B23A", yellowInk="#20160A")

def configure(root, title, modules, ideas):
    """root: carpeta del proyecto; title: nombre del itinerario; modules: p. ej. «M6 · M7»."""
    global ROOT, BOX, TITLE, MODULES, IDEAS
    ROOT = pathlib.Path(root).resolve()
    man = json.loads((ROOT / "assets/captures/manifest.json").read_text(encoding="utf-8"))
    BOX = {s["id"]: s["boxes"] for s in man["shots"]}
    TITLE, MODULES, IDEAS = title, modules, list(ideas)
    fonts = ROOT / "assets/fonts"
    fonts.mkdir(parents=True, exist_ok=True)
    for f in (pathlib.Path(__file__).parent / "fonts").glob("*.woff2"):
        if not (fonts / f.name).exists():
            shutil.copy(f, fonts / f.name)

def box(shot, key):
    b = BOX[shot][key]
    return [b["x"], b["y"], b["width"], b["height"]]

def union(*bs):
    x0 = min(b[0] for b in bs); y0 = min(b[1] for b in bs)
    x1 = max(b[0] + b[2] for b in bs); y1 = max(b[1] + b[3] for b in bs)
    return [x0, y0, x1 - x0, y1 - y0]

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
        .{cid}-card {{ position: absolute; left: {FX + FW - 760}px; top: {FY + 120}px; width: 720px; padding: 30px 32px 24px;
          background: #fff; border-radius: 16px; opacity: 0; z-index: 5;
          box-shadow: 0 18px 50px rgba(6, 8, 63, 0.22), 0 0 0 1px rgba(6, 8, 63, 0.08); }}
        .{cid}-card-t {{ font-family: "IBM Plex Mono", monospace; font-size: 36px; font-weight: 700;
          letter-spacing: 0.06em; color: {C['indigo']}; margin-bottom: 8px; }}
        .{cid}-row {{ display: flex; align-items: center; gap: 18px; margin-top: 12px; padding: 14px 18px;
          border-radius: 12px; border: 3px solid transparent; }}
        .{cid}-dot {{ flex: none; width: 20px; height: 20px; border-radius: 50%; }}
        .{cid}-lbl {{ flex: 1; font-size: 40px; font-weight: 600; }}
        .{cid}-val {{ font-size: 40px; font-weight: 600; color: {C['indigo']}; }}
"""
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-frame">
          <div id="{cid}-cam" data-layout-allow-overflow>
{imgs}
            <div id="{cid}-fx"></div>
          </div>
        </div>
        <div id="{cid}-chips"></div>
        <div id="{cid}-overlay"></div>
        <div id="{cid}-band"></div>"""
    script = f"""        (function () {{
          const ID = "{cid}";
          const CFG = {json.dumps(cfg, ensure_ascii=False)};
          const tl = gsap.timeline({{ paused: true }});
          const cam = document.getElementById(ID + "-cam");
          const fx = document.getElementById(ID + "-fx");
          const chips = document.getElementById(ID + "-chips");
          const overlay = document.getElementById(ID + "-overlay");
          const base = CFG.FW / 1920;
          function frameFor(target, zoom) {{
            if (target === "full") {{ target = {json.dumps(APP)}; zoom = zoom || 1920 / {APP[2]}; }}
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
            }} else if (type === "card") {{
              // recuadro fijo (no sigue a la cámara): {{title, rows: [[etiqueta, valor, color]], hi, tHi}}
              const o = ev[2];
              const card = document.createElement("div");
              card.className = ID + "-card"; card.id = ID + "-card-" + (n++);
              const ttl = document.createElement("div");
              ttl.className = ID + "-card-t"; ttl.textContent = o.title; card.appendChild(ttl);
              const rows = o.rows.map(function (r, i) {{
                const row = document.createElement("div");
                row.className = ID + "-row"; row.id = card.id + "-r" + i;
                const dot = document.createElement("span"); dot.className = ID + "-dot"; dot.style.background = r[2];
                const lb = document.createElement("span"); lb.className = ID + "-lbl"; lb.style.color = r[2]; lb.textContent = r[0];
                const vl = document.createElement("span"); vl.className = ID + "-val"; vl.textContent = r[1];
                row.appendChild(dot); row.appendChild(lb); row.appendChild(vl); card.appendChild(row);
                return row;
              }});
              overlay.appendChild(card);
              tl.fromTo(card, {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }}, t);
              rows.forEach(function (row, i) {{
                tl.fromTo(row, {{ opacity: 0, x: -12 }}, {{ opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }}, t + 0.35 + i * 0.45);
              }});
              if (o.hi !== undefined) {{
                const c = o.rows[o.hi][2];
                tl.to(rows[o.hi], {{ borderColor: c, backgroundColor: c + "14", duration: 0.4, ease: "power1.out" }}, o.tHi);
                rows.forEach(function (row, i) {{ if (i !== o.hi) tl.to(row, {{ opacity: 0.45, duration: 0.4 }}, o.tHi); }});
              }}
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
          <div id="{cid}-mods">{"MÓDULOS" if any(s in MODULES for s in "·→,") else "MÓDULO"} {html.escape(MODULES)}</div>
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
    dots = "".join(f'<div class="{cid}-dot" id="{cid}-dot-{i}"></div>' for i in range(len(IDEAS)))
    body = f"""        <div id="{cid}-bg"></div>
        <div id="{cid}-eyebrow">PARA LLEVARTE</div>
{ideas}
        <div id="{cid}-dots">{dots}</div>"""
    slot = (sc["dur"] - 1.0) / len(IDEAS)
    parts = []
    for i in range(len(IDEAS)):
        t0 = 0.8 + i * slot
        if i > 0:
            parts.append(f'          tl.to("#" + ID + "-idea-{i-1}", {{ opacity: 0, y: -16, duration: 0.45, ease: "power1.in" }}, {t0 - 0.6:.2f});')
        parts.append(f'          tl.fromTo("#" + ID + "-idea-{i}", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {t0:.2f});')
        parts.append(f'          tl.to("#" + ID + "-dot-{i}", {{ backgroundColor: "{C["violet"]}", duration: 0.3 }}, {t0:.2f});')
    idea_tl = "\n".join(parts)
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

BUILDERS = dict(open=open_scene, screen=screen_scene, takeaways=takeaways_scene, final=final_scene)

def main(SCENES, names=None):
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
    <title>{html.escape(TITLE)}</title>
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



def guion(SCENES, names, path, ideas_t=None):
    """Escribe GUION-GRABACION.md: cada frase del texto guía con su tiempo en el video."""
    def mmss(x): return f"{int(x // 60)}:{x % 60:04.1f}"
    out = [f"# Guion de grabación · {TITLE}", "",
           "Cada frase aparece en la banda inferior del video en el momento indicado. Grabá mirando el video;",
           "si tu ritmo es distinto no importa: después se transcribe la grabación y se ajustan escenas y subtítulos a tu voz.", ""]
    t = 0.0
    for sc in SCENES:
        out.append(f"## {mmss(t)} · {names[sc['id']]} ({sc['dur']:g} s)")
        if sc["kind"] == "takeaways":
            slot = (sc["dur"] - 1.0) / len(IDEAS)
            out += [f"- {mmss(t + 0.8 + i * slot)} (en pantalla) {idea}" for i, idea in enumerate(IDEAS)]
        elif sc["kind"] in ("open", "final"):
            out.append("- Placa sin texto a grabar.")
        for gt, gd, tx in sc.get("guide", []):
            out.append(f"- {mmss(t + gt)} – {mmss(t + gt + gd)}  {tx}")
        out.append("")
        t += sc["dur"]
    out.append(f"Duración total: {mmss(t)}")
    pathlib.Path(path).write_text("\n".join(out), encoding="utf-8")
