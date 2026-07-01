// Collaudo del meccanismo "🔁 Rigenera" (modalità solo, contro Claude).
// A differenza di test_solo.js, qui si inietta una CHIAVE fittizia (canaleIA() vero) così i
// pulsanti di rigenerazione compaiono, e lo stub di rete risponde con testi SEMPRE DIVERSI
// (un contatore), così la rigenerazione è verificabile: ogni "Rigenera" deve cambiare il
// contenuto mostrato e NON deve duplicare le voci del log narrativo.
// Seed fisso (mulberry32) per riproducibilità. Uso: npm i jsdom && SEED=5 node test/test_riprova.js
// (default SEED=5: vincitori scene O,O,P,P,P, con buon margine su entrambi i lati: l'Opposizione
//  apre le scene 1-2 (rigenera apertura) e i Protagonisti vincono le scene 3-5, così Claude narra
//  il suo esito, come richiede la regola "narra chi perde la posta". Margine scelto per robustezza:
//  il percorso asincrono dell'IA non è perfettamente deterministico e un singolo esito di scena può
//  oscillare; con 2 vittorie O e 3 P entrambe le condizioni restano soddisfatte).
const {JSDOM}=require("jsdom");
const fs=require("fs");
const SEED=parseInt(process.env.SEED||"5");

let html=fs.readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G;\n/* AVVIO */");
// RNG con seed iniettato in testa al primo script inline (come partita_esempio.js)
html=html.replace("<script>",`<script>
(function(){let s=${SEED}>>>0;Math.random=function(){s|=0;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};})();
`);

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom; const {document}=window;
const click=el=>el&&el.dispatchEvent(new window.Event("click",{bubbles:true}));
const G=()=>window.__G();
const dorme=ms=>new Promise(r=>setTimeout(r,ms));
const mod=()=>document.getElementById("ovModale").classList.contains("attivo");

// stub: ogni chiamata restituisce un JSON valido per la fase, con testi via via DIVERSI (contatore nGen)
let nGen=0;
window.fetch=async(url,opts)=>{
  let body={}; try{ body=JSON.parse(opts.body) }catch(e){}
  const msg=(body.messages&&body.messages[0]&&body.messages[0].content)||"";
  nGen++;
  let obj={};
  if(/"narrazione"/.test(msg)) obj={narrazione:"Narrazione di Claude num "+nGen, spinta:null};
  else if(/"titolo"/.test(msg)) obj={titolo:"Titolo "+nGen, posta:"Posta "+nGen};
  else if(/"esito"/.test(msg)) obj={esito:"Esito di Claude num "+nGen};
  else if(/"nemici"/.test(msg)) obj={nemici:["Nemici "+nGen,"Corrotti "+nGen], caos:["Caos "+nGen], q6:"q6-"+nGen, q7:"q7-"+nGen, q8:"q8-"+nGen, q9:"q9-"+nGen};
  else if(/"acquisti"/.test(msg)) obj={acquisti:[]};
  else if(/"scelta"/.test(msg)) obj={scelta:0};
  return { json: async()=>({content:[{type:"text",text:JSON.stringify(obj)}]}) };
};

// pilota il modale di feedback aperto da un pulsante "Rigenera": ritorna false se il pulsante
// non c'è/è disabilitato o il modale non si apre
async function rigeneraVia(btnId, feedback){
  const b=document.getElementById(btnId);
  if(!b || b.disabled) return false;
  click(b);
  await dorme(20);
  const fb=document.getElementById("fbTesto");
  if(!fb) return false;
  if(feedback) fb.value=feedback;
  click(document.getElementById("fbSi"));
  await dorme(90);   // attende la fetch dello stub e l'iniezione
  return true;
}
function fallisci(m){ console.error("FALLITO:", m); process.exit(1) }

let narrazioniIA=0;
let okSetup=false, okApert=false, okNarr=false, okEsito=false;

async function main(){
  const inizio=Date.now();
  for(let i=0;i<8000;i++){
    if(Date.now()-inizio>110000) throw new Error("timeout");
    const f=G()?G().fase:"?";

    if(mod()){
      const ck=document.getElementById("ckOk");
      if(ck){ const k=document.getElementById("ckInput"); if(k) k.value="sk-ant-test"; click(ck); await dorme(20); continue; }   // imposta la chiave fittizia
      if(G().attore==="P") click(document.getElementById("fanteNo")||document.getElementById("reNo"));
      await dorme(30); continue;
    }

    if(f==="modalita"){ click(document.getElementById("md-solo")); await dorme(20); continue }
    if(f==="setup"){
      const set=(id,v)=>{const e=document.getElementById(id); if(e) e.value=v};
      set("w-nomeP","Tester"); set("w-missione","Arrestare Vargas PRIMA che il jet riparta");
      set("w-primadiff","Skunk e in cella"); set("w-persA","Frank"); set("w-persB","Skunk");
      set("w-nemici-input","Sicari e corrotti"); set("w-caos-input","Tempesta e sfortuna");
      for(let k=0;k<10;k++) set("w-pitch-"+k,"Risposta "+(k+1));
      // passo Opposizione (5): Claude la genera da se; appena pronta, prova la rigenerazione una volta
      if(G().passo===5){
        if(!okSetup){
          if(G().oppGenerata && document.getElementById("w-reopp")){
            const prima=G().nemici.join("|");   // ora G.nemici è un array: confronto per contenuto
            const fatto=await rigeneraVia("w-reopp","rendili piu cinici");
            const dopo=G().nemici.join("|");
            if(!fatto) fallisci("setup: modale Rigenera non aperto");
            if(!dopo || dopo===prima) fallisci("setup: nemici non rigenerati ("+prima+" -> "+dopo+")");
            okSetup=true;
          }else{ await dorme(40); continue; }   // aspetta la generazione automatica
        }
      }
      click(document.getElementById("w-avanti")); await dorme(20); continue;
    }

    const attoreO = G().attore==="O";
    if(f==="asta" && !attoreO){
      const manoA=G().lati[G().attore].mano;   // v1.34: asta solo numeriche (Jolly e figure escluse)
      const c=[...document.querySelectorAll("#manoAsta .carta")].filter(x=>{const o=manoA.find(y=>y.id==x.dataset.id);return o&&!o.jolly&&!o.fig;});
      click(c[Math.floor(Math.random()*c.length)]); click(document.getElementById("confAsta"));
      await dorme(20); continue;
    }
    if(f==="asta_rivela"){ click(document.getElementById("vaiApertura")); await dorme(20); continue }
    if(f==="apertura"){
      if(!attoreO){ click(document.getElementById("a-via")); await dorme(20); continue }
      const ti=document.getElementById("a-titolo");
      if(ti && ti.value){   // Claude ha riempito titolo/posta e si e fermato per la revisione
        if(!okApert){
          const prima=ti.value;
          const fatto=await rigeneraVia("a-riprova","titolo piu breve");
          if(fatto){
            const dopo=(document.getElementById("a-titolo")||{}).value;
            if(!dopo || dopo===prima) fallisci("apertura: titolo non rigenerato ("+prima+" -> "+dopo+")");
            okApert=true;
          }
        }
        click(document.getElementById("a-via")); await dorme(20); continue;
      }
      await dorme(40); continue;   // aspetta che iaApertura riempia
    }
    if(f==="turno" && !attoreO){
      const c=[...document.querySelectorAll("#manoTurno .carta")];
      click(c[0]);
      const box=document.getElementById("pannelloAzione");
      const js=box.querySelector("#jScarta");
      if(js){ click(js); await dorme(20); continue }
      const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);
      if(jv.length){ click(jv[0]); click([...box.querySelectorAll("#jollyCombos button[data-c]")][0]); await dorme(20); continue }
      const o=[...box.querySelectorAll(".opzioni button")];
      click(o[0]); await dorme(20); continue;
    }
    if(f==="narrazione"){
      const latoNarr=G().narrLato||G().attore;
      if(latoNarr==="P"){
        const ni=document.getElementById("narrInput");
        if(ni){ ni.value="Frank e Skunk tirano dritto nella notte."; ni.dispatchEvent(new window.Event("input",{bubbles:true})); }
        click(document.getElementById("narrOk")); await dorme(20); continue;
      }
      const n=document.getElementById("iaNarr");
      if(n){
        narrazioniIA++;
        if(!okNarr){
          const prima=n.textContent;
          const lenPrima=G().storia.length;
          const fatto=await rigeneraVia("narrRiprova","piu breve e cupo");
          if(fatto){
            const n2=document.getElementById("iaNarr");
            const dopo=n2?n2.textContent:"";
            if(!dopo || dopo===prima) fallisci("narrazione: testo non rigenerato ("+prima+" -> "+dopo+")");
            if(G().storia.length!==lenPrima) fallisci("narrazione: log duplicato/incoerente ("+lenPrima+" -> "+G().storia.length+")");
            okNarr=true;
          }
        }
        click(document.getElementById("narrOk"));
      }
      await dorme(50); continue;
    }
    if(f==="fine_scena"){
      const rec=G().scene[G().scena];
      const claudeEsito = G().modalita==="solo" && !rec.perRitirata && (rec.vincitore==="P" || (rec.vincitore==="parita" && rec.iniziativa==="O"));   // l'esito lo narra chi perde la posta: l'Opposizione quando vince la scena i Protagonisti (in parità chi ha vinto l'asta)
      if(claudeEsito && !document.getElementById("fsEsito")){ await dorme(40); continue }   // aspetta l'iniezione dell'esito
      if(claudeEsito && !okEsito){
        const fsE=document.getElementById("fsEsito");
        const prima=fsE.textContent;
        const lenPrima=G().storia.length;
        const fatto=await rigeneraVia("fsRiprova","");   // feedback vuoto: rigenerazione a vuoto
        if(fatto){
          const e2=document.getElementById("fsEsito");
          const dopo=e2?e2.textContent:"";
          if(!dopo || dopo===prima) fallisci("esito: testo non rigenerato ("+prima+" -> "+dopo+")");
          if(G().storia.length!==lenPrima) fallisci("esito: log duplicato/incoerente ("+lenPrima+" -> "+G().storia.length+")");
          okEsito=true;
        }
      }
      const avanti=document.getElementById("fs-avanti");
      if(avanti && !avanti.disabled) click(avanti);
      await dorme(20); continue;
    }
    if(f==="mercato"){
      const fine=document.getElementById("m-fine");
      if(fine && !fine.disabled && document.getElementById("iaMercatoFatto")){ click(fine); }
      await dorme(50); continue;
    }
    if(f==="mano_estesa"){
      if(!attoreO){
        const btn=document.getElementById("estOk");
        if(btn.disabled) [...document.querySelectorAll("#estCarte .carta")].slice(0,4).forEach(c=>click(c));
        click(document.getElementById("estOk"));
      }
      await dorme(40); continue;
    }
    if(f==="jolly_intro"){ click(document.getElementById("j-ok")); await dorme(20); continue }
    if(f==="pareggio_finale"){
      const sp=document.getElementById("pf-spendi");
      if(sp) click(sp && !sp.disabled ? sp : document.getElementById("pf-cedi"));
      await dorme(20); continue;
    }
    if(f==="primo_conteggio"){ click(document.getElementById("pc-avanti")); await dorme(20); continue }
    if(f==="colpi"){
      if(!attoreO){
        const g=G(), top=g.colpi.top;
        const giocabili=g.lati[g.attore].riserva.filter(c=>c.val>=top).sort((a,b)=>a.val-b.val);
        if(giocabili.length){
          const el=document.querySelector(`#riservaCarte .carta[data-id="${giocabili[0].id}"]`);
          if(el) click(el);
        }
      }
      await dorme(50); continue;
    }
    if(f==="neutralizza"){ click(document.getElementById("n-ok")); await dorme(20); continue }
    if(f==="finale"){
      const g=G();
      console.log("PARTITA COMPLETATA (seed "+SEED+")");
      console.log("vincitori scene:", g.scene.map(s=>s?s.vincitore:"-").join(","));
      console.log("narrazioni IA mostrate:", narrazioniIA, "| generazioni stub:", nGen);
      console.log("rigenerazioni testate -> setup:"+okSetup+" apertura:"+okApert+" narrazione:"+okNarr+" esito:"+okEsito);
      if(!okSetup)  fallisci("setup Opposizione mai rigenerato");
      if(!okNarr)   fallisci("narrazione mai rigenerata");
      if(!okApert)  fallisci("apertura mai rigenerata (Claude non ha mai aperto una scena con questo seed)");
      if(!okEsito)  fallisci("esito mai rigenerato (i Protagonisti non hanno mai vinto una scena con questo seed, quindi Claude non ha mai narrato un esito)");
      console.log("OK: tutti i contenuti di Claude rigenerabili, log coerente");
      process.exit(0);
    }
    await dorme(40);
  }
  throw new Error("non ha raggiunto il finale, fase: "+G().fase);
}
main().catch(e=>{ console.error("ECCEZIONE:",e.message,"fase:",G()?G().fase:"?"); process.exit(1) });
