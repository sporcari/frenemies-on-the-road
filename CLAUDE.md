# Frenemies on the Road

Gioco narrativo competitivo 2-4 giocatori su meccaniche tipo Scopa, road movie notturno.
Tutto in italiano. Niente lineette (trattini lunghi) nei testi nuovi.

## Prima di toccare codice o regole
Leggi docs/frenemies_decisioni.md (diario delle decisioni) e, per le regole,
docs/frenemies_on_the_road_kb_v1_2.md, che è la fonte di verità del regolamento.
Il PDF del manuale NON sta nel repo: si rigenera dal markdown via WeasyPrint
solo alle milestone.

## Regole ferree del codice (index.html, file unico HTML/JS client-side)
- Stato globale G separato dall'interfaccia: le funzioni di render r*() non
  mutano MAI lo stato (requisito per l'online, che replica G tra i client)
- Operazioni sulle carte sempre per id, mai per riferimento
- Niente localStorage: salvataggio via export/import JSON
- UI adattiva: mai scroll di pagina in gioco; dimensioni in calc(base*var(--k,1)),
  adattaViewport() solo visuale, non tocca mai G

## Collaudo dopo ogni modifica
npm i jsdom (una volta sola), poi dalla radice del repo:
- node test/test_partita.js  e  NG=4 node test/test_partita.js
- node test/test_adatta.js  e  node test/test_solo.js
- SEED=13 TRANSCRIPT=1 node test/partita_esempio.js e diff del transcript
  generato con test/transcript_seed_13_v2.txt: se cambia, il §34 del
  regolamento va riscritto

## Documentazione delle decisioni
Ogni nuova interpretazione di regole o scelta architetturale va aggiunta
come riga in docs/frenemies_decisioni.md nello stesso commit.
