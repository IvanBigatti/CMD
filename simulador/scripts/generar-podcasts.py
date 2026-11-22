"""Genera los podcasts de cada capacitación con voces neuronales de edge-tts (gratis, sin API key).

Lee podcasts/guiones/<clave>.txt (un párrafo por bloque, separados por una línea en blanco) y escribe
public/podcasts/<clave>-<voz>.mp3 para cada voz. Los nombres los usa src/contenido/podcasts.ts.
Junto a cada mp3 escribe <clave>-<voz>.vtt: los subtítulos sincronizados (WebVTT) que muestra el reproductor.
Los tiempos salen de los eventos SentenceBoundary de edge-tts, desplazados por la duración real de cada párrafo
y de las pausas, así coinciden con el mp3 final.

Uso:   npm run podcasts               (todas las capacitaciones)
       npm run podcasts -- mep on     (solo algunas)
Requiere ffmpeg y el entorno de .venv-podcasts (ver README).
"""
import asyncio, pathlib, re, subprocess, sys, tempfile

import edge_tts

RAIZ = pathlib.Path(__file__).resolve().parent.parent
GUIONES = RAIZ / "podcasts" / "guiones"
SALIDA = RAIZ / "public" / "podcasts"

# Voces argentinas de edge-tts → sufijo del archivo
VOCES = {"elena": "es-AR-ElenaNeural", "tomas": "es-AR-TomasNeural"}
# Un poco más lento que lo normal: el público son personas de 45 a 65 años que recién empiezan
VELOCIDAD = "-8%"
PAUSA_ENTRE_PARRAFOS = 0.7  # segundos
# Subtítulos: cada cue entra en ~2 líneas y dura al menos un poco más de un segundo
CUE_MAX_CARACTERES = 90
CUE_MIN_SEGUNDOS = 1.2


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


def duracion(archivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(archivo)],
                       check=True, capture_output=True, text=True)
    return float(r.stdout)


def partir_oracion(texto):
    """Parte una oración larga en tramos de hasta CUE_MAX_CARACTERES, cortando en comas, punto y coma o dos puntos."""
    piezas = re.findall(r"[^,;:]+[,;:]?\s*", texto) or [texto]
    tramos = []
    for pieza in piezas:
        if tramos and (len(tramos[-1]) + len(pieza) <= CUE_MAX_CARACTERES or len(tramos[-1]) < 25):
            tramos[-1] += pieza
        else:
            tramos.append(pieza)
    # Un tramo todavía largo se corta por el espacio más cercano a la mitad (sin partir palabras)
    final = []
    pendientes = tramos[:]
    while pendientes:
        t = pendientes.pop(0).strip()
        if len(t) <= CUE_MAX_CARACTERES:
            final.append(t)
            continue
        medio = len(t) // 2
        corte = min((m.start() for m in re.finditer(r"\s", t)), key=lambda i: abs(i - medio))
        pendientes[0:0] = [t[:corte], t[corte:]]
    return [t for t in final if t]


def cues_de_oracion(texto, ini, fin):
    """Reparte el tiempo de una oración entre sus tramos según los caracteres de cada uno."""
    tramos = partir_oracion(" ".join(texto.split()))
    total = sum(len(t) for t in tramos)
    cues, t0 = [], ini
    for t in tramos:
        t1 = t0 + (fin - ini) * len(t) / total
        cues.append([t0, t1, t])
        t0 = t1
    return cues


def juntar_cortos(cues):
    """Une al vecino los cues que duran menos de CUE_MIN_SEGUNDOS, mientras el texto entre en el máximo."""
    out = []
    for c in cues:
        if out and (c[1] - c[0] < CUE_MIN_SEGUNDOS or out[-1][1] - out[-1][0] < CUE_MIN_SEGUNDOS) \
                and len(out[-1][2]) + 1 + len(c[2]) <= CUE_MAX_CARACTERES:
            out[-1][1] = c[1]
            out[-1][2] += " " + c[2]
        else:
            out.append(c)
    return out


def marca(seg):
    ms = int(round(seg * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}"


def escribir_vtt(cues, destino):
    # Cada cue termina antes de que empiece el siguiente, así nunca se superponen
    for a, b in zip(cues, cues[1:]):
        a[1] = min(a[1], b[0])
    bloques = [f"{marca(a)} --> {marca(b)}\n{t}" for a, b, t in cues if b > a]
    destino.write_text("WEBVTT\n\n" + "\n\n".join(bloques) + "\n", encoding="utf-8")


async def sintetizar(texto, voz, mp3):
    """Guarda el audio del párrafo y devuelve sus oraciones como (inicio, fin, texto) en segundos."""
    oraciones = []
    with open(mp3, "wb") as f:
        async for ev in edge_tts.Communicate(texto, VOCES[voz], rate=VELOCIDAD, boundary="SentenceBoundary").stream():
            if ev["type"] == "audio":
                f.write(ev["data"])
            elif ev["type"] == "SentenceBoundary":
                ini = ev["offset"] / 1e7
                oraciones.append((ini, ini + ev["duration"] / 1e7, ev["text"]))
    return oraciones


async def generar(clave, voz, tmp):
    parrafos = [p.strip() for p in (GUIONES / f"{clave}.txt").read_text(encoding="utf-8").split("\n\n") if p.strip()]
    partes, cues, desplazo = [], [], 0.0
    for i, texto in enumerate(parrafos):
        mp3 = tmp / f"{clave}-{voz}-{i:02}.mp3"
        oraciones = await sintetizar(texto, voz, mp3)
        # El concat de ffmpeg exige que todas las partes tengan el mismo formato: todo a WAV 24 kHz mono
        wav = mp3.with_suffix(".wav")
        ffmpeg("-i", str(mp3), "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(wav))
        partes.append(wav)
        for ini, fin, t in oraciones:
            cues += cues_de_oracion(t, desplazo + ini, desplazo + fin)
        desplazo += duracion(wav) + PAUSA_ENTRE_PARRAFOS

    # Une los párrafos con silencio entre medio, normaliza el volumen y exporta en mono
    silencio = tmp / "silencio.wav"
    ffmpeg("-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", str(PAUSA_ENTRE_PARRAFOS), "-c:a", "pcm_s16le", str(silencio))
    lista = tmp / f"{clave}-{voz}.txt"
    intercalado = [p for parte in partes for p in (parte, silencio)][:-1]
    lista.write_text("".join(f"file '{p}'\n" for p in intercalado), encoding="utf-8")
    destino = SALIDA / f"{clave}-{voz}.mp3"
    ffmpeg("-f", "concat", "-safe", "0", "-i", str(lista),
           "-af", "aresample=24000,loudnorm=I=-16:TP=-1.5:LRA=11", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k",
           str(destino))
    escribir_vtt(juntar_cortos(cues), destino.with_suffix(".vtt"))
    return destino


async def main(claves):
    SALIDA.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        for clave in claves:
            for voz in VOCES:
                destino = await generar(clave, voz, pathlib.Path(t))
                seg = duracion(destino)
                print(f"{destino.relative_to(RAIZ)}  {int(seg // 60)}:{int(seg % 60):02}")


if __name__ == "__main__":
    todas = sorted(p.stem for p in GUIONES.glob("*.txt"))
    pedidas = sys.argv[1:] or todas
    faltan = [c for c in pedidas if c not in todas]
    if faltan:
        sys.exit(f"No hay guion para: {', '.join(faltan)}")
    asyncio.run(main(pedidas))
