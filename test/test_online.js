// Collaudo della modalità ONLINE (2 giocatori): due client jsdom collegati da un finto PeerJS
// in memoria giocano una partita completa. A ogni passo agisce solo il client del lato di turno
// (latoCheAgisce), l'altro deve essere spettatore; dopo ogni mossa lo stato G dei due client deve
// coincidere. Driver delle fasi copiato e adattato da test/test_partita.js.
// Uso: node test/test_online.js
const {JSDOM}=require("jsdom");
let html=require("fs").readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
html=html.replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G;\n/* AVVIO */");

const bus={};
class Conn{
  constructor(){ this.h={}; this.open=false; this.altro=null; }
  on(e,f){ (this.h[e]=this.h[e]||[]).push(f); }
  emit(e,...a){ (this.h[e]||[]).forEach(f=>f(...a)); }
  send(d){ const x=JSON.parse(JSON.stringify(d)); setTimeout(()=>this.altro.emit("data",x),0); }
}
function creaPeer(){
  return class Peer{
    constructor(id){ this.id=id||("anon"+Math.random()); this.h={}; setTimeout(()=>{ bus[this.id]=this; this.emit("open",this.id); },0); }
    on(e,f){ this.h[e]=f; }
    emit(e,...a){ if(this.h[e]) this.h[e](...a); }
    connect(id){
      const a=new Conn(), b=new Conn(); a.altro=b; b.altro=a;
      setTimeout(()=>{ bus[id].emit("connection",b); a.open=b.open=true; b.emit("open"); a.emit("open"); },0);
      return a;
    }
  };
}
function client(){
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,beforeParse(w){ w.Peer=creaPeer(); w.alert=()=>{}; }});
  const w=dom.window;
  w.addEventListener("error",e=>{ console.error("ERRORE PAGINA:",e.message); process.exit(1); });
  return w;
}
const A=client(), B=client();
const dorme=ms=>new Promise(r=>setTimeout(r,ms));
const click=(w,el)=>el&&el.dispatchEvent(new w.Event("click",{bubbles:true}));
const G=w=>w.__G();
function fallisci(m){ console.error("FALLITO:",m); process.exit(1); }

let comprato=false, spinte=0, colpi=0;
function passo(w){
  const d=w.document, g=G(w);
  if(d.getElementById("ovModale").classList.contains("attivo")){
    const fmm=d.getElementById("fanteMazzoMio"); if(fmm){ click(w,fmm); return "fante"; }
    const fro=d.getElementById("fanteReordOk"); if(fro){ click(w,fro); return "fante"; }
    const rNo=d.getElementById("reNo"); if(rNo){ click(w,rNo); return "re"; }
    const rs=d.getElementById("reginaScartiOk"); if(rs){ const c=d.querySelector("#reginaScarti .carta"); if(c) click(w,c); click(w,rs); return "regina"; }
    const pngOk=d.getElementById("pngOk"); if(pngOk){ const n=d.getElementById("m-png-nome"); if(n) n.value="Figura di prova"; const x=d.getElementById("m-png-desc"); if(x) x.value="Descrizione"; click(w,pngOk); return "png"; }
    const q=d.getElementById("pngnOk"); if(q){ const n=d.getElementById("m-pngn-nome"); if(n) n.value="PNG"; click(w,q); return "pngn"; }
    const rc=d.getElementById("ritConferma"); if(rc){ click(w,rc); return "concessione"; }
    throw new Error("modale sconosciuto");
  }
  const f=g.fase;
  if(f==="setup"){
    for(let k=0;k<10;k++){ const i=d.getElementById("w-pitch-"+k); if(i) i.value="Risposta "+(k+1); }
    const m=d.getElementById("w-missione"); if(m && !m.value) m.value="Missione di prova";
    click(w,d.getElementById("w-avanti")); return "setup"+g.passo;
  }
  if(f==="asta"){
    const mano=g.lati[g.attore].mano;
    const carte=[...d.querySelectorAll("#manoAsta .carta")].filter(el=>{ const c=mano.find(x=>x.id==el.dataset.id); return c&&!c.jolly&&!c.fig; });
    if(!carte.length) throw new Error("asta senza carte");
    click(w,carte[Math.floor(Math.random()*carte.length)]); click(w,d.getElementById("confAsta")); return f;
  }
  if(f==="asta_rivela"){ click(w,d.getElementById("vaiApertura")); return f; }
  if(f==="apertura"){ d.getElementById("a-titolo").value="Scena"; click(w,d.getElementById("a-via")); return f; }
  if(f==="turno"){
    const bc=d.getElementById("btnConcedi"); if(bc && Math.random()<0.5){ click(w,bc); return "concedi"; }
    const carte=[...d.querySelectorAll("#manoTurno .carta")];
    if(!carte.length) throw new Error("turno senza carte");
    click(w,carte[0]);
    const box=d.getElementById("pannelloAzione");
    const js=box.querySelector("#jScarta"); if(js){ click(w,js); return "jolly-scartato"; }
    const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);
    if(jv.length){ click(w,jv[0]); const jc=[...box.querySelectorAll("#jollyCombos button[data-c], #figCombos button[data-c]")]; click(w,jc[0]); return "figura/jolly"; }
    const opz=[...box.querySelectorAll(".opzioni button")];
    if(!opz.length) throw new Error("nessuna opzione");
    click(w,opz[opz.length-1].dataset.piatto?opz[Math.floor(Math.random()*opz.length)]:opz[0]); return "gioca";
  }
  if(f==="narrazione"){
    const sp=[...d.querySelectorAll("button[data-spinta]")];
    if(sp.length && spinte<4){ spinte++; click(w,sp[0]); return "spinta"; }
    click(w,d.getElementById("narrOk")); return f;
  }
  if(f==="fine_scena"){ const t=d.getElementById("fs-riassunto"); if(t) t.value="Esito"; click(w,d.getElementById("fs-avanti")); return f; }
  if(f==="mano_estesa"){ const b=d.getElementById("estOk"); if(b.disabled) [...d.querySelectorAll("#estCarte .carta")].slice(0,4).forEach(c=>click(w,c)); click(w,d.getElementById("estOk")); return f; }
  if(f==="mercato"){
    if(!comprato){ const b=[...d.querySelectorAll("button[data-f]")].find(x=>!x.disabled); if(b){ comprato=true; click(w,b); return "compra"; } }
    click(w,d.getElementById("m-fine")); return f;
  }
  if(f==="jolly_intro"){ click(w,d.getElementById("j-ok")); return f; }
  if(f==="pareggio_finale"){ const s=d.getElementById("pf-spendi"); click(w,s&&!s.disabled?s:d.getElementById("pf-cedi")); return f; }
  if(f==="primo_conteggio"){ click(w,d.getElementById("pc-avanti")); return f; }
  if(f==="colpi"){
    const top=g.colpi.top, gio=g.lati[g.attore].riserva.filter(c=>c.val>=top).sort((a,b)=>a.val-b.val);
    if(gio.length){ const el=d.querySelector(`#riservaCarte .carta[data-id="${gio[0].id}"]`); if(el){ colpi++; click(w,el); } }
    return "colpo";
  }
  if(f==="neutralizza"){ click(w,d.getElementById("n-ok")); return f; }
  if(f==="finale") return "FINALE";
  throw new Error("fase sconosciuta: "+f);
}

(async()=>{
  // lobby: A crea la stanza giocando i Protagonisti, B si unisce col codice
  click(A,A.document.getElementById("md-online")); click(A,A.document.getElementById("lb-creaP"));
  await dorme(20);
  const codice=A.document.getElementById("lb-codiceVal").textContent;
  if(!/^[A-Z0-9]{5}$/.test(codice)) fallisci("codice stanza non generato: "+codice);
  click(B,B.document.getElementById("md-online"));
  B.document.getElementById("lb-input").value=codice.toLowerCase();
  click(B,B.document.getElementById("lb-vai"));
  await dorme(600);   // il polling della lobby dell'host gira ogni 400 ms
  if(G(A).fase!=="setup" || G(B).fase!=="setup") fallisci("dopo la connessione i client non sono nel setup: "+G(A).fase+"/"+G(B).fase);
  if(A.eval("rete.mioLato")!=="P" || B.eval("rete.mioLato")!=="O") fallisci("lati assegnati male: "+A.eval("rete.mioLato")+"/"+B.eval("rete.mioLato"));

  const conta={};
  for(let i=0;i<6000;i++){
    const lato=A.eval("latoCheAgisce()");
    const attivo = A.eval("rete.mioLato")===lato ? A : B, altro = attivo===A ? B : A;
    if(attivo.eval("spettatore()")) fallisci("il client di turno si crede spettatore (fase "+G(attivo).fase+")");
    if(!altro.eval("spettatore()")) fallisci("il client fuori turno non è spettatore (fase "+G(altro).fase+")");
    const r=passo(attivo);
    conta[attivo===A?"A":"B"]=(conta[attivo===A?"A":"B"]||0)+1;
    await dorme(2);
    if(r==="FINALE"){
      const gA=G(A), gB=G(B);
      if(gB.fase!=="finale") fallisci("l'ospite non ha visto il finale");
      console.log("PARTITA ONLINE COMPLETATA in",i,"passi · passi host/ospite:",conta.A,"/",conta.B);
      console.log("scene:",gA.scene.map(s=>s?s.vincitore:"-").join(","),"· missione:",gA.scene[4].missione,"· acquisto:",comprato,"· spinte:",spinte,"· colpi:",colpi);
      process.exit(0);
    }
    const aperto=A.document.getElementById("ovModale").classList.contains("attivo")||B.document.getElementById("ovModale").classList.contains("attivo");
    if(!aperto && JSON.stringify(G(A))!==JSON.stringify(G(B))) fallisci("stato divergente dopo '"+r+"' (fase "+G(attivo).fase+", scena "+(G(attivo).scena+1)+")");
  }
  fallisci("finale non raggiunto, fase bloccata: "+G(A).fase);
})().catch(e=>fallisci(e.message));
