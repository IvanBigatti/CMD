"""Walks the «Comprar mi primer CEDEAR» itinerary of the simulator and saves one
screenshot per screen plus the boxes (in 1920x1080 px) of every relevant
element, in assets/captures/manifest.json.

Usage: python tools/capture.py <path to InvertOnlineSandBox.html> <output dir>
"""
import json, sys, pathlib
from playwright.sync_api import sync_playwright

SIM = pathlib.Path(sys.argv[1]).resolve()
OUT = pathlib.Path(sys.argv[2]).resolve()
OUT.mkdir(parents=True, exist_ok=True)

# Elements whose boxes are recorded on every screenshot (when visible).
WATCH = {
    "nav-cotizaciones": '[data-tour="nav-cotizaciones"]',
    "nav-portafolio": '[data-tour="nav-portafolio"]',
    "cuenta-arg": '[data-tour="cuenta-arg"]',
    "bal-ars": '#balArs',
    "tab-cedears": '[data-tour="tab-cedears"]',
    "inst-KO": '[data-tour="inst-KO"]',
    "ficha-head": '#fichaBox > .row',
    "ficha-precio": '#fichaBox .big',
    "ficha-datos": '#fichaBox .fcard:first-child',
    "ficha-ratio": '#fichaBox .dcrow:has-text("Ratio de conversión")',
    "ficha-pu": '#fichaBox .dcrow:has-text("Acción en EE.UU.")',
    "ficha-tc": '#fichaBox .dcrow:has-text("Tipo de cambio implícito")',
    "caja-puntas": '[data-tour="caja-puntas"]',
    "puntas-tabla": '[data-tour="caja-puntas"] table',
    "puntas-venta-col": '[data-tour="caja-puntas"] thead th:nth-child(3)',
    "puntas-venta-1": '[data-tour="caja-puntas"] tbody tr:first-child td:nth-child(3)',
    "puntas-hint": '[data-tour="caja-puntas"] .hint',
    "btn-comprar": '[data-tour="btn-comprar"]',
    "form-comprar": '[data-tour="form-comprar"]',
    "campo-plazo": '[data-tour="campo-plazo"]',
    "campo-simbolo": '#cSimbolo',
    "campo-simbolo-info": '#cInfo',
    "campo-cantidad": '[data-tour="campo-cantidad"]',
    "campo-modalidad": '[data-tour="campo-modalidad"]',
    "montos-disponibles": '[data-tour="montos-disponibles"]',
    "btn-comprar-submit": '[data-tour="btn-comprar-submit"]',
    "modal": '#modal .sheet',
    "costos-confirmacion": '[data-tour="costos-confirmacion"]',
    "confirmar-orden": '[data-tour="confirmar-orden"]',
    "boleto-detalle": '[data-tour="boleto-detalle"]',
    "boleto-ultimo": '#boletoBox .kv:last-of-type',
    "pos-lista": '[data-tour="pos-lista"]',
    "toggle-moneda": '[data-tour="toggle-moneda"]',
    "toggle-usd": '[data-tour="toggle-moneda"] [data-mon="USD"]',
    "stats": '#statsBox2',
    "splash": '#splash .sheet',
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
    page.wait_for_timeout(900)  # let smooth scroll and transitions finish
    page.add_style_tag(content="#tip,#ring{visibility:hidden!important}")
    page.screenshot(path=str(OUT / f"{name}.png"))
    text = page.evaluate(
        "() => { const m = document.querySelector('#modal:not([hidden]) .sheet') || document.querySelector('main');"
        " return m ? m.innerText.slice(0, 2500) : ''; }")
    tour = page.evaluate(
        "() => (typeof T!=='undefined' && T.tour) ? {i:T.i, n:T.tour.steps.length, title:(T.tour.steps[T.i]||{}).title} : null")
    shots.append({"id": name, "file": f"{name}.png", "note": note, "tour": tour,
                  "scrollY": page.evaluate("() => (document.querySelector('main')||document.scrollingElement).scrollTop"),
                  "boxes": boxes(page), "text": text})
    page.add_style_tag(content="#tip,#ring{visibility:visible!important}")
    print("shot", name, tour)


def click(page, sel):
    page.locator(sel).first.click()
    page.wait_for_timeout(450)


def nxt(page):
    click(page, "#tipNext")


def scroll_to(page, sel):
    page.evaluate("s => document.querySelector(s).scrollIntoView({block:'center'})", sel)
    page.wait_for_timeout(500)


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
    page.goto(SIM.as_uri())
    page.wait_for_timeout(800)
    click(page, "#btnIniciar")
    click(page, '[data-track="cedear"]')
    shot(page, "00-inicio-900k", "Account overview with $900.000 (step 0, info)")
    nxt(page)
    shot(page, "01-inicio-cotizaciones", "Step: click Cotizaciones")
    click(page, '[data-tour="nav-cotizaciones"]')
    shot(page, "02-mercado", "Market screen (step: CEDEARs tab)")
    click(page, '[data-tour="tab-cedears"]')
    shot(page, "03-mercado-cedears", "CEDEARs tab (step: pick KO)")
    click(page, '[data-tour="inst-KO"]')
    shot(page, "04-ficha", "KO detail, top (ratio step)")
    scroll_to(page, '[data-tour="caja-puntas"]')
    shot(page, "05-ficha-puntas", "KO detail scrolled to bid/ask box")
    nxt(page)  # ratio -> two prices
    nxt(page)  # two prices -> Comprar
    shot(page, "06-ficha-comprar", "Step: click Comprar on the detail")
    click(page, '[data-tour="btn-comprar"]')
    shot(page, "07-orden", "Order form with KO loaded (six fields)")
    nxt(page)  # form -> cantidad
    nxt(page)  # cantidad -> modalidad
    nxt(page)  # modalidad -> montos
    scroll_to(page, '[data-tour="montos-disponibles"]')
    shot(page, "08-orden-montos", "Order form scrolled to available amounts (24 hs)")
    page.select_option("#cPlazo", "ci")
    page.wait_for_timeout(400)
    shot(page, "09-orden-montos-ci", "Same, with plazo = Contado inmediato")
    page.select_option("#cPlazo", "24")
    page.wait_for_timeout(400)
    nxt(page)  # montos -> submit
    shot(page, "10-orden-enviar", "Step: click Comprar (submit)")
    click(page, '[data-tour="btn-comprar-submit"]')
    shot(page, "11-confirmacion", "Confirmation modal with costs")
    nxt(page)  # costs -> confirm
    click(page, '[data-tour="confirmar-orden"]')
    shot(page, "12-boleto", "Trade ticket (boleto)")
    scroll_to(page, '[data-tour="boleto-detalle"]')
    shot(page, "13-boleto-abajo", "Trade ticket scrolled to the cost line")
    nxt(page)  # boleto -> portafolio
    click(page, '[data-tour="nav-portafolio"]')
    shot(page, "14-portafolio-ars", "Portfolio in pesos")
    nxt(page)  # cartera -> moneda
    click(page, '[data-tour="toggle-moneda"] [data-mon="USD"]')
    shot(page, "15-portafolio-usd", "Portfolio in dollars")
    browser.close()

(OUT / "manifest.json").write_text(json.dumps({"viewport": [1920, 1080], "scale": 2, "shots": shots},
                                              ensure_ascii=False, indent=1), encoding="utf-8")
print("ok", len(shots))
