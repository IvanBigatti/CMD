"""Recorre el itinerario «Vender, esperar la liquidación y retirar» del simulador.
Uso: python tools/capture.py <InvertOnlineSandBox.html> assets/captures
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "_serie"))
from captura import Captura

WATCH = {
    "nav-micuenta": '[data-tour="nav-micuenta"]',
    "nav-operar": '[data-tour="nav-operar"]',
    "menu-vender": '[data-tour="menu-vender"]',
    "menu-estado": '[data-tour="menu-estado"]',
    "menu-retirar": '[data-tour="menu-retirar"]',
    "reloj-avanzar": '[data-tour="reloj-avanzar"]',
    "cuenta-arg": '[data-tour="cuenta-arg"]',
    "bal-ars": "#balArs",
    "acc-saldos": "#accSaldos",
    "saldos": "#saldosBox",
    "saldos-panel": "#accSaldos .accbody",
    "form-vender": '[data-tour="form-vender"]',
    "simbolo-venta": '[data-tour="campo-simbolo-venta"]',
    "simbolo-info": "#vInfo",
    "plazo-venta": '[data-tour="campo-plazo-venta"]',
    "cant-venta": '[data-tour="campo-cantidad-venta"]',
    "vender-submit": '[data-tour="btn-vender-submit"]',
    "vmsg": "#vMsg .alert",
    "aviso-plazo": "#mdBody .alert.info",
    "costos": '#mdBody [data-tour="costos-confirmacion"]',
    "confirmar-orden": '[data-tour="confirmar-orden"]',
    "boleto": '[data-tour="boleto-detalle"]',
    "monto-retiro": '[data-tour="monto-retiro"]',
    "ret-disp": "#retDisp",
    "ret-msg": "#retMsg .alert",
    "confirmar-retiro": '[data-tour="confirmar-retiro"]',
    "ret-panel": "#s-retirar .panel",
    "ret-saldos": "#retSaldos",
    "md-close": "#mdClose",
    "pos-lista": '[data-tour="pos-lista"]',
    "nav-portafolio": '[data-tour="nav-portafolio"]',
}

with Captura(sys.argv[1], sys.argv[2], WATCH) as c:
    c.click("#btnIniciar")
    c.click('[data-track="venta"]')
    c.shot("01-inicio", "Estado de cuenta con la tenencia (paso 1, info)")
    c.click('[data-tour="nav-portafolio"]')
    c.shot("01b-portafolio", "Portafolio: 30 CEDEARs de KO")
    c.page.evaluate("() => go('inicio')")
    c.next()
    c.click('[data-tour="nav-operar"]')
    c.shot("02-menu-operar", "Menú Operar abierto, Vender")
    c.click('[data-tour="menu-vender"]')
    c.shot("03-vender", "Pantalla Vender: símbolo (lista)")
    c.next()
    c.shot("04-vender-plazo", "Pantalla Vender: plazo Normal 24 hs")
    c.next()
    c.click('[data-tour="btn-vender-submit"]')
    c.shot("05-confirmar-venta", "Modal de confirmación de la venta")
    c.page.evaluate("() => document.querySelector('#mdBody .alert.info').scrollIntoView({block:'center'})")
    c.shot("05b-aviso-plazo", "Modal: aviso «Ojo con el plazo»")
    c.click('[data-tour="confirmar-orden"]')
    c.shot("06-boleto", "Boleto de la venta")
    c.click('[data-tour="nav-micuenta"]')
    c.shot("07-menu-micuenta", "Menú Mi Cuenta abierto (Estado de cuenta)")
    c.click('[data-tour="menu-estado"]')
    c.page.evaluate("() => { document.querySelector('#accSaldos').open = false; document.querySelector('main').scrollTo(0,0); window.scrollTo(0,0); }")
    c.shot("08-estado", "Estado de cuenta después de la venta")
    c.page.evaluate("() => document.querySelector('#accSaldos').scrollIntoView({block:'center'})")
    c.shot("08b-acordeon", "Acordeón «Detalle de saldos» cerrado")
    c.click('[data-tour="detalle-saldos"] summary')
    c.page.evaluate("() => { const d=document.querySelector('#accSaldos'); d.open = true; d.scrollIntoView({block:'center'}); }")
    c.shot("09-detalle-saldos", "Detalle de saldos: a liquidar")
    c.next()
    c.click('[data-tour="nav-micuenta"]')
    c.shot("10-menu-retirar", "Menú Mi Cuenta abierto (Retirar dinero)")
    c.click('[data-tour="menu-retirar"]')
    c.shot("11-retirar", "Retirar dinero: monto precargado")
    c.next()
    c.click('[data-tour="confirmar-retiro"]')
    c.shot("12-retiro-rechazado", "Retiro rechazado: no disponible")
    c.click('[data-tour="reloj-avanzar"]')
    c.shot("13-paso-un-dia", "Modal: pasó un día hábil")
    c.click("#mdClose")
    c.shot("14-retirar-disponible", "Retirar: el saldo pasó a disponible")
    c.click('#retMon [data-mon="ARS"]')
    c.shot("14b-retirar-limpio", "Retirar: pestaña Pesos, sin el mensaje anterior")
    c.next()
    c.click('[data-tour="confirmar-retiro"]')
    c.shot("15-retiro-ok", "Retiro enviado")
