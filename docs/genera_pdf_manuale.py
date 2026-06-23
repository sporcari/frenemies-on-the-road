#!/usr/bin/env python3
"""Rigenera il PDF del MANUALE DEL GIOCATORE da frenemies_manuale.md.

Flusso: Markdown -> HTML -> (iniezione diagrammi SVG) -> WeasyPrint -> PDF.

A differenza di genera_pdf.py (che produce il PDF della Knowledge Base, la
fonte di verita delle regole), questo script genera il manuale discorsivo
pensato per la revisione di un editor, arricchito da diagrammi di flusso.

I diagrammi sono SVG nativi (WeasyPrint non esegue JavaScript): nel markdown
ci sono segnaposto `<!-- DIAGRAMMA: chiave -->` che qui vengono sostituiti con
l'SVG corrispondente. Cosi il sorgente .md resta pulito e leggibile.

Uso:  python3 docs/genera_pdf_manuale.py
Dipendenze: markdown, weasyprint.
"""
import math
import os
import re
import sys
import datetime

# Riquadro utile per un diagramma grande su pagina orizzontale (A4 landscape,
# margini ~11mm): lo scaliamo per riempirlo, mantenendo le proporzioni.
LAND_W_MM = 268
LAND_H_MM = 165
# Riquadro per un diagramma su pagina VERTICALE (A4 portrait, margini 18/20mm):
# area utile ~174 x 257mm, lasciamo spazio per didascalia e numero di pagina.
PORT_W_MM = 174
PORT_H_MM = 235

import markdown
from weasyprint import HTML

DOCS = os.path.dirname(os.path.abspath(__file__))
SORGENTE = os.path.join(DOCS, "frenemies_manuale.md")
USCITA = os.path.join(DOCS, "frenemies_manuale.pdf")

# Palette coerente con il PDF della KB.
ORO = "#b9770e"
ORO_CHIARO = "#f5a623"
CREMA = "#f5e6c8"
SABBIA = "#f1efe9"
BORDO = "#cfcabb"
SCURO = "#15161a"
BLU = "#4f7cac"
ROSSO = "#b5462f"
VERDE = "#5a7d4f"
OLIVA = "#9c7a1e"
GRIGIO = "#6b7280"
FONT = "'Helvetica Neue',Arial,sans-serif"

CSS = f"""
@page {{ size: A4; margin: 20mm 18mm;
        @bottom-center {{ content: counter(page); color: #999; font-size: 9pt; }} }}
@page :first {{ @bottom-center {{ content: none; }} }}
body {{ font-family: {FONT}; font-size: 10.7pt; line-height: 1.55; color: #1a1a1a; }}
h1, h2, h3, h4 {{ font-family: 'Oswald','Arial Narrow',sans-serif; color: {ORO};
        letter-spacing: .3px; line-height: 1.2; }}
h1 {{ font-size: 23pt; border-bottom: 3px solid {ORO_CHIARO}; padding-bottom: 5px;
        margin-top: 26px; page-break-before: always; }}
h2 {{ font-size: 15pt; margin-top: 20px; border-bottom: 1px solid #e3c98a; padding-bottom: 2px; }}
h3 {{ font-size: 12.5pt; color: {SCURO}; margin-top: 14px; }}
a {{ color: {BLU}; }}
code {{ background: {SABBIA}; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }}
pre {{ background: {SABBIA}; padding: 8px 10px; border-radius: 6px; }}
blockquote {{ border-left: 3px solid {ORO_CHIARO}; margin: 8px 0; padding: 4px 12px;
        color: #555; font-style: italic; }}
table {{ border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.7pt; }}
th, td {{ border: 1px solid {BORDO}; padding: 5px 8px; text-align: left; vertical-align: top; }}
th {{ background: {CREMA}; font-family: 'Oswald','Arial Narrow',sans-serif; }}
hr {{ border: none; border-top: 1px solid #ddd; margin: 16px 0; }}
ul, ol {{ margin: 6px 0 6px 20px; }}
/* Appendice B: partita d'esempio, passo per passo */
p.azione {{ margin: 13px 0 2px; }}
p.azione strong {{ font-family: 'Oswald','Arial Narrow',sans-serif; color: {SCURO}; }}
.fiction {{ background: #fbf6ea; border-left: 4px solid {ORO_CHIARO}; border-radius: 8px;
        padding: 9px 14px; margin: 3px 0 9px; line-height: 1.5;
        page-break-inside: avoid; break-inside: avoid; }}
.fiction .chi {{ display: block; margin-bottom: 3px; font-size: 8.4pt; letter-spacing: .7px;
        text-transform: uppercase; font-family: 'Oswald','Arial Narrow',sans-serif;
        font-weight: bold; color: {ORO}; }}
.fiction .titolo-scena {{ display: block; margin-bottom: 4px; font-family: 'Oswald','Arial Narrow',sans-serif;
        font-size: 13pt; font-weight: bold; color: {ORO}; }}
/* Salti pagina intelligenti */
h2, h3, h4 {{ page-break-after: avoid; break-after: avoid-page; }}
p {{ orphans: 3; widows: 3; }}
ul, ol {{ page-break-inside: avoid; break-inside: avoid; }}
li {{ page-break-inside: avoid; break-inside: avoid; }}
blockquote {{ page-break-inside: avoid; break-inside: avoid; }}
table, tr {{ page-break-inside: avoid; break-inside: avoid; }}
@page paesaggio {{ size: A4 landscape; margin: 11mm 12mm;
        @bottom-center {{ content: counter(page); color: #999; font-size: 9pt; }} }}
figure.diagramma {{ margin: 18px 0; text-align: center; page-break-inside: avoid; break-inside: avoid; }}
figure.diagramma svg {{ width: 100%; height: auto; max-height: 230mm; }}
figure.diagramma figcaption {{ font-size: 9.5pt; color: #888; margin-top: 8px; font-style: italic; }}
.diag-pagina {{ page: paesaggio; page-break-before: always; page-break-after: always;
        break-before: page; break-after: page;
        height: 183mm; display: flex; flex-direction: column;
        justify-content: center; align-items: center; }}
.diag-pagina figure.diagramma {{ margin: 0; }}
.diag-pagina figure.diagramma svg {{ max-height: 168mm; }}
.diag-pagina-v {{ page-break-before: always; page-break-after: always;
        break-before: page; break-after: page;
        height: 245mm; display: flex; flex-direction: column;
        justify-content: center; align-items: center; }}
.diag-pagina-v figure.diagramma {{ margin: 0; }}
.diag-pagina-v figure.diagramma svg {{ max-height: 235mm; }}
.cover {{ text-align: center; margin-top: 38mm; page-break-after: always; }}
.cover .titolo {{ font-family: 'Oswald','Arial Narrow',sans-serif; font-size: 40pt;
        color: {ORO}; letter-spacing: 1px; line-height: 1.05; }}
.cover .sotto {{ font-family: 'Oswald','Arial Narrow',sans-serif; font-size: 16pt;
        color: {SCURO}; margin-top: 10px; }}
.cover .occhiello {{ font-size: 11pt; color: #666; margin-top: 26px; font-style: italic;
        max-width: 120mm; margin-left: auto; margin-right: auto; }}
.cover .righello {{ width: 70mm; height: 3px; background: {ORO_CHIARO}; margin: 22px auto; border: none; }}
"""


# ---------------------------------------------------------------------------
# Mini toolkit SVG: tutto con attributi di presentazione (WeasyPrint non
# applica CSS interno all'SVG in modo affidabile).
# ---------------------------------------------------------------------------

def _esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def txt(x, y, s, size=13, fill=SCURO, weight="normal", anchor="middle"):
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'fill="{fill}" font-weight="{weight}" text-anchor="{anchor}">{_esc(s)}</text>')


def rect(x, y, w, h, fill, stroke="none", rx=10, sw=1.5):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" ry="{rx}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def card(x, y, w, h, titolo, righe, header_fill, header_txt="#ffffff",
         body_fill="#ffffff", titolo_size=13, riga_size=10.5):
    """Scheda con striscia d'intestazione colorata e righe nel corpo."""
    out = [rect(x, y, w, h, body_fill, BORDO, rx=10)]
    # intestazione: rettangolo arrotondato in alto + rettangolino che squadra il fondo
    out.append(rect(x, y, w, 30, header_fill, rx=10, sw=0))
    out.append(f'<rect x="{x}" y="{y+15}" width="{w}" height="15" fill="{header_fill}"/>')
    out.append(txt(x + w / 2, y + 20, titolo, titolo_size, header_txt, "bold"))
    cy = y + 48
    for r in righe:
        out.append(txt(x + w / 2, cy, r, riga_size, SCURO))
        cy += 17
    return "".join(out)


def diamante(cx, cy, hw, hh, fill, stroke, righe, size=11):
    pts = f"{cx},{cy-hh} {cx+hw},{cy} {cx},{cy+hh} {cx-hw},{cy}"
    out = [f'<polygon points="{pts}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"/>']
    n = len(righe)
    y0 = cy - (n - 1) * 8
    for i, r in enumerate(righe):
        out.append(txt(cx, y0 + i * 16 + 4, r, size, "#ffffff", "bold"))
    return "".join(out)


def nota(x, y, w, h, righe, size=9.5):
    """Riquadro tratteggiato con testo piccolo (annotazioni a margine)."""
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" ry="8" '
           f'fill="#fbf7ee" stroke="{ORO_CHIARO}" stroke-width="1.3" stroke-dasharray="4 3"/>']
    cy = y + (h - (len(righe) - 1) * 14) / 2 + 3.5
    for r in righe:
        out.append(txt(x + w / 2, cy, r, size, "#7a6a3a"))
        cy += 14
    return "".join(out)


def arrow(x1, y1, x2, y2, color=ORO, w=2.2, head=9):
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    bx, by = x2 - ux * head, y2 - uy * head
    px, py = -uy, ux
    p2 = (bx + px * head * 0.55, by + py * head * 0.55)
    p3 = (bx - px * head * 0.55, by - py * head * 0.55)
    return (f'<line x1="{x1}" y1="{y1}" x2="{bx:.1f}" y2="{by:.1f}" '
            f'stroke="{color}" stroke-width="{w}"/>'
            f'<polygon points="{x2},{y2} {p2[0]:.1f},{p2[1]:.1f} {p3[0]:.1f},{p3[1]:.1f}" '
            f'fill="{color}"/>')


def svg(vb_w, vb_h, body):
    return (f'<svg viewBox="0 0 {vb_w} {vb_h}" xmlns="http://www.w3.org/2000/svg" '
            f'font-family="{FONT}">{body}</svg>')


def figura(inner, didascalia, compatta=False, verticale=False):
    # I diagrammi piccoli e larghi (compatta=True) scorrono inline col testo.
    if compatta:
        return (f'<figure class="diagramma">{inner}'
                f'<figcaption>{_esc(didascalia)}</figcaption></figure>')
    # I diagrammi grandi prendono una pagina tutta per se (orizzontale di default,
    # verticale se verticale=True) e vengono scalati per riempirla, proporzioni intatte.
    w_mm, h_mm = (PORT_W_MM, PORT_H_MM) if verticale else (LAND_W_MM, LAND_H_MM)
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', inner)
    if m:
        vw, vh = float(m.group(1)), float(m.group(2))
        s = min(w_mm / vw, h_mm / vh)
        inner = inner.replace(
            "<svg ", f'<svg style="width:{vw*s:.1f}mm;height:{vh*s:.1f}mm" ', 1)
    fig = (f'<figure class="diagramma">{inner}'
           f'<figcaption>{_esc(didascalia)}</figcaption></figure>')
    cls = "diag-pagina-v" if verticale else "diag-pagina"
    return f'<div class="{cls}">{fig}</div>'


# ---------------------------------------------------------------------------
# I diagrammi
# ---------------------------------------------------------------------------

def diag_cinque_scene():
    W, H = 820, 200
    nomi = [("1", "Innesco", "Collaborazione forzata"),
            ("2", "Adattamento", "Equilibrio fragile"),
            ("3", "Frattura", "Dubbio"),
            ("4", "Crisi", "Crollo"),
            ("5", "Risoluzione", "Scelta decisiva")]
    bw, gap, bh = 150, 11, 64
    cols = [ORO_CHIARO, "#eab14a", "#dd9a3a", ROSSO, "#8e3a26"]
    parts = []
    centri = []
    for i, (n, nome, fun) in enumerate(nomi):
        x = 11 + i * (bw + gap)
        top = 96 - i * 15
        parts.append(rect(x, top, bw, bh, "#ffffff", BORDO, rx=10))
        parts.append(f'<rect x="{x}" y="{top}" width="6" height="{bh}" rx="3" fill="{cols[i]}"/>')
        parts.append(txt(x + bw / 2, top + 24, f"{n}. {nome}", 13.5, SCURO, "bold"))
        parts.append(txt(x + bw / 2, top + 45, fun, 10.5, "#555"))
        centri.append((x, top + bh / 2, x + bw))
    # connettori tra i box
    for i in range(len(nomi) - 1):
        _, ym, xr = centri[i]
        xl2, ym2, _ = centri[i + 1]
        parts.append(arrow(xr + 1, ym, xl2 - 1, ym2, ORO, 2))
    # freccia "la tensione cresce"
    parts.append(arrow(20, 185, 800, 185, "#c9c2b0", 3, 11))
    parts.append(txt(410, 178, "la tensione cresce, scena dopo scena", 10.5, "#9a937f", "middle"))
    return figura(svg(W, H, "".join(parts)),
                  "Le cinque scene: una curva da film, dalla collaborazione forzata alla scelta decisiva.",
                  compatta=True)


def diag_flusso_scena():
    W, H = 760, 624
    cx = 380
    parts = []

    def box(y, lines, fill=CREMA, w=384, xc=None, size=11.5):
        xc = cx if xc is None else xc
        x = xc - w / 2
        h = 22 + len(lines) * 16
        parts.append(rect(x, y, w, h, fill, BORDO, rx=10))
        cy = y + (h - (len(lines) - 1) * 16) / 2 + 4
        for ln in lines:
            parts.append(txt(xc, cy, ln, size, SCURO, "bold"))
            cy += 16
        return y + h

    y = 8
    yb = box(y, ["Ciascun giocatore pesca", "la propria mano di 4 carte"])
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["Asta per determinare l'iniziativa"])
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["Chi ha l'iniziativa stabilisce", "la posta e il titolo della scena"])
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["L'altro fa il framing iniziale: la situazione", "e l'atmosfera in cui si trovano i protagonisti"])
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["A partire da chi ha l'iniziativa, si svolgono", "4 turni, giocando una carta alla volta"])
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16

    # decisione: resa onorevole all'ultimo turno
    dcy = y + 48
    parts.append(diamante(cx, dcy, 152, 48, ORO, "#8a5908",
                          ["Chi gioca l'ultimo turno", "concede la scena?"], 11))

    by = dcy + 68
    lxc, rxc = 150, 610
    lb = box(by, ["Ritirata strategica:", "narra la resa onorevole"], fill="#eef3e9", w=270, xc=lxc, size=11)
    rb = box(by, ["Si legge il piatto e si stabilisce", "chi vince la posta"], w=292, xc=rxc, size=11)
    parts.append(arrow(cx - 152, dcy, lxc + 4, by - 2, GRIGIO, 2))
    parts.append(arrow(cx + 152, dcy, rxc - 4, by - 2, GRIGIO, 2))
    parts.append(txt(196, 418, "Sì", 11.5, SCURO, "bold"))
    parts.append(txt(566, 418, "No", 11.5, SCURO, "bold"))

    my = lb + 22
    yb = box(my, ["Chi ha perso la posta narra", "come si conclude la scena"], fill="#fbf1d8")
    parts.append(arrow(lxc, lb, cx - 70, my - 2, GRIGIO, 2))
    parts.append(arrow(rxc, lb, cx + 70, my - 2, GRIGIO, 2))
    return figura(svg(W, H, "".join(parts)),
                  "Una scena, passo per passo: chi vince l'asta fissa posta e titolo, "
                  "l'altro apre la scena, si gioca e chi perde la posta ne narra l'esito.",
                  verticale=True)


def diag_tre_gesti():
    W, H = 820, 196
    dati = [
        ("Giocare nel piatto", "Introdurre", GRIGIO,
         ["Meccanica: aggiungi una carta", "Narrativa: disponi una", "tua risorsa in scena"]),
        ("Fare una presa", "Superare", BLU,
         ["Meccanica: rimuovi carte", "Narrativa: togli una risorsa", "all'avversario, con un costo"]),
        ("Fare una scopa", "Svolta", ORO,
         ["Meccanica: svuoti il piatto", "Narrativa: successo pieno,", "sopra ogni aspettativa"]),
    ]
    bw, gap = 256, 16
    parts = []
    for i, (tit, sub, col, righe) in enumerate(dati):
        x = 12 + i * (bw + gap)
        parts.append(rect(x, 8, bw, 180, "#ffffff", BORDO, rx=12))
        parts.append(rect(x, 8, bw, 40, col, rx=12, sw=0))
        parts.append(f'<rect x="{x}" y="{8+20}" width="{bw}" height="20" fill="{col}"/>')
        parts.append(txt(x + bw / 2, 27, tit, 14, "#ffffff", "bold"))
        parts.append(txt(x + bw / 2, 43, f"= {sub}", 11, "#ffffff"))
        cy = 78
        for r in righe:
            parts.append(txt(x + bw / 2, cy, r, 10.5, SCURO))
            cy += 22
        if i < 2:
            ax = x + bw + 1
            parts.append(arrow(ax, 98, ax + gap - 2, 98, "#c9c2b0", 2.4, 8))
    return figura(svg(W, H, "".join(parts)),
                  "Le tre mosse del gioco: ognuna è insieme una scelta meccanica e un fatto della storia.",
                  compatta=True)


def diag_esiti():
    W, H = 700, 470
    gx, gy = 175, 120
    cw, ch = 250, 150
    parts = []
    # super-etichette
    parts.append(txt(gx + cw, 34, "PUNTI complessivi", 13, ORO, "bold"))
    parts.append(txt(gx + cw / 2, 60, "Vinti", 12, SCURO, "bold"))
    parts.append(txt(gx + cw + cw / 2, 60, "Persi", 12, SCURO, "bold"))
    parts.append(f'<text x="40" y="{gy+ch}" font-family="{FONT}" font-size="13" fill="{ORO}" '
                 f'font-weight="bold" text-anchor="middle" transform="rotate(-90 40 {gy+ch})">PIATTO</text>')
    parts.append(f'<text x="70" y="{gy+ch/2+4}" font-family="{FONT}" font-size="12" fill="{SCURO}" '
                 f'font-weight="bold" text-anchor="middle" transform="rotate(-90 70 {gy+ch/2})">Vinto</text>')
    parts.append(f'<text x="70" y="{gy+ch+ch/2+4}" font-family="{FONT}" font-size="12" fill="{SCURO}" '
                 f'font-weight="bold" text-anchor="middle" transform="rotate(-90 70 {gy+ch+ch/2})">Perso</text>')
    celle = [
        (0, 0, VERDE, ["Vittoria totale"], ["successo pieno, netto"]),
        (1, 0, OLIVA, ["Per il rotto", "della cuffia"], ["obiettivo raggiunto,", "ma a caro prezzo"]),
        (0, 1, BLU, ["Sconfitta con", "aspetti positivi"], ["qualcosa è salvato o imparato"]),
        (1, 1, ROSSO, ["Disfatta totale"], ["fallimento completo"]),
    ]
    for col, row, fill, titoli, righe in celle:
        x = gx + col * cw
        y = gy + row * ch
        cxc = x + cw / 2
        parts.append(f'<rect x="{x}" y="{y}" width="{cw}" height="{ch}" fill="{fill}" '
                     f'fill-opacity="0.92" stroke="#ffffff" stroke-width="3"/>')
        totale = len(titoli) * 21 + len(righe) * 17
        yy = y + ch / 2 - totale / 2 + 15
        for t in titoli:
            parts.append(txt(cxc, yy, t, 14.5, "#ffffff", "bold"))
            yy += 21
        yy += 3
        for r in righe:
            parts.append(txt(cxc, yy, r, 10.5, "#fdf6ea"))
            yy += 17
    return figura(svg(W, H, "".join(parts)),
                  "I quattro esiti, dall'incrocio tra vittoria del piatto (la missione) e vittoria ai punti.")


def diag_flusso_partita():
    W, H = 760, 668
    cx = 400
    parts = []

    def box(y, lines, fill=CREMA, w=300, xc=None, size=11.5):
        xc = cx if xc is None else xc
        x = xc - w / 2
        h = 22 + len(lines) * 16
        parts.append(rect(x, y, w, h, fill, BORDO, rx=10))
        cy = y + (h - (len(lines) - 1) * 16) / 2 + 4
        for ln in lines:
            parts.append(txt(xc, cy, ln, size, SCURO, "bold"))
            cy += 16
        return y + h

    lxlane = 120          # corsia di sinistra per i rami "No" e i loop
    sx = cx - 150         # bordo sinistro della colonna principale

    y = 8
    yb = box(y, ["Pitch"]); parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    sc_top = y
    yb = box(y, ["Scene 1-4"]); sc_mid = (y + yb) / 2
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16

    # bivio mercato
    d1 = y + 48
    parts.append(diamante(cx, d1, 150, 48, ORO, "#8a5908", ["È terminata", "la scena 4?"], 12))
    # ramo No -> Mercato (a sinistra) e loop verso Scene 1-4
    mtop = d1 - 35
    mb = box(mtop, ["Mercato:", "si comprano figure", "da aggiungere al mazzo"],
             fill="#eef3e9", w=216, xc=lxlane, size=10.5)
    parts.append(arrow(cx - 150, d1, lxlane + 108, d1, GRIGIO, 2))
    parts.append(txt(cx - 161, d1 - 8, "No", 11.5, SCURO, "bold"))
    parts.append(f'<path d="M {lxlane} {mtop} V {sc_mid} H {sx-2}" fill="none" '
                 f'stroke="{GRIGIO}" stroke-width="2" stroke-dasharray="5 4"/>')
    parts.append(arrow(sx - 8, sc_mid, sx - 1, sc_mid, GRIGIO, 2))
    # ramo Sì -> prosegue
    parts.append(arrow(cx, d1 + 48, cx, d1 + 64, GRIGIO, 2))
    parts.append(txt(cx + 16, d1 + 60, "Sì", 11.5, SCURO, "bold")); y = d1 + 64

    yb = box(y, ["Ultima scena"]); parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["Colpi di scena"]); parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    yb = box(y, ["Lettura del finale e domande"]); parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16
    ep_top = y
    yb = box(y, ["Epilogo: vignette a turno"]); ep_mid = (y + yb) / 2
    parts.append(arrow(cx, yb, cx, yb + 16)); y = yb + 16

    # bivio epilogo
    d2 = y + 48
    parts.append(diamante(cx, d2, 168, 48, ORO, "#8a5908", ["Hanno passato", "entrambi i giocatori?"], 11))
    # ramo No -> torna all'Epilogo
    parts.append(f'<path d="M {cx-168} {d2} H {lxlane} V {ep_mid} H {sx-2}" fill="none" '
                 f'stroke="{GRIGIO}" stroke-width="2" stroke-dasharray="5 4"/>')
    parts.append(arrow(sx - 8, ep_mid, sx - 1, ep_mid, GRIGIO, 2))
    parts.append(txt(cx - 192, d2 - 8, "No", 11.5, SCURO, "bold"))
    # ramo Sì -> Fine
    parts.append(arrow(cx, d2 + 48, cx, d2 + 64, GRIGIO, 2))
    parts.append(txt(cx + 16, d2 + 60, "Sì", 11.5, SCURO, "bold"))
    fcy = d2 + 96
    parts.append(f'<circle cx="{cx}" cy="{fcy}" r="32" fill="{VERDE}" stroke="{BORDO}" stroke-width="1.5"/>')
    parts.append(txt(cx, fcy + 5, "Fine", 13, "#ffffff", "bold"))

    return figura(svg(W, H, "".join(parts)),
                  "La partita nel suo insieme: il pitch, le quattro scene col mercato, "
                  "l'ultima scena coi colpi di scena, il finale e l'epilogo a vignette.",
                  verticale=True)


def diag_asta():
    W, H = 820, 712
    p = []

    def pill(x, y, w, h, tit, sub=None, fill=CREMA, tcol=SCURO):
        p.append(rect(x, y, w, h, fill, BORDO, rx=10))
        if sub:
            p.append(txt(x + w / 2, y + h / 2 - 3, tit, 12, tcol, "bold"))
            p.append(txt(x + w / 2, y + h / 2 + 15, sub, 11.5, tcol, "bold"))
        else:
            p.append(txt(x + w / 2, y + h / 2 + 5, tit, 12.5, tcol, "bold"))

    cx = 400
    p.append(nota(600, 12, 210, 50, ["Il Jolly non si può", "usare nell'asta."]))
    pill(250, 10, 300, 44, "Ogni lato pesca 4 carte")
    p.append(arrow(cx, 54, cx, 70))
    pill(250, 70, 300, 44, "Ognuno cala 1 carta coperta")
    p.append(arrow(cx, 114, cx, 130))
    pill(250, 130, 300, 44, "Si rivelano insieme")
    p.append(arrow(cx, 174, cx, 178))
    # D1: valori diversi?
    p.append(diamante(cx, 224, 150, 46, ORO, "#8a5908", ["Carte di valore", "diverso?"], 12))
    p.append(arrow(252, 224, 150, 438, BLU, 2))
    p.append(txt(232, 250, "sì", 10.5, BLU, "bold", "end"))
    p.append(arrow(cx, 270, cx, 306))
    p.append(txt(cx + 12, 292, "no (parità)", 10, ROSSO, "bold", "start"))
    # D2: prima scena?
    p.append(diamante(cx, 352, 150, 46, ORO, "#8a5908", ["È la prima", "scena?"], 12))
    p.append(arrow(cx, 398, 410, 438))
    p.append(txt(cx + 14, 422, "sì", 10.5, SCURO, "bold", "start"))
    p.append(arrow(548, 352, 680, 438, SCURO, 2))
    p.append(txt(574, 344, "no", 10.5, SCURO, "bold", "start"))
    # esiti (chi vince)
    pill(30, 440, 230, 64, "Vince", "la carta più alta")
    pill(295, 440, 230, 64, "Vince", "l'Opposizione")
    pill(560, 440, 240, 64, "Vince chi non l'ha avuta", "nella scena precedente")
    # convergenza alla barra di merge
    p.append(arrow(145, 504, 250, 533, BLU, 2))
    p.append(arrow(410, 504, 400, 533))
    p.append(arrow(680, 504, 550, 533, SCURO, 2))
    p.append(rect(140, 533, 520, 64, "#eef3e9", VERDE, rx=10))
    p.append(txt(400, 558, "Il vincitore ha l'iniziativa: gioca per primo", 12.5, SCURO, "bold"))
    p.append(txt(400, 578, "e definisce titolo e posta della scena", 12.5, SCURO, "bold"))
    # destino delle due carte d'asta
    p.append(arrow(300, 597, 235, 614, VERDE, 2))
    p.append(arrow(500, 597, 595, 614, VERDE, 2))
    p.append(card(60, 614, 330, 84, "Carta del vincitore",
                  ["messa da parte: sarà la sua", "ultima giocata del round"], BLU, riga_size=10))
    p.append(card(430, 614, 330, 84, "Carta del perdente",
                  ["torna nella sua mano"], ROSSO, riga_size=10))
    return figura(svg(W, H, "".join(p)),
                  "L'asta per l'iniziativa, passo per passo, parità comprese.")


def diag_turno():
    W, H = 1040, 700
    p = []
    cx = 520
    # start
    p.append(rect(cx - 185, 22, 370, 56, CREMA, BORDO, rx=12))
    p.append(txt(cx, 46, "Nel tuo turno:", 14, SCURO, "bold"))
    p.append(txt(cx, 67, "scegli una carta dalla mano", 12, "#555"))
    p.append(arrow(cx, 78, cx, 116, ORO, 2.6))
    # D1: puo catturare?
    p.append(diamante(cx, 184, 192, 66, ORO, "#8a5908", ["La carta", "può catturare?"], 15))
    # NO -> Introdurre (sinistra)
    p.append(card(36, 158, 256, 104, "Giocare nel piatto",
                  ["= Introdurre", "aggiungi la tua", "risorsa in scena"], GRIGIO, riga_size=11.5))
    p.append(arrow(cx - 192, 184, 298, 200, GRIGIO, 2.6))
    p.append(txt(cx - 208, 166, "no", 13, GRIGIO, "bold", "end"))
    # SI -> Cattura obbligatoria (giu)
    p.append(arrow(cx, 250, cx, 288, ORO, 2.6))
    p.append(txt(cx + 18, 273, "sì", 13, ORO, "bold", "start"))
    p.append(rect(cx - 188, 290, 376, 58, "#fdeede", ROSSO, rx=12))
    p.append(txt(cx, 315, "Cattura obbligatoria", 14, ROSSO, "bold"))
    p.append(txt(cx, 336, "(non puoi metterla nel piatto)", 11, "#7a4030"))
    p.append(arrow(cx, 348, cx, 388, ROSSO, 2.6))
    # D2: svuota il piatto?
    p.append(diamante(cx, 454, 196, 66, ORO, "#8a5908", ["La cattura", "svuota il piatto?"], 15))
    # SCOPA (alto a destra): bersaglio dei due "sì"
    p.append(card(792, 124, 232, 108, "SCOPA",
                  ["carta in orizzontale", "vale 4 punti"], ORO, riga_size=11.5))
    # D2 NO -> PRESA (giu)
    p.append(arrow(cx, 520, cx, 558, BLU, 2.6))
    p.append(txt(cx + 18, 543, "no", 13, BLU, "bold", "start"))
    p.append(card(cx - 150, 560, 300, 96, "PRESA",
                  ["carta in verticale", "vale 1 punto"], BLU, riga_size=11.5))
    # D2 SI -> SCOPA (su a destra)
    p.append(arrow(cx + 196, 454, 836, 234, ORO, 2.6))
    p.append(txt(720, 372, "sì", 13, ORO, "bold", "end"))
    # PRESA -> D3 (destra)
    p.append(arrow(cx + 150, 608, 700, 608, SCURO, 2.6))
    # D3: usi una spinta?
    p.append(diamante(862, 608, 162, 60, BLU, "#2f547d", ["Usi una spinta", "del pitch?"], 13.5))
    # D3 SI -> SCOPA (su)
    p.append(arrow(862, 548, 922, 234, ORO, 2.6))
    p.append(txt(946, 380, "sì:", 12, ORO, "bold", "start"))
    p.append(txt(946, 397, "diventa scopa", 12, ORO, "bold", "start"))
    # D3 NO -> resta presa (sotto)
    p.append(txt(862, 690, "no: resta una presa", 12, BLU, "bold"))
    return figura(svg(W, H, "".join(p)),
                  "La giocata del turno: introdurre, prendere, o promuovere una presa a scopa con una spinta del pitch (del seme della carta).")


# NB: diag_asta e diag_turno restano definiti ma non sono più usati nel manuale
# (i flowchart di dettaglio asta/turno sono stati rimossi: la struttura della
# scena è coperta dal diagramma flusso-scena a inizio Capitolo 3).
DIAGRAMMI = {
    "cinque-scene": diag_cinque_scene,
    "flusso-scena": diag_flusso_scena,
    "tre-gesti": diag_tre_gesti,
    "esiti": diag_esiti,
    "flusso-partita": diag_flusso_partita,
}


def genera():
    if not os.path.exists(SORGENTE):
        sys.exit(f"Sorgente non trovata: {SORGENTE}")

    with open(SORGENTE, encoding="utf-8") as f:
        testo = f.read()

    corpo = markdown.markdown(
        testo,
        extensions=["tables", "fenced_code", "sane_lists", "attr_list"],
    )

    mancanti = []
    for chiave, fn in DIAGRAMMI.items():
        segno = f"<!-- DIAGRAMMA: {chiave} -->"
        if segno in corpo:
            corpo = corpo.replace(segno, fn())
        else:
            mancanti.append(chiave)
    if mancanti:
        print(f"Attenzione: segnaposto non trovati nel markdown: {', '.join(mancanti)}")

    oggi = datetime.date.today().isoformat()
    cover = (
        '<section class="cover">'
        '<div class="titolo">FRENEMIES<br>ON THE ROAD</div>'
        '<div class="sotto">Manuale del gioco</div>'
        '<hr class="righello">'
        '<div class="occhiello">Una coppia mal assortita parte per una missione disperata, '
        'un viaggio che si scriverà una carta alla volta.</div>'
        f'<div class="occhiello" style="margin-top:40mm;color:#999">Bozza per revisione editoriale &middot; {oggi}</div>'
        '</section>'
    )

    html = (f'<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">'
            f'<style>{CSS}</style></head><body>{cover}{corpo}</body></html>')

    HTML(string=html, base_url=DOCS).write_pdf(USCITA)
    print(f"PDF generato: {os.path.relpath(USCITA)}  ({oggi})")


if __name__ == "__main__":
    genera()
