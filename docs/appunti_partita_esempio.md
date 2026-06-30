# Appunti di lavoro — partita d'esempio (Appendice B / §34), scene 3-5

**Cosa è questo file.** Diario di lavoro per la stesura della partita d'esempio dello scenario
"Il sole di mezzanotte" (seed 23/43). Qui registro **alla lettera** tutto ciò che Saverio detta,
mossa per mossa (motivazioni strategiche incluse), prima di trasformarlo nel formato passo-per-passo
dell'Appendice B. Le scene 1-2 e il mercato 2/3 sono già scritti nel manuale; questo file parte dalla
Scena 3.

I fatti meccanici di ogni scena sono presi dal transcript di riferimento (fonte di verità delle
carte). La dettatura di Saverio va ancorata a quelle carte.

---

## ⚠️⚠️⚠️ RIPRENDERE DA QUI (agg. 26 giu 2026) — EURISTICA + SEED FATTI, manca SOLO la fiction S3-S5

**Euristica anti-spreco figure: FATTA** (decisione #45 nel diario). In `test/partita_smart.js`, alla presa con figura (ramo non-scopa di `scegliMossa`) si aggiunge `+FIGVAL[c.fig]`: la presa con figura batte la stessa presa con un numero, e tra due figure si cala prima la più alta (anti-stranding). Migliorata la ricerca `FIGJOLLY` (traccia `reginaPresa`/`reginaSacr`/`fanteSacr`, rilassato il malus "figura nei colpi") e aggiunto `BATCHSTART=N`. Test core verdi. Nessun effetto su motore/regole/`partita_esempio.js`.

**SEED-VETRINA S3-S5 SCELTO: `34/367`** (seed 34 per S1-S2 invariate, SEED2=SEED3=367 per il mazzo residuo). Transcript fonte di verità: `transcript_smart_seed_34_367.txt` (radice; rigenerabile con `MERCATO=canonico SEED=34 SEED2=367 SEED3=367 TRANSCRIPT=1 node test/partita_smart.js`). Arco **POPOP** (S1:P S2:O S3:P S4:O S5:P). Fatti meccanici chiave: S2 con **resa onorevole** (4♠ ininfluente, 1-12); **S3 ricicla a 0-0** (vince P di parità, diario pari) e qui si vedono **Fante presa di 2 + effetto SCAMBIO 3♠↔10♥** e **Jolly SCOPA-sleale come 4** (3 punti all'avversario); **S4** Regina presa (0-0, O vince di parità); **S5** Re (Opp) presa; 3 colpi di scena dei Protagonisti (7♥, 8♠, 9♠); finale piatto 5♦ 2♠ 7♥ 8♠ 9♠ → **Vittoria piena 26-5** (ribaltone: primo conteggio Prot dietro 2-5). NB scelto lo **showcase completo** (Fante+Jolly visibili) invece della cuffia: nei seed 1-580 nessun POPOP tiene insieme cuffia + effetto Fante senza sprecare una figura.

**PROSSIMO PASSO (chat dedicata): SCRIVERE LA FICTION S3-S5** ancorata a `transcript_smart_seed_34_367.txt`, col metodo solito (Saverio detta, si registra verbatim qui, poi formato Appendice B). Restano aperti anche: intro Appendice B (riga ~873 «scopa 4»→3) e nota (~875), §34 KB, rigenerazione PDF/docx. La continuità PNG (punto 5 sotto) resta valida.

---

## ⚠️⚠️ (STORICO 25 giu sera) — REGOLA v1.26 FATTA, manca seed S3-5 + euristica

**1. REGOLA v1.26 COMPLETATA e propagata (commit non ancora fatto).** Il **sacrificio di una figura vale sempre 1 punto** (come una resa), **mai scopa**, anche sul piatto vuoto. Una scopa è sempre e solo una presa che svuota il piatto. Propagato a: motore `index.html` (ramo `sacrificio` in `giocaCarta` → prese/1pt, niente `aggiungiScopa`; testi/bottoni `opzioniFigura`; `REGOLE`/`REGOLE_IA`), KB §15.3/§16 + registro v1.26 + footer, manuale §3/§6/glossario + footer, diario decisioni #44, driver `test/partita_smart.js` (figura sul piatto vuoto non vale più 1000). **Test core verdi** (partita 2g/4g, adatta, solo, riprova). Voci storiche del registro (v1.6 #3, v1.23 #1) lasciate com'erano.

**2. ESEMPIO — stato nel manuale.** **S1, S2 e mercato 2/3 SCRITTI** (`docs/frenemies_manuale.md`) sul **seed 34**, validi anche sotto v1.26 (non hanno sacrifici di figura → invariati). Contengono molta fiction nuova dettata da Saverio: Grand Hotel + caveau, **Hatim** (concierge), tempesta di sabbia, **formula arcaica di Otto** (planting S5), **Faruq** (alleato sul treno, uomo del Cairo), **rapimento** dei Veglianti (resa = cattura), mercato con **Kalim = Fante = cugino di Faruq, guida del Sahara** (box «Paola annuncia»). **S3, S4, S5 nel manuale sono ANCORA IL VECCHIO ESEMPIO (seed 23/43/5)** → da sostituire. Anche l'intro Appendice B (riga ~873 «scopa 4» → 3) e la nota (~875) restano da sistemare.

**3. SEED PER S3-S5 — approccio deciso (idea di Saverio).** Si **tiene il seed 34 per S1-S2** (preserva tutto il lavoro) e si **rigenera il SOLO mazzo residuo per S3-S5 con un SEED2** (vecchia tecnica multi-seed; `partita_smart.js` già la supporta: reseed a fine S2). Aggiunta opzione **`FIXSEED=N`** al batch di `partita_smart.js`: tiene fisso il seed principale (S1-S2) e fa variare SEED2/SEED3 (S3-S5). Comando ricerca: `MERCATO=canonico FIGJOLLY=1 FIXSEED=34 BATCH=250 node --max-old-space-size=8192 test/partita_smart.js`. Le righe escono come `SEED=34/<seed2>`.

**4. PROSSIMO PASSO (chat dedicata): affinare l'euristica del driver.** Sotto v1.26 l'IA del driver **spreca le figure**: le scarica come sacrificio da 1pt invece di incassarle quando hanno un bersaglio (es. in 34/1 la Regina poteva fare presa al ① ma il driver gioca prima il Fante e la incastra al ⑤ col piatto vuoto). Il `2♠` d'asta è obbligato all'ultima giocata, quindi non è lì il problema: è l'**ordine** delle figure. **TODO:** in `partita_smart.js`, far preferire all'IA di **incassare una figura che ha un bersaglio adesso** piuttosto che rischiare di sprecarla dopo (evita lo stranding). Poi **ri-cercare** (FIXSEED=34) un seed con: cuffia + arco POPOP + effetto Fante visibile + **Regina che fa qualcosa di significativo** (presa vera, o meglio l'ingresso di **Pablo nei colpi di scena** in S5 — la ricerca FIGJOLLY attuale lo escludeva come malus, va rilassata). Candidato attuale (euristica vecchia): **34/1** (cuffia, POPOP, Fante scambio, 1 resa, comeback 0-9→22-9) ma Regina sprecata in S4.

**5. CONTINUITÀ PNG aggiornata:** Faruq (Cairo, interprete/guardia/amico di Otto, sul treno S2, non rapito, raggiunge El Qara) ≠ **Kalim** (Fante ♥, **cugino di Faruq**, guida del Sahara; abbandonato il vecchio «fratello del macchinista»). Regina ♥ = **Fatima** (figlia di Kalim, giovane egittologa del Museo del Cairo, grandi occhi castani svegli; entra in S4; ~~Pablo Gutiérrez~~ accantonato: la nuova S3 non ha biplano). Re ♦ = **Lord Alistair Blackwood** (Gran Maestro della Loggia del Basilisco, barone scozzese; comprato da Omar al mercato 4/5, calato nella cripta S5). **Descrizione (Saverio):** occultista, oltre la cinquantina ma ancora molto possente, energico, con una brama insaziabile di artefatti magici da cui vuole ottenere poteri e doni sovrannaturali. Altri PNG Loggia: **Koenig** (luogotenente, entra in S4), **prof. Mansour** (relatore di Fatima, ingaggiato dalla Loggia).

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

## ✍️ DETTATURA SCENA 3 (seed 34/367) — SCRITTA NEL MANUALE ✅

**STATO (30 giu):** Scena 3 completa e travasata in `docs/frenemies_manuale.md` ("## Scena 3. Frattura", titolo in-fiction **Fuga**), al posto della vecchia (seed 23). Corretti anche: intro Appendice B (riga ~873 «scopa 4»→3, presa con figura «2»→1) e nota ~875 (ora "prime tre scene"). Effetto Fante riscritto alla regola corrente (sbircia 2/scambia 1). Asta corretta: `3♠` vs `4♣` = il 4 batte il 3 (NON parità). PROSSIMO: mercato 3/4 (Regina ♥ = Pablo, dettatura già presente più sotto) + Scena 4. Restano da rigenerare PDF/docx e §34 KB a fine di tutte le scene.



**Fonte di verità carte:** `transcript_smart_seed_34_367.txt`. Mani S3: Prot `Jolly 7♠ 3♠ F♥` · Opp `7♦ 9♣ 6♦`. Piatto ereditato da S2: `10♦ 1♥ 2♣`. Asta `3♠` vs `4♣` → parità → iniziativa **Opposizione** (Omar fissa titolo+posta e apre). Giocate reali: ① Omar `6♦` gioca · ② Paola `Fante♥` (vale 8) presa di 2 (`2♣`+`6♦`=8; il `10♦` resta perché 10>8) + effetto SCAMBIO `3♠↔10♥` · ③ Omar `7♦` gioca · ④ Paola `10♥` presa di 1 (7♦) · ⑤ Omar `9♣` gioca · ⑥ Paola `7♠` presa (9♣) + SPINTA ♠ → SCOPA · ⑦ Omar `4♣` gioca · ⑧ Paola `Jolly come 4` SCOPA sleale (3 punti a Omar). Fine: 0‑0, vince P di parità, diario **pari**. Mercato dopo S3: P compra **Regina♥** (Pablo).

**Titolo scena (Saverio 30 giu):** cambia da "Il mare di sabbia" (transcript/playset) a **"Fuga"**, coerente con la nuova posta.

**Continuità d'apertura (deciso 30 giu):** S2 si chiude con la **cattura** (Vera e Otto rapiti dai Veglianti, legati sulle selle dei cammelli; Faruq libero ingaggia Kalim). Quindi la S3 NON si apre più con i due liberi coi cammelli di Kalim (era il vecchio testo seed 23): si apre dalla prigionia.

**DETTATURA — nuova posta S3 (Saverio, 30 giu, verbatim):** «la modificherei vista la situazione… rispetto a quella del playset, è più interessante dire che la posta è "Fuggire dai veglianti, se va bene riprendono il viaggio verso la città perduta liberi, se va male restano in balia dei veglianti".»

**Posta S3 ADOTTATA (sostituisce quella del playset "Orientarsi nel deserto…"):**
> **Fuggire dai Veglianti.** Se va bene: riprendono il viaggio verso la città perduta, liberi. Se va male: restano in balia dei Veglianti.

**Punto didattico da evidenziare nel manuale (Saverio, 30 giu):** le poste del playset sono **solo spunti**, non un copione da seguire alla lettera; è **più sensato trovare di volta in volta una posta adatta alla situazione di fiction che si è creata** al tavolo. Qui chi vince l'iniziativa (Omar) prende lo spunto del playset ("orientarsi nel deserto") e lo **rimpiazza** con una posta che nasce dallo stato di fatto maturato in gioco: dopo la cattura di fine S2, "Fuggire dai Veglianti" è più calzante e più interessante. Resta coerente coi due principi già fissati (posta non indispensabile + dice il COSA non il COME). NB: questa posta non tocca le carte (la meccanica del transcript è invariata); cambia solo il framing narrativo della scena.

**→ TODO propagazione (quando S3-5 approvate):** questo principio ("le poste del playset sono spunti adattabili alla fiction") va aggiunto in §5.2 del manuale insieme ai principi 1 e 2 già raccolti, e propagato a KB, REGOLE, REGOLE_IA, diario decisioni.

**DETTATURA ① Omar `6♦` (apre la scena, ♦ = fazione organizzata, Saverio 30 giu, verbatim):** «Omar con il 6 di quadri deve introdurre un elemento di una fazione organizzata, la cosa più ovvia sarebbe i veglianti, magari il loro accampamento. Potrebbe anche far tornare in scena la loggia che non si vede da tanto, ma ripensando alla posta la scelta migliore è "pensare ovvio": in questa scena si gioca per scappare dai veglianti. Quindi Omar fa la narrazione mostrando una panoramica a volo d'uccello dell'accampamento di Veglianti in una porzione rocciosa di deserto, in un complesso di stretti canyon e grotte scavate nell'arenaria dal vento. Dentro ad una di queste grotte sono tenuti legati e imbavagliati a un palo, schiena contro schiena, Vera ed Otto. Sull'ingresso della grotta è di guardia un vegliante dall'aria truce e minacciosa. Il 6 di quadri ovviamente è la guardia.»

- **Motivazione strategica (riga d'azione):** Omar apre nel piatto (ereditato da S2: `10♦ 1♥ 2♣`; il `6♦` non cattura nulla → introduce). Sceglie di "pensare ovvio" e mette in scena l'ostacolo coerente con la posta (fuggire dai Veglianti), invece di richiamare la Loggia assente da tempo.
- **`6♦` = Qualcuno:** la guardia Vegliante all'ingresso della grotta (index card Omar). Sarà il primo ostacolo che i Protagonisti dovranno togliere di mezzo (verrà catturato dal Fante al ②, con il 2♣).
- **Continuità:** apre dalla prigionia (legati e imbavagliati al palo, schiena contro schiena) → coerente con la cattura di fine S2 e con la nuova posta.

**BOZZA FORMATO APPENDICE B — apertura S3 + ① (da approvare):**
> **Omar vince l'iniziativa e gioca il 6♦** nel piatto: la prima giocata apre la scena. Avendo l'iniziativa, è Omar a fissare titolo e posta e a inquadrare la scena; nel piatto introduce subito l'ostacolo coerente con la posta, la guardia che sorveglia i prigionieri. Annota su una index card: «6♦ = la guardia Vegliante all'ingresso della grotta».
>
> `<div class="fiction"><span class="titolo-scena">Fuga</span><em>Posta: fuggire dai Veglianti. Se va bene, Vera e Otto riprendono il viaggio verso la città perduta, liberi. Se va male, restano in balia dei Veglianti.</em></div>`
>
> `<div class="fiction"><span class="chi">Omar narra</span>A volo d'uccello, l'accampamento dei Veglianti si annida in una piega rocciosa del deserto: un dedalo di canyon stretti e di grotte che il vento ha scavato nell'arenaria. Dentro una di queste, legati e imbavagliati a un palo, schiena contro schiena, ci sono Vera e Otto. All'imbocco della grotta veglia una sentinella dall'aria truce, la mano sull'elsa, lo sguardo che non perde di vista i due prigionieri.</div>`

**DETTATURA ② Paola `Fante♥` (Kalim), presa di `2♣`+`6♦` + effetto scambio (Saverio 30 giu, verbatim):** «la narrazione mostra come Kalim, da esperto del deserto, restringe il campo delle zone possibili dal punto del rapimento e ritrova le tracce del convoglio dei veglianti. Arriva quindi con il buio al campo dei veglianti in tempo per studiare la situazione, insieme a suo cugino Faruq, e capire in quale grotta si trovano i due. Kalim lascia cadere un sasso sulla testa della guardia che cade svenuta, poi si cala nel dirupo e la trascina nella grotta, rubandone i vestiti e mascherandosi come lei.»

- **Mappatura meccanica:** presa di 2 (`2♣`+`6♦`=8) = neutralizza la **guardia** (`6♦`) col sasso in testa + toglie l'ultima confusione/pista persa del deserto (`2♣`, ♣ ereditato da S2). Resta nel piatto `10♦ 1♥` (il `10♦` = risorsa dei Veglianti ancora in piedi). Effetto Fante (sbircia mazzo + scambia `3♠↔10♥`) = lo **scouting** di Kalim e Faruq (restringe le zone, ritrova le tracce, studia il campo e capisce in quale grotta sono): scambia una carta debole con una alta, frutto della sua perizia. La maschera da guardia = Kalim che prende il posto della sentinella catturata (prepara il ④/⑥).
- **PNG:** rientra **Faruq** (già S2) come spalla di Kalim.

**BOZZA FORMATO APPENDICE B — ② (da approvare):**
> **Paola gioca il Fante ♥, Kalim, e cattura insieme il 2♣ e il 6♦: una presa di 2 carte** (il Fante vale 8). Toglie di mezzo la guardia (il 6♦) e l'ultima traccia di confusione del deserto (il 2♣), e schiera l'informatore appena ha un bersaglio. Nel piatto resta il 10♦, la presenza dei Veglianti ancora in piedi. Poi sfrutta l'effetto del Fante: sbircia il mazzo e scambia il 3♠ che ha in mano con il 10♥, si libera di una carta debole e si tiene una carta alta per più avanti.
>
> `<div class="fiction"><span class="chi">Paola narra</span>Kalim il deserto lo legge come gli altri leggono un libro. Dal punto in cui i Veglianti hanno caricato i prigionieri sui cammelli restringe a poche le zone dove un accampamento può nascondersi, e poco dopo ritrova le tracce del convoglio: solchi di zoccoli che il vento non ha ancora cancellato. Le segue con Faruq fino a notte, e arrivano in vista dei canyon in tempo per studiare la situazione, quante sentinelle, quali grotte sorvegliate, dietro quale di esse tengono Vera e Otto. Poi sceglie la sua mossa. La grotta si apre nella parete del canyon, un cinque metri sotto il ciglio del dirupo, e la sentinella monta la guardia proprio davanti all'imbocco, sotto lo strapiombo. Kalim si porta in silenzio sull'orlo, lascia cadere un sasso pesante che coglie la guardia in pieno sulla testa, e quella si accascia senza un grido. Poi si cala giù con agilità, la trascina dentro al riparo, le sfila le vesti scure e il turbante e se li infila. Il suo piano è tirarli fuori di lì restando camuffato da sentinella.</div>`

**DETTATURA ③ Omar `7♦` (introduce, ♦ = altra minaccia Vegliante, Saverio 30 giu, verbatim):** «Omar aggiunge un altro elemento a suo favore, mostrando come ci sia almeno una dozzina di altri guerrieri che si aggirano per il canyon e non sarà facile eluderli e portare fuori i due europei da questo intricato labirinto di rocce scavate dal vento.»

- **Mappatura meccanica:** piatto `10♦ 1♥`; il `7♦` non cattura nulla → **introdotto** (giocata). Piatto → `10♦ 1♥ 7♦`. `7♦` = Qualcuno: la **dozzina di guerrieri Veglianti** che pattuglia il canyon (il labirinto sorvegliato). Si somma al `10♦` ancora in piedi: l'Opposizione accumula presenza ♦ nel piatto.

**BOZZA FORMATO APPENDICE B — ③ (da approvare):**
> **Omar gioca il 7♦** nel piatto: non c'è nulla da catturare, così aggiunge un'altra minaccia accanto a quella che resta. Annota: «7♦ = la dozzina di guerrieri che pattuglia il canyon».
>
> `<div class="fiction"><span class="chi">Omar narra</span>Ma una sentinella sola non è tutto l'accampamento. Per i canyon si aggira almeno una dozzina di guerrieri: girano tra le rocce, si passano la voce di posto in posto, controllano ogni varco di quel labirinto scavato dal vento. Al centro dell'accampamento hanno acceso un fuoco, e su quello gira lento un capretto che arrostisce, mentre gli uomini vanno e vengono dalla brace. Anche ammesso di slegare i due europei, farli uscire vivi da quel dedalo, con tutti quegli occhi addosso, è un'altra faccenda.</div>`

**DETTATURA ④ Paola `10♥` presa del `10♦` (= Alì) (Saverio 30 giu, verbatim):** «Paola osserva la index card di Alì, vede che è proprio quel 10 di quadri che lei sta per catturare con il suo 10 di cuori. La narrazione è questa: quando Kalim slega Vera ed Otto spiega ai due chi è e la situazione. Agiscono così: Kalim, fingendosi la guardia, porta Otto da Alì; l'accademico di mezza età, in fluente arabo, spiega che ha bisogno urgente di andare in bagno e inizia a lamentarsi delle condizioni in cui sono tenuti prigionieri. Alì annuisce e ordina a Kalim di scortarlo verso le latrine e di non perderlo d'occhio, pensando che si tratti di uno dei suoi uomini.»

- **Mappatura meccanica:** piatto `10♦ 1♥ 7♦`; `10♥` cattura il `10♦` (pari valore) → **presa di 1**. Restano `1♥ 7♦`. Il `10♦` era **Alì** (index card di Omar in S2, sopravvissuto nel piatto): catturarlo = toglierlo di mezzo con l'inganno. Paola usa la carta alta appena ottenuta dallo scambio del Fante per neutralizzare la risorsa più temibile dell'Opposizione.
- **Momento "index card" al tavolo:** Paola legge il marcatore del `10♦` e ritrova Alì → il marcatore le dice chi sta neutralizzando (come l'esempio Hatim/3♥ nel manuale). Va messo in chiaro nella riga d'azione.
- **Slegamento:** qui Kalim libera Vera e Otto e spiega chi è (il freeing entra in questo beat). **Vera resta fuori inquadratura** (Saverio): solo Otto esce con Kalim verso le latrine; cosa fa Vera si vedrà nelle giocate seguenti.

**BOZZA FORMATO APPENDICE B — ④ (da approvare):**
> **Paola gioca il 10♥ e cattura il 10♦: presa.** Controlla la index card del 10♦ e ci ritrova Alì, il guerriero che li aveva catturati sul treno: il marcatore le dice subito chi sta togliendo di mezzo. In ♥, il seme dei legami, usa la carta alta appena guadagnata da Kalim per neutralizzare la minaccia più pesante dell'Opposizione, e lo fa con l'astuzia invece che con la forza.
>
> `<div class="fiction"><span class="chi">Paola narra</span>Al riparo della grotta Kalim taglia le corde, toglie i bavagli e in un sussurro spiega ai due chi è e come stanno le cose: è la guida mandata da Faruq, fuori ci sono dodici guerrieri, e l'unico modo di uscirne è non dare nell'occhio. Poi mette in atto il piano. Ancora vestito da sentinella, accompagna Otto fuori dalla grotta e lo conduce diritto da Alì. L'accademico recita la sua parte alla perfezione: in un arabo fluente e lamentoso spiega di avere un bisogno urgente, e si mette a protestare per le condizioni in cui li tengono, una vergogna per gente d'onore. Alì, infastidito, annuisce e ordina alla sua guardia di scortare il prigioniero alle latrine e di non perderlo di vista un istante, convinto di star dando un ordine a uno dei suoi.</div>`

**DETTATURA ⑤ Omar `9♣` (introduce, ♣ = attrito interno alla coppia, Saverio 30 giu, verbatim):** «il 9 di fiori potrebbe essere un elemento esterno oppure un conflitto tra i protagonisti. Direi che Kalim, Vera e Otto si ritrovano dove sono legati i cammelli, ma Otto si impunta: sta morendo di fame e questo profumo di capretto arrosto gli ha aperto una voragine nello stomaco, non partirà a stomaco vuoto. Vera lo insulta e gli dice che non può fare capricci come un bambino. Stanno perdendo tempo e forse facendo troppo rumore con la loro discussione.»

- **Mappatura meccanica:** piatto `1♥ 7♦`; il `9♣` non cattura → **introdotto**. Piatto → `1♥ 7♦ 9♣`. `9♣` = il **caos interno alla coppia** (la fame di Otto + il litigio che fa rumore): attrito ♣ che lavora dall'interno, non un nemico esterno. Callback al tema diario Otto/Vera.
- **Continuità:** qui **Vera rientra in inquadratura** (allo slargo dei cammelli, con Kalim e Otto). Il capretto arrosto richiama il fuoco introdotto al ③. Il "troppo rumore" prepara il rischio delle giocate seguenti.

**BOZZA FORMATO APPENDICE B — ⑤ (da approvare):**
> **Omar gioca il 9♣** nel piatto: dispone il caos, e stavolta non è un nemico ma l'attrito che lavora dentro la coppia. Annota: «9♣ = la lite tra Vera e Otto che rischia di tradirli».
>
> `<div class="fiction"><span class="chi">Omar narra</span>Kalim guida Otto e Vera fino allo slargo dove sono legati i cammelli. Ma proprio lì Otto si impunta. È digiuno da chissà quanto, e quel profumo di capretto arrosto che arriva dal fuoco gli ha aperto una voragine nello stomaco: non se ne va a pancia vuota, dice, non dopo tutto questo. Vera lo aggredisce a mezza voce, gli sibila che non è il momento dei capricci da bambino, che ogni istante perso lì in mezzo è un rischio. E mentre bisticciano, le loro voci salgono di tono più di quanto dovrebbero, tra quelle rocce che rimandano ogni suono.</div>`

**DETTATURA ⑥ Paola `7♠` presa del `7♦` + spinta ♠ → SCOPA (Saverio 30 giu, verbatim):** «lei gela Otto con uno sguardo di fuoco, quindi salta in groppa a un cammello mentre Kalim si carica sul suo un Otto recalcitrante e partono al galoppo (o ritmo sostenuto, non so se i cammelli galoppano) superando in velocità il drappello di guardie distratte a mangiare.»

- **Spinta scelta (Saverio):** la **♠ n.2 (dote/asso)** «Nessuno guida, scala o spara come Vera: dove finisce la strada, comincia lei». (Resta libera la ♠ n.1 "padre/sacrificio" per più avanti, es. la cripta.)
- **Mappatura meccanica:** piatto `1♥ 7♦ 9♣`; `7♠` prende il `7♦` (pari valore) → presa di 1 (toglie la **dozzina di guardie**). Poi **spinta ♠ → SCOPA**, spazza il resto (`9♣` la lite + `1♥`), piatto vuoto. Il `7♠` va tra le scope (3 punti). La presa = superano le guardie; la spinta (audacia di Vera) = la fuga diventa un successo pieno. Lo sguardo di fuoco che gela Otto = chiude il `9♣` (la lite spazzata via).
- **NB camelli:** i dromedari sì galoppano (a scatti), va bene "al galoppo"; resa con sfumatura ("galoppo sgraziato/di gran carriera").

**BOZZA FORMATO APPENDICE B — ⑥ (da approvare):**
> **Paola gioca il 7♠ e cattura il 7♦: presa. Poi spunta la spinta ♠ del pitch** «Nessuno guida, scala o spara come Vera: dove finisce la strada, comincia lei»: la presa diventa **scopa** e svuota il piatto, portandosi via anche il 9♣ e l'1♥. La presa toglie di mezzo la dozzina di guardie; la spinta, l'audacia di Vera, trasforma la fuga in un successo pieno. Il 7♠ va tra le scope di Paola (3 punti), e la spinta di ♠ è ora usata.
>
> `<div class="fiction"><span class="chi">Paola narra</span>Vera ne ha abbastanza. Gela Otto con uno sguardo di fuoco che gli muore in gola ogni protesta, poi non perde un altro istante: con un balzo è in groppa a un cammello, mentre Kalim se ne carica sul suo un Otto recalcitrante che ancora si volta verso il fuoco. Spronano le bestie e partono di gran carriera tra le rocce, in un galoppo sgraziato e tonante. Il drappello che presidia l'uscita del canyon è raccolto intorno alla brace a strapparsi brani di capretto, e quando alza la testa è già tardi: dove gli altri vedono solo pareti e vicoli ciechi, Vera ha già scelto la sua via e la sta percorrendo a tutta velocità. Passando come una folata strappa di mano a una guardia il cosciotto che stava addentando e lo lancia a Otto: «E adesso smettila di frignare.» Le grida partono quando i tre sono ormai lanciati oltre il varco.</div>`

**DETTATURA (aggiunta al ⑥, Saverio 30 giu, verbatim):** «passando acchiappa al volo un cosciotto strappandolo di mano a una guardia, passandolo ad Otto.» → collocata DENTRO la fuga del ⑥ (galoppo che supera le guardie a mangiare); ripaga la fame/capriccio di Otto del ⑤ e il capretto del ③. Soggetto: Vera (resa più viva: anche la concessione al capriccio di Otto la fa di forza, al galoppo). NB: NON è il Jolly (⑧): non è un "peccato/inganno", solo un gesto sbrigativo. ⑦ (Omar 4♣) e ⑧ (Jolly sleale) restano da dettare: serve un elemento ♣ al ⑦ (inseguimento?) e un vero atto sleale al ⑧.

**DETTATURA ⑦ Omar `4♣` (introduce, ♣ = vicolo cieco, Saverio 30 giu, verbatim):** «il 4 di fiori la narrazione di Omar è che hanno imboccato un cunicolo sbagliato e si trovano in un cul de sac, davanti a loro c'è una parete scoscesa e parzialmente franata, impossibile da percorrere a dorso di cammello, tornare indietro è fuori discussione.» [Scartati: Veglianti (appena seminati), la lite (appena risolta), i predatori notturni.]

- **Mappatura meccanica:** piatto vuoto (svuotato dalla scopa del ⑥); il `4♣` non cattura → **introdotto**. Piatto → `4♣`. `4♣` = caos ambientale ♣: nel labirinto di canyon (③) imboccano il cunicolo sbagliato e finiscono in un **vicolo cieco**, una parete scoscesa e in parte franata, impercorribile coi cammelli; tornare indietro è fuori discussione (l'inseguimento alle spalle).
- **Setup per ⑧:** il `4♣` sarà catturato dal **Jolly come 4** (scopa sleale, 3 punti a Omar). Serve che superino il vicolo cieco con un **atto torbido** di uno dei due protagonisti (il peccato del Jolly), da dettare.

**BOZZA FORMATO APPENDICE B — ⑦ (da approvare):**
> **Omar gioca il 4♣** nel piatto appena svuotato: non c'è nulla da catturare, e introduce l'ostacolo che chiude la trappola. Annota: «4♣ = il vicolo cieco, la parete franata che sbarra la fuga».
>
> `<div class="fiction"><span class="chi">Omar narra</span>Ma nel buio Kalim, per la fretta, sbaglia cunicolo. I tre si lanciano in una gola sempre più stretta e si ritrovano in un cul de sac: davanti, una parete scoscesa e in parte franata chiude il passaggio, un caos di massi e ghiaia che nessun cammello potrà mai risalire. Alle spalle, l'unico imbocco da cui sono entrati, e da lì arriva già l'eco dei Veglianti che montano in sella. Tornare indietro è fuori discussione, e davanti non c'è strada.</div>`

**DETTATURA ⑧ Paola `Jolly` come 4 → SCOPA sleale (il peccato) (Saverio 30 giu, verbatim):** «Faruq dall'alto, avendo seguito le manovre degli altri tre, lancia una corda. Kalim aiuta Otto ad arrampicarsi, ma è troppo lento e da dietro si sentono già le voci degli inseguitori e si vedono le luci delle loro torce brillare sulle pareti del canyon. Vera decide di fare l'unica cosa necessaria per fargli guadagnare tempo. Dal tascapane estrae un candelotto di dinamite che aveva rubato alla grotta, lo accende e lo lancia verso gli inseguitori facendo crollare addosso a loro una frana di sassi; il boato è assordante, la polvere nasconde il destino dei Veglianti. Ma Otto è inorridito, sotto shock, e guarda Vera incredulo che lei possa essersi spinta a tanto. I tre scappano, ma non senza essersi macchiati le mani di sangue.»

- **Mappatura meccanica:** piatto `4♣`; il **Jolly dichiarato 4** cattura il `4♣` → **SCOPA**, piatto vuoto (i tre superano il vicolo cieco e sfuggono all'inseguimento). Ma è la **mossa sleale**: i 3 punti della scopa vanno a **Omar**, e il **marcatore del peccato** entra nel campo dell'Opposizione (Omar potrà far riemergere il sangue sulle mani di Vera in una sua presa/scopa futura → semina per la Crisi di S4).
- **Il peccato:** Vera uccide gli inseguitori con la dinamite (frana letale). Contrasto fortissimo con la sua resa di S2 («non fate male a questi uomini»): qui supera la linea. Otto inorridito = il legame si incrina (Jolly = divisione).
- **Continuità dinamite (DECISO, Saverio 30 giu):** NON si semina. La narrazione emerge dal gioco, non è una sceneggiatura di un film: quando Vera è scappata dal campo non poteva sapere che sarebbe servita la dinamite. Basta che sia plausibile a posteriori (Vera può averla presa per un diversivo durante la fuga) e non va mostrato prima. **Principio di metodo generale** (vale per tutta la partita): non pre-pianificare/foreshadoware gli elementi, si introducono quando la giocata li chiede.
- **Esito scena:** dopo l'⑧ la scena finisce. Piatto **0‑0** → vince **Protagonisti** (parità → ultima carta giocata = Paola/Jolly, tie‑break v1.22). Seme dominante **parità** → diario **pari** (scopa svuota il piatto: il legame ha preso un colpo in fiction, ma meccanicamente esce pari). Esito narrato: parità dei totali → **narra chi vince l'asta = Omar** (v1.14). Da dettare l'esito breve (fuga riuscita verso l'oasi, ma col peccato che pesa).

**BOZZA FORMATO APPENDICE B — ⑧ (da approvare):**
> **Paola gioca il Jolly e dichiara che vale 4: cattura il 4♣, ed è una SCOPA** che svuota il piatto. Ma il Jolly è la mossa sleale: i suoi 3 punti vanno a Omar, e il marcatore del peccato passa all'Opposizione, pronto a tornare a galla quando meno serve ai Protagonisti. Vera compra la salvezza a un prezzo che le macchia le mani.
>
> `<div class="fiction"><span class="chi">Paola narra</span>Una corda cade dall'alto della parete: è Faruq, che dall'orlo del canyon ha seguito ogni loro mossa. Kalim spinge su per primo Otto, puntellandolo, ma l'accademico è impacciato e lento, e intanto da dietro arrivano le voci degli inseguitori e le loro torce cominciano a chiazzare di luce le pareti della gola. Vera capisce che qualcuno deve far guadagnare tempo agli altri, e decide in un istante. Dal tascapane tira fuori un candelotto di dinamite che ha sottratto all'accampamento, ne accende la miccia con un fiammifero e lo scaglia verso l'imbocco del cunicolo. L'esplosione stacca mezza parete: una frana di massi rovina addosso agli inseguitori, il boato rimbomba per tutto il canyon, e una nube di polvere cala su quello che resta. Quando Otto si volta dall'alto della corda, fissa Vera come se non la riconoscesse, incredulo che sia arrivata a tanto. I quattro si lasciano il canyon alle spalle, salvi, ma con le mani sporche di sangue.</div>`

**DETTATURA ESITO S3 (Omar narra, parità → v1.14) (Saverio 30 giu, verbatim):** «Omar narra che quando la polvere si posa, Alì e gli altri superstiti del crollo osservano Otto, Vera e i loro soccorritori svanire nella notte, sui cavalli di Faruq e Kalim. Alì aiuta i suoi compagni e dice qualcosa come "non andranno molto lontano...". Vera e Otto viaggiano tutta la notte, aggrappati ai loro salvatori, sono ancora scossi dagli eventi di quella giornata, ma sulle prime luci dell'alba vedono le palme di un'oasi.»

- **Risolve i cammelli:** abbandonati nel cul-de-sac, i quattro proseguono sulle **cavalcature di Faruq e Kalim** dal ciglio (Vera e Otto in groppa dietro i salvatori). [Coerenza deserto: "cavalli" o "cammelli"? Kalim è guida del deserto, i Veglianti vanno sui cammelli; valuterei "cammelli" per uniformità, ma Saverio ha detto cavalli → DA CONFERMARE.]
- **Alì sopravvive:** coerente col ④ (il `10♦`/Alì era stato *catturato* = raggirato con la finta delle latrine, non ucciso → può riapparire, regola del manuale §«la carta catturata non sparisce dalla fiction»). Il «non andranno lontano» = minaccia seminata per S4.
- **Esito di scena (servizio, fuori box):** piatto **0‑0** → vince Protagonisti (parità → ultima carta = Jolly di Paola, v1.22); seme dominante **parità** → diario **pari**. NOTA seme dominante (richiesta trasversale di Saverio): la scopa finale svuota il piatto, quindi nessun seme domina a colorare l'esito, e il diario non si muove; in fiction il legame ha preso un colpo (Otto inorridito), ma quel peso non sta nel diario, lo porta il **marcatore del peccato** ora in mano a Omar, pronto per la Crisi di S4.

**BOZZA FORMATO APPENDICE B — ESITO S3 (da approvare):**
> **Fine della Scena 3.** Il piatto è vuoto, e a parità la posta va a chi ha calato l'ultima carta, Paola col Jolly: Vera e Otto sono liberi. Seme dominante: parità, diario del rapporto **pari**. La scopa finale ha svuotato il piatto, così nessun seme colora l'esito e il diario non si sposta; il colpo che il legame ha incassato stanotte non è inciso lì, ma nel marcatore del peccato, che ora è nelle mani di Omar.
>
> `<div class="fiction"><span class="chi">Omar narra</span>Quando la polvere si posa, Alì è ancora in piedi. Contuso, il mantello bianco di calcina, ma vivo, come una manciata di altri scampati alla frana. Si rialza a fatica e libera i compagni rimasti sotto i sassi, e intanto non stacca gli occhi da laggiù, dove Vera, Otto e i loro soccorritori si fanno sempre più piccoli nella notte, in groppa alle cavalcature di Faruq e Kalim. Non grida, non spreca un colpo. Sputa la sabbia dai denti e mormora soltanto, con la calma di chi ha dalla sua tutto il deserto: «Non andranno lontano.» E aveva ragione a non avere fretta: Vera e Otto viaggiano tutta la notte aggrappati ai loro salvatori, muti, ancora scossi da tutto quello che è successo, e solo alle prime luci dell'alba, all'orizzonte, vedono finalmente le palme di un'oasi. Ma il deserto è grande, e ha occhi ovunque.</div>`

---

## ✍️ DETTATURA SCENA 4 (seed 34/367) — SCRITTA NEL MANUALE ✅

**STATO (30 giu):** Scena 4 completa e trascritta in `docs/frenemies_manuale.md` ("## Scena 4. Crisi", titolo in-fiction «Nella città perduta», posta adattata «prima della Loggia»), al posto della vecchia (seed 23). Nuovi PNG: **Fatima** in azione (Regina), **prof. Mansour**, **Koenig** (luogotenente). Esito di Paola (prima sconfitta). Punti: Paola +1 (presa Regina) → 6; Omar +3 (scopa ⑧) → 8 (per il Re). **MERCATO 4/5 SCRITTO ✅** (nuova sezione "## Mercato, tra la quarta e la quinta scena"): Omar compra il **Re ♦ = Lord Alistair Blackwood** (8 punti → 0), box «Omar annuncia» con la descrizione di Blackwood, effetto Re (scambio carta mano ↔ scarti comuni stesso seme), mano estesa + riserva per i colpi di scena. Paola non compra (tiene 6).

**REGOLA v1.27 — nuovo effetto del Re (FATTA, decisione #47).** Il Re non scambia più: **recupera dagli scarti comuni una carta del proprio seme** → la rimescola nel mazzo (scene 1-4) o la aggiunge alla **riserva** (scena 5). Propagata ovunque (motore, REGOLE/REGOLE_IA, KB §21+§16+registro/footer, manuale §1.5/§3/glossario + mercato 4/5, driver, diario #47). Collaudo verde. Driver: recupera il seme del Re più alto + tiene il Re per la presa grande (≤10). **Transcript 34/367 rigenerato; scene 1-4 IDENTICHE.**

**NUOVA SCENA 5 (transcript v1.27, fonte di verità aggiornata):** asta `2♠` vs `3♦` → Omar. Giocate: ① Omar `5♦` · ② Paola `6♠` · ③ Omar `Re♦`(Blackwood) presa del `6♠` + **effetto Re: recupera `10♦` dagli scarti → nella riserva di Omar** · ④ Paola `4♥` · ⑤ Omar `4♦` presa del `4♥` · ⑥ Paola `2♠` · ⑦ Omar `3♦`(d'asta) · ⑧ Paola `3♠` presa del `3♦`. Primo conteggio: piatto `5♦ 2♠` → Opp 5, Prot 2. **Colpi di scena (v1.28, turni strettamente alterni, niente colpi consecutivi): Paola `7♥` elimina `5♦` · Omar `10♦` (recuperato dal Re) elimina `7♥` · Paola `9♠` (si aggiunge) · FINE (Omar a secco, Paola non gioca due colpi di fila → l'`8♠` resta inutilizzato).** Piatto definitivo `2♠ 10♦ 9♠` → Prot (♥+♠) **11** vs Opp (♦+♣) **10** → **VITTORIA PIENA** (punti Prot 5, Opp 2). Diario: su, su, pari, pari, giù. **Il ribaltone regge, all'ultimo respiro.**

**FIX DRIVER (colpi di scena, pre-esistente):** il driver cliccava `bs[bs.length-1]` = il bottone «Metti senza eliminare» (è l'ultimo, anch'esso `data-bersaglio` ma vuoto), quindi **non eliminava MAI** nei colpi. Corretto in `test/partita_smart.js`: ora filtra i bersagli reali e clicca quello di valore più alto (ripiega su «Metti senza eliminare» solo se non ci sono bersagli). Transcript rigenerato → i colpi ora mostrano l'eliminazione da entrambi i lati (vetrina della meccanica §24). È solo tooling, non una regola.

PROSSIMO: scrivere la fiction della Scena 5 (la cripta).



**Fonte di verità carte:** `transcript_smart_seed_34_367.txt`. Asta `3♥` vs `1♦` → il 3 batte l'1, vince **Paola** (iniziativa Protagonisti, prima volta dal Cairo). Piatto vuoto. Mani: Paola `D♥(Fatima) 5♠ 10♠` + `3♥` d'asta; Omar `10♣ 9♦ 8♦ 1♦`. Giocate: ① Paola `5♠` apre · ② Omar `8♦` · ③ Paola `Regina♥`(Fatima) presa di 1 (`8♦`) + effetto: Omar scarta a caso `10♣` e pesca `6♣` · ④ Omar `6♣` · ⑤ Paola `10♠` · ⑥ Omar `1♦` · ⑦ Paola `3♥`(d'asta) · ⑧ Omar `9♦` presa di 3 (`5♠+1♦+3♥`=9) + **spinta ♦** «La Loggia ha sicari in ogni porto; i Veglianti hanno costruito le trappole» → SCOPA, spazza `6♣ 10♠`. Fine: 0‑0, vince **O** di parità (ultima carta = Omar), diario **pari**. Esito narrato da **Paola** (perde la posta). Mercato 4/5: **Omar compra il Re ♦** (5+3=8).

**Titolo + posta (Saverio 30 giu):** titolo dal canovaccio **«Nella città perduta»**. Posta **adattata**: da «trovare l'accesso alla cripta» a **«trovare l'accesso alla cripta PRIMA della Loggia»**, perché i Protagonisti sanno di aver perso un giorno a causa del rapimento (urgenza + continuità). Altro caso del principio S3: posta del canovaccio adattata alla fiction.

> **Posta S4 adottata:** Trovare l'accesso alla cripta prima della Loggia. Se va bene: entrano per primi, a un passo dalla missione. Se va male: la Loggia li precede, e restano in balìa dei nemici e delle insidie della città perduta.

**DETTATURA ① Paola `5♠` (apre, ♠ = azione di Vera + framing, Saverio 30 giu, verbatim):** «Paola descrive che Vera ed Otto passano il giorno successivo a riposarsi e a studiare, anche con l'aiuto di Fatima, il taccuino per decifrare gli indizi che rivelano la posizione della città perduta; quando partono alla sera dall'oasi hanno ben chiaro dove dirigersi e Vera guida risoluta fino a un grande conglomerato di arenaria a forma di scafo di nave, che sbuca in mezzo al mare di dune. Quello è il punto.»

- **Mappatura:** piatto vuoto; `5♠` non cattura → introdotto (azione di Vera, il loro arrivo/vantaggio sul posto). Sarà catturato all'⑧ (parte del `5♠+1♦+3♥` preso dal `9♦` di Omar) → la Loggia annulla il loro vantaggio. Fatima è presente (annunciata al mercato, aiuta a studiare il taccuino); la sua entrata meccanica decisiva è al ③.

**DETTATURA ③ Paola `Regina♥` (Fatima) presa `8♦` + effetto (Saverio 30 giu, verbatim):** «Fatima, osservando con il binocolo dalla duna, riconosce il suo professore: sta parlando con un pezzo grosso della loggia. Lei decide di farsi avanti con tutta la sua faccia tosta e punta al gruppo di manovali e mercenari: "Sono l'assistente del professor [cognome egiziano]", mostrando il tesserino dell'università che la qualifica, "Ha detto di iniziare gli scavi e trasportare tutto il materiale in quella zona." Così svia il gruppo verso la "poppa" della grande roccia, perché loro sanno che si entrerà dalla parte opposta.»
- **Cognome professore:** proposto **Mansour** (DA CONFERMARE). È il professore/relatore di Fatima venduto alla Loggia → candidato **Re ♦** (mercato 4/5). Qui lo si VEDE (parla col pezzo grosso), seminandolo.
- **Mappatura:** piatto `5♠ 8♦`; Regina (9) cattura l'`8♦` (presa di 1) = svia/neutralizza la forza-lavoro della Loggia. Effetto manipolatrice: Omar scarta a caso `10♣`, pesca `6♣` = la Loggia spreca un asset alto mandando uomini/mezzi dalla parte sbagliata. Resta nel piatto `5♠`.

**DETTATURA ④ Omar `6♣` (introduce, ♣ = vento del deserto, Saverio 30 giu, verbatim):** «Quando Vera, Otto e gli altri si spostano per raggiungere Fatima e il lato giusto della roccia, si alza vento fortissimo che li confonde e rende difficile trovare il riferimento che dovrebbe fargli identificare il punto esatto in cui cercare l'accesso.»
- **Mappatura:** piatto `5♠`; `6♣` (la carta pescata da Omar per effetto Regina) non cattura → introdotto. Piatto `5♠ 6♣`. `6♣` = caos ♣, il vento che cancella il riferimento dell'ingresso. Resterà nel piatto fino alla scopa dell'⑧.

**DETTATURA ⑤ Paola `10♠` (introduce, ♠ = Vera trova l'accesso, Saverio 30 giu, verbatim):** «Vera ha uno scatto di nervi, non possono essere arrivati così vicini e farsi fermare dal vento che smuove la sabbia e dal buio; batte il piede con rabbia e sente proprio sotto di sé risuonare vuoto. Si butta a gattoni e smuove la sabbia freneticamente e trova una lastra di pietra sotto la quale c'è l'accesso che cercavano.»
- **Mappatura:** piatto `5♠ 6♣`; `10♠` non cattura (5+6=11, nessun 10) → introdotto. Piatto `5♠ 6♣ 10♠`. `10♠` = risorsa pesante di Vera. **Fatto messo (Saverio): «ho trovato la lastra»**, NON l'hanno ancora smossa né aperto l'accesso. Sarà spazzato dalla scopa di Omar all'⑧ («spazza 10 avversario») → la Loggia ribalta il vantaggio: trovano l'ingresso ma perdono la scena (l'apertura/discesa slitta a dopo).

**DETTATURA ⑥ Omar `1♦` (introduce, ♦ = portatore che li scopre, Saverio 30 giu, verbatim):** «Un giovane portatore cerca Fatima per chiederle delucidazioni e trova il gruppetto dalla parte opposta rispetto a quella indicata, che esulta davanti alla lastra. Corre direttamente dal professore per avvisarlo.»
- **Mappatura:** piatto `5♠ 6♣ 10♠`; `1♦` non cattura → introdotto. Piatto `5♠ 6♣ 10♠ 1♦`. `1♦` = il portatore che fa saltare l'inganno di Fatima e avverte il professore (Mansour). Sarà catturato dal `9♦` di Omar all'⑧ (parte di `5♠+1♦+3♥`). Innesca il ribaltone: la Loggia arriva.

**DETTATURA ⑦ Paola `3♥` (d'asta, ultima giocata, ♥ = Vera si ferma per Otto, Saverio 30 giu, verbatim):** «Vera si accorge che qualcuno li ha visti, istintivamente estrae il revolver e lo punta contro il ragazzo. Ma poi si blocca. Osserva negli occhi Otto e rinfodera l'arma. "Sbrighiamoci, abbiamo ancora poco tempo".»
- **Mappatura:** piatto `5♠ 6♣ 10♠ 1♦`; `3♥` (carta d'asta di Paola, ultima giocata obbligata) non cattura → introdotto. Piatto `5♠ 6♣ 10♠ 1♦ 3♥`. `3♥` = il legame che riaffiora: Vera stavolta NON spara, fermata dallo sguardo di Otto. Beat di crescita/redenzione. **Nel box NON si nomina il canyon** (Saverio): il peccato della S3 lo farà eventualmente riaffiorare Omar (ha il marcatore), non Paola. Verrà spazzato dalla scopa di Omar all'⑧ (parte di `5♠+1♦+3♥`).

**DETTATURA ⑧ Omar `9♦` + spinta ♦ → SCOPA (la cattura, Saverio 30 giu, verbatim):** «Proprio mentre a fatica sono riusciti a scostare la lastra quel tanto per permettere a qualcuno di infilarsi dentro, sentono la voce di Koenig, luogotenente della Loggia, affiancato dal prof. Mansour e da una dozzina di mercenari coi mitra spianati. "Bene bene... La famigerata Vera Falco e l'esimio Professor Lenzi suppongo... avete fatto un lavoro all'altezza della vostra reputazione. Grazie." Poi ordina ai suoi uomini di arrestarli.»
- **Mappatura:** piatto `5♠ 6♣ 10♠ 1♦ 3♥`; `9♦` cattura `5♠+1♦+3♥` (=9) presa di 3, poi spinta ♦ «La Loggia ha sicari in ogni porto; i Veglianti hanno costruito le trappole» → SCOPA, spazza `6♣ 10♠`. Piatto vuoto, vince O. La lastra è scostata (accesso aperto) ma la Loggia li cattura → ironia: hanno aperto Zerzura per i nemici.
- **NUOVO PNG: Koenig**, luogotenente della Loggia (era nominato negli appunti S1 ma tenuto fuori; entra qui). Con lui il **prof. Mansour** (in scena) + dozzina di mercenari. **Niente peccato del Jolly emerso** (scelta Saverio): la frattura resta sulla disfatta/cattura.
- **→ Re ♦ (mercato 4/5): BATTEZZATO = Lord Alistair Blackwood**, Gran Maestro della Loggia del Basilisco, barone scozzese (figura di spicco, deus ex machina nella cripta S5). Gerarchia Loggia: Blackwood (Gran Maestro, Re ♦) > Koenig (luogotenente) > Mansour (professore ingaggiato). [Grafia "Alistair" normalizzata; Saverio aveva scritto "Alistar".]
- **Setup S5:** sono arrestati ma l'accesso è aperto → in S5 finiscono comunque nella cripta (la Loggia li porta giù? l'enigma di Otto serve per le porte interne?). Da gestire all'apertura S5.

**DETTATURA ESITO S4 (Paola narra, perde la posta) (Saverio 30 giu, verbatim):** «Koenig fa aprire del tutto l'accesso e portare lì l'attrezzatura. "Falco, Lenzi e la giovane assistente verranno con noi, chissà che non possano rivelarsi utili." Così calano una scala di corda e scendono tutti nell'oscurità della città sepolta da migliaia di anni.»
- **Esito di servizio:** piatto 0-0 → vince O (ultima carta Omar), diario **pari**, seme dominante parità (scopa svuota; il `3♥` del gesto di Vera spazzato → non resta inciso). Prima sconfitta dei Protagonisti, narrata da Paola.
- **Ponte a S5:** prigionieri ma portati giù perché utili (enigma di Otto, egittologia di Fatima) → entrano comunque nella cripta. **Faruq e Kalim invece legati in una tenda e lasciati in superficie** (Saverio) sotto poca guardia → restano disponibili per un soccorso/epilogo. Mansour è lì (potenziale beat: riconosce Fatima, sua dottoranda — lasciato implicito per ora).

**DETTATURA ② Omar `8♦` (introduce, ♦ = Loggia già sul posto, Saverio 30 giu, verbatim):** «Quando arrivano però scorgono già un gruppo di camion con attrezzature pesanti da scavo, uomini armati. Gli uomini della Loggia sono già qui.»
- **Mappatura:** piatto `5♠`; `8♦` non cattura → introdotto. Piatto `5♠ 8♦`. `8♦` = la spedizione della Loggia (camion, attrezzatura da scavo, uomini armati) già sul posto. Mette in scacco la posta «prima della Loggia». Sarà catturato dalla Regina/Fatima al ③ (la sua competenza neutralizza il vantaggio della Loggia). Seminato «sembrano sapere dove cercare» = aggancio al professore di Fatima.

---

## ✍️ DETTATURA SCENA 5 (seed 34/367) — SCRITTA NEL MANUALE ✅

**STATO (30 giu):** Scena 5 completa e trascritta in `docs/frenemies_manuale.md` ("## Scena 5. Risoluzione"): apertura, ①-⑧, primo conteggio (esito apparente, Paola), 3 colpi di scena (Faruq/Kalim autisti; Veglianti+Alì fermano il camion; Aldo vivo che salva Vera + reframe "rimettere il Sole nella cripta per sigillare il demone"), conteggio definitivo (11-10 Vittoria piena), esito di Omar (Veglianti scacciano i mercenari, Blackwood fugge sul biplano giurando vendetta). Il segreto di Otto (sapeva di Aldo) è nel box del 9♠ → spiega il diario "giù". PROSSIMO: stabilire il finale (due piani) + rispondere alle domande di fine partita.



Asta `2♠` vs `3♦` → vince Omar (iniziativa Opposizione). Titolo «La cripta del Sole», posta canovaccio (l'eclissi). Niente spinte (ultima scena). Aftermath del rapporto = narrativo, non meccanico (diario S5 «giù» = solo l'esito di scena).

**DETTATURA ① Omar `5♦` (apre, ♦ = vantaggio posizionale Loggia, Saverio 30 giu, verbatim):** «La comitiva si sta muovendo con delle lanterne nei cunicoli che un tempo erano le strade di Zerzura; i muri degli edifici sono pieni di iscrizioni, geroglifici; statue spaventose adornano i capitelli dei colonnati. Vera, Otto e Fatima vengono spinti con le mani legate e armi puntate contro la schiena. Il 5 di quadri rappresenta il vantaggio posizionale, armi puntate.»
- **Mappatura:** piatto vuoto; `5♦` non cattura → introdotto. Piatto `5♦`. `5♦` = vantaggio della Loggia (prigionieri in pugno, armi alla schiena). È la carta che Paola elimina col `7♥` nei colpi di scena (i prigionieri si liberano della stretta).

**DETTATURA ② Paola `6♠` (introduce, ♠ = inganno di Vera, Saverio 30 giu, verbatim):** «Vera riconosce in un dettaglio architettonico un appunto che aveva letto sul taccuino del padre, ora requisito da Koenig. Sa che di lì c'è una trappola o pericolo di qualche tipo, allora cerca di ingannare i suoi nemici dicendogli che quella è la giusta direzione per la cripta.»
- **Mappatura:** piatto `5♦`; `6♠` non cattura → introdotto. Piatto `5♦ 6♠`. `6♠` = Vera che, prigioniera, prova a sviare i nemici verso una trappola fingendo di indicare la via. Sarà catturata dal Re/Blackwood al ③ (l'occultista non abbocca). Continuità: taccuino studiato all'oasi (S4 ①), confiscato da Koenig alla cattura (S4 esito).

**DETTATURA ③ Omar `Re♦` (Blackwood) presa `6♠` + effetto recupero `10♦` (Saverio 30 giu, verbatim):** «Un uomo alto, con tenuta paramilitare, calvo con folte basette bianche, si fa avanti dalle retrovie. I mercenari scostano reverenti per lasciarlo passare, e anche Koenig e Mansour abbassano lo sguardo deferenti. L'uomo sfoglia il diario del padre di Vera. "Bel tentativo, ma tuo padre è stato molto dettagliato nel suo notevole taccuino. E per tua sfortuna sono abile quanto voi a leggere questo linguaggio e a decifrare codici ed enigmi." Otto riconosce solo ora il Barone Lord Blackwood, Gran Maestro della Loggia del Basilisco. "Se proverai ancora a ingannarmi Zerzura sarà la vostra tomba", avverte i prigionieri prima di esortare il gruppo: "per di qua".»
- **Mappatura:** piatto `5♦ 6♠`; Re (10) cattura il `6♠` (presa di 1) = smonta l'inganno di Vera. Resta `5♦`. **Effetto Re v1.27: recupera dagli scarti una carta di Quadri, il `10♦`, nella riserva di Omar** (asso per i colpi di scena; rientrerà come la carta con cui Omar elimina il `7♥`). La riserva è nascosta, quindi il recupero non va mostrato nel box (basta in riga d'azione).
- **TODO colpi:** dare forma narrativa al `10♦` quando rientra (la risorsa/potere della Loggia che Blackwood cala per eliminare il `7♥`).

**DETTATURA ④ Paola `4♥` (introduce, ♥ = Otto rassicura, Saverio 30 giu, verbatim):** «Otto bisbiglia a Vera e Fatima "Mantenete la calma, non credo che abbia ancora scoperto i poteri magici delle formule scritte nel taccuino. Niente colpi di testa, non vale la pena di farsi sparare nella schiena". Otto rassicura le sue compagne dimostrandosi insolitamente calmo e padrone di sé.»
- **Mappatura:** piatto `5♦`; `4♥` non cattura → introdotto. Piatto `5♦ 4♥`. `4♥` = il legame/Otto che tiene calmo il gruppo. **Planting:** Blackwood non sa ancora del potere magico delle formule (asso nascosto di Otto per la risoluzione). Otto fuori carattere (di solito fifone) = beat di crescita. Catturato da Omar (`4♦`) al ⑤.

**DETTATURA ⑤ Omar `4♦` presa del `4♥` (Saverio 30 giu, verbatim):** «Lord Blackwood, una volta giunti davanti a un misterioso edificio a tronco di cono, appoggia i palmi sul portale dalle grandi ante di bronzo istoriate e inizia a salmodiare nella lingua sconosciuta. Dallo spiraglio tra le ante si vede una luce accecante e poi i portoni della cripta si aprono. Blackwood conosce la lingua magica.»
- **Mappatura:** piatto `5♦ 4♥`; `4♦` cattura il `4♥` (pari valore) → presa. Resta `5♦`. La presa = Blackwood smentisce la rassicurazione di Otto del ④ (NON ignora le formule, le conosce e apre la cripta lui stesso). Crolla l'asso su cui Otto contava. Edificio a tronco di cono, ante di bronzo istoriate, luce accecante.

**DETTATURA ⑥ Paola `2♠` (introduce, ♠ = Vera si libera, Saverio 30 giu, verbatim):** «Vera, approfittando del momento in cui tutti fissano meravigliati il prodigio eseguito da Blackwood, per liberarsi i polsi dai legacci che la tenevano.»
- **Mappatura:** piatto `5♦`; `2♠` non cattura → introdotto. Piatto `5♦ 2♠`. `2♠` = Vera che si libera i polsi nella distrazione generale. Carta piccola ma TENACE: resta nel piatto fino al conteggio definitivo (è il `2♠` del finale 19-10) → prepara la sua azione nei colpi di scena.

**DETTATURA ⑦ Omar `3♦` (d'asta, ultima giocata, introduce, Saverio 30 giu, verbatim):** «Su un altare al centro della cripta si trova il Sole di Mezzanotte, ed è lui che sta emettendo tutta quella luce. Blackwood scatta dentro e lo prende tra le mani sollevandolo con un urlo di gioia.»
- **Mappatura:** piatto `5♦ 2♠`; `3♦` (carta d'asta di Omar) non cattura → introdotto. Piatto `5♦ 2♠ 3♦`. `3♦` = Blackwood che afferra il Sole di Mezzanotte (trionfo apparente della Loggia). Sarà catturato da Paola (`3♠`) all'⑧.

**DETTATURA ⑧ Paola `3♠` presa del `3♦` (Saverio 30 giu, verbatim):** «Vera scatta, ruba dalla fondina di un mercenario un revolver ed entra nella cripta puntandola contro Blackwood. "Posa il Sole sull'altare". L'omone annuisce con un sorrisetto strafottente: "E cosa pensi di fare da sola contro tutti?" Vera con la coda dello sguardo vede Otto e Fatima in ginocchio con le armi puntate alla testa.»
- **Mappatura:** piatto `5♦ 2♠ 3♦`; `3♠` cattura il `3♦` (pari valore) → presa (ultima carta). Restano `5♦ 2♠` → primo conteggio Opp 5 (la stretta della Loggia + ostaggi) vs Prot 2 (Vera libera). La presa = Vera spezza il trionfo di Blackwood (lo mette sotto tiro), ma da sola con gli ostaggi non ribalta l'apparenza. Standoff.

**DETTATURA PRIMO CONTEGGIO (esito apparente, Paola narra, Saverio 30 giu, verbatim):** «La narrazione dell'esito apparente spetta a Paola, che descrive come l'artefatto viene messo in uno scrigno di piombo e tutti fuoriescono dal sottosuolo, quando il sole è ormai alto nel cielo.»
- Piatto `5♦ 2♠` → Opp 5, Prot 2. Apparente sconfitta: Vera abbassa l'arma (ostaggi), il Sole chiuso nello scrigno di piombo (nemmeno la luce filtra), la Loggia riemerge col sole alto (eclissi passata) e porta via il trofeo. "Sembra finita". Poi i colpi di scena rivelano il vero.

**DETTATURA COLPO 1 — Paola `7♥` elimina `5♦` (Saverio 30 giu, verbatim):** «I mercenari caricano su un camion la cassa contenente l'artefatto, ma ora l'inquadratura mostra gli autisti in cabina e, sorprendentemente, sono Faruq e Kalim.»
- **Mappatura:** `7♥` (riserva) entra nel piatto ed **elimina** il `5♦` (≤7). Piatto → `2♠ 7♥`. `7♥` = Faruq e Kalim (alleati ♥): liberatisi in superficie, hanno preso il posto degli autisti del camion. Il controllo della Loggia (`5♦`) era un'illusione. Voce: Paola.
- **Rifinitura (Saverio):** chiarire dove sono i tre: Vera, Otto e Fatima sono caricati **sul cassone** del camion come prigionieri, insieme alla cassa col tesoro. Faruq e Kalim (in cabina) **sbattono giù i mercenari di scorta** e partono col camion (prigionieri + artefatto a bordo).

**DETTATURA COLPO 2 — Omar `10♦` elimina `7♥` (Saverio 30 giu, verbatim):** «Il camion ha percorso solo poche centinaia di metri quando si trova circondato da una ventina di Veglianti in groppa ai loro cammelli; il loro capo spara una raffica di colpi che buca le gomme al veicolo: "Fermi, sacrileghi, il Sole di Mezzanotte non può lasciare Zerzura!"»
- **Mappatura:** `10♦` (la carta recuperata dal Re, riserva di Omar) entra nel piatto ed **elimina** il `7♥` (≤10). Piatto → `2♠ 10♦`. `10♦` = **i Veglianti** (il 10♦ era Alì in S2!): l'altra fazione ♦ rientra per conto suo (il Sole non deve lasciare Zerzura), ferma il camion forando le gomme. **Capo = Alì** (proposto): paga il «Non andranno lontano» della S3. NB: non è Blackwood che li "evoca" (Loggia e Veglianti sono rivali); è Omar che cala una risorsa ♦. Voce: Omar.
- **Colpo 2 = SOLO agguato** (Saverio): i Veglianti fermano il camion (gomme forate, «Fermi, sacrileghi!»). Aldo NON entra qui, entra nel colpo 3 (`9♠`).

**DETTATURA COLPO 3 — Paola `9♠` (si aggiunge; Vera + Aldo) (Saverio 30 giu, verbatim):** «Con la narrazione del 9 di picche è Vera che scende con le mani alzate, ma suo padre dice ad Alì di non spararle.» → Vera scende dal cassone mani alzate, Alì la punta, **Aldo gli abbassa l'arma «Non farlo, è mia figlia»**, si toglie il velo, Vera (e Otto e Faruq) lo riconoscono. **Paga la spinta ♣ mai usata** (Aldo vivo) come sconfinamento narrativo (decisione #42: il giocatore Protagonista fa intervenire/impietosire un PNG dell'Opposizione a suo favore). Voce: Paola.
- **Mappatura:** `9♠` entra nel piatto (nessun bersaglio: il `10♦` è 10>9). Piatto → `2♠ 10♦ 9♠`. È la carta vincente (Prot 11 > Opp 10).
- **RISOLUZIONE (Saverio 30 giu, verbatim):** «Vera corre verso il padre; il motivo per cui voleva il Sole era onorare il suo sacrificio e realizzare il suo sogno. Aldo dice che l'artefatto va riportato nella cripta prima dell'eclissi o forze malefiche si scateneranno sul mondo: la funzione di quel prodigioso artefatto è sigillare un demone nella sua dimensione e impedirgli di tornare sulla Terra. Vera lo abbraccia, e anche Otto raggiunge il vecchio amico.»
- **REFRAME della missione:** "mettere in salvo il Sole" = NON prenderlo, ma **rimetterlo nella cripta** (sigillare il demone). La vittoria meccanica (11-10) = i Protagonisti (con Veglianti + Aldo) impediscono alla Loggia di portarlo via. **Paga il "fini oscuri" di Fatima** (Blackwood occultista voleva il potere del demone). Diario S5 **giù** = lettura di scena (Vera-Otto: il segreto di Otto incrina il loro legame), distinto dalla riunione Vera-Aldo; l'aftermath del rapporto resta narrativo. La fate/sconfitta di Blackwood e la Loggia → nell'esito (narra Omar).

**DETTATURA ESITO S5 (Omar narra, perde la posta) (Saverio 30 giu, verbatim):** «Gli altri uomini dei Veglianti mettono in fuga i mercenari della Loggia dopo un rapido scontro. Blackwood sale sul suo biplano e scappa promettendo vendetta.»
- Conteggio definitivo `2♠ 10♦ 9♠` → Prot 11, Opp 10 → **Vittoria piena** (Prot tiene 6 punti prestigio, Opp 2). Diario su, su, pari, pari, giù.
- Esito: i Veglianti mettono in fuga i mercenari; **Blackwood fugge sul biplano giurando vendetta** (idra: la testa che sopravvive → gancio per un seguito). Sole riportato nella cripta, demone sigillato. NB biplano = di Blackwood, introdotto qui (la S3 non ha più biplano, nessun conflitto). PROSSIMO: chiusura dell'esempio (finale a due piani missione/prestigio + diario + aftermath/epilogo narrativo su Vera-Otto).

---

## ✍️ DETTATURA EPILOGO (vignette) — SCRITTO NEL MANUALE ✅ (Paola passa, Omar passa)

Epilogo a vignette (§7.5): si alternano Paola/Omar, una vignetta per Qualcuno, ambientate giorni/anni dopo; "passo" chiude. Raccolgo le vignette qui, poi le trascrivo nel manuale in un'unica sezione "## Epilogo" dopo "Come si chiude la partita".

**Vignetta 1 — Paola (Fatima), Saverio 30 giu verbatim:** «Fatima prende il dottorato, davanti al padre e allo zio Faruq commossi. Il suo relatore non è più Mansour, ma Otto, che ha ottenuto la cattedra.» → box: discussione di tesi al Museo del Cairo; Kalim e Faruq commossi in prima fila; relatore = Otto (cattedra ottenuta), Mansour sparito.

**Vignetta 2 — Omar (Alì / Veglianti), Saverio 30 giu verbatim:** «Alì dei Veglianti riposiziona il Sole di Mezzanotte e poi, insieme agli altri Veglianti, richiude la lastra.» → box: nella cripta Alì rimette il Sole sull'altare, sigillo richiuso, lastra riposizionata; il deserto cancella le tracce, riprende la veglia eterna.

**Vignetta 3 — Paola (Hatim e Otto), Saverio 30 giu verbatim:** «Hatim tira giù la teiera dal fuoco, versa due tazze e porta il vassoio in una sala con tanti tavoli di scacchi, lo aspetta il suo amico Otto. Poi i due ricominciano a giocare.» → box: circolo scacchistico del Grand Hotel al Cairo; Hatim e Otto riprendono la partita a scacchi (callback S1).

**Vignetta 4 — Omar (Koenig), Saverio 30 giu verbatim:** «Koenig è tra le nevi dell'Himalaya, attorno a lui sherpa eccitati per una scoperta. Prende la radio e contatta qualcuno della Loggia: "Lo abbiamo trovato".» → box: gancio per il seguito; la Loggia su un nuovo artefatto, altra montagna.

**Vignetta 5 — Paola (Vera e Aldo), Saverio 30 giu verbatim:** «Vera pilota un idrovolante giallo, davanti a lei Aldo consulta una vecchia mappa, sotto una giungla tropicale: "Eccolo, atterra su quel piccolo lago, il tempio dovrebbe essere poco distante".» → box: Vera e Aldo (padre-figlia) su una nuova avventura insieme; callback alla spinta ♠ "dove finisce la strada comincia lei", ora non più sola. (Otto resta all'accademia/scacchi → la coppia Vera-Otto si separa su buoni termini, eco del diario "giù".)

**Vignetta 6 (FINALE) — Omar (Blackwood e la Loggia), Saverio 30 giu verbatim:** «Blackwood presiede una seduta del consiglio della Loggia; i confratelli in tunica, nel castello del nobile in Scozia. Dietro, l'enorme statua di una creatura mostruosa; a terra un pentacolo con un occhio al centro. Una litania ritmata sale nel salone mentre l'inquadratura si allontana.» → box di chiusura, immagine sinistra, gancio per il seguito. **EPILOGO COMPLETO (6 vignette). PROSSIMO: trascrivere la sezione "## Epilogo" nel manuale dopo "Come si chiude la partita".**

---

## (STALE — VECCHIO SEED 23) Scena 3 — Il mare di sabbia (Frattura)

> ⚠️ Le carte qui sotto sono del vecchio seed (9♠/10♥/4♠, biplano, ciondolo, otre): NON valide per il seed-vetrina 34/367. Conservate solo per riciclo di immaginario (deserto, Kalim, spinta ♠ del padre). La meccanica reale è nel blocco di dettatura S3 qui sopra.

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

**DETTATURA Regina ♥ = FATIMA (mercato 3/4, Saverio 30 giu, verbatim):** «Con le informazioni che ha Paola potrebbe essere Fatima, la giovane figlia di Kalim che li aspetta all'oasi. È un'egittologa neo-laureata, ricercatrice per il Museo del Cairo; quando lo zio Faruq ha ingaggiato suo padre per salvare Vera e Otto lei non ha voluto sentir ragioni e si è unita alla comitiva.»

- **Continuità:** figlia di **Kalim** (il Fante ♥, guida); **Faruq** è lo "zio" (cugino di Kalim → zio per Fatima). Si era unita alla spedizione ma è rimasta all'**oasi** (base) durante il raid notturno nel canyon; i quattro la ritrovano lì all'alba (fine S3 → mercato 3/4 ambientato all'oasi).
- **Meccanica:** Regina ♥, valore 9, costo 5. Entra nel mazzo, rimescola, e nel 34/367 Paola la **pesca per la Scena 4** (la gioca lì, presa nella città perduta → Fatima entra in S4, NON nei colpi di scena come Pablo nel vecchio gioco). Effetto manipolatrice (avversario scarta a caso + rimpiazzo dal mazzo): per Fatima si narrerà come la sua **competenza da egittologa** che spiazza i nemici/manda all'aria un loro piano, non come seduzione.
- **Aspetto (Saverio):** giovane, grandi occhi castani estremamente svegli.
- **Backstory rifinita (Saverio, 30 giu):** è **dottoranda** in egittologia; il suo **capo/relatore è stato ingaggiato dalla Loggia** (caccia al Sole di Mezzanotte) e l'ha **lasciata a casa**. Lei ha voluto seguire il padre Kalim nel deserto per aiutare Vera e Otto. → Aggancio con la Loggia mantenendo Kalim come padre. **Possibile payoff:** il professore/relatore = candidato **Re ♦** (figura di Omar, mercato 4/5, cripta) → antagonista personale di Fatima. Da decidere al mercato 4/5.

**⚠️ PABLO ACCANTONATO (Saverio, 30 giu).** Nel seed 34/367 la nuova Scena 3 (Fuga dai Veglianti) NON ha biplano né Loggia, quindi l'origine di Pablo («aviatore folgorato da Vera quando lei abbatte il suo biplano») non ha più aggancio. La Regina ♥ del mercato 3/4 deve essere **un altro personaggio**, da inventare. Vincoli: alleato dei Protagonisti (♥), entra in **Scena 4** (la Regina è giocata in S4, presa di Paola nella città perduta), effetto Regina = manipolatrice (l'avversario scarta a caso una carta e la rimpiazza dal mazzo; narrativamente seduzione/manipolazione/semina disordine tra i nemici). DA DETTARE chi è. La dettatura Pablo qui sotto resta solo come STORIA del vecchio seed.

**Dettatura Saverio (Regina ♥ = PABLO, mercato 3/4) [STALE, vecchio seed 23 — vedi avviso sopra]:** «La Regina potrebbe essere Pablo Gutierrez, l'ardito pilota di biplano ed affascinante avventuriero al soldo della Loggia che si rimasto perdutamente innamorato di Vera quando lei gli ha sparato addosso nel deserto.» → **Regina ♥ = Pablo Gutiérrez**, pilota del biplano abbattuto da Vera in Scena 3, innamoratosi di lei, defeziona dalla Loggia e diventa alleato dei Protagonisti. Callback perfetto al biplano della Scena 3. In cripta (colpi di scena) entra, elimina il 5♣ e viene eliminato dal 9♣ di Omar (si sacrifica per Vera). NB (correzione Saverio): al mercato 3/4 NON li ha ancora raggiunti (la carta è mescolata nel mazzo) — è solo folgorato da Vera (sconfitto da un vetro = il ciondolo, e un revolver) e prima o poi tradirà la Loggia. Entra davvero solo quando si gioca la carta, in cripta.

### Dettatura di Saverio (verbatim)

**Sulla posta (e principio generale).**
> no ecco, parliamo subito della posta. attraversare le dune col taccuino non è una buona posta, anzi bisognerebbe dire nel manuale che le poste delle scene non sono mai realmente necessarie per ottenere l'obiettivo finale. Se si ottiene è un vantagigo, se non si ottiene è un problema, ma non sono mai indispensabili. Quindi una buona posta è "Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se si ottiene i protagonisti possono accamparsi e prpararsi alla ricerca, altrimenti si perdono nel deserto".

**Nuova posta Scena 3 (adottata):** Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se si ottiene, i protagonisti possono accamparsi e prepararsi alla ricerca; altrimenti si perdono nel deserto.

**Principio 1 da inserire nel manuale (e propagare):** le poste delle scene non sono MAI indispensabili per l'obiettivo finale. Ottenerle è un vantaggio, mancarle è un problema, ma la missione resta possibile in entrambi i casi.

**Sul "come" della posta.**
> inoltre la posta non dice mai come deve essere ottenuta, per questo deve essere abbastanza vaga. Orientarsi va bene, perché puoi farlo con le stelle, con una mappa, seguendo l'istinto dei cammelli, con un sogno. Orientarsi con il taccuino no, perché prenarra quello che deve venir fuori dalla scena.

**Principio 2 da inserire nel manuale (e propagare):** la posta dice il COSA (l'obiettivo concreto), mai il COME (il mezzo per ottenerlo), che deve emergere dalle giocate. Va lasciata abbastanza aperta. Es: "orientarsi nel deserto" sì (stelle, mappa, istinto dei cammelli, un sogno…); "orientarsi col taccuino" no, perché prenarra ciò che deve nascere dalla scena. (Entrambi i principi vanno in §5.2 "Come inventare una buona posta" e propagati a KB, REGOLE, REGOLE_IA, diario.)
