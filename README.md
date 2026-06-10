# Frenemies on the Road

Gioco narrativo competitivo per 2, 3 o 4 giocatori su meccaniche tipo Scopa, ambientato in un road movie notturno. Protagonisti (Cuori e Picche) contro Opposizione (Fiori e Quadri), cinque scene fisse, diario relazionale letto dalle dominanze di seme.

## Struttura

- `index.html` — il gioco completo, un solo file HTML/JS tutto client-side (pass-and-play, online a 2 via PeerJS, modalità solo contro Claude)
- `manifest.webmanifest`, `sw.js`, `icon-*.png` — PWA
- `docs/frenemies_on_the_road_kb_v1_2.md` — regolamento, fonte di verità (il PDF si rigenera da qui via WeasyPrint)
- `docs/frenemies_decisioni.md` — diario delle decisioni, da consultare prima di modificare codice o regole
- `test/test_partita.js` — driver headless con scelte casuali: `npm i jsdom && node test/test_partita.js` (variabile `NG=3` o `NG=4`)
- `test/partita_esempio.js` — driver a seed riproducibile con transcript: `SEED=13 TRANSCRIPT=1 node test/partita_esempio.js`
- `test/transcript_seed_13_v2.txt` — transcript di riferimento per la partita d'esempio del §34

## Prassi di collaudo

Dopo ogni modifica alle regole o al codice: una passata di `test_partita.js` a 2 e a 4 giocatori, poi diff del transcript seed 13 col riferimento per capire se il §34 del regolamento va riscritto.

## Deploy

Repository collegato a Netlify: ogni push pubblica la nuova versione. L'online PeerJS è testabile solo sulla versione pubblicata.
