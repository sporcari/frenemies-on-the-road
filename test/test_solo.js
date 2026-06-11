// Collaudo della modalità SOLO (contro Claude): lo stub della rete risponde JSON vuoto,
// quindi ogni decisione dell'IA passa dai fallback automatici. La partita deve completarsi.
// Uso: npm i jsdom && node test_solo.js
const {JSDOM}=require("jsdom");
const fs=require("fs");
let html=fs.readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G;\n/* AVVIO */");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom; const {document}=window;

// stub: l'IA "risponde" sempre un oggetto vuoto → tutti i fallback
window.fetch=async()=>({ json: async()=>({content:[{type:"text",text:"{}"}]}) });

const click=el=>el&&el.dispatchEvent(new window.Event("click",{bubbles:true}));
const G=()=>window.__G();
const dorme=ms=>new Promise(r=>setTimeout(r,ms));
const mod=()=>document.getElementById("ovModale").classList.contains("attivo");

let narrazioniIA=0, mosseO=0;

async function main(){
  const inizio=Date.now();
  for(let i=0;i<6000;i++){
    if(Date.now()-inizio>110000) throw new Error("timeout");
    const f=G()?G().fase:"?";

    // modali figura: se è dell'umano (P), conferma; se è dell'IA ci pensa lo scheduler
    if(mod()){
      if(G().attore==="P") click(document.getElementById("fanteOk")||document.getElementById("reNo"));
      await dorme(30); continue;
    }

    if(f==="modalita"){ click(document.getElementById("md-solo")); await dorme(20); continue }
    if(f==="setup"){
      const set=(id,v)=>{const e=document.getElementById(id); if(e) e.value=v};
      set("w-nomeP","Tester"); set("w-missione","Arrestare Vargas PRIMA che il jet riparta");
      set("w-primadiff","Skunk è in cella"); set("w-persA","Frank"); set("w-persB","Skunk");
      set("w-nemici","Sicari e corrotti"); set("w-caos","Tempesta e sfortuna");
      for(let k=0;k<10;k++) set("w-pitch-"+k,"Risposta "+(k+1));
      click(document.getElementById("w-avanti")); await dorme(20); continue;
    }

    const attoreO = G().attore==="O";
    if(f==="asta" && !attoreO){
      const c=[...document.querySelectorAll("#manoAsta .carta")].filter(x=>!x.classList.contains("jolly"));
      click(c[Math.floor(Math.random()*c.length)]); click(document.getElementById("confAsta"));
      await dorme(20); continue;
    }
    if(f==="asta_rivela"){ click(document.getElementById("vaiApertura")); await dorme(20); continue }
    if(f==="apertura" && !attoreO){ click(document.getElementById("a-via")); await dorme(20); continue }
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
        // in solo la narrazione umana è obbligatoria: scrivo nel campo, poi confermo
        const ni=document.getElementById("narrInput");
        if(ni){ ni.value="Frank e Skunk tirano dritto nella notte."; ni.dispatchEvent(new window.Event("input",{bubbles:true})); }
        click(document.getElementById("narrOk")); await dorme(20); continue;
      }
      // narrazione dell'IA: aspetta l'iniezione del testo, poi conferma come farebbe l'umano
      const n=document.getElementById("iaNarr");
      if(n){ narrazioniIA++; click(document.getElementById("narrOk")); }
      await dorme(50); continue;
    }
    if(f==="fine_scena"){ click(document.getElementById("fs-avanti")); await dorme(20); continue }
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
    if(f==="primo_conteggio"){ click(document.getElementById("pc-avanti")); await dorme(20); continue }
    if(f==="colpi"){
      // turno di P (umano): colpo obbligatorio, gioca una carta di riserva; turno di O: ci pensa lo scheduler
      if(!attoreO){
        const carte=[...document.querySelectorAll("#riservaCarte .carta")];
        if(carte.length){
          click(carte[0]);
          const b=document.querySelector("button[data-bersaglio]");
          if(b) click(b);
        }
      }
      await dorme(50); continue;
    }
    if(f==="neutralizza"){ click(document.getElementById("n-ok")); await dorme(20); continue }
    if(f==="finale"){
      const g=G();
      console.log("PARTITA SOLO COMPLETATA");
      console.log("vincitori scene:", g.scene.map(s=>s?s.vincitore:"-").join(","));
      console.log("narrazioni IA mostrate:", narrazioniIA, "| modalita:", g.modalita, "| nomi O:", g.nomi.O);
      if(g.modalita!=="solo") { console.error("FALLITO: modalita errata"); process.exit(1) }
      if(narrazioniIA===0) { console.error("FALLITO: nessuna narrazione IA iniettata"); process.exit(1) }
      const storiaP=g.storia.filter(v=>v.lato==="P").length, storiaO=g.storia.filter(v=>v.lato==="O").length;
      console.log("log narrativo:", g.storia.length, "voci (P:"+storiaP+" O:"+storiaO+")");
      if(storiaP===0) { console.error("FALLITO: nessuna narrazione umana registrata nel log"); process.exit(1) }
      if(storiaO===0) { console.error("FALLITO: nessuna narrazione di Claude registrata nel log"); process.exit(1) }
      console.log("modalità solo OK (tutti i fallback esercitati, log narrativo popolato)");
      process.exit(0);
    }
    await dorme(40); // tocca all'IA: lasciale il tempo di agire
  }
  throw new Error("non ha raggiunto il finale, fase: "+G().fase);
}
main().catch(e=>{ console.error("ECCEZIONE:",e.message,"fase:",G()?G().fase:"?"); process.exit(1) });
