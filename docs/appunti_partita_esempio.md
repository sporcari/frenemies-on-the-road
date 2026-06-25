# Appunti di lavoro — partita d'esempio (Appendice B / §34), scene 3-5

**Cosa è questo file.** Diario di lavoro per la stesura della partita d'esempio dello scenario
"Il sole di mezzanotte" (seed 23/43). Qui registro **alla lettera** tutto ciò che Saverio detta,
mossa per mossa (motivazioni strategiche incluse), prima di trasformarlo nel formato passo-per-passo
dell'Appendice B. Le scene 1-2 e il mercato 2/3 sono già scritti nel manuale; questo file parte dalla
Scena 3.

I fatti meccanici di ogni scena sono presi dal transcript di riferimento (fonte di verità delle
carte). La dettatura di Saverio va ancorata a quelle carte.

---

## ⚠️⚠️ RIPRENDERE DA QUI (agg. 25 giu 2026, sera) — REGOLA v1.26 FATTA, manca seed S3-5 + euristica

**1. REGOLA v1.26 COMPLETATA e propagata (commit non ancora fatto).** Il **sacrificio di una figura vale sempre 1 punto** (come una resa), **mai scopa**, anche sul piatto vuoto. Una scopa è sempre e solo una presa che svuota il piatto. Propagato a: motore `index.html` (ramo `sacrificio` in `giocaCarta` → prese/1pt, niente `aggiungiScopa`; testi/bottoni `opzioniFigura`; `REGOLE`/`REGOLE_IA`), KB §15.3/§16 + registro v1.26 + footer, manuale §3/§6/glossario + footer, diario decisioni #44, driver `test/partita_smart.js` (figura sul piatto vuoto non vale più 1000). **Test core verdi** (partita 2g/4g, adatta, solo, riprova). Voci storiche del registro (v1.6 #3, v1.23 #1) lasciate com'erano.

**2. ESEMPIO — stato nel manuale.** **S1, S2 e mercato 2/3 SCRITTI** (`docs/frenemies_manuale.md`) sul **seed 34**, validi anche sotto v1.26 (non hanno sacrifici di figura → invariati). Contengono molta fiction nuova dettata da Saverio: Grand Hotel + caveau, **Hatim** (concierge), tempesta di sabbia, **formula arcaica di Otto** (planting S5), **Faruq** (alleato sul treno, uomo del Cairo), **rapimento** dei Veglianti (resa = cattura), mercato con **Kalim = Fante = cugino di Faruq, guida del Sahara** (box «Paola annuncia»). **S3, S4, S5 nel manuale sono ANCORA IL VECCHIO ESEMPIO (seed 23/43/5)** → da sostituire. Anche l'intro Appendice B (riga ~873 «scopa 4» → 3) e la nota (~875) restano da sistemare.

**3. SEED PER S3-S5 — approccio deciso (idea di Saverio).** Si **tiene il seed 34 per S1-S2** (preserva tutto il lavoro) e si **rigenera il SOLO mazzo residuo per S3-S5 con un SEED2** (vecchia tecnica multi-seed; `partita_smart.js` già la supporta: reseed a fine S2). Aggiunta opzione **`FIXSEED=N`** al batch di `partita_smart.js`: tiene fisso il seed principale (S1-S2) e fa variare SEED2/SEED3 (S3-S5). Comando ricerca: `MERCATO=canonico FIGJOLLY=1 FIXSEED=34 BATCH=250 node --max-old-space-size=8192 test/partita_smart.js`. Le righe escono come `SEED=34/<seed2>`.

**4. PROSSIMO PASSO (chat dedicata): affinare l'euristica del driver.** Sotto v1.26 l'IA del driver **spreca le figure**: le scarica come sacrificio da 1pt invece di incassarle quando hanno un bersaglio (es. in 34/1 la Regina poteva fare presa al ① ma il driver gioca prima il Fante e la incastra al ⑤ col piatto vuoto). Il `2♠` d'asta è obbligato all'ultima giocata, quindi non è lì il problema: è l'**ordine** delle figure. **TODO:** in `partita_smart.js`, far preferire all'IA di **incassare una figura che ha un bersaglio adesso** piuttosto che rischiare di sprecarla dopo (evita lo stranding). Poi **ri-cercare** (FIXSEED=34) un seed con: cuffia + arco POPOP + effetto Fante visibile + **Regina che fa qualcosa di significativo** (presa vera, o meglio l'ingresso di **Pablo nei colpi di scena** in S5 — la ricerca FIGJOLLY attuale lo escludeva come malus, va rilassata). Candidato attuale (euristica vecchia): **34/1** (cuffia, POPOP, Fante scambio, 1 resa, comeback 0-9→22-9) ma Regina sprecata in S4.

**5. CONTINUITÀ PNG aggiornata:** Faruq (Cairo, interprete/guardia/amico di Otto, sul treno S2, non rapito, raggiunge El Qara) ≠ **Kalim** (Fante ♥, **cugino di Faruq**, guida del Sahara; abbandonato il vecchio «fratello del macchinista»). Regina ♥ = **Pablo Gutiérrez** (pilota del biplano, defeziona per Vera). Re ♦ Opposizione ancora da battezzare.

---

## ⚠️ RIPRENDERE DA QUI (agg. 25 giu 2026) — SCRIVERE LA FICTION dal nuovo seed-vetrina

**Stato.** Il seed-vetrina è stato scelto e **validato sulle regole correnti (fino a v1.25)**. Rosa ristretta a 3, tutti col MERCATO CANONICO (Protagonisti comprano Fante+Regina, Opposizione il Re), tutte e 3 le figure + il Jolly giocati, e arco con **S4 vinta da O, S5 da P**:

| Seed | Arco | Pregi | Esito |
|---|---|---|---|
| **34** (consigliato) | **P,O,P,O,P** (alternato) | rimonta drammatica 0‑17 → 22‑17, **1 sola resa**, Fante/Kalim con effetto visibile in S3 (come il vecchio testo), Jolly sleale (presa) | per il rotto della cuffia |
| 245 | P,O,O,O,P | **tutte e 3 le figure fanno SCOPA in scena** (Fante S3, Regina S4, Re S5) + Jolly scopa‑sleale; ma 2 rese | Vittoria Piena |
| 96 | P,P,P,O,P | **massimo riciclo della Scena 3** (chiude 0‑0 con la spinta ♠ del ciondolo, come il vecchio); ma Jolly solo scartato | Vittoria Piena |

Transcript (fonte di verità delle carte): `transcript_smart_seed_34.txt` / `_245.txt` / `_96.txt` nella radice. Rigenerabili con `MERCATO=canonico SEED=N TRANSCRIPT=1 node test/partita_smart.js`.

**Nota validazione (25/6):** rigenerati dopo i cambi v1.16‑v1.25; i tre giochi sono identici a prima salvo l'etichetta d'esito rinominata dal motore **"Vittoria Totale" → "Vittoria Piena"**. I cambi meccanici (v1.22 tie‑break, v1.23 figura che si sacrifica, v1.25 marcatore Jolly solo narrativo) non alterano queste tre partite. Il driver `partita_smart.js` è stato allineato a v1.23 (`figMetti` → `figSacrPresa`); conta solo se si rilancia la ricerca a 300 seed.

**METODO per scrivere la fiction (come si è sempre lavorato).**
1. La **fonte di verità** sono le carte del transcript del seed scelto: la fiction le **ancora**, non le contraddice mai (chi cala cosa, prese, scope, vincitori di scena, esiti, semi).
2. **Saverio detta** la narrazione mossa per mossa (motivazioni strategiche incluse). L'assistente **registra verbatim** in questo file e poi trasforma nel formato Appendice B. Non si inventa fiction libera: si ancora la dettatura alle carte.
3. **Formato Appendice B** (vedi blocco "FORMATO" più sotto e diario decisioni): riga d'azione `{: .azione }` con motivazione strategica + box `<div class="fiction"><span class="chi">… narra</span>…</div>`. Semi a icona ♠♥♦♣. Nei box NIENTE termini di gioco (posta, mappa…). Niente lineette lunghe.
4. **Regole correnti da rispettare nella fiction:** apertura scena = chi vince l'asta fissa titolo+posta, poi **il framing entra nella PRIMA giocata** (v1.20, supera il vecchio passo di framing separato della v1.18); l'**esito lo narra chi PERDE la posta** (v1.14; parità → chi gioca l'ultima carta, v1.22); terminologia **"missione"** (non "obiettivo finale") e **"Crescita"** nel finale (v1.19/v1.24).
5. **Continuità nomi:** Vera Falco (♠) / Otto Lenzi (♥); Loggia del Basilisco + Veglianti (♦); il deserto/caos (♣). PNG già battezzati: Hatim, **Kalim** (Fante ♥, guida del deserto), **Pablo Gutiérrez** (Regina ♥, pilota del biplano abbattuto da Vera, defeziona per amore). **Re ♦ ancora da battezzare** (figura dell'Opposizione, mercato 4/5).
6. **Riciclo:** la fiction già scritta nel manuale (Appendice B, Scene 1‑3 del VECCHIO esempio) è riusabile **a pezzetti** — l'immaginario legato alla scena (asta, treno+Alì, deserto/biplano/otre/pozzo, ciondolo) torna nella sua scena in ogni seed; i pezzi legati a una carta (Kalim/Fante, spinta ♠ del padre, Pablo/Regina) si ri‑ancorano dove la carta capita.

**Dopo la fiction (lavoro tecnico, anche dopo):** rifare `test/partita_esempio.js` sul seed scelto e rigenerare il transcript di riferimento (regole v1.25), riscrivere KB §34 e Appendice B del manuale, rigenerare i PDF (`genera_pdf_manuale.py`, `genera_pdf.py`) e il `.docx` (`genera_docx_appendiceB.py`). Resta anche lo sweep esempi inline Frank/Skunk nella KB e nei blocchi `REGOLE`/`REGOLE_IA` di `index.html`.

---

## ✍️ DETTATURA SCENA 1 (seed 34) — SCRITTA NEL MANUALE ✅

**STATO:** Scena 1 completa e scritta in `docs/frenemies_manuale.md` (sezione "## Scena 1. Innesco"), forma actual play, al posto della vecchia (seed 23). Narrativa approvata da Saverio. Risolte le due aperture: "tieni il taccuino" (non "diario"); esito = solo azione/inseguimento (la lettura ♥ resta nel testo di servizio fuori box).

**APERTI a valle (NON ancora sistemati):**
- `frenemies_manuale.md` riga ~873 (intro Appendice B): «una scopa 4» è STALE → regole v1.15 scopa=3 (presa 1, presa con figura 2, scopa 3). Da correggere.
- riga ~875 nota: «le prime due scene in forma definitiva» ora incoerente (S1 è seed 34 nuova, S2 è ancora la vecchia seed 23). Da riscrivere quando faremo S2.
- Scene 2-5 + mercati + pitch in breve: ancora vecchio esempio (seed 23/43/5), da rifare sul seed 34.



**SEED SCELTO: 34** (confermato da Saverio). Si scrive fiction NUOVA, non si ricicla il vecchio testo (Saverio: "è più semplice inventare qualcosa di nuovo"). Ci si ancora alle carte del transcript `transcript_smart_seed_34.txt`.

**Fatti meccanici S1 (transcript, fonte di verità).** Asta `1♠`/`1♣` parità → iniziativa Opposizione: **apre Omar**, fissa titolo+posta. Posta: prendere il taccuino di Aldo. Giocate: ① Omar `2♦` apre · ② Paola `2♥` SCOPA (prende il 2♦) · ③ Omar `3♣` · ④ Paola `5♥` · ⑤ Omar `7♣` · ⑥ Paola `1♠` · ⑦ Omar `1♣` (d'asta) presa dell'1♠ · ⑧ Paola `6♥` chiude. Fine: piatto `3♣ 5♥ 7♣ 6♥` → Prot 11 – Opp 10, vincono Protagonisti. Dominante ♥ (batte ♣ 10) → diario su. Esito narrato da Omar (perde la posta).

**① Omar `2♦` (apre, ♦):** CONFERMATO da Saverio — apertura con la corruzione. Framing nella prima giocata (v1.20), voce Omar. [Precisazione Saverio: nel ① dire cosa FA l'assistente, così si capisce perché la Loggia lo corrompe.] L'assistente del banditore è l'uomo che tiene le chiavi dello stanzino e porta in sala i lotti uno alla volta: la Loggia lo compra così che, quando toccherà al taccuino, lo gestisca a loro favore. (Aggancio diretto al ②: è lo stesso assistente che Otto poi distrae.) [Saverio: l'asta si svolge nel salone di un Grand Hotel del Cairo; mette all'incanto vari reperti archeologici raccolti/sottratti negli scavi degli ultimi anni, e tra i lotti c'è il taccuino di Aldo. Dà sostanza al "catalogo" su cui Otto disserta al ②.]

BOX ① FINALE (testo dettato da Saverio, verbatim): «Nel salone delle feste di un Grand Hotel del Cairo si batte all'asta una collezione di reperti archeologici raccolti negli scavi degli ultimi anni, e tra quei lotti c'è il prezioso taccuino di Aldo Falco. La Loggia non lascia nulla al caso: un uomo in doppio petto si avvicina all'assistente del banditore, quello che dal magazzino porterà in sala i lotti durante la serata. Gli fa scivolare in tasca una busta gonfia di banconote.» [Termine fissato: CAVEAU (Saverio: "forse il caveau?" → adottato; meglio di magazzino per reperti di valore in un Grand Hotel, e un caveau chiuso/sorvegliato rende sensato sia il valore dell'assistente con le chiavi sia il varco aperto distraendolo). Box asciutto: tolti Zerzura/"non hanno l'invito"/lampadari/scopo della corruzione. Al ② "stanzino/magazzino" → "caveau".]

**Dettatura iniziale ② (poi ridistribuita):** Saverio aveva dettato per il `2♥`: «Otto che nota la cosa e si unisce alla conversazione, facendo una lunga e noiosa dissertazione sull'antico egizio, e sui pezzi in catalogo, dando modo a Vera di avvicinarsi allo stanzino…». Poi (vedi sotto) ha voluto **far tornare Hatim**, e abbiamo distribuito le due idee ♥ su due carte: Hatim al ②, la dissertazione di Otto al ④.

**② Paola `2♥` SCOPA (♥ = l'accesso di Hatim):** Saverio: «far tornare in pista Hatim che fa entrare i nostri da una porta sul retro e li accompagna direttamente al caveau». Hatim = concierge del Grand Hotel, vecchio amico di Otto (circolo scacchistico). La scopa cattura il `2♦` = scavalcano ingresso sorvegliato + messinscena della Loggia; Vera arriva al caveau (NON prende ancora il taccuino).

**③ Omar `3♣` (♣ caos AMBIENTALE):** dettatura Saverio: «dai grandi tendaggi rossi ai lati delle finestre spalancate si sta riversando sul pavimento di marmo un'orda di scorpioni del deserto», nessuno l'ha ancora notato. Il deserto si insinua nel Cairo (foreshadowing). Il `3♣` non viene mai catturato → resta nel piatto fino al finale (conto ♣=10). CONFERMATO.

**④ Paola `5♥` (♥ = la copertura di Otto):** la dissertazione erudita (spostata qui dal ②). L'assistente torna ogni tanto al caveau a prelevare il lotto successivo; Otto lo trattiene in sala con la parlantina (egizio antico, pezzi in catalogo, datazioni, geroglifici), così Vera lavora indisturbata nel caveau. CONFERMATO (Saverio: «in pratica lo trattiene»).

**⑤ Omar `7♣` (♣ caos):** dettatura Saverio: «con il 7 di fiori Otto ha una crisi delle sue con gli scorpioni, dato che è pieno di fobie». Gli scorpioni del ③ ripagano: Otto, pieno di fobie, va in crisi; la sua copertura (④) salta. Voce Omar.

NB GEOGRAFIA: al ④ corretto «nel caveau» → «al caveau» (Vera lavora ALLA porta, non è ancora dentro). Sequenza: ② Hatim la porta alla porta del caveau → ④ Otto la copre → ⑥ Vera scassina ed entra.

**⑥ Paola `1♠` (♠ = azione fisica di Vera):** dettatura Saverio: «Il cosiddetto caveau è uno stanzino con una porta blindata e scaffali alle pareti. Per fortuna la serratura è un modello vecchio e Vera riesce ad avere la meglio su di essa». Vera forza la vecchia serratura ed entra nel caveau (tra gli scaffali coi lotti). NON prende ancora il taccuino: il `1♠` verrà catturato al ⑦; il taccuino si conquista all'⑧ (chiusura ♥, diario su).

**⑦ Omar `1♣` (♣ = sfortuna, NON la Loggia; presa dell'1♠):** [Correzione Saverio: è asso di FIORI → caos/sfortuna, non ♦. Koenig NON entra in S1, niente ♦ a cui agganciarlo.] dettatura Saverio: «Vera entra, ma la porta si richiude alle sue spalle e si blocca, dall'interno non ci sono serrature». Vera resta CHIUSA DENTRO il caveau (la porta blindata si apre solo dall'esterno). La sfortuna ♣ annulla lo scasso riuscito (il `1♠`). Prepara l'⑧. Voce Omar.

**⑧ Paola `6♥` (♥, chiude → dominante ♥, diario su):** dettatura Saverio (verbatim): «Otto è corso fuori dall'Hotel, blaterando di una qualche maledizione o una piaga d'egitto, che si è manifestata con l'invasione di scorpioni. Mentre sta riprendendo fiato nel vicolo, sente la voce di Vera che lo chiama da una finestrella con pesanti inferiate di ferro, l'unica apertura dello stanzino nel quale è rimasta intrappolata. "Otto sono rimasta bloccata qui... tieni il diario"». → Vera intrappolata affida il taccuino a Otto attraverso le inferriate = gesto di fiducia, il legame regge (diario su); i Protagonisti conquistano la posta (taccuino loro). [DA DECIDERE: "tieni il diario" — possibile clash col termine di gioco "diario del rapporto". Proposto "tieni il taccuino" per coerenza con il resto del testo. Anche da chiarire: Vera resta dentro? La liberazione (Hatim/Otto) si può mettere nell'esito.]

**ESITO S1 (Omar narra — perde la posta, v1.14):** dettatura Saverio (verbatim): «Otto si allontana dall'Hotel e dai dannati scorpioni, quando l'assistente del banditore apre la porta Vera scatta fuori travolgendolo. Gli uomini della Loggia hanno capito perfettamente cos'è successo quando la vedono uscire così di corsa e la riconoscono e iniziano ad inseguirla per le vie del Cairo». → Vera si libera (l'assistente torna e apre, lei lo travolge); la Loggia la riconosce e la insegue (ombre + ponte verso il treno di S2). NB: dominante ♥ (diario su) = la scena l'ha decisa il legame (Hatim + copertura di Otto + fiducia all'inferriata); ma l'esito dettato è action/inseguimento. DA CHIARIRE: vuoi un tocco di ♥ nella voce di Omar (ammettere che è stato il gioco di squadra a fregarli) o la lettura del dominante resta solo nel testo di servizio fuori box?

---

## (STORICO) RIPRENDERE DA QUI (giugno 2026) — REGOLE v1.15: l'esempio va RIGENERATO da zero

Le regole sono cambiate (v1.15, vedi memoria `regole-v115-overhaul` e registro KB v1.15): **scopa=3, presa=1 sempre, Fante nel mazzo con nuovo effetto (sbircia 2/scambia 1), ordine mercato→mescola(se hai comprato)→pesca**. Tutto il vecchio esempio sotto (3 seed 23/43/5, Scena 4 scriptata, scopa=4) è **NON PIÙ VALIDO**: `test/partita_esempio.js` e `test/transcript_seed_23_43_5_v2.txt` vanno rifatti. Motore/REGOLE/KB/manuale/test sono già allineati e verdi; resta da **scegliere un nuovo seed-vetrina, rigenerare il transcript, e riscrivere §34 + Appendice B** (la fiction la detta Saverio).

### Come GENERARE e cercare i seed (driver `test/partita_smart.js`, già su regole v1.15)
- Partita singola: `SEED=N TRANSCRIPT=1 node test/partita_smart.js` → scrive `transcript_smart_seed_N.txt` (+ riga riassunto).
- Ricerca a batch con filtro: `ARCO=POPOP BATCH=300 node --max-old-space-size=8192 test/partita_smart.js 2>/dev/null | grep -vE "_location|jsdom|at "`.
  - `BATCH=N` gioca i seed 1..N (entrambi i lati col gioco ottimale euristico) e stampa: medie (punti netti/spesi/lordi, scope, figure comprate per lato, % vittoria Prot, % "per il rotto della cuffia"), poi i seed che soddisfano TUTTI i criteri, poi i parziali 4/5.
  - `ARCO=POPOP` (o altro, es. PPOOP) evidenzia i seed con quell'esatta sequenza di vincitori di scena.
  - Memoria tecnica: JSDOM perde memoria → c'è `window.close()`, ma usa `--max-old-space-size=8192` e BATCH ≤ ~300; l'errore finale `_location` è solo il teardown, innocuo.
  - **Per il nuovo esempio canonico usa il MERCATO DI DEFAULT** (smart: prima il Fante poi la figura più potente), NON `MERCATO=canonico` (serviva solo a confrontare a parità di pescate il vecchio esempio). `SCOPA`/`FIGPRESA` lasciali ai default (3/1).

### Criteri di SELEZIONE del seed-vetrina (i 5 controllati dal batch + le preferenze di Saverio)
1. **Poste 3/2** (split bilanciato, non cinquina): `nP/nO` = 3/2 o 2/3.
2. **Vittoria finale dei Protagonisti "per il rotto della cuffia"**: outcome contiene "ROTTO DELLA CUFFIA" e `finalP>finalO`.
3. **Ribaltone DOPO i colpi di scena**: al primo conteggio i Protagonisti NON sono avanti (`primoP<=primoO`) e dopo i colpi sì (`finalP>finalO`). La vittoria non deve essere già acquisita al primo conteggio.
4. **Tutte e 3 le figure comprate** (Fante, Regina, Re presenti tra gli acquisti dei due lati).
5. **Almeno una resa** (resa onorevole/ritirata di un lato con ultima carta ininfluente).
Preferenze aggiuntive di Saverio (per scegliere tra i candidati): **arco P,O,P,O,P** (alternato) era il preferito; **scope da entrambi i lati** (showcase più ricco); **una sola resa** (più pulita di tre); le **figure giocate in azione** (non solo comprate) sono un plus; col nuovo Fante che va in mazzo e viene comprato presto, controlla che venga **giocato** e che l'effetto si veda.

### Dopo aver scelto il seed
- Rifare il driver canonico (`partita_esempio.js`) per le regole v1.15: nuovo modale Fante (`#fanteSwap`/`#fanteNo`), etichette punteggio (presa 1 / scopa 3), via la Scena-4 scriptata e il meccanismo a 3 seed (col nuovo flusso e mescola-se-comprato si può usare un solo SEED, o una linea scriptata nuova). Rigenerare il transcript di riferimento.
- Riscrivere §34 (KB, togliere la nota "stale") e Appendice B (manuale) con la fiction (Saverio detta, io anchoro alle carte del nuovo transcript). Formato Appendice B invariato (vedi sotto).
- Rigenerare i PDF (`python3 docs/genera_pdf_manuale.py` e `docs/genera_pdf.py` per la KB) e il `.docx` (`docs/genera_docx_appendiceB.py`).
- Restano in sospeso anche: sweep esempi inline Frank/Skunk → Vera/Otto; eventuale ritocco costi figure (3/5/8, per ora invariato).

---

## (STORICO, NON PIÙ VALIDO con v1.15) STATO CORRENTE precedente

**Esempio canonico = TRE seed: `SEED=23 SEED2=43 SEED3=5`.** SEED → scene 1-2, SEED2 → scena 3, SEED3 → scene 4-5 (reseed a fine S2 con SEED2 e a fine S3 con SEED3). Reference: `test/transcript_seed_23_43_5_v2.txt`. Collaudo: `SEED=23 SEED2=43 SEED3=5 TRANSCRIPT=1 node test/partita_esempio.js` poi diff con la reference (deve essere identico). Il driver alza a 3 il tetto spinte (`spinteUsate<3`).

**Cosa è GIÀ SCRITTO nel manuale (`docs/frenemies_manuale.md`, Appendice B):** pitch in breve, prima difficoltà, **Scena 1**, **Scena 2**, **Mercato 2/3** (Fante=Kalim), **Scena 3** (con esito finale aggiornato), **Mercato 3/4** (Regina ♥ = Pablo Gutiérrez). Tutto rigenera il PDF con `python3 docs/genera_pdf_manuale.py`.

**Cosa MANCA da scrivere (fiction), nell'ordine:**
1. **Scena 4 — Nella città perduta (Crisi)** — scheletro carte più sotto in questo file. Iniziativa ai Protagonisti (Paola inquadra); l'Opposizione vince con la **scopa della spinta ♣** (il deserto li travolge). Esito narrato da **Paola** (perde la posta). DA DETTARE/BOZZARE; aperto: se/come esce il segreto su Aldo (spinta ♣ Fiori #2 "Aldo è vivo, è un Vegliante" NON ancora usata in gioco).
2. **Mercato 4/5** — Omar compra il **Re ♦** (ancora da battezzare: "deus ex machina", in cripta si sacrifica per una scopa).
3. **Scena 5 — La cripta del Sole (Risoluzione)** — scheletro più sotto. Re♦ scopa, Jolly (4 pt a Omar), colpi di scena (Pablo/Regina entra, elimina, è eliminato) → ribaltone piatto 12-0 → per il rotto della cuffia.

**FORMATO (fisso) dell'Appendice B:** ogni passo = riga d'azione in chiaro (chi cala quale carta, effetto in gioco, **+ motivazione strategica**) con `{: .azione }`, poi un `<div class="fiction"><span class="chi">Paola narra</span>…</div>` (box **monocolore**, SOLO fiction, didascalia "Paola narra"/"Omar narra"; per posta+titolo `<span class="titolo-scena">`). Apertura scena (v1.20): il vincitore d'asta stabilisce titolo+posta → box; poi apre la scena giocando la prima carta, e la narrazione di quella prima giocata include il framing (situazione + atmosfera) → box. Niente passo di framing separato. Esito/conteggio in testo normale FUORI dai box. **Semi a icona ♠♥♦♣.** Nei box NON usare termini di gioco (niente "posta"/"mappa"). CSS in `docs/genera_pdf_manuale.py`. Niente lineette lunghe (—).

**Regole stabilite questa sessione:** v1.13 posta "il cosa non il come / mai indispensabile"; v1.14 **l'esito lo narra chi PERDE la posta** (parità → chi vince l'asta). "La mappa" → "il prezioso taccuino di appunti su come raggiungere l'artefatto" ovunque. Esito narrato dal seme dominante (♣=caos/attrito, ♦=nemici, ♠/♥=Protagonisti con forza/dialogo); scopa di chiusura → piatto vuoto → seme dominante e diario in parità.

**PNG creati (su index card all'acquisto/introduzione):** Hatim (5♥, concierge), assistente del banditore, sgherri/Loggia, Alì (7♦, guerriero Veglianti), Gustav Koenig (9♥, luogotenente Loggia), **Kalim** (Fante ♥, guida del deserto, fratello del macchinista), **Pablo Gutiérrez** (Regina ♥, aviatore della Loggia folgorato da Vera, prima o poi traditore). **DA BATTEZZARE: Re ♦** (figura dell'Opposizione, mercato 4/5).

**ALTRO LAVORO IN SOSPESO (v1.12):** sweep degli **esempi inline ancora Frank/Skunk** nel manuale (capitoli 3-7, ~16 occorrenze: righe indicative 181/187/235/251/263/269/275/329/407/494/535/537/539/562/574/617), e gli esempi inline della KB + i blocchi `.es`/esempi di tono in `REGOLE`/`REGOLE_IA` in `index.html`. Da convertire a Vera/Otto **pescando dall'actual play una volta finito** (richiesta di Saverio).

**Git:** ramo `manuale-actual-play-appendice-b`, ultimo commit di checkpoint + commit di fine sessione. PDF del manuale e PDF KB esclusi dai commit (policy / KB PDF stale, da rigenerare a milestone).

---

## ✍️ DETTATURA SCENA 2 (seed 34) — SCRITTA NEL MANUALE ✅

**STATO:** Scena 2 completa e scritta in `docs/frenemies_manuale.md` ("## Scena 2. Adattamento"), forma actual play, al posto della vecchia (seed 23). Esito approvato (rapimento, dominante ♦). Confermato: avvertimento di Alì spostato ad Aldo in S4. RITOCCHI: ⑤ con callback scorpioni+tempesta e Otto che si rannicchia "in attesa di morte imminente"; RESA/ESITO RISTRUTTURATI (Saverio): il box "Alì tira il freno…/rapimento" è la **narrazione dell'ESITO** (Paola, perde la posta); la **resa** (⑧, `4♠`=♠=Vera) ha un box suo, dettatura Saverio (verbatim): «Vera impietosita dallo stato di Otto e non volendo causare spargimenti di sangue alza le mani e le mette dietro alla testa, suggerendo al compagno di fare lo stesso. -Ci arrendiamo, ma non fate male a questi uomini... siete noi che volete-». Quindi nel manuale: ⑧ resa (gesto di Vera) → Fine del round (1-12, ♦) → esito (rapimento). [♠ del `4♠` = la resa è un gesto di Vera, non di Otto.]

**MERCATO 2/3 SCRITTO NEL MANUALE ✅** ("## Mercato, tra la seconda e la terza scena"). CONVENZIONE MERCATO (Saverio): il mercato NON narra una scena. Struttura = (1) punti; (2) box **«[Giocatore] annuncia»** che PRESENTA il PNG (chi è + breve descrizione da index card, niente trama); (3) **azione al tavolo** con la meccanica d'acquisto (costo, figura nel mazzo, rimescola+ripesca; pagare = rimettere negli scarti una carta‑scopa/presa del valore giusto). Stessa struttura per i mercati 3/4 (Regina) e 4/5 (Re). Punteggio v1.15 corretto: **Paola 8** (S1 scopa 3; S2 scopa 3 + presa 1 + resa onorevole 1) → compra Fante (3) → **restano 5**; **Omar 2** (una presa a scena), non compra (mira al Re). Fante entra nel MAZZO (v1.15), rimescola+ripesca → in S3 in mano.

**CONTINUITÀ PNG AGGIORNATA (importante per la memoria):**
- **Faruq** = guida/interprete/guardia del corpo, amico di famiglia di Otto, uomo del CAIRO; sul treno in S2, intralcia Alì, NON rapito, raggiunge El Qara.
- **Kalim** = **Fante ♥**, **cugino di Faruq**, guida esperta del SAHARA (NON più "fratello del macchinista"). Faruq lo manda a cercarli; entra in gioco in S3 (scopa, "si sacrifica con un gesto eroico").
- Abbandonati: il macchinista/fratello come fonte di Kalim.

**PENDENTI (intro Appendice B):** riga ~873 "scopa 4" → 3 (e "presa con figura 2" → la presa con figura vale 1, non 2, in v1.15: verificare e correggere). Nota "le prime due scene in forma definitiva" ora copre S1+S2+mercato nuovi; il resto (S3-5, pitch in breve) è ancora vecchio.



**Fatti meccanici (transcript).** Asta Paola `1♥` vs Omar `2♣` → iniziativa Opposizione, apre Omar; `2♣` messo da parte d'asta, `1♥` torna in mano a Paola. Piatto in entrata da S1: `3♣ 5♥ 7♣ 6♥`. Mani: Paola `9♥ 4♠ 8♥ 1♥` · Omar `10♦ 8♣ 5♣` (+`2♣`). Posta: Raggiungere El Qara in tempo. Giocate: ① Omar `5♣` presa (cattura `5♥`) · ② Paola `9♥` presa di 2 (`3♣`+`6♥`) + SPINTA ♥ → SCOPA (spazza `7♣`) · ③ Omar `10♦` · ④ Paola `1♥` · ⑤ Omar `8♣` · ⑥ Paola `8♥` presa (`8♣`) · ⑦ Omar `2♣` (d'asta) · ⑧ Paola `4♠` RESA ONOREVOLE. Fine: piatto 1 a 12 → vince OPPOSIZIONE, dominante ♦ (diario su). Mercato: Protagonisti comprano il Fante ♥. **Esito narrato da PAOLA** (Protagonisti perdono la posta, v1.14: prima sconfitta che narrano loro).

**① Omar `5♣` (apre, ♣ = attrito; presa del `5♥`):** dettatura Saverio (verbatim): «apre Omar con una presa di fiori. Quindi direi che descrive Otto e Vera in uno scomparto del treno a vapore che stanno litigando animatamente su come sono andate le cose la sera prima. Otto non voleva rubare il taccuino e Vera insiste che non l'hanno rubato perché quell'oggetto gli apparteneva.» → framing nel treno a vapore + litigio del mattino dopo (♣ attrito); la presa del `5♥` = la lite si mangia un pezzo della complicità ritrovata al Cairo. Voce Omar.

REVISIONE Saverio (① troppo fiacco): aggiungere una **tempesta di sabbia** che costringe il macchinista a rallentare e fermare il treno ad aspettare che passi. [Accortezza assistente: la tempesta = il `5♣` GIOCATO da Omar (♣ = caos del deserto, coerente col pitch), NON il `5♥`; il `5♥` catturato resta la complicità che la sosta forzata si rimangia. Più dinamico + semi puliti.] CONFERMATO (Saverio è passato al ②).

**② Paola `9♥` presa di 2 (`3♣`+`6♥`) + SPINTA ♥ → SCOPA (spazza `7♣`):** spinta del pitch di Otto «La caccia l'ha riaperta la sua traduzione: se finisce male, è colpa sua» (senso di colpa/responsabilità). Struttura: presa = Otto chiude i finestrini e si mette a studiare il taccuino (pagine, disegni, mappe, congetture); spinta→scopa = SVOLTA, dettatura Saverio (verbatim): «viene colto da un'illuminazione e ripete una formula in una lingua arcaica letta sul taccuino ed ecco che la tempesta si placa e il treno può ripartire». Chiude il cerchio col ① (la tempesta che aveva fermato il treno si calma) + planting per S5 (le decifrazioni di Otto hanno potere reale). Voce Paola.

**③ Omar `10♦` (♦ = nemici, carta pesante):** Saverio: «ricicliamo l'arrivo di Alì». Riciclo dal vecchio testo SOLO l'arrivo di Alì (il framing del treno è già al ①; il treno ha appena ripreso a correre dopo la tempesta del ②). Alì = guerriero dei Veglianti (tuareg, turbante, occhio tatuato in fronte) che salta sul treno in corsa. PNG su index card. Voce Omar.

**④ Paola `1♥` (♥ = legame, gesto piccolo; asso debole, resta nel piatto):** [Saverio "uffa ancora cuori"; risolto con un gesto, non un discorso.] dettatura Saverio (verbatim): «Otto è ancora stupito per quello che è riuscito a fare, come se si fosse appena svegliato da un sogno, richiude il taccuino con le mani tremanti e lo consegna a Vera. Tienilo tu.» → Otto scosso dalla formula (planting S5: potere reale) affida il taccuino a Vera. SPECCHIO del ⑧ di S1 (lì Vera→Otto, qui Otto→Vera). Prepara il furto di Alì (ora il taccuino ce l'ha Vera). Aggiunta Saverio: «Vera annuisce e lo nasconde nel suo tascapane» (il TASCAPANE è dove Alì poi andrà a strappare il taccuino). Voce Paola.

**⑤ Omar `8♣` (♣ = caos interno, il panico di Otto):** dettatura Saverio (verbatim): «8 di fiori potrebbe essere Otto che va fuori di testa, si rende conto che stanno avendo a che fare con forze troppo grandi, sovrannaturali. E i passi di Alì che sta raggiungendo lo scompartimento lo terrorizzano.» → Otto crolla proprio dopo il suo colpo di genio (la formula); capisce che è sovrannaturale + i passi di Alì lo terrorizzano. Voce Omar. [⑥ `8♥` di Vera cattura questo `8♣` = lei assorbe/gestisce il panico di lui.]

**⑥ Paola `8♥` presa dell'`8♣` (♥ = alleato):** dettatura Saverio (verbatim): «8 di cuori, Faruq la guida, interprete e guardia del corpo, amico di famiglia di Otto stava appisolato nello scompartimento accanto. Quando sente il baccano fatto da Alì, esce nel corridoio e lo afferra per il mantello guerriero trattenendolo per un po'. "Signor Otto, signorina Vera scappate ci penso io..."». AGGIUNTA Saverio: «Otto torna in sé, non può permettere che Faruq rischi la vita per lui». → NUOVO PNG **Faruq** (guida/interprete/guardia del corpo, amico di famiglia di Otto); il `8♥` cattura l'`8♣` = il legame spezza il panico di Otto. Voce Paola.

**⚠️ DA DECIDERE — Faruq vs Kalim:** Faruq è "guida", ma il Fante ♥ comprato al mercato dopo S2 finora era **Kalim** "guida del deserto". Due guide si pestano i piedi. (a) Faruq = il futuro Fante (se sopravvive); (b) Faruq alleato di una scena sola (resta a trattenere Alì) e il Fante resta Kalim. L'aggiunta "Otto non può permettere che rischi la vita" lascia aperto: forse tornano per lui. Saverio non ha ancora scelto.

**⑦ Omar `2♣` (carta d'asta, ♣ = caos):** Alì si libera di Faruq e la situazione precipita: rende inevitabile la resa. [Correzione Saverio: «Alì non è mai stato realmente bloccato da Faruq ma solo intralciato» → niente corpo a corpo vinto; Alì se lo scrolla di dosso senza rallentare. Ammorbidito anche il ⑥ ("trattiene per un po'", non "con tutta la stazza").] Voce Omar.

**⑧ Paola `4♠` RESA ONOREVOLE (cede la scena) — RAPIMENTO:** [Saverio ha CAMBIATO idea: non consegnano il taccuino, vengono RAPITI.] dettatura Saverio (verbatim): «E se invece anziché consegnare il diario Alì li incappucciasse e li rapisse? Li fa scendere dal treno dove altri suoi complici li caricano sui loro cammelli». + «Sì diciamo che Alì è venuto per rapirli, non per il taccuino». → Alì è venuto per LORO, non per il taccuino: li rapisce. **Il taccuino resta nascosto nel tascapane di Vera** (Alì non lo cerca). Il rapimento = perdita della posta (non arrivano a El Qara).

REGIA FINALE ⑧ (dettatura Saverio, verbatim): «non dire che non è venuto per il taccuino, è superfluo. Alì tira il freno di emergenza. Nessuno ha il coraggio di opporsi a quel mezzo gigante intabarrato di nero, dal cui fianco pende un'enorme scimitarra. Salgono i suoi complici, altri Veglianti mascherati che in pochi istanti immobilizzano Otto e Vera e li fissano di traverso sulle selle dei loro cammelli.» → NON dire in prosa "non per il taccuino" (resta solo logica interna). Alì descritto: mezzo gigante intabarrato di nero + enorme scimitarra (coerente col ③). Voce Paola. Coda su Faruq (approvata da Saverio): vede sparire i due oltre le dune + «forse sarà lui, di tutti loro, l'unico ad arrivare davvero a El Qara» (Faruq prosegue, raggiunge El Qara, e da lì tornerà a salvarli come Fante).

L'avvertimento «Voi non potrete mai capire, tornate a casa vostra finché siete in tempo» → SPOSTATO: proposto per ALDO FALCO in S4 (il padre Vegliante davanti alla cripta). Da confermare.

**ESITO S2 (Paola narra — perde la posta, dominante ♦):** non arrivano mai a El Qara; portati nel deserto sui cammelli dei Veglianti; saltano carovana + guide indigene. Tinta ♦ = i nemici (Veglianti) hanno deciso. Imposta la S3 (fuga nel deserto). RISOLTO Faruq (Saverio): «Faruq non lo rapiscono ma può tornare utile per venirli a salvare più avanti come Fante». → Faruq resta sul treno (vivo, solo intralciato al ⑦), NON rapito; torna in S3 come **Fante** a salvarli e fare da guida. Combacia col motore (S3 Fante = SCOPA, chiosa "si sacrifica con un gesto eroico" → Faruq li libera e si sacrifica). **Faruq = Fante CONFERMATO, Kalim ABBANDONATO** (aggiornare la memoria/continuità: il Fante ♥ non è più Kalim ma Faruq, guida/interprete/guardia del corpo, amico di famiglia di Otto).

## Scena 3 — Il mare di sabbia (Frattura)

**Setup (dal transcript).**
- Dopo il mercato 2/3: il Jolly è entrato nel mazzo dei Protagonisti.
- Mani: Protagonisti `9♠ 4♠ 10♥ F♥` (F♥ = il Fante comprato, Kalim) · Opposizione `2♣ 6♦ 5♦ 9♦`.
- Asta: Protagonisti `4♠` contro Opposizione `5♦` → iniziativa all'**Opposizione** (Omar definisce titolo e posta e apre la scena con la prima giocata, che include il framing, v1.20).
- Posta (NUOVA, adottata): Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se si ottiene: i protagonisti possono accamparsi e prepararsi alla ricerca. Altrimenti: si perdono nel deserto. (Vecchia posta scartata: "Attraversare le dune col taccuino…")

**Le giocate del round (ordine reale).**
1. Omar `6♦` → giocata nel piatto (nuova risorsa/minaccia). Piatto: 6♦
2. Paola `F♥` (Fante, Kalim) → **SCOPA** (il Fante vale 8, cattura il 6♦ e svuota il piatto). Effetto Fante: guarda le prime 4 carte del mazzo = **3♠ 8♥ 4♥ 7♠** (verificato instrumentando il driver; è la mano che pescherà in Scena 4) e **le tiene tutte** (il driver clicca Conferma senza mandarne in fondo nessuna). Piatto: vuoto
3. Omar `9♦` → giocata. Piatto: 9♦
4. Paola `10♥` → giocata. Piatto: 9♦ 10♥
5. Omar `2♣` → giocata. Piatto: 9♦ 10♥ 2♣
6. Paola `4♠` → giocata. Piatto: 9♦ 10♥ 2♣ 4♠
7. Omar `5♦` → giocata. Piatto: 9♦ 10♥ 2♣ 4♠ 5♦
8. Paola `9♠` → presa del 9♦, poi **SPINTA del pitch ♠** «Suo padre è sparito cercando Zerzura: trovarla vuol dire realizzare il suo sogno e dare un senso al suo sacrificio» → la presa diventa **SCOPA** e raccoglie le 4 carte rimaste (10♥ 2♣ 4♠ 5♦). Piatto: vuoto

**Fine Scena 3:** piatto 0 a 0 → vince Protagonisti; seme dominante parità (diario: pari).
Punti: Paola fa 2 scope (8 punti) in questa scena; Omar 0. (Paola aveva 2 punti residui dopo il Fante → 10; Omar resta a 6.)
**Mercato dopo S3:** Protagonisti comprano la **Regina di Cuori ♥** (costa 5; a Paola restano 5). Omar continua a tenere i punti.

**Note di continuità:** la spinta ♠ usata qui («realizzare il sogno del padre e dare un senso al suo sacrificio») è una delle due spinte dei Protagonisti; si "consuma". La spinta ♦ dell'Opposizione era già stata usata in Scena 2 (le trappole dei Veglianti).

**Correzione Saverio (mossa 3, 9♦):** «Il 9 di quadri fai che è un biplano della Loggia che sorvola il deserto in perlustrazione.» → minaccia = biplano della Loggia in ricognizione (non più la colonna di automobili).

**Correzione Saverio (mossa 7, 5♦):** «All'alba del giorno dopo la colonna di fumo che si alza dal bivacco e il biplano li avvista e si avvicina, partono raffiche di mitra che costringono il convoglio a nascondersi dietro a una duna.» → minaccia = il biplano (continuità con mossa 3) li avvista grazie al fumo del bivacco e li mitraglia, riparo dietro la duna. (Adeguato anche l'inizio della mossa 8: «sotto il fuoco del biplano» invece di «davanti ai Veglianti».)

**Dettatura Saverio (mossa 8, 9♠ + spinta ♠ → scopa):** «Vera usa il ciondolo che porta al collo, con la foto di suo padre e sua madre per accecare con il riflesso del sole abbagliante il pilota del biplano, costringendolo ad una brusca virata, mentre fa fuoco con il suo revolver contro il velivolo colpendone il serbatoio. È l'occasione perfetta per rimettersi in fuga sui cammelli.» → la chiusura lega il ciondolo (foto del padre) alla spinta ♠ «realizzare il sogno del padre e dare un senso al suo sacrificio»; poi fuga sui cammelli fino all'oasi. NUOVO dettaglio personaggio: Vera porta al collo un **ciondolo con la foto di padre e madre**.

**Correzione esito S3 (diario):** il diario si legge da ♥ vs ♠ NEL PIATTO a fine scena (KB §27.2). S3 chiude con una scopa → piatto vuoto → **parità → diario pari** ("né avanzato né peggiorato"). Quindi l'esito NON deve parlare di frattura che si approfondisce (sarebbe diario giù = Picche dominanti). Riscritto: posta vinta (oasi), e SOPRATTUTTO l'avvicinamento (Saverio: "nella scena si è visto che i due si sono avvicinati" = mossa 4, 10♥, la notte al fuoco). Spiegazione meccanica messa nel conteggio: il 10♥ della vicinanza era sul tavolo, ma la scopa finale l'ha spazzato via → piatto vuoto → diario pari. L'avvicinamento c'è stato nella scena, ma non resta inciso nel piatto. Segreto di Otto = seme sospeso (Crisi S4), non frattura che cresce. NB design: una scena chiusa in scopa azzera il piatto e quindi il diario esce sempre "pari" comunque sia andata la relazione nella scena.

**Correzioni Saverio (esito + mossa 5):** (1) nei box di narrazione NON usare la parola "posta" (è un termine di gioco). (2) TOLTO il segreto di Otto che scrive di nascosto: **Otto e Vera li tiene sempre Paola**, non ha senso che come giocatrice progetti qualcosa contro se stessa (regola di metodo da ricordare per tutta la partita). (3) Il contrappeso all'avvicinamento (fuoco, mossa 4) diventa la **mossa 5 (Omar 2♣)**: l'otre non si rompe per caso, è **colpa di Otto che non ha stretto il tappo** e l'acqua è colata via durante il tragitto; **Vera si infuria con lui**. Così avvicinamento (fuoco) e lite (acqua) si bilanciano → diario pari sensato anche in fiction. Esito riscritto in quest'ottica, senza "posta" e senza segreto.

**Dettatura Saverio (mossa 4, 10♥):** aggiunta — Otto, al fuoco, rivela i progressi già fatti col taccuino prima del furto di Alì: aveva **già decifrato gran parte dell'enigma per oltrepassare le porte della città proibita**, e ce l'ha in testa. → il 10♥ (risorsa pesante) diventa una risorsa concreta che peserà alla cripta (S5), e rafforza la continuità "taccuino perso non è fatale" (Vera ha la mappa, Otto l'enigma). Planting per S5 (passare le porte durante l'eclissi).

**Richiesta Saverio (trasversale):** a ogni esito delle 3 scene, spiegare come il **seme dominante** influenza la narrazione (KB §27.1: ♠/♥ = decidono i Protagonisti con forza/dialogo; ♦ = i nemici; ♣ = caos/attriti; vale a prescindere da chi vince). Aggiunta dopo ogni esito una nota "Come il seme dominante guida l'esito": S1 dominante ♣ → Omar narra la vittoria come una crepa di coppia; S2 e S3 chiudono in scopa → piatto vuoto → parità → vittoria netta, nessun dominante a colorare (in S2 la scopa finale "cancella" il dominio di Alì/♦ avuto durante la scena). NB: lo stato coppia è il DIARIO (♥ vs ♠), diverso dal seme dominante (chi/cosa ha deciso).

**CAMBIO DI REGOLA (Saverio, v1.14): l'esito lo narra chi PERDE la posta** (non più chi perde l'asta), per caricarlo di ombre. Parità dei totali → narra chi vince l'asta (evita due narrazioni di fila del perdente d'asta = ultima carta). Propagato a KB §13/§18 + registro/footer v1.14, REGOLE, REGOLE_IA, manuale §5.10, motore (3 punti: latoCheAgisce fine_scena, claudeEsito in rFineScena, instradamento in conteggioDefinitivo), test_riprova SEED 7→2, diario decisioni #34. **Actual play:** le 3 scene le vince Paola → esiti narrati da Omar; Scena 1 già Omar (cambiata solo la motivazione "perso la scena"), Scene 2-3 passate da Paola a Omar e riscritte nella sua voce cupa (acknowledge la vittoria dei Protagonisti ma calca su costo/ombre/foreshadowing). Tutti i test verdi.

**Correzioni Saverio (Scena 2):** (a) esito di Omar: NON "Veglianti a mani vuote" — Alì il taccuino l'ha preso, e Omar lo rigira come minaccia (il taccuino ha la strada per Zerzura e i segreti per superarne le insidie). (b) Rimossa la nota di continuità (niente "Vera ha ricopiato la mappa"): il taccuino è perso davvero ai Veglianti. (c) Mossa 3 (10♦): Alì raggiunge la locomotiva e ci salta sopra, stordisce con un pugno il **macchinista**, poi corre lungo i corridoi verso lo scompartimento; un secondo Vegliante aziona lo scambio. Coerenza: spiega perché alla mossa 8 Vera trova il macchinista svenuto (prima c'era un incoerente "capotreno"). Ora "macchinista" è il filo unico (stordito M3 → trovato svenuto M8 → grato offre Kalim al mercato).

**RISOLTO — niente "mappa", si parla del "prezioso taccuino di appunti su come raggiungere l'artefatto"** (scelta di Saverio: più generico, lascia margine di manovra in gioco, in linea con "il cosa non il come"). Sostituito ovunque (manuale, playset json, scheda, index.html, partita_esempio.js, KB §33): premessa "L'unica mappa è il taccuino" → "Come arrivarci lo dice solo il prezioso taccuino di appunti…"; posta S1 "hanno la mappa" → "hanno gli appunti su come raggiungere l'artefatto"; "mappato la strada" → "annotato la via"; esito S2 di Omar "la strada per la città perduta" → "gli appunti per arrivare all'artefatto"; KB §33 "la Loggia insegue con la stessa mappa comprata all'asta" → "sulle stesse tracce" (toglie anche la contraddizione: Vera ruba il taccuino prima dell'asta). RESTANO di proposito: l'esempio generico di orientamento ("con una mappa" tra stelle/cammelli/sogno, è un metodo non il taccuino) e l'Appendice A (Frank/Skunk). Transcript: cambia solo la riga della posta, _v2 aggiornato.

**STATO Scena 3:** fiction scritta come **bozza curata** (non dettata) nel manuale, sezione "## Scena 3. Frattura". Beat principali della bozza: framing del deserto senza punti di riferimento; minacce dell'Opposizione = Veglianti che cancellano le piste (6♦), colonna della Loggia motorizzata (9♦), Veglianti in vedetta (5♦); caos = otre d'acqua perso (2♣); risorse di Paola = Kalim/Fante legge il deserto e fa scopa (effetto: scout), notte al fuoco in cui Otto e Vera si riavvicinano (10♥), Vera trova un pozzo (4♠), e la chiusura con la spinta ♠ di Vera che li porta all'oasi (9♠ → scopa). Esito (Paola narra): raggiungono l'oasi, ma Vera vede Otto scrivere di nascosto qualcosa che tace (aggancio al segreto: Aldo vivo/Vegliante, da far esplodere in Crisi). **DA RIVEDERE con Saverio** (dettatura/correzioni). Regina ♥ comprata dopo S3 = nome ancora da decidere.

## Scene 4-5 + mercati (SEED3=5) — scheletro meccanico

**Mercato 3/4:** Paola compra la **Regina ♥** (5 punti). Omar non compra (risparmia per il Re).

**Scena 4 — Nella città perduta (Crisi).** Asta 3♠ vs 1♣ → iniziativa **Protagonisti** (Paola inquadra). Posta: trovare l'accesso alla cripta (bene: sono a un passo dall'obiettivo; male: restano in balia dei nemici e delle insidie della città perduta). [Posta rivista da Saverio giu 2026: posta = "il cosa" trovare l'accesso, non "prima dell'alba"; e non indispensabile, vedi nota Indiana Jones.]

**LINEA DI GIOCO SCRIPTATA A MANO (Saverio, giu 2026), NON più seed-derivata.** Saverio ha riscritto la successione delle giocate per fare della Crisi una **vittoria totale dell'Opposizione (3 scope)**. Implementata in `test/partita_esempio.js` con `S4_ORDINE`/`s4i` (override del solo turno in `G().scena===3`) e selezione della spinta di Aldo (`S4_SPINTA_TXT`). Verificato col solver minimax (`scratchpad/solver4.js`): con queste carte la scopa di Omar è inevitabile e 3 scope è la linea ottimale per l'Opposizione. Successione:
1. Paola `7♠` giocata (apre d'attacco nel vuoto)
2. Omar `7♣` prende 7♠ → **SCOPA**
3. Paola `4♥` giocata
4. Omar `1♣` giocata
5. Paola `8♥` giocata
6. Omar `8♣` prende l'8♥, poi **SPINTA ♣ del segreto** «Aldo Falco è vivo: è un Vegliante. Otto lo ha capito, e tace» → **SCOPA** (raccoglie 4♥ 1♣)
7. Paola `3♠` giocata (carta d'asta, forzata ultima)
8. Omar `3♦` prende 3♠ → **SCOPA**
**Fine S4:** piatto 0‑0 → **vince OPPOSIZIONE**, 3 scope (12 punti), seme dominante parità, diario **pari**. Esito narrato da **Paola** (perde la posta → narra lei, regola v1.14): prima e unica volta che i Protagonisti narrano la loro sconfitta. NB: la spinta usata qui è **il segreto su Aldo** (non più il deserto): la verità taciuta da Otto che esplode e fa crollare il patto. Da qui Aldo è "in scena" come Vegliante: pesa sulla cripta (S5).

**Mercato 4/5:** **Omar compra il Re ♦** (8 punti; ci arriva largamente con le 3 scope). Poi mano estesa.

**Scena 5 — La cripta del Sole (Risoluzione).** Asta 6♥ vs R♦ → iniziativa **Opposizione** (Omar inquadra). Posta: l'eclissi (bene: salvano il Sole; male: esce nella valigetta sbagliata). Piatto di partenza vuoto. [SCENA 5 CAMBIATA: lo scripting di S4 ha spostato il flusso RNG, quindi la S5 è una nuova partita rispetto al vecchio scheletro. Le carte qui sotto sono quelle reali del nuovo transcript.]
1. Omar `4♦` giocata
2. Paola **SCOPA col Jolly come 4** → piatto ripulito, ma i 4 punti vanno a **Omar** (mossa sleale)
3. Omar `4♣` giocata
4. Paola `1♥` giocata
5. Omar `5♣` prende 1♥+4♣ → **SCOPA**
6. Paola `2♥` giocata
7. Omar **Re ♦** prende 2♥ → **SCOPA** (giocato ULTIMO, non più per primo)
8. Paola `6♥` giocata (resta nel piatto)
**Primo conteggio (apparente):** piatto = 6♥. Punti: Omar straordinariamente avanti (5 scope), Paola 0 → sembra disfatta totale.
**Colpi di scena:** Omar **9♣** elimina 6♥ → Paola **Regina ♥** (Pablo) elimina 9♣ → Paola **2♠** → Paola **10♠**.
**Conteggio definitivo:** piatto D♥ 2♠ 10♠ → Protagonisti **21‑0** (♥+♠ 21 vs ♦+♣ 0); punti Prot 0 vs **Opp 20 (5 scope: 8♣, 3♦, Jolly, 5♣, R♦)** → **PER IL ROTTO DELLA CUFFIA**. Diario finale: su, pari, pari, pari, giù. Esito finale narrato da **Omar** (i Protagonisti vincono il piatto → l'Opposizione lo narra). **Arco nuovo: l'Opposizione domina TUTTO ai punti (20‑0) e schiaccia la Crisi col segreto su Aldo, ma i Protagonisti rubano l'artefatto nei colpi di scena.**

**PNG da battezzare:** ~~Regina ♥~~ **FATTA** (vedi sotto) e Re ♦ (figura dell'Opposizione comprata da Omar dopo S4, "deus ex machina"; in cripta si sacrifica per una scopa) — ancora da battezzare.

**Dettatura Saverio (Regina ♥, mercato 3/4):** «La Regina potrebbe essere Pablo Gutierrez, l'ardito pilota di biplano ed affascinante avventuriero al soldo della Loggia che si rimasto perdutamente innamorato di Vera quando lei gli ha sparato addosso nel deserto.» → **Regina ♥ = Pablo Gutiérrez**, pilota del biplano abbattuto da Vera in Scena 3, innamoratosi di lei, defeziona dalla Loggia e diventa alleato dei Protagonisti. Callback perfetto al biplano della Scena 3. In cripta (colpi di scena) entra, elimina il 5♣ e viene eliminato dal 9♣ di Omar (si sacrifica per Vera). NB (correzione Saverio): al mercato 3/4 NON li ha ancora raggiunti (la carta è mescolata nel mazzo) — è solo folgorato da Vera (sconfitto da un vetro = il ciondolo, e un revolver) e prima o poi tradirà la Loggia. Entra davvero solo quando si gioca la carta, in cripta.

### Dettatura di Saverio (verbatim)

**Sulla posta (e principio generale).**
> no ecco, parliamo subito della posta. attraversare le dune col taccuino non è una buona posta, anzi bisognerebbe dire nel manuale che le poste delle scene non sono mai realmente necessarie per ottenere l'obiettivo finale. Se si ottiene è un vantagigo, se non si ottiene è un problema, ma non sono mai indispensabili. Quindi una buona posta è "Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se si ottiene i protagonisti possono accamparsi e prpararsi alla ricerca, altrimenti si perdono nel deserto".

**Nuova posta Scena 3 (adottata):** Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se si ottiene, i protagonisti possono accamparsi e prepararsi alla ricerca; altrimenti si perdono nel deserto.

**Principio 1 da inserire nel manuale (e propagare):** le poste delle scene non sono MAI indispensabili per l'obiettivo finale. Ottenerle è un vantaggio, mancarle è un problema, ma la missione resta possibile in entrambi i casi.

**Sul "come" della posta.**
> inoltre la posta non dice mai come deve essere ottenuta, per questo deve essere abbastanza vaga. Orientarsi va bene, perché puoi farlo con le stelle, con una mappa, seguendo l'istinto dei cammelli, con un sogno. Orientarsi con il taccuino no, perché prenarra quello che deve venir fuori dalla scena.

**Principio 2 da inserire nel manuale (e propagare):** la posta dice il COSA (l'obiettivo concreto), mai il COME (il mezzo per ottenerlo), che deve emergere dalle giocate. Va lasciata abbastanza aperta. Es: "orientarsi nel deserto" sì (stelle, mappa, istinto dei cammelli, un sogno…); "orientarsi col taccuino" no, perché prenarra ciò che deve nascere dalla scena. (Entrambi i principi vanno in §5.2 "Come inventare una buona posta" e propagati a KB, REGOLE, REGOLE_IA, diario.)
