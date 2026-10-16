"""Captura compartida de la serie: abre el simulador en Edge headless (1920x1080 @2x),
guarda una captura por pantalla (sin el globo ni el anillo de la guía) y registra
las cajas de los elementos observados en manifest.json.

Uso desde el tools/capture.py de cada video:
    from captura import Captura
    with Captura(sim_html, out_dir, watch={...}) as c:
        c.click("#btnIniciar"); c.click('[data-track="venta"]'); c.shot("01-inicio", "nota")
"""
import json, pathlib
from playwright.sync_api import sync_playwright

BASE_WATCH = {
    "modal": "#modal .sheet",
    "modal-p": "#mdBody p",
}

class Captura:
    def __init__(self, sim, out, watch, all_tour=False):
        self.sim = pathlib.Path(sim).resolve()
        self.out = pathlib.Path(out).resolve()
        self.out.mkdir(parents=True, exist_ok=True)
        self.watch = dict(BASE_WATCH, **watch)
        self.shots = []
        self.all_tour = all_tour  # registrar también todos los elementos [data-tour] visibles

    def __enter__(self):
        self._pw = sync_playwright().start()
        self.browser = self._pw.chromium.launch(channel="msedge")
        self.page = self.browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=2)
        self.page.goto(self.sim.as_uri())
        self.page.wait_for_timeout(800)
        return self

    def __exit__(self, *exc):
        self.browser.close()
        self._pw.stop()
        if exc[0] is None:
            (self.out / "manifest.json").write_text(json.dumps(
                {"viewport": [1920, 1080], "scale": 2, "shots": self.shots}, ensure_ascii=False, indent=1),
                encoding="utf-8")
            print("ok", len(self.shots))

    def boxes(self):
        out = {}
        for k, sel in self.watch.items():
            loc = self.page.locator(sel)
            if loc.count() == 0:
                continue
            el = loc.first
            if not el.is_visible():
                continue
            b = el.bounding_box()
            if b and b["width"] > 0 and b["height"] > 0:
                out[k] = {kk: round(v, 1) for kk, v in b.items()}
        return out

    def shot(self, name, note="", full_page=False):
        p = self.page
        p.wait_for_timeout(900)
        p.add_style_tag(content="#tip,#ring{visibility:hidden!important}")
        p.screenshot(path=str(self.out / f"{name}.png"), full_page=full_page)
        text = p.evaluate("() => { const m=document.querySelector('main'); const d=document.querySelector('#modal:not([hidden]) .sheet'); return (d? 'MODAL: '+d.innerText+' || ' : '') + (m? m.innerText.slice(0,1800):''); }")
        tour = p.evaluate("() => (typeof T!=='undefined' && T.tour) ? {i:T.i, n:T.tour.steps.length, title:(T.tour.steps[T.i]||{}).title} : null")
        boxes = self.boxes()
        if self.all_tour:
            for k, v in p.evaluate("""() => { const o = {};
                document.querySelectorAll('[data-tour]').forEach(el => { const r = el.getBoundingClientRect();
                  if (r.width > 0 && r.height > 0 && el.offsetParent !== null) o['t:' + el.dataset.tour] =
                    {x: Math.round(r.x*10)/10, y: Math.round(r.y*10)/10, width: Math.round(r.width*10)/10, height: Math.round(r.height*10)/10}; });
                return o; }""").items():
                boxes.setdefault(k, v)
        saldo = p.evaluate("() => (typeof ST !== 'undefined') ? JSON.parse(JSON.stringify(ST.saldo)) : null")
        saldo_tx = p.evaluate("() => (typeof saldosHTML === 'function') ? (d => { d.innerHTML = saldosHTML(); return d.innerText; })(document.createElement('div')) : ''")
        self.shots.append({"id": name, "file": f"{name}.png", "note": note, "tour": tour,
                           "boxes": boxes, "saldo": saldo, "saldo_tx": saldo_tx, "text": text})
        p.add_style_tag(content="#tip,#ring{visibility:visible!important}")
        print("shot", name, tour)

    def click(self, sel, wait=450):
        self.page.locator(sel).first.click()
        self.page.wait_for_timeout(wait)

    def next(self):
        self.click("#tipNext")
