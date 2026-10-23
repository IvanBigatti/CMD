"""Genera los podcasts de cada capacitación con voces neuronales de edge-tts (gratis, sin API key).

Lee podcasts/guiones/<clave>.txt (un párrafo por bloque, separados por una línea en blanco) y escribe
public/podcasts/<clave>-<voz>.mp3 para cada voz. Los nombres los usa src/contenido/podcasts.ts.

Uso:   npm run podcasts               (todas las capacitaciones)
       npm run podcasts -- mep on     (solo algunas)
Requiere ffmpeg y el entorno de .venv-podcasts (ver README).
"""
import asyncio, pathlib, subprocess, sys, tempfile

import edge_tts

RAIZ = pathlib.Path(__file__).resolve().parent.parent
GUIONES = RAIZ / "podcasts" / "guiones"
SALIDA = RAIZ / "public" / "podcasts"

# Voces argentinas de edge-tts → sufijo del archivo
VOCES = {"elena": "es-AR-ElenaNeural", "tomas": "es-AR-TomasNeural"}
# Un poco más lento que lo normal: el público son personas de 45 a 65 años que recién empiezan
VELOCIDAD = "-8%"
PAUSA_ENTRE_PARRAFOS = 0.7  # segundos


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)


def duracion(archivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(archivo)],
                       check=True, capture_output=True, text=True)
    return float(r.stdout)


async def generar(clave, voz, tmp):
    parrafos = [p.strip() for p in (GUIONES / f"{clave}.txt").read_text(encoding="utf-8").split("\n\n") if p.strip()]
    partes = []
    for i, texto in enumerate(parrafos):
        mp3 = tmp / f"{clave}-{voz}-{i:02}.mp3"
        await edge_tts.Communicate(texto, VOCES[voz], rate=VELOCIDAD).save(str(mp3))
        # El concat de ffmpeg exige que todas las partes tengan el mismo formato: todo a WAV 24 kHz mono
        wav = mp3.with_suffix(".wav")
        ffmpeg("-i", str(mp3), "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", str(wav))
        partes.append(wav)

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
