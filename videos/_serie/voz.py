"""Voz del usuario para la serie: alinear las frases del guion con la grabación y preparar los audios.

Flujo por video (ver ESTILO.md, «Voz»):
  1. Las grabaciones están en <video>/Audios/ (uno o varios archivos).
  2. `transcribir(...)` → voz/<parte>.json con palabras y tiempos (Parakeet local).
  3. `alinear(palabras, frases)` → (inicio, fin) de cada frase del subtítulo en la grabación.
     Se alinea por palabras con tolerancia, así un error del transcriptor («Dólar Map») no rompe la búsqueda.
  4. `cortar(...)` → un WAV normalizado por escena, que el build coloca como clip de voz.
"""
import json, re, subprocess, unicodedata, difflib, pathlib

def _norm(t):
    t = unicodedata.normalize("NFKD", t.lower()).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]", "", t)

def tokens(texto):
    return [t for t in (_norm(w) for w in re.split(r"[\s/]+", texto)) if t]

def preparar(origen, wav):
    """Convierte la grabación a WAV 48 kHz mono, con el volumen normalizado (−16 LUFS, pico −1.5 dB)."""
    wav = pathlib.Path(wav); wav.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(origen),
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", str(wav)], check=True)
    return wav

def transcribir(wav, salida):
    """Transcribe con Parakeet (local) y guarda la lista plana de palabras en `salida`."""
    wav, salida = pathlib.Path(wav), pathlib.Path(salida)
    tmp = salida.parent / (salida.stem + "-tmp")
    tmp.mkdir(parents=True, exist_ok=True)
    subprocess.run(f'npx hyperframes transcribe "{wav}" --dir "{tmp}" --engine parakeet --language es',
                   shell=True, check=True, capture_output=True)
    words = json.loads((tmp / "transcript.json").read_text(encoding="utf-8"))
    if isinstance(words, dict):
        words = words.get("words", words)
    salida.write_text(json.dumps(words, ensure_ascii=False, indent=0), encoding="utf-8")
    return words

def alinear(palabras, frases):
    """Devuelve [(inicio, fin)] para cada frase, en segundos de la grabación."""
    wt = [_norm(w["text"]) for w in palabras]
    ft, owner = [], []
    for i, f in enumerate(frases):
        for t in tokens(f):
            ft.append(t); owner.append(i)
    sm = difflib.SequenceMatcher(None, ft, wt, autojunk=False)
    mapa = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            mapa[a + k] = b + k
    res = []
    for i in range(len(frases)):
        idx = [k for k, o in enumerate(owner) if o == i]
        matched = [k for k in idx if k in mapa]
        if not matched:
            res.append(None); continue
        # extender a las palabras de la frase que el transcriptor no reconoció al principio o al final
        j0 = max(0, mapa[matched[0]] - (matched[0] - idx[0]))
        j1 = min(len(palabras) - 1, mapa[matched[-1]] + (idx[-1] - matched[-1]))
        res.append((palabras[j0]["start"], palabras[j1]["end"]))
    # completar huecos y evitar solapes
    for i, r in enumerate(res):
        if r is None:
            prev = res[i - 1][1] if i else 0.0
            nxt = next((x[0] for x in res[i + 1:] if x), prev + 2.0)
            res[i] = (prev, nxt)
    for i in range(1, len(res)):
        if res[i][0] < res[i - 1][1]:
            res[i] = (res[i - 1][1], max(res[i][1], res[i - 1][1] + 0.3))
    return res

def cortar(wav, ini, fin, salida, fade=0.03):
    """Recorta [ini, fin] de `wav` con fundidos cortos para que no haya chasquidos."""
    dur = fin - ini
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{ini:.3f}", "-t", f"{dur:.3f}", "-i", str(wav),
                    "-af", f"afade=t=in:d={fade},afade=t=out:st={max(0, dur - fade):.3f}:d={fade}",
                    "-ar", "48000", "-ac", "1", str(salida)], check=True)
    return salida


def cortar_tramo(wav, ini, fin, salida, quitar=(), fade=0.012):
    """Como `cortar`, pero saca los intervalos de `quitar` (tropiezos), empalmando en microsilencios."""
    if not quitar:
        return cortar(wav, ini, fin, salida)
    piezas, a = [], ini
    for x, y in sorted(quitar):
        piezas.append((a, x)); a = y
    piezas.append((a, fin))
    f = []
    for k, (p, q) in enumerate(piezas):
        d = q - p
        f.append(f"[0]atrim={p:.3f}:{q:.3f},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:d={fade},afade=t=out:st={max(0, d - fade):.3f}:d={fade}[p{k}]")
    f.append("".join(f"[p{k}]" for k in range(len(piezas))) + f"concat=n={len(piezas)}:v=0:a=1[out]")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(wav), "-filter_complex", ";".join(f),
                    "-map", "[out]", "-ar", "48000", "-ac", "1", str(salida)], check=True)
    return salida


class Narracion:
    """La voz del usuario aplicada a las escenas de un video.

    cfg[sid] = dict(parte=n, tramo=(ini, fin), antes=s, despues=s, frases=[...], quitar=[(x, y)], dur=None)
      - tramo: segundos de la grabación que van en esa escena (cortados en silencios reales)
      - antes/despues: margen de la escena antes de que arranque la voz y después de que termine
      - frases: subtítulos (el guion corregido); se alinean con la transcripción
      - quitar: tropiezos a recortar dentro del tramo
      - dur: duración fija de la escena (si no, antes + voz + después, con un mínimo de `min`)
    """

    def __init__(self, root, cfg, transcript="voz/tmp{n}/transcript.json", wav="voz/parte{n}.wav"):
        self.root = pathlib.Path(root)
        self.cfg = cfg
        partes = {c["parte"] for c in cfg.values()}
        self.wav = {n: self.root / wav.format(n=n) for n in partes}
        self.palabras = {n: json.loads((self.root / transcript.format(n=n)).read_text(encoding="utf-8")) for n in partes}
        self.T = {sid: self._tiempos(sid) for sid in cfg}

    def _menos_quitado(self, sid, t):
        return sum(y - x for x, y in self.cfg[sid].get("quitar", ()) if y <= t)

    def _tiempos(self, sid):
        c = self.cfg[sid]
        a, b = c["tramo"]
        # solo las palabras de este tramo: evita que una frase repetida en otra toma se alinee ahí
        palabras = [w for w in self.palabras[c["parte"]] if a - 0.5 <= w["start"] <= b + 0.5]
        al = alinear(palabras, [f.replace("AL30", "AL 30") for f in c["frases"]])
        voz_len = (b - a) - self._menos_quitado(sid, b + 1)
        dur = round(c.get("dur") or max(c.get("min", 0), c["antes"] + voz_len + c["despues"]), 2)
        P = [round(max(c["antes"], c["antes"] + (s - a) - self._menos_quitado(sid, s)), 2) for s, _ in al]
        guide = [(P[i], round((P[i + 1] if i + 1 < len(P) else dur - 0.15) - P[i], 2), f)
                 for i, f in enumerate(c["frases"])]
        return dur, P, guide, voz_len

    def P(self, sid, i, dt=0.0):
        """Momento (en segundos desde el inicio de la escena) en que arranca la frase i."""
        return round(self.T[sid][1][i] + dt, 2)

    def escena(self, sid, kind="screen", events=None, **kw):
        dur, _, guide, _ = self.T[sid]
        d = dict(id=sid, kind=kind, dur=dur, guide=guide, **kw)
        if events is not None:
            d["events"] = events
        return d

    def audios(self, SCENES):
        """Corta un WAV por escena y devuelve los clips de la pista de voz."""
        clips, t = [], 0.0
        for sc in SCENES:
            c = self.cfg.get(sc["id"])
            if c:
                a, b = c["tramo"]
                out = self.root / f"voz/{sc['id']}.wav"
                cortar_tramo(self.wav[c["parte"]], a, b, out, c.get("quitar", ()))
                clips.append((f"voz-{sc['id']}", f"voz/{sc['id']}.wav", t + c["antes"], self.T[sc["id"]][3]))
            t += sc["dur"]
        return clips


def musica(SCENES, src="musica/fondo.wav", apertura=0.5, bajo_voz=0.3, voz_desde=None):
    """Envolvente de la música de fondo: más presente en la apertura (sin voz), baja debajo de la voz."""
    total = round(sum(sc["dur"] for sc in SCENES), 3)
    t1 = voz_desde if voz_desde is not None else SCENES[0]["dur"] + 0.6
    return dict(src=src, dur=total, points=[(0, apertura), (t1 - 1.6, apertura), (t1, bajo_voz), (total, bajo_voz)])


def preparar_musica(origen, salida, dur, ini=0.35, fin_util=150.0, cruce=5.0):
    """Recorta la pista a la duración del video, la normaliza (−16 LUFS) y le pone fundidos.
    Si el video es más largo que la parte útil de la pista (`ini`–`fin_util`, antes de su propio
    final), la repite empalmando las copias con un fundido cruzado de `cruce` segundos."""
    util = fin_util - ini
    copias = 1
    while copias * util - (copias - 1) * cruce < dur:
        copias += 1
    entradas = sum((["-ss", str(ini), "-t", f"{util:.3f}", "-i", str(origen)] for _ in range(copias)), [])
    if copias == 1:
        cadena = "[0]anull[m]"
    else:
        cadena, prev = "", "[0]"
        for k in range(1, copias):
            out = "[m]" if k == copias - 1 else f"[x{k}]"
            cadena += f"{prev}[{k}]acrossfade=d={cruce}:c1=tri:c2=tri{out};"
            prev = out
        cadena = cadena.rstrip(";")
    filtro = (cadena + f";[m]atrim=0:{dur:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,"
              f"afade=t=in:d=1.5,afade=t=out:st={dur - 3.5:.3f}:d=3.5[out]")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *entradas, "-filter_complex", filtro,
                    "-map", "[out]", "-ar", "48000", "-ac", "2", str(salida)], check=True)


def carve(index_html, clips, core_dir):
    """«Carve» de la música: le abre lugar a la voz (hyperframes-audio)."""
    script = pathlib.Path.home() / ".claude/skills/hyperframes-audio/scripts/carve.mjs"
    if not script.exists():  # skills installed in the repo (npx skills add) instead of the user folder
        script = pathlib.Path(__file__).resolve().parents[2] / ".agents/skills/hyperframes-audio/scripts/carve.mjs"
    voces = sum((["--voice", c[0]] for c in clips), [])
    subprocess.run(["node", str(script), "--comp", str(index_html), "--core", str(core_dir), "--bed", "musica", *voces],
                   check=True)


def pista_unica(root, clips, total, salida="voz/pista.wav"):
    """Une los clips de voz en una sola pista continua (cada uno en su lugar exacto).
    Con muchos clips sueltos, la mezcla del render baja el volumen general (lo reparte entre
    todas las pistas); con una sola pista de voz + la música, el nivel queda igual en toda la serie."""
    root = pathlib.Path(root)
    entradas, filtros = [], []
    for k, (_, src, start, _) in enumerate(clips):
        entradas += ["-i", str(root / src)]
        ms = int(round(start * 1000))
        filtros.append(f"[{k}]adelay={ms}|{ms}[d{k}]")
    filtros.append("".join(f"[d{k}]" for k in range(len(clips))) +
                   f"amix=inputs={len(clips)}:normalize=0:dropout_transition=0,apad,atrim=0:{total:.3f}[out]")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *entradas, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-ar", "48000", "-ac", "1", str(root / salida)], check=True)
    return [("voz", salida, 0.0, round(total, 3))]
