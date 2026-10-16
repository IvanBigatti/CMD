"""Recorre el itinerario «Ingresar dinero y comprar dólar MEP» del simulador
y guarda una captura por pantalla + las cajas (en px de 1920x1080) de cada
elemento relevante, en assets/captures/manifest.json.

Uso: python tools/capture.py <ruta a InvertOnlineSandBox.html> <carpeta salida>
"""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

SIM = pathlib.Path(sys.argv[1]).resolve()
OUT = pathlib.Path(sys.argv[2]).resolve()
OUT.mkdir(parents=True, exist_ok=True)

# Elementos cuyas cajas se registran en cada captura (si están visibles).
WATCH = {
    "qa-ingresar": '[data-tour="qa-ingresar"]',
    "qa-mep": '[data-tour="qa-mep"]',
    "nav-operar": '[data-tour="nav-operar"]',
    "origen-list": '[data-tour="origen-list"]',
    "origen-tercero": '[data-tour="origen-tercero"]',
    "origen-propia": '[data-tour="origen-propia"]',
    "origen-msg": '#origenMsg .alert',
    "alias": '#s-ingresar .card > div:first-child',
    "monto-ingreso": '[data-tour="monto-ingreso"]',
    "confirmar-ingreso": '[data-tour="confirmar-ingreso"]',
    "mep-tc": '[data-tour="mep-tc"]',
    "mep-monto": '[data-tour="mep-monto"]',
    "mep-min": '#mepMin',
    "mep-verpordentro": '[data-tour="mep-verpordentro"]',
    "mep-patas": '[data-tour="mep-patas"]',
    "mep-patas-ops": '#mepPatas .kv',
    "mep-confirmar": '[data-tour="mep-confirmar"]',
    "modal": '#modal .sheet',
    "splash": '#splash .sheet',
    "cuenta-arg": '[data-tour="cuenta-arg"]',
    "bal-ars": '#balArs',
    "bal-usd": '#balUsd',
    "acc-saldos": '#accSaldos',
    "saldos": '#saldosBox',
    "menu-mep": '.dd-menu >> text=Compra Dólar MEP Simple',
    "patas-op1": '#mepPatas .kv .r:nth-child(2)',
    "patas-op2": '#mepPatas .kv .r:nth-child(3)',
    "patas-ci": '#mepPatas .kv .r:nth-child(4)',
    "modal-p": '#mdBody p',
    "qa-mep-card": '#s-inicio .card:has([data-tour="qa-mep"])',
}

shots = []

def boxes(page):
    out = {}
    for k, sel in WATCH.items():
        loc = page.locator(sel)
        if loc.count() == 0:
            continue
        el = loc.first
        if not el.is_visible():
            continue
        b = el.bounding_box()
        if b and b["width"] > 0 and b["height"] > 0:
            out[k] = {kk: round(v, 1) for kk, v in b.items()}
    return out

def shot(page, name, note=""):
    page.wait_for_timeout(900)  # deja terminar scroll suave y transiciones
    page.add_style_tag(content="#tip,#ring{visibility:hidden!important}")
    path = OUT / f"{name}.png"
    page.screenshot(path=str(path))
    # Saldos visibles en el estado de cuenta (para no inventar cifras)
    text = page.evaluate("() => document.querySelector('main') ? document.querySelector('main').innerText.slice(0, 1500) : ''")
    tour = page.evaluate("() => (typeof T!=='undefined' && T.tour) ? {i:T.i, n:T.tour.steps.length, title: (T.tour.steps[T.i]||{}).title} : null")
    shots.append({"id": name, "file": f"{name}.png", "note": note, "tour": tour,
                  "boxes": boxes(page), "text": text})
    page.add_style_tag(content="#tip,#ring{visibility:visible!important}")
    print("shot", name, tour)

def click(page, sel):
    page.locator(sel).first.click()
    page.wait_for_timeout(450)

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge")
    page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
    page.goto(SIM.as_uri())
    page.wait_for_timeout(800)
    shot(page, "00-bienvenida", "Cartel inicial")
    click(page, "#btnIniciar")
    shot(page, "01-itinerarios", "Selector de itinerarios")
    click(page, '[data-track="mep"]')
    shot(page, "02-inicio-cero", "Estado de cuenta en cero (paso 1, info)")
    click(page, "#tipNext")
    shot(page, "03-inicio-ingresar", "Paso: clic en Ingresar dinero")
    click(page, '[data-tour="qa-ingresar"]')
    shot(page, "04-ingresar", "Pantalla Ingresar dinero: alias y cuentas de origen")
    click(page, "#tipNext")
    click(page, '[data-tour="origen-tercero"]')
    shot(page, "05-tercero-elegida", "Elegida la cuenta de María G. Suárez (aviso)")
    click(page, '[data-tour="confirmar-ingreso"]')
    shot(page, "06-rechazo", "Confirmar con cuenta de tercero: Transferencia rechazada")
    click(page, '[data-tour="origen-propia"]')
    shot(page, "07-propia-elegida", "Elegida la cuenta del Banco Nación")
    click(page, '[data-tour="confirmar-ingreso"]')
    shot(page, "08-acreditado", "Modal Dinero acreditado")
    click(page, "#mdClose")
    shot(page, "09-inicio-con-pesos", "Estado de cuenta con pesos (paso: clic en Comprar del MEP)")
    # Mostrar también el acceso desde el menú Operar, sin avanzar la guía
    click(page, '[data-tour="nav-operar"]')
    shot(page, "10-menu-operar", "Menú Operar abierto")
    page.keyboard.press("Escape")
    page.evaluate("() => { if (typeof cerrarMenus==='function') cerrarMenus(); }")
    page.wait_for_timeout(300)
    click(page, '[data-tour="qa-mep"]')
    shot(page, "11-mep", "Compra Dólar MEP Simple: tipo de cambio")
    click(page, "#tipNext")
    click(page, '[data-tour="mep-verpordentro"]')
    shot(page, "12-mep-por-dentro", "Ver por dentro: las dos operaciones")
    click(page, "#tipNext")
    click(page, '[data-tour="mep-confirmar"]')
    shot(page, "13-mep-ok", "Modal Compraste dólar MEP")
    click(page, "#mdClose")
    shot(page, "14-inicio-final", "Estado de cuenta con pesos y dólares")
    page.evaluate("() => { const d=document.querySelector('#accSaldos'); d.open=true; d.scrollIntoView({block:'center'}); }")
    shot(page, "15-detalle-saldos", "Detalle de saldos: pesos y dólares disponibles")
    browser.close()

(OUT / "manifest.json").write_text(json.dumps({"viewport": [1920, 1080], "scale": 2, "shots": shots},
                                              ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", len(shots))
