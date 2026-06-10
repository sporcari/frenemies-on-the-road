#!/usr/bin/env python3
"""Rigenera il PDF del regolamento da frenemies_on_the_road_kb_v1_2.md.

Flusso: Markdown -> HTML -> WeasyPrint -> PDF. Se esiste docs/scheda_partita.pdf
(le pagine della scheda di partita dell'originale), viene appeso in coda via pypdf.

Uso:  python3 docs/genera_pdf.py
Dipendenze: markdown, weasyprint, pypdf.
"""
import os
import sys
import datetime

import markdown
from weasyprint import HTML

DOCS = os.path.dirname(os.path.abspath(__file__))
SORGENTE = os.path.join(DOCS, "frenemies_on_the_road_kb_v1_2.md")
SCHEDA = os.path.join(DOCS, "scheda_partita.pdf")   # opzionale: pagine da appendere
USCITA = os.path.join(DOCS, "frenemies_on_the_road_kb_v1_2.pdf")

CSS = """
@page { size: A4; margin: 20mm 18mm; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10.5pt;
       line-height: 1.5; color: #1a1a1a; }
h1, h2, h3, h4 { font-family: 'Oswald', 'Arial Narrow', sans-serif;
       color: #b9770e; letter-spacing: .3px; line-height: 1.2; }
h1 { font-size: 22pt; border-bottom: 3px solid #f5a623; padding-bottom: 4px; }
h2 { font-size: 15pt; margin-top: 18px; border-bottom: 1px solid #e3c98a; padding-bottom: 2px; }
h3 { font-size: 12.5pt; color: #15161a; }
a { color: #4f7cac; }
code { background: #f1efe9; padding: 1px 4px; border-radius: 3px; font-size: 9.5pt; }
pre { background: #f1efe9; padding: 8px 10px; border-radius: 6px; overflow-x: auto; }
blockquote { border-left: 3px solid #f5a623; margin: 8px 0; padding: 4px 12px;
       color: #555; font-style: italic; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.5pt; }
th, td { border: 1px solid #cfcabb; padding: 5px 8px; text-align: left; vertical-align: top; }
th { background: #f5e6c8; font-family: 'Oswald', 'Arial Narrow', sans-serif; }
hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
ul, ol { margin: 6px 0 6px 20px; }
"""


def genera():
    if not os.path.exists(SORGENTE):
        sys.exit(f"Sorgente non trovata: {SORGENTE}")

    with open(SORGENTE, encoding="utf-8") as f:
        testo = f.read()

    corpo = markdown.markdown(
        testo,
        extensions=["tables", "fenced_code", "sane_lists", "toc", "attr_list", "nl2br"],
    )
    oggi = datetime.date.today().isoformat()
    html = f"""<!DOCTYPE html><html lang="it"><head><meta charset="utf-8">
<style>{CSS}</style></head><body>{corpo}</body></html>"""

    HTML(string=html, base_url=DOCS).write_pdf(USCITA)
    print(f"PDF generato: {os.path.relpath(USCITA)}  ({oggi})")

    if os.path.exists(SCHEDA):
        from pypdf import PdfWriter
        w = PdfWriter()
        w.append(USCITA)
        w.append(SCHEDA)
        with open(USCITA, "wb") as out:
            w.write(out)
        print(f"Appese le pagine di {os.path.relpath(SCHEDA)} in coda.")
    else:
        print("(scheda_partita.pdf assente: generato il solo regolamento, nessun merge.)")


if __name__ == "__main__":
    genera()
