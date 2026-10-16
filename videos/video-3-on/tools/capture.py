"""Walks the «Invertir en Obligaciones Negociables» itinerary of the simulator.
Usage: python tools/capture.py <InvertOnlineSandBox.html> assets/captures
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "_serie"))
from captura import Captura

WATCH = {
    "nav-operar": '[data-tour="nav-operar"]',
    "menu-comprar": '[data-tour="menu-comprar"]',
    "cuenta-arg": '[data-tour="cuenta-arg"]',
    "bal-ars": "#balArs",
    "bal-usd": "#balUsd",
    "form-comprar": '[data-tour="form-comprar"]',
    "campo-simbolo": "#cSimbolo",
    "simbolo-info": "#cInfo",
    "campo-cantidad": '[data-tour="campo-cantidad"]',
    "cant-input": "#cCant",
    "campo-modalidad": '[data-tour="campo-modalidad"]',
    "btn-comprar-submit": '[data-tour="btn-comprar-submit"]',
    "cmsg": "#cMsg .alert",
    "montos": '[data-tour="montos-disponibles"]',
    "costos": '#mdBody [data-tour="costos-confirmacion"]',
    "confirmar-orden": '[data-tour="confirmar-orden"]',
    "boleto": '[data-tour="boleto-detalle"]',
    "boleto-costo-total": '#boletoBox p',
    "nav-cotizaciones": '[data-tour="nav-cotizaciones"]',
    "tab-ons": '[data-tour="tab-ons"]',
    "inst-YMCJO": '[data-tour="inst-YMCJO"]',
    "ficha-head": '#fichaBox > .row',
    "ficha-datos": '#fichaBox .fcard:first-child',
    "ficha-renta": '#fichaBox .dcrow:has-text("Pago de renta")',
    "ficha-vto": '#fichaBox .dcrow:has-text("Vencimiento")',
    "ficha-tasa": '#fichaBox .dcrow:has-text("Tasa anual")',
    "ficha-lamina": '#fichaBox .dcrow:has-text("Lámina mínima")',
}

with Captura(sys.argv[1], sys.argv[2], WATCH) as c:
    c.click("#btnIniciar")
    c.click('[data-track="on"]')
    c.shot("01-inicio", "Account overview with US$ 3.000 (step 0, info)")
    c.next()
    c.shot("02-inicio-operar", "Step: open Operar")
    c.click('[data-tour="nav-operar"]')
    c.shot("03-menu-operar", "Operar menu open (Comprar)")
    c.click('[data-tour="menu-comprar"]')
    c.shot("04-orden", "Order form with YMCJO and 550 VN")
    c.next()  # symbol -> quantity
    c.next()  # quantity -> submit (550)
    c.click('[data-tour="btn-comprar-submit"]')
    c.shot("05-rechazo", "Order rejected: 550 is not a multiple of the lot")
    c.page.fill("#cCant", "1000")
    c.page.dispatch_event("#cCant", "input")
    c.page.wait_for_timeout(300)
    c.shot("06-orden-1000", "Quantity corrected to 1.000 VN")
    c.next()  # 'Ahí está' -> send again
    c.click('[data-tour="btn-comprar-submit"]')
    c.shot("07-confirmacion", "Confirmation modal with costs")
    c.click('[data-tour="confirmar-orden"]')
    c.shot("08-boleto", "Trade ticket (boleto)")
    # Show where the coupon calendar and maturity come from (real detail screen, outside the guide)
    c.click('[data-tour="nav-cotizaciones"]')
    c.click('[data-tour="tab-ons"]')
    c.shot("09-mercado-ons", "Market, ON tab")
    c.page.locator('[data-tour="inst-YMCJO"]').dispatch_event('click')  # the guide bubble covers the row
    c.page.wait_for_timeout(450)
    c.page.evaluate("() => document.querySelector('main').scrollTo(0,0)")
    c.shot("10-ficha-ymcjo", "YMCJO detail: coupon calendar and maturity")
