// Partita d'esempio per il manuale — driver con seed fisso e transcript completo.
// Uso: SEED=42 node partita_esempio.js            (riassunto di una riga)
//      SEED=42 TRANSCRIPT=1 node partita_esempio.js  (scrive transcript_seed_42.txt)
const {JSDOM}=require("jsdom");
const fs=require("fs");
const SEED=parseInt(process.env.SEED||"1");
// Secondo seed opzionale: governa SOLO le scene 3-5 (mercato di fine 2ª scena, rimescoli e scelte).
// Le scene 1-2 restano quelle di SEED; a fine Scena 2 si rigenera l'RNG col SEED2, rimescolando
// il solo mazzo residuo (le carte già giocate sono fuori dal mazzo). Se assente, vale SEED.
const SEED2=parseInt(process.env.SEED2||String(SEED));

let html=fs.readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G; window.__idc=()=>idc; window.__comboFiguraDefault=comboFiguraDefault; window.__combosPresa=combosPresa;\n/* AVVIO */");
// RNG con seed (mulberry32) iniettato in testa al primo script inline: governa mescolate e scelte
html=html.replace("<script>",`<script>
(function(){let s=${SEED}>>>0;window.__reseed=function(n){s=n>>>0};Math.random=function(){s|=0;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};})();
`);

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom; const {document}=window;
const click=el=>el.dispatchEvent(new window.Event("click",{bubbles:true}));
const rnd=()=>window.Math.random();
function G(){ return window.__G() }
function fase(){ return window.__G ? G().fase : "?" }
const veloAttivo=()=>document.getElementById("velo").classList.contains("attivo");
const modaleAttivo=()=>document.getElementById("ovModale").classList.contains("attivo");

/* ---------- materiale demo (scenario §33): Vera, Otto e il Sole di Mezzanotte ---------- */
const MISSIONE="Prendere il Sole di Mezzanotte nella cripta di Zerzura, che l'eclissi apre tra cinque giorni, PRIMA che ci arrivi la Loggia del Basilisco.";
const PRIMADIFF="Il taccuino del professor Aldo Falco, l'unico che abbia mai mappato la strada per Zerzura prima di sparire, stasera va all'asta in una sala privata del Cairo. La Loggia è già in città con una valigetta piena di banconote, e Vera e Otto non hanno nemmeno l'invito.";
const PITCH=[
 "Otto si paralizza davanti a qualsiasi cosa strisci o voli, e prima di muovere un passo deve leggere qualcosa",
 "Vera agisce prima di pensare e fa saltare in aria cose che andrebbero studiate: tratta i reperti come maniglie",
 "Suo padre è sparito cercando Zerzura: trovarla vuol dire realizzare il suo sogno e dare un senso al suo sacrificio",
 "La caccia l'ha riaperta la sua traduzione: se finisce male, è colpa sua",
 "Nessuno guida, scala o spara come Vera: dove finisce la strada, comincia lei",
 "Legge sette lingue morte e ha una faccia di cui tutti si fidano",
 "La Loggia ha sicari in ogni porto; i Veglianti hanno costruito le trappole",
 "La Loggia vuole l'artefatto, i Veglianti temono la fine: nessuno li lascerà arrivare alla cripta",
 "Tempeste in anticipo, pozzi secchi, piste cancellate, un camion che perde olio",
 "Aldo Falco è vivo: è un Vegliante. Otto lo ha capito, e tace"
];
const TITOLI=["L'asta del Cairo","Il treno per El Qara","Il mare di sabbia","L'accampamento","La cripta del Sole"];
const POSTE=[
 "Prendere il taccuino di Aldo. Se va bene: hanno la mappa e un giorno di vantaggio. Se va male: il taccuino finisce nelle mani della Loggia e un giorno di vantaggio",
 "Raggiungere El Qara in tempo. Se va bene: si uniscono alla carovana dei mercanti di datteri e ingaggiano le guide indigene. Se va male: arrivano troppo tardi e restano senza quell'aiuto prezioso",
 "Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se va bene: i protagonisti possono accamparsi e prepararsi alla ricerca. Se va male: si perdono nel deserto",
 "Raggiungere l'ingresso prima dell'alba. Se va bene: scendono nella cripta col favore del buio. Se va male: alla cripta li aspettano la Loggia da una parte e i Veglianti dall'altra",
 "L'eclissi. Se va bene: mettono in salvo il Sole di Mezzanotte. Se va male: il Sole di Mezzanotte esce da Zerzura nella valigetta sbagliata"
];

/* ---------- transcript ---------- */
const T=[];
const SYM={cuori:"♥",picche:"♠",quadri:"♦",fiori:"♣"};
const cstr=c=>c?(c.jolly?"JOLLY":(c.fig?c.fig.charAt(0).toUpperCase():c.val)+SYM[c.seme]):"?";
const mano=l=>G().lati[l].mano.map(cstr).join(" ");
const piatto=()=>G().piatto.length?G().piatto.map(cstr).join(" "):"(vuoto)";
const nomeL=l=>l==="P"?"PROTAGONISTI":"OPPOSIZIONE";
function log(s){ T.push(s) }

let spinteUsate=0, colpiFatti=0, acquisti=0, jollyGiocati=0, counterFatto=false, ultimaLoggata="";
const greedyOmar={};   // decisione (memoizzata per scena) se l'IA spende al mercato
let reseedFatto=false;   // l'RNG è già passato a SEED2 a fine 2ª scena
const astaScelte={P:null,O:null};
let spintaScena=-1;
function logUltima(){
  const u=G().ultimaGiocata;
  if(u && u!==ultimaLoggata){ log("   → "+u); ultimaLoggata=u }
}

function passo(){
  if(modaleAttivo()){
    const fm=document.getElementById("fanteManoOk");
    if(fm){   // eccezione Fante: entra in mano, una carta della mano va in fondo al mazzo
      const g=G();
      const lBuy=["P","O"].find(x=>g.lati[x].mano.length>4 && g.lati[x].mano.some(c=>c.fig==="F"));
      const scartabili=g.lati[lBuy].mano.filter(c=>c.fig!=="F" && !c.jolly);   // tieni Jolly e figure
      const cand=(scartabili.length?scartabili:g.lati[lBuy].mano.filter(c=>c.fig!=="F")).sort((a,b)=>a.val-b.val)[0];
      const el=[...document.querySelectorAll("#fanteManoCarte .carta")].find(x=>parseInt(x.dataset.id)===cand.id);
      click(el); click(fm);
      log(`   → FANTE assoldato: entra in mano, ${cstr(cand)} va in fondo al mazzo.`);
      return "fante-mano";
    }
    const f=document.getElementById("fanteOk"), rNo=document.getElementById("reNo");
    if(f){ log("   → effetto FANTE: guarda le prime 4 carte del mazzo e le riordina."); click(f); return "fante" }
    if(rNo){ log("   → effetto RE: nessuno scambio con gli scarti."); click(rNo); return "re-no" }
    const pngOk=document.getElementById("pngOk");   // modale nome/desc dell'acquisto figura (silenzioso nel transcript)
    if(pngOk){ const n=document.getElementById("m-png-nome"); if(n) n.value="PNG di prova";
      const d=document.getElementById("m-png-desc"); if(d) d.value="descrizione di prova"; click(pngOk); return "png-figura" }
    const pngnOk=document.getElementById("pngnOk");
    if(pngnOk){ const n=document.getElementById("m-pngn-nome"); if(n) n.value="PNG narrativo di prova"; click(pngnOk); return "png-narr" }
    throw new Error("modale sconosciuto");
  }
  if(veloAttivo()){ click(document.getElementById("veloBtn")); return "velo" }
  const f=fase();

  if(f==="modalita"){ click(document.getElementById("md-locale")); return f }

  if(f==="setup"){
    const set=(id,v)=>{const e=document.getElementById(id); if(e) e.value=v};
    set("w-nomeP","Paola"); set("w-nomeO","Omar");
    set("w-missione",MISSIONE); set("w-primadiff",PRIMADIFF);
    set("w-persA","Vera Falco"); set("w-descA","Eroina d'azione: atletica, impulsiva, irruente. Cresciuta nei cantieri di scavo del padre Aldo. Guida, scala, cavalca e spara meglio di chiunque la insegua.");
    set("w-persB","Otto Lenzi"); set("w-descB","Filologo delle lingue morte, topo di biblioteca, fobie catalogate in ordine alfabetico. La sua traduzione di una stele ha riacceso la caccia a Zerzura, e non se lo perdona.");
    set("w-nemici-input","La Loggia del Basilisco e i Veglianti di Zerzura: due ordini rivali, ma entrambi vogliono fermarli");
    set("w-caos-input","Il deserto: tempeste in anticipo, piste che spariscono, un camion che perde olio, le trappole della cripta, gli scorpioni");
    for(let k=0;k<10;k++) set("w-pitch-"+k,PITCH[k]);
    if(G().passo===2){ const b=[...document.querySelectorAll('button[data-tono]')].find(x=>x.dataset.tono==="Action"); if(b&&G().tono!=="Action"){ click(b); return "tono" } }
    click(document.getElementById("w-avanti")); return "setup"+G().passo;
  }

  if(f==="asta"){
    const a=G().attore;
    const carte=[...document.querySelectorAll("#manoAsta .carta")].filter(c=>!c.classList.contains("jolly"));
    if(!carte.length) throw new Error("asta senza carte");
    log(`   ${nomeL(a)} — mano: ${mano(a)}`);
    const el=carte[Math.floor(rnd()*carte.length)];
    astaScelte[a]=G().lati[a].mano.find(c=>c.id===parseInt(el.dataset.id))||null;
    click(el);
    click(document.getElementById("confAsta"));
    return f;
  }
  if(f==="asta_rivela"){
    const g=G(), rec=g.scene[g.scena];
    log(`   Asta: Protagonisti ${cstr(astaScelte.P)} contro Opposizione ${cstr(astaScelte.O)} → iniziativa a ${nomeL(rec.iniziativa)}.`);
    click(document.getElementById("vaiApertura")); return f;
  }
  if(f==="apertura"){
    const g=G();
    log(``);
    log(`== SCENA ${g.scena+1} — ${TITOLI[g.scena]} ==`);
    document.getElementById("a-titolo").value=TITOLI[g.scena];
    document.getElementById("a-posta").value=POSTE[g.scena];
    log(`   Posta: ${POSTE[g.scena]}`);
    if(g.piatto.length) log(`   Nel piatto dalla scena precedente: ${piatto()}`);
    click(document.getElementById("a-via")); return f;
  }

  if(f==="turno"){
    const a=G().attore;
    const carte=[...document.querySelectorAll("#manoTurno .carta")];
    if(!carte.length) throw new Error("turno senza carte");
    log(`   ${nomeL(a)} — mano: ${mano(a)} | piatto: ${piatto()}`);
    const jollyEl=carte.find(c=>c.classList.contains("jolly"));
    const nonJolly=carte.filter(c=>!c.classList.contains("jolly"));
    const scelta=(jollyEl && G().piatto.length>0) ? jollyEl : (nonJolly[0]||carte[0]);
    click(scelta);
    const box=document.getElementById("pannelloAzione");
    const jScarta=box.querySelector("#jScarta");
    if(jScarta){ click(jScarta); jollyGiocati++; logUltima(); return "jolly-scartato" }
    const figSac=box.querySelector("#figSacrificio"); if(figSac){ click(figSac); logUltima(); return "fig-sacrificio" }
    const figMet=box.querySelector("#figMetti"); if(figMet){ click(figMet); logUltima(); return "fig-piatto" }
    const cid=parseInt(scelta.dataset.id);
    const attore=G().attore, manoA=G().lati[attore];
    const cardObj=(manoA.mano.find(x=>x.id===cid))||(manoA.astaCarta&&manoA.astaCarta.id===cid?manoA.astaCarta:null);
    if(cardObj && cardObj.fig){
      // figura (UI stile Jolly): riproduci la presa di default scegliendo il valore = somma del default
      const def=window.__comboFiguraDefault(attore, cardObj.val);
      const v=def.reduce((s,x)=>s+x.val,0);
      click([...box.querySelectorAll("button[data-v]")].find(b=>parseInt(b.dataset.v)===v));
      const combos=window.__combosPresa(v);
      const wantIds=def.map(x=>x.id).sort((a,b)=>a-b).join(",");
      const idx=combos.findIndex(cmb=>cmb.map(x=>x.id).sort((a,b)=>a-b).join(",")===wantIds);
      const fc=[...box.querySelectorAll("#figCombos button[data-c]")];
      click(fc[idx>=0?idx:0]); logUltima(); return "fig-presa";
    }
    const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);
    if(jv.length){
      const scelto=jv[jv.length-1];   // il valore più alto disponibile: più drammatico
      click(scelto);
      const jc=[...box.querySelectorAll("#jollyCombos button[data-c]")];
      click(jc[0]); jollyGiocati++; logUltima();
      return "jolly";
    }
    const opz=[...box.querySelectorAll(".opzioni button")];
    if(!opz.length) throw new Error("nessuna opzione");
    click(opz[opz.length-1].dataset.piatto?opz[Math.floor(rnd()*opz.length)]:opz[0]);
    logUltima();
    return "gioca";
  }

  if(f==="narrazione"){
    const sp=[...document.querySelectorAll("button[data-spinta]")];
    if(sp.length && spinteUsate<2 && G().scena>=1 && spintaScena!==G().scena){
      spintaScena=G().scena;
      spinteUsate++;
      const b=sp[0];
      log(`   → SPINTA DEL PITCH: viene spuntata «${b.textContent.trim()}» — la presa diventa una scopa vera: il piatto si svuota nelle prese di chi spunta.`);
      click(b); logUltima(); return "spinta";
    }
    click(document.getElementById("narrOk")); return f;
  }

  if(f==="fine_scena"){
    const g=G(), rec=g.scene[g.scena];
    log(`   FINE SCENA ${g.scena+1}: piatto ${rec.totP} a ${rec.totO} → vince ${rec.vincitore==="parita"?"NESSUNO (parità)":nomeL(rec.vincitore)}. Seme dominante: ${SYM[rec.dominante]||rec.dominante||"—"} (diario: ${rec.rapporto}).`);
    // a fine 2ª scena, prima del mercato, l'RNG passa a SEED2: scene 3-5 governate dal secondo seed,
    // sul solo mazzo residuo (le carte giocate nelle scene 1-2 sono già fuori dal mazzo).
    if(g.scena===1 && SEED2!==SEED && !reseedFatto){ window.__reseed(SEED2); reseedFatto=true; }
    click(document.getElementById("fs-avanti")); return f;
  }

  if(f==="mano_estesa"){
    const btn=document.getElementById("estOk");
    if(btn.disabled){
      const tutte=[...document.querySelectorAll("#estCarte .carta")];
      const jolly=tutte.filter(c=>c.classList.contains("jolly"));
      const altre=tutte.filter(c=>!c.classList.contains("jolly"));
      [...jolly,...altre].slice(0,4).forEach(c=>click(c));
    }
    const g=G();
    log(`   MANO ESTESA (scena 5): ${nomeL(g.attore)} tiene 4 carte, il resto va in riserva per i colpi di scena.`);
    click(document.getElementById("estOk")); return f;
  }

  if(f==="mercato"){
    // Politica curata per l'esempio "vetrina": far comparire tutte e tre le figure.
    // Paola: prima il Fante (entra in mano), poi la Regina quando se la può permettere (mai il Re).
    // Omar: punta al Re, lo compra solo quando se lo può permettere (altrimenti risparmia).
    const NOMI_FIG={F:"il FANTE",D:"la REGINA",R:"il RE"};
    const btns=[...document.querySelectorAll("button[data-f]")].filter(x=>!x.disabled);
    const pick = btns.find(x=>x.dataset.l==="P" && x.dataset.f==="F")
              || btns.find(x=>x.dataset.l==="P" && x.dataset.f==="D")
              || btns.find(x=>x.dataset.l==="O" && x.dataset.f==="R");
    if(pick){
      log(`   MERCATO: ${nomeL(pick.dataset.l)} compra ${NOMI_FIG[pick.dataset.f]} di ${pick.dataset.s} ${SYM[pick.dataset.s]}.`);
      click(pick); acquisti++; return "compra";
    }
    click(document.getElementById("m-fine")); return f;
  }

  if(f==="jolly_intro"){ log(``); log(`-- Dopo la seconda scena: il JOLLY entra nel mazzo dei Protagonisti. --`); click(document.getElementById("j-ok")); return f }

  if(f==="primo_conteggio"){
    log(``); log(`-- PRIMO CONTEGGIO (esito apparente) --`);
    log(`   Piatto finale: ${piatto()}`);
    click(document.getElementById("pc-avanti")); return f;
  }

  if(f==="colpi"){
    // colpo obbligatorio finché c'è riserva
    const carte=[...document.querySelectorAll("#riservaCarte .carta")];
    if(carte.length){
      click(carte[0]);
      const b=document.querySelector("button[data-bersaglio]");
      if(b){ colpiFatti++; click(b); logUltima(); return "colpo"; }
    }
    return "colpo";
  }

  if(f==="neutralizza"){
    log(`   Figure rimaste sul piatto: vengono neutralizzate (contano come scope avversarie).`);
    click(document.getElementById("n-ok")); return f;
  }

  if(f==="finale") return "FINALE";
  throw new Error("fase sconosciuta: "+f);
}

window.addEventListener("error",e=>{ console.error("ERRORE PAGINA:",e.message); process.exit(1) });

try{
  for(let i=0;i<5000;i++){
    if(passo()==="FINALE"){
      const g=G();
      const esito=document.querySelector(".cartellone .grande");
      const outcome=esito?esito.textContent.trim():"?";
      log(``); log(`-- CONTEGGIO DEFINITIVO E FINALE --`);
      log(`   Piatto finale: ${piatto()}`);
      const pv=l=>{const L=g.lati[l];return (L.bonus||0)+L.prese.reduce((a,c)=>a+(c.fig?2:1),0)+L.scope.filter(c=>!c.esposta).length*4;};
      const ps=l=>g.piatto.filter(c=>g.lati[l].semi.includes(c.seme)).reduce((a,c)=>a+(c.jolly?0:(c.fig?{F:8,D:9,R:10}[c.fig]:c.val)),0);
      log(`   Valori nel piatto: Protagonisti (♥+♠) ${ps("P")} contro Opposizione (♦+♣) ${ps("O")}.`);
      log(`   Punti complessivi (presa 1, figura 2, scopa 4): Protagonisti ${pv("P")} (${g.lati.P.prese.length} prese, ${g.lati.P.scope.length} scope), Opposizione ${pv("O")} (${g.lati.O.prese.length} prese, ${g.lati.O.scope.length} scope).`);
      log(`   Esito: ${outcome}`);
      log(`   Scope — Protagonisti: ${g.lati.P.scope.map(cstr).join(" ")||"nessuna"} · Opposizione: ${g.lati.O.scope.map(cstr).join(" ")||"nessuna"}`);
      log(`   Diario del rapporto per scena: ${g.scene.map(s=>s?s.rapporto:"-").join(", ")}`);
      const vinte=g.scene.map(s=>s?s.vincitore:"-").join("");
      const riass=`SEED=${SEED} ok scene=${vinte} scopeP=${g.lati.P.scope.length} scopeO=${g.lati.O.scope.length} jolly=${jollyGiocati} counter=${counterFatto} spinte=${spinteUsate} colpi=${colpiFatti} acquisti=${acquisti} outcome="${outcome}"`;
      console.log(riass);
      if(process.env.TRANSCRIPT){
        const fnT=`transcript_seed_${SEED}${SEED2!==SEED?"_"+SEED2:""}.txt`;
        fs.writeFileSync(fnT, T.join("\n"));
        console.log(`transcript: ${fnT} (${T.length} righe)`);
      }
      process.exit(0);
    }
  }
  console.error(`SEED=${SEED} BLOCCATO in fase ${fase()}`);
  process.exit(1);
}catch(e){
  console.error(`SEED=${SEED} ECCEZIONE in fase ${fase()}: ${e.message}`);
  process.exit(1);
}
