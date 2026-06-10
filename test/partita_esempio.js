// Partita d'esempio per il manuale — driver con seed fisso e transcript completo.
// Uso: SEED=42 node partita_esempio.js            (riassunto di una riga)
//      SEED=42 TRANSCRIPT=1 node partita_esempio.js  (scrive transcript_seed_42.txt)
const {JSDOM}=require("jsdom");
const fs=require("fs");
const SEED=parseInt(process.env.SEED||"1");

let html=fs.readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G; window.__idc=()=>idc;\n/* AVVIO */");
// RNG con seed (mulberry32) iniettato in testa al primo script inline: governa mescolate e scelte
html=html.replace("<script>",`<script>
(function(){let s=${SEED}>>>0;Math.random=function(){s|=0;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};})();
`);

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom; const {document}=window;
const click=el=>el.dispatchEvent(new window.Event("click",{bubbles:true}));
const rnd=()=>window.Math.random();
function G(){ return window.__G() }
function fase(){ return window.__G ? G().fase : "?" }
const veloAttivo=()=>document.getElementById("velo").classList.contains("attivo");
const modaleAttivo=()=>document.getElementById("ovModale").classList.contains("attivo");

/* ---------- materiale demo (scenario §33) ---------- */
const MISSIONE="Entro 36 ore Vargas atterrerà su una pista segreta del New Mexico per un meeting con i boss locali, e ripartirà: bisogna farlo arrestare in flagranza PRIMA del decollo.";
const PRIMADIFF="Skunk è in cella: i poliziotti corrotti lo hanno arrestato per farlo uccidere in prigione dagli uomini di Vargas.";
const PITCH=[
 "Skunk non dice mai tutta la verità: ogni cosa che tocca diventa un traffico",
 "Frank lo tratta ancora da spia, mai da socio",
 "Solo l'arresto in flagranza di Vargas può ridargli il distintivo",
 "Vargas ha fatto uccidere suo fratello Jorge",
 "Frank conosce ogni strada secondaria e i colleghi sul libro paga",
 "Skunk procura qualsiasi cosa con una telefonata",
 "La rete di poliziotti corrotti e i due sicari pazienti",
 "Il meeting è il momento di massima esposizione di Vargas",
 "Tempesta di sabbia, un'auto a pezzi, posti di blocco a sorpresa",
 "Jorge è stato ucciso al posto di Skunk: la spia era lui, e Frank non lo sa"
];
const TITOLI=["La cella","La statale","Il deserto","L'ultima notte","La pista"];
const POSTE=[
 "Tirare fuori Skunk prima del trasferimento: se va male, escono braccati e con mezzo distretto alle calcagna",
 "Sparire verso ovest: se va male, i sicari agganciano la loro traccia",
 "Attraversare il deserto interi: se va male, quello che non si sono detti esplode",
 "Arrivare in vista della pista: se va male, qualcuno li sta già aspettando",
 "Il meeting: se va male, il jet riparte con Vargas a bordo"
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
const astaScelte={P:null,O:null};
let spintaScena=-1;
function logUltima(){
  const u=G().ultimaGiocata;
  if(u && u!==ultimaLoggata){ log("   → "+u); ultimaLoggata=u }
}

function passo(){
  if(modaleAttivo()){
    const f=document.getElementById("fanteOk"), rNo=document.getElementById("reNo");
    if(f){ log("   → effetto FANTE: guarda le prime 4 carte del mazzo e le riordina."); click(f); return "fante" }
    if(rNo){ log("   → effetto RE: nessuno scambio con gli scarti."); click(rNo); return "re-no" }
    throw new Error("modale sconosciuto");
  }
  if(veloAttivo()){ click(document.getElementById("veloBtn")); return "velo" }
  const f=fase();

  if(f==="modalita"){ click(document.getElementById("md-locale")); return f }

  if(f==="setup"){
    const set=(id,v)=>{const e=document.getElementById(id); if(e) e.value=v};
    set("w-nomeP","Paola"); set("w-nomeO","Omar");
    set("w-missione",MISSIONE); set("w-primadiff",PRIMADIFF);
    set("w-persA","Frank"); set("w-descA","Ex poliziotto sospeso per eccesso di forza. Cinico, metodico.");
    set("w-persB","Skunk"); set("w-descB","Suo ex informatore. Truffatore, intrallazzone dei bassifondi.");
    set("w-nemici","L'organizzazione di Vargas: poliziotti corrotti e due sicari pazienti");
    set("w-caos","La tempesta di sabbia, un'auto con trecentomila chilometri, la sfortuna");
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
    const jFall=box.querySelector("#jFallisce");
    if(jFall){ click(jFall); jollyGiocati++; logUltima(); return "jolly-fallito" }
    const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);
    if(jv.length){
      const scelto=jv[jv.length-1];   // il valore più alto disponibile: più drammatico
      click(scelto);
      const jc=[...box.querySelectorAll("#jollyCombos button[data-c]")];
      click(jc[0]); jollyGiocati++;
      const pj=G().pendingJolly;
      log(`   → ${nomeL(a)} dichiara il JOLLY come ${pj.valore} per prendere ${pj.combo.map(cstr).join(" + ")}. Tocca all'avversario decidere.`);
      return "jolly";
    }
    const opz=[...box.querySelectorAll(".opzioni button")];
    if(!opz.length) throw new Error("nessuna opzione");
    click(opz[opz.length-1].dataset.piatto?opz[Math.floor(rnd()*opz.length)]:opz[0]);
    logUltima();
    return "gioca";
  }

  if(f==="counter"){
    const si=document.getElementById("cSi");
    if(si){ counterFatto=true; click(si); logUltima(); return "counter-si" }
    log(`   → l'avversario non può (o non vuole) opporsi.`);
    click(document.getElementById("cNo")); logUltima(); return "counter-no";
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
    let b;
    while(acquisti<3 && (b=[...document.querySelectorAll("button[data-f]")].find(x=>!x.disabled))){
      const NOMI_FIG={F:"il FANTE",D:"la DAMA",R:"il RE"};
      log(`   MERCATO: ${nomeL(b.dataset.l)} compra ${NOMI_FIG[b.dataset.f]||b.dataset.f} di ${b.dataset.s} ${SYM[b.dataset.s]}.`);
      click(b); acquisti++;
    }
    click(document.getElementById("m-fine")); return f;
  }

  if(f==="jolly_intro"){ log(``); log(`-- Dopo la terza scena: i JOLLY entrano nei mazzi. --`); click(document.getElementById("j-ok")); return f }

  if(f==="primo_conteggio"){
    log(``); log(`-- PRIMO CONTEGGIO (esito apparente) --`);
    log(`   Piatto finale: ${piatto()}`);
    click(document.getElementById("pc-avanti")); return f;
  }

  if(f==="colpi"){
    if(colpiFatti<2){
      const carte=[...document.querySelectorAll("#riservaCarte .carta")];
      for(const c of carte){
        click(c);
        const b=document.querySelector("button[data-bersaglio]");
        if(b){ colpiFatti++; click(b); logUltima(); return "colpo" }
      }
    }
    log(`   ${nomeL(G().attore)} passa: nessun (altro) colpo di scena.`);
    click(document.getElementById("colpoPasso")); return f;
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
      const sv=c=>c.esposta?0:(c.tappata?1:2);
      const pv=l=>g.lati[l].scope.reduce((a,c)=>a+sv(c),0)+g.lati[l].prese.length;
      const ps=l=>g.piatto.filter(c=>g.lati[l].semi.includes(c.seme)).reduce((a,c)=>a+(c.jolly?0:(c.fig?{F:8,D:9,R:10}[c.fig]:c.val)),0);
      log(`   Valori nel piatto: Protagonisti (♥+♠) ${ps("P")} contro Opposizione (♦+♣) ${ps("O")}.`);
      log(`   Punti complessivi (scope + prese): Protagonisti ${pv("P")} (${g.lati.P.prese.length} prese), Opposizione ${pv("O")} (${g.lati.O.prese.length} prese).`);
      log(`   Esito: ${outcome}`);
      log(`   Scope — Protagonisti: ${g.lati.P.scope.map(cstr).join(" ")||"nessuna"} · Opposizione: ${g.lati.O.scope.map(cstr).join(" ")||"nessuna"}`);
      log(`   Diario del rapporto per scena: ${g.scene.map(s=>s?s.rapporto:"-").join(", ")}`);
      const vinte=g.scene.map(s=>s?s.vincitore:"-").join("");
      const riass=`SEED=${SEED} ok scene=${vinte} scopeP=${g.lati.P.scope.length} scopeO=${g.lati.O.scope.length} jolly=${jollyGiocati} counter=${counterFatto} spinte=${spinteUsate} colpi=${colpiFatti} acquisti=${acquisti} outcome="${outcome}"`;
      console.log(riass);
      if(process.env.TRANSCRIPT){
        fs.writeFileSync(`transcript_seed_${SEED}.txt`, T.join("\n"));
        console.log(`transcript: transcript_seed_${SEED}.txt (${T.length} righe)`);
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
