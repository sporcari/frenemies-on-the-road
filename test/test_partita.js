// Driver di collaudo per index.html (il gioco) — uso: npm i jsdom && node test/test_partita.js (variabile NG=3 o NG=4 per il numero di giocatori). Il percorso del file HTML è relativo a questo script.
const {JSDOM}=require("jsdom");
let html=require("fs").readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
// rimuovi script esterni (peerjs, fonts) per il test headless
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G; window.__idc=()=>idc;\n/* AVVIO */");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom; const {document}=window;
const click=el=>el.dispatchEvent(new window.Event("click",{bubbles:true}));

function fase(){ return window.__G ? window.__G().fase : "?" }
function veloAttivo(){ return document.getElementById("velo").classList.contains("attivo") }
function modaleAttivo(){ return document.getElementById("ovModale").classList.contains("attivo") }

let compratoUnaVolta=false, spinteUsate=0, colpiFatti=0, pngCreato=false, log=[];
function passo(i){
  // modali degli effetti figura
  if(modaleAttivo()){
    const f=document.getElementById("fanteOk"), rNo=document.getElementById("reNo");
    if(f){ click(f); return "fante" }
    if(rNo){ click(rNo); return "re-no" }
    const pngOk=document.getElementById("pngOk");      // modale acquisto figura (nome/desc)
    if(pngOk){ const ni=document.getElementById("m-png-nome"); if(ni) ni.value="Figura di prova";
      const di=document.getElementById("m-png-desc"); if(di) di.value="Descrizione di prova"; click(pngOk); return "png-figura" }
    const pngnOk=document.getElementById("pngnOk");    // modale crea PNG narrativo
    if(pngnOk){ const ni=document.getElementById("m-pngn-nome"); if(ni) ni.value="PNG narrativo di prova"; click(pngnOk); return "png-narr" }
    throw new Error("modale sconosciuto");
  }
  if(veloAttivo()){ click(document.getElementById("veloBtn")); return "velo" }
  const f=fase();
  if(f==="modalita"){ click(document.getElementById("md-locale")); return f }
  if(f==="setup"){
    if(G().passo===1 && process.env.NG){
      const b=document.querySelector(`button[data-ng="${process.env.NG}"]`);
      if(b && !b.style.background) click(b);
      const nomi={picche:"Anna",cuori:"Bruno",quadri:"Carla",fiori:"Dino"};
      Object.entries(nomi).forEach(([sm,n])=>{const i=document.getElementById("w-g"+sm); if(i) i.value=n;});
      const nO=document.getElementById("w-nomeO"); if(nO) nO.value="Squadra Opposizione";
    }
    for(let k=0;k<10;k++){ const inp=document.getElementById("w-pitch-"+k); if(inp) inp.value="Risposta di prova "+(k+1); }
    click(document.getElementById("w-avanti")); return f+G().passo }
  if(f==="asta"){
    const carte=[...document.querySelectorAll("#manoAsta .carta")].filter(c=>!c.classList.contains("jolly"));
    if(!carte.length) throw new Error("asta senza carte selezionabili (mano: "+G().lati[G().attore].mano.length+", mazzo P/O: "+G().lati.P.mazzo.length+"/"+G().lati.O.mazzo.length+", scena "+(G().scena+1)+")");
    click(carte[Math.floor(Math.random()*carte.length)]);
    click(document.getElementById("confAsta"));
    return f;
  }
  if(f==="asta_rivela"){
    const b=document.getElementById("vaiApertura");
    click(b); return f;
  }
  if(f==="apertura"){ document.getElementById("a-titolo").value="Scena test"; click(document.getElementById("a-via")); return f }
  if(f==="turno"){
    const carte=[...document.querySelectorAll("#manoTurno .carta")];
    if(!carte.length) throw new Error("turno senza carte");
    click(carte[0]);
    const box=document.getElementById("pannelloAzione");
    const jScarta=box.querySelector("#jScarta");
    if(jScarta){ click(jScarta); return "jolly-scartato" }
    const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);
    if(jv.length){
      const figura=!!box.querySelector("#figCombos");   // figura e Jolly condividono i bottoni data-v
      click(jv[0]);
      const jc=[...box.querySelectorAll("#jollyCombos button[data-c], #figCombos button[data-c]")];
      click(jc[0]); return figura?"figura":"jolly";
    }
    const opz=[...box.querySelectorAll(".opzioni button")];
    if(!opz.length) throw new Error("nessuna opzione di gioco");
    click(opz[opz.length-1].dataset.piatto?opz[Math.floor(Math.random()*opz.length)]:opz[0]);
    return "gioca";
  }
  if(f==="narrazione"){
    const sp=[...document.querySelectorAll("button[data-spinta]")];
    if(sp.length){
      const g=G();
      if(g.scena>=4) throw new Error("VINCOLO VIOLATO: spinta offerta in scena "+(g.scena+1));
      const lt=g.narrLato||g.attore;
      const bc=g.lati[lt].prese.find(x=>x.id===g.narr.boostCard);
      for(const b of sp){ const p=g.pitch[parseInt(b.dataset.spinta)];
        if(p.seme!==bc.seme) throw new Error("VINCOLO VIOLATO: risposta "+p.seme+" su presa "+bc.seme); }
    }
    if(sp.length && spinteUsate<4){ spinteUsate++;
      const g=G(), lt=g.narrLato||g.attore, presePrima=g.lati[lt].prese.length, piattoPrima=g.piatto.length;
      click(sp[0]); log.push("SPINTA usata, scena "+(g.scena+1)+", piatto raccolto: "+piattoPrima);
      if(G().piatto.length!==0) throw new Error("VINCOLO VIOLATO: piatto non svuotato dopo la spinta");
      return "spinta" }
    if(!pngCreato){ const cp=document.getElementById("creaPng"); if(cp){ pngCreato=true; click(cp); return "apre-png-narr" } }
    click(document.getElementById("narrOk")); return f }
  if(f==="fine_scena"){
    const P=G().lati.P, O=G().lati.O;
    if(P.mano.length||O.mano.length||P.astaCarta||O.astaCarta) throw new Error("fine scena con carte in mano!");
    click(document.getElementById("fs-avanti")); return f;
  }
  if(f==="mano_estesa"){
    const btn=document.getElementById("estOk");
    if(btn.disabled){
      [...document.querySelectorAll("#estCarte .carta")].slice(0,4).forEach(c=>click(c));
    }
    click(document.getElementById("estOk")); return f;
  }
  if(f==="mercato"){
    if(!compratoUnaVolta){
      const b=[...document.querySelectorAll("button[data-f]")].find(x=>!x.disabled);
      if(b){ click(b); compratoUnaVolta=true; log.push("ACQUISTO ok"); return "compra"; }  // apre il modale nome/desc
    }
    click(document.getElementById("m-fine")); return f;
  }
  if(f==="jolly_intro"){ click(document.getElementById("j-ok")); return f }
  if(f==="primo_conteggio"){ click(document.getElementById("pc-avanti")); return f }
  if(f==="colpi"){
    // colpo obbligatorio: gioca una carta di riserva, poi clicca il primo bottone (bersaglio o "metti senza eliminare")
    const carte=[...document.querySelectorAll("#riservaCarte .carta")];
    if(carte.length){
      click(carte[0]);
      const b=document.querySelector("button[data-bersaglio]");
      if(b){ colpiFatti++; log.push("COLPO DI SCENA fatto"); click(b); }
    }
    return "colpo"; }
  if(f==="neutralizza"){ click(document.getElementById("n-ok")); return f }
  if(f==="finale") return "FINALE";
  throw new Error("fase sconosciuta: "+f);
}
function G(){ return window.__G() }

window.addEventListener("error",e=>{ console.error("ERRORE PAGINA:",e.message); process.exit(1) });

try{
  for(let i=0;i<3000;i++){
    const r=passo(i);
    if(r==="FINALE"){
      const g=G();
      const vinte=g.scene.map(s=>s?s.vincitore:"-").join(",");
      console.log("PARTITA COMPLETATA in",i,"passi");
      console.log("vincitori scene:",vinte);
      console.log("rapporti:",g.scene.map(s=>s?s.rapporto:"-").join(","));
      console.log("jolly entrato:",g.jollyEntrato,"| acquisto:",compratoUnaVolta,"| spinte:",spinteUsate,"| colpi:",colpiFatti);
      console.log("piatto finale:",g.piatto.length,"carte");
      const tot=l=>["mazzo","mano","prese","scope","riserva"].map(k=>g.lati[l][k].length).join("/");
      console.log("nGiocatori:",g.nGiocatori,"| scopeGiocatore:",JSON.stringify(g.scopeGiocatore),"| controllo finale:",JSON.stringify(g.controllo),"| scarti comuni:",g.scartiComuni.length);
      console.log("P mazzo/mano/prese/scope/riserva:",tot("P"));
      console.log("O:",tot("O"));
      process.exit(0);
    }
  }
  console.error("NON ha raggiunto il finale. Fase bloccata:",fase());
  process.exit(1);
}catch(e){
  console.error("ECCEZIONE alla fase",fase(),":",e.message);
  process.exit(1);
}
