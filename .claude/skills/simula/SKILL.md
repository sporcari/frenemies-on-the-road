---
name: simula
description: Lancia il benchmark di bilanciamento di Frenemies on the Road (simulazione deterministica di N partite) e ne riassume i risultati confrontandoli col run precedente. Usala quando l'utente vuole misurare l'effetto sul bilanciamento di un cambio di regole, o chiede di "rilanciare le simulazioni", "girare il benchmark", "vedere le statistiche delle partite", "quanto vincono P/O".
---

# Benchmark di bilanciamento (Frenemies on the Road)

Esegui la simulazione deterministica e riporta i risultati in modo confrontabile nel tempo.

## Passi

1. Dalla radice del repo, lancia il runner deterministico:
   ```
   node test/benchmark.js
   ```
   (N di default = 250 partite, seed 1–250, policy di mercato greedy fissa, scoring v1.32. Per un campione diverso: `BENCH_N=200 node test/benchmark.js` — ma il confronto Δ vale solo tra run con lo **stesso N**.)

2. Il runner:
   - appende un record JSON a `test/simulazioni/storico.jsonl` (metadati: data, commit, versione KB, N, seed, policy, scoring + tutte le metriche);
   - rigenera `test/simulazioni/ultimo.md` (report leggibile + Δ rispetto al run precedente).

3. Leggi `test/simulazioni/ultimo.md` e presenta all'utente un riassunto conciso, evidenziando:
   - **A) Esito:** % vittorie missione P vs O; distribuzione dei 4 esiti; ribaltoni dopo i colpi.
   - **B) Punti:** punti lordi per scena (P/O) e totale; netti/spesi. **B.2:** figure possedute per scena.
   - **C) Scene:** rapporto scene vinte (5-0…0-5), poste medie, % vittoria per singola scena.
   - **D) Meccaniche:** figure comprate, scope, rese, jolly.
   - Se esiste un run precedente confrontabile, **metti in risalto i Δ** (cosa è cambiato e perché, se collegabile a un cambio di regole recente).

## Note

- Il benchmark è **deterministico**: a parità di codice/regole due run danno risultati identici (RNG seminato). Quindi ogni differenza tra due run riflette un **cambio di regole o di motore** — è esattamente ciò che serve per valutare il bilanciamento.
- Tetto memoria JSDOM ~300 partite per processo: il default 250 sta sotto. Per campioni più grandi servono più chunk (fuori dallo scopo di questa skill).
- **Committa** `test/simulazioni/storico.jsonl` e `ultimo.md` insieme al cambio di regole che ha motivato il run, così lo storico resta allineato alla cronologia delle regole.
- La policy di mercato del benchmark (greedy: una figura per mercato per lato, la più costosa acquistabile non ancora posseduta) è fissa e vive in `test/partita_smart.js` (gestore fase `mercato`). Se la cambi, i confronti con i run vecchi non sono più validi: annotalo.
