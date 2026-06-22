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
- node test/test_riprova.js (meccanismo "Rigenera" vs Claude; seed fisso)
- SEED=23 SEED2=43 TRANSCRIPT=1 node test/partita_esempio.js e diff del
  transcript generato (test/transcript_seed_23_43.txt) con
  test/transcript_seed_23_43_v2.txt: se cambia, il §34 del regolamento va
  riscritto. NB l'esempio usa DUE seed: SEED governa le scene 1-2, SEED2 le
  scene 3-5 (l'RNG si rigenera a fine 2ª scena, sul solo mazzo residuo).

## Protocollo per le modifiche alle REGOLE
Le regole sono duplicate in più punti: una modifica che tocca le regole va
propagata, nello STESSO commit, a TUTTI questi (verifica che nessuno descriva
ancora la regola vecchia):
1. docs/frenemies_decisioni.md - una riga nel diario: cosa cambia e perché.
2. docs/frenemies_on_the_road_kb_v1_2.md - la fonte di verità: testo della
   regola e, se serve, l'esempio (§33 scenario demo, §34 partita d'esempio) e
   il registro modifiche. Se cambia il transcript (vedi Collaudo), rigenera
   test/transcript_seed_23_43_v2.txt e riallinea il §34.
3. index.html - tre rappresentazioni delle stesse regole, da tenere in sync:
   - costante REGOLE: il regolamento in-app per i giocatori (pulsante "?"),
     inclusi i suoi esempi (blocchi `.es`).
   - costante REGOLE_IA: il regolamento condensato inviato a Claude in modalità
     vs Claude (con i suoi esempi di tono). NON è un file separato: è una
     stringa dentro index.html.
   - setupPerIA() / statoPerIA(): il contesto di gioco inviato a Claude (dati
     del pitch, stato della partita).

Aggiorna SEMPRE anche gli ESEMPI quando cambia la regola che illustrano: gli
esempi vivono nel KB (esempi inline, §10, §34) e in index.html (blocchi `.es`
di REGOLE, esempi di tono in REGOLE_IA). Il PDF del manuale si rigenera dal solo
KB (docs/genera_pdf.py): per il manuale il KB è già la fonte unica; le copie in
index.html non possono pescare da file esterni (file unico, niente build) e
vanno allineate a mano qui.

## Documentazione delle decisioni
Ogni nuova interpretazione di regole o scelta architetturale (anche non di
regole) va aggiunta come riga in docs/frenemies_decisioni.md nello stesso commit.
