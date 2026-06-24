# Appunti di lavoro — partita d'esempio (Appendice B / §34), scene 3-5

**Cosa è questo file.** Diario di lavoro per la stesura della partita d'esempio dello scenario
"Il sole di mezzanotte" (seed 23/43). Qui registro **alla lettera** tutto ciò che Saverio detta,
mossa per mossa (motivazioni strategiche incluse), prima di trasformarlo nel formato passo-per-passo
dell'Appendice B. Le scene 1-2 e il mercato 2/3 sono già scritti nel manuale; questo file parte dalla
Scena 3.

I fatti meccanici di ogni scena sono presi dal transcript di riferimento (fonte di verità delle
carte). La dettatura di Saverio va ancorata a quelle carte.

---

## ⚠️ RIPRENDERE DA QUI (giugno 2026) — REGOLE v1.15: l'esempio va RIGENERATO da zero

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
