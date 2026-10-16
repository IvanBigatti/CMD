"""Recorre de punta a punta el itinerario «Ciclo completo de una inversión», en una sola pasada.
Guarda una captura antes de cada acción de la guía (NN-a-...) y otra después de las acciones
que cambian la pantalla, más los saldos reales en cada momento (manifest.json → saldo, saldo_tx).
Uso: python tools/capture.py <InvertOnlineSandBox.html> assets/captures
"""
import sys, pathlib, re, unicodedata
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "_serie"))
from captura import Captura

WATCH = {
    "origen-msg": "#origenMsg .alert",
    "ret-msg": "#retMsg .alert",
    "v-msg": "#vMsg .alert",
    "c-msg": "#cMsg .alert",
    "bal-ars": "#balArs",
    "bal-usd": "#balUsd",
    "saldos": "#saldosBox",
    "ret-saldos": "#retSaldos",
    "patas-ops": "#mepPatas .kv",
    "md-close": "#mdClose",
    "port-usd": '#s-portafolio [data-mon="USD"]',
    "mov-tabla": "#mvBox",
}

def slug(t):
    t = unicodedata.normalize("NFKD", t or "").encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")[:28]

with Captura(sys.argv[1], sys.argv[2], WATCH, all_tour=True) as c:
    p = c.page
    c.click("#btnIniciar")
    c.click('[data-track="completo"]')
    n = p.evaluate("T.tour.steps.length")
    while True:
        st = p.evaluate("T.active ? {i:T.i, title:T.tour.steps[T.i].title, target:T.tour.steps[T.i].target, act:T.tour.steps[T.i].act} : null")
        if not st:
            break
        i, target, act = st["i"], st["target"], st["act"]
        name = f"{i:02d}-a-{slug(st['title'])}"
        c.shot(name, f"Paso {i+1} de {n}: {st['title']} (antes)")
        modal_open = p.evaluate("!document.querySelector('#modal').hidden")
        in_modal = bool(target) and p.evaluate(f"!!(document.querySelector('{target}') && document.querySelector('{target}').closest('.veil'))")
        if modal_open and not in_modal:
            c.click("#mdClose")
            c.shot(f"{i:02d}-b-sin-modal", f"Paso {i+1}: pantalla al cerrar el aviso")
        if act == "click":
            if target == '[data-tour="origen-tercero"]':
                c.click(target)
                c.shot(f"{i:02d}-c-tercero", "Cuenta de otra persona elegida (aviso)")
                c.click('[data-tour="confirmar-ingreso"]')
                c.shot(f"{i:02d}-d-rechazo", "Transferencia rechazada")
                continue
            if target == '[data-tour="detalle-saldos"]':
                c.click(target + " summary")
                p.evaluate("() => { const d=document.querySelector('#accSaldos'); d.open = true; d.scrollIntoView({block:'center'}); }")
                c.shot(f"{i:02d}-c-detalle-abierto", "Detalle de saldos abierto")
                continue
            c.click(target, 700)
            c.shot(f"{i:02d}-c-despues", f"Paso {i+1}: después del clic")
        else:
            if target == '[data-tour="campo-simbolo-venta"]':
                p.locator("#vSimbolo").select_option("KO")
                p.wait_for_timeout(400)
                c.shot(f"{i:02d}-c-ko-elegido", "Vender: KO elegido en la lista")
            if target == '[data-tour="toggle-moneda"]':
                c.click('#s-portafolio [data-mon="USD"]')
                c.shot(f"{i:02d}-c-en-dolares", "Portafolio en dólares")
                c.click('#s-portafolio [data-mon="ARS"]')
            if target == '[data-tour="monto-retiro"]' and p.evaluate("ST.dia") > 0:
                c.click('#retMon [data-mon="ARS"]')
                c.shot(f"{i:02d}-c-retiro-limpio", "Retirar: pestaña Pesos, sin el mensaje anterior")
            if target is None and p.evaluate("ST.pantalla") == "movimientos":
                c.shot(f"{i:02d}-c-movimientos-completo", "Movimientos, página completa", full_page=True)
            c.next()
    c.shot("99-fin", "Fin de la guía")
