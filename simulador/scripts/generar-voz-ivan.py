#!/usr/bin/env python3
"""Genera la voz "Iván" de los podcasts a partir de la narración de los videos de capacitación.

Para cada módulo escribe public/podcasts/<clave>-ivan.mp3 y <clave>-ivan.vtt.

- Audio: solo la voz (sin música ni efectos), rearmada en la línea de tiempo del video final.
  Los proyectos de video (../videos/video-N-*/index.html) listan cada clip de voz con su inicio y su
  duración; acá se ubican con ffmpeg (adelay + amix) y se recortan las placas mudas de apertura y cierre.
  Se normaliza a -16 LUFS (igual que los demás podcasts) y se codifica en mp3 mono de 64 kbps.
- Subtítulos: las mismas frases que aparecen en el video (clips "guide"), con sus tiempos reales,
  corridos según el recorte para que queden sincronizados con este mp3.

Uso: python3 scripts/generar-voz-ivan.py [clave ...]   (sin argumentos, genera los cinco módulos)
Requiere ffmpeg y los proyectos de video en la carpeta hermana ../videos (no están en el repositorio).
"""
import html
import json
import pathlib
import re
import subprocess
import sys
import tempfile

RAIZ = pathlib.Path(__file__).resolve().parent.parent
VIDEOS = RAIZ.parent / "videos"
SALIDA = RAIZ / "public" / "podcasts"

# clave del módulo -> carpeta del proyecto de video
MODULOS = {
    "mep": "video-1-ingreso-mep",
    "cedear": "video-2-cedear",
    "on": "video-3-on",
    "venta": "video-4-venta-retiro",
    "completo": "video-5-ciclo-completo",
}

# Clips de voz que en el video no llevan subtítulo (títulos, placas y «Para llevarte», que va en pantalla):
# clave -> [(clip, segundo de la grabación donde empieza, frases)]. Los tiempos de cada frase salen de la
# transcripción de la grabación (audio/transcript.json, Parakeet), alineada con voz.alinear de la serie.
SIN_SUBTITULO = {
    "cedear": [
        ("s01", 1.6, ["Comprar mi primer CEDEAR"]),
        ("c1", 15.6, ["Leer la ficha y armar la orden"]),
        ("c2", 79.6, ["Confirmar y seguir tu inversión"]),
        ("s09", 115.9, ["Así que, para llevarte:", "un CEDEAR es una parte de una acción: mirá el ratio.",
                        "Hay dos precios: a mercado pagás el de venta.", "El costo se mira antes de confirmar."]),
        ("s10", 131.3, ["Ahora hacelo vos."]),
    ],
    "on": [
        ("s01", 0.4, ["Invertir en obligaciones negociables"]),
        ("s09", 111.6, ["Para llevarte:", "En una ON, la cantidad va en VN, no en dólares.",
                        "Tiene que respetar la lámina mínima.", "Sabés de antemano cuánto cobrás y cuándo."]),
    ],
}

MARGEN_ANTES = 0.35   # silencio que se deja antes de la primera palabra
MARGEN_DESPUES = 0.6  # silencio que se deja después de la última
UMBRAL_SILENCIO = "-45dB"
LARGO_MAX_CUE = 90    # caracteres por cue (igual que los .vtt de las otras voces)


def atributos(etiqueta: str) -> dict:
    return {k: html.unescape(v) for k, v in re.findall(r'([\w-]+)="([^"]*)"', etiqueta)}


def leer_proyecto(carpeta: pathlib.Path):
    """Devuelve (clips de voz, frases) del index.html del video, en segundos de su línea de tiempo."""
    index = (carpeta / "index.html").read_text(encoding="utf-8")
    clips = []
    for etq in re.findall(r"<audio\b[^>]*>", index):
        a = atributos(etq)
        if a.get("id", "").startswith("voz"):
            clips.append((carpeta / a["src"], float(a["data-start"]), float(a["data-duration"])))
    frases = []
    for etq, texto in re.findall(r'(<div\b[^>]*class="clip guide[^"]*"[^>]*>)<span\b[^>]*class="guide-tx">(.*?)</span>', index, re.S):
        a = atributos(etq)
        frases.append((float(a["data-start"]), float(a["data-duration"]), html.unescape(texto).strip()))
    frases.sort()
    return clips, frases


def frases_sin_subtitulo(clave, carpeta, clips):
    """Frases de los clips sin subtítulo, ubicadas en la línea de tiempo del video con la transcripción de la grabación."""
    extra = SIN_SUBTITULO.get(clave)
    if not extra:
        return []
    sys.path.insert(0, str(VIDEOS / "_serie"))
    import voz as voz_serie  # alinear(): frases del guion contra palabras transcriptas
    palabras = json.loads((carpeta / "audio/transcript.json").read_text(encoding="utf-8"))
    inicio_clip = {ruta.stem: ini for ruta, ini, _ in clips}
    out = []
    for clip, a0, frases in extra:
        dur = next(d for r, _, d in clips if r.stem == clip)
        validas = [w for w in palabras if a0 - 0.1 <= w["start"] <= a0 + dur + 0.3]
        tiempos = voz_serie.alinear(validas, frases)
        for i, (f, (a, _)) in enumerate(zip(frases, tiempos)):
            fin = tiempos[i + 1][0] if i + 1 < len(frases) else a0 + dur
            ini_v = inicio_clip[clip] + a - a0
            out.append((ini_v, max(fin - a, 0.5), f))
    return out


def partir_largos(frases):
    """Parte en dos los textos muy largos, repartiendo el tiempo según los caracteres."""
    out = []
    for ini, dur, texto in frases:
        if len(texto) <= LARGO_MAX_CUE:
            out.append((ini, dur, texto)); continue
        palabras = texto.split()
        acum, corte = 0, len(palabras) // 2
        for i, w in enumerate(palabras):
            acum += len(w) + 1
            if acum >= len(texto) / 2:
                corte = i + 1; break
        a, b = " ".join(palabras[:corte]), " ".join(palabras[corte:])
        d1 = dur * len(a) / (len(a) + len(b))
        out += [(ini, d1, a), (ini + d1, dur - d1, b)]
    return out


def mezclar(clips, destino: pathlib.Path):
    """Ubica cada clip de voz en su instante del video y lo deja en un WAV mono de 48 kHz."""
    cmd = ["ffmpeg", "-loglevel", "error", "-y"]
    for ruta, _, _ in clips:
        cmd += ["-i", str(ruta)]
    cadenas = []
    for i, (_, ini, dur) in enumerate(clips):
        ms = round(ini * 1000)
        cadenas.append(f"[{i}]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=mono,adelay={ms}[v{i}]")
    entradas = "".join(f"[v{i}]" for i in range(len(clips)))
    if len(clips) == 1:
        cadenas.append(f"{entradas}anull[out]")
    else:
        cadenas.append(f"{entradas}amix=inputs={len(clips)}:normalize=0:duration=longest[out]")
    cmd += ["-filter_complex", ";".join(cadenas), "-map", "[out]", "-ar", "48000", "-ac", "1", str(destino)]
    subprocess.run(cmd, check=True)


def limites_de_voz(wav: pathlib.Path):
    """Instante de la primera y de la última palabra, detectado con silencedetect."""
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(wav), "-af", f"silencedetect=n={UMBRAL_SILENCIO}:d=0.5",
                        "-f", "null", "-"], capture_output=True, text=True, check=True)
    total = duracion(wav)
    inicios = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    fines = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    primera = fines[0] if inicios and inicios[0] < 0.05 and fines else 0.0
    ultima = inicios[-1] if inicios and (len(fines) < len(inicios) or (fines and fines[-1] < inicios[-1])) else total
    return primera, ultima


def duracion(ruta: pathlib.Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ruta)],
                       capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def mmss(s: float) -> str:
    t = round(s)
    return f"{t // 60}:{t % 60:02d}"


def marca(s: float) -> str:
    ms = round(s * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d}.{ms % 1000:03d}"


def escribir_vtt(frases, desde: float, hasta: float, destino: pathlib.Path):
    """Cues con los tiempos del video corridos al recorte; una línea por frase."""
    cues = []
    for ini, dur, texto in frases:
        a, b = max(ini - desde, 0.0), min(ini + dur - desde, hasta - desde)
        if b - a < 0.2:
            continue  # frase fuera del recorte (placas mudas)
        cues.append([a, b, texto])
    for i in range(len(cues) - 1):  # sin superposición entre cues contiguos
        cues[i][1] = min(cues[i][1], cues[i + 1][0])
    bloques = ["WEBVTT"]
    for a, b, texto in cues:
        if len(texto) > LARGO_MAX_CUE:
            print(f"  aviso: cue largo ({len(texto)} caracteres): {texto[:50]}…")
        bloques.append(f"{marca(a)} --> {marca(b)}\n{texto}")
    destino.write_text("\n\n".join(bloques) + "\n", encoding="utf-8")
    return len(cues)


def generar(clave: str):
    carpeta = VIDEOS / MODULOS[clave]
    clips, frases = leer_proyecto(carpeta)
    frases = partir_largos(sorted(frases + frases_sin_subtitulo(clave, carpeta, clips)))
    if not clips:
        sys.exit(f"{clave}: el proyecto no tiene clips de voz")
    with tempfile.TemporaryDirectory() as tmp:
        completo = pathlib.Path(tmp) / "voz.wav"
        mezclar(clips, completo)
        primera, ultima = limites_de_voz(completo)
        desde = max(primera - MARGEN_ANTES, 0.0)
        hasta = min(ultima + MARGEN_DESPUES, duracion(completo))
        mp3 = SALIDA / f"{clave}-ivan.mp3"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{desde:.3f}", "-t", f"{hasta - desde:.3f}", "-i", str(completo),
                        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", "-b:a", "64k", str(mp3)], check=True)
    n = escribir_vtt(frases, desde, hasta, SALIDA / f"{clave}-ivan.vtt")
    d = duracion(mp3)
    print(f"{clave}: voz {primera:.2f}-{ultima:.2f} s, recorte {desde:.2f}-{hasta:.2f} s, mp3 {d:.2f} s ({mmss(d)}), {n} cues")
    return d


if __name__ == "__main__":
    claves = sys.argv[1:] or list(MODULOS)
    SALIDA.mkdir(parents=True, exist_ok=True)
    duraciones = {c: generar(c) for c in claves}
    print(json.dumps({c: mmss(d) for c, d in duraciones.items()}))
