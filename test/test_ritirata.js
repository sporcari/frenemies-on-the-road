// Collaudo della ritirata strategica (una partita per processo; ripetere per coprire entrambe le varianti).
// Forza la mossa appena il pulsante compare e verifica condizioni, effetti e tetto di una volta per variante.
// Uso: node test/test_ritirata.js  (ripetere in un loop per vedere sia "mazzo" sia "prese").
const {JSDOM}=require("jsdom");
let html=require("fs").readFileSync(require("path").join(__dirname,"..","index.html"),"utf8").replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G; window.__rv=l=>ritirataVarianti(l);\n/* AVVIO */");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom,{document}=window;
const click=el=>el&&el.dispatchEvent(new window.Event("click",{bubbles:true}));
const G=()=>window.__G(), fase=()=>window.__G().fase;
const veloA=()=>document.getElementById("velo").classList.contains("attivo");
const modA=()=>document.getElementById("ovModale").classList.contains("attivo");

let varianti=new Set(), ritirate=0;
function assert(c,m){ if(!c) throw new Error("VINCOLO VIOLATO: "+m); }

function passo(){
  if(fase()==="turno"){
    const g=G(), l=g.attore;
    const btnR=document.getElementById("btnRitirata"), btnS=document.getElementById("btnResa");
    if(btnR||btnS){
      assert(l!==g.astaWinner,"ritirata offerta a chi ha l'iniziativa");
      assert(g.lati[l].mano.length===1,"ritirata offerta con != 1 carta in mano");
      assert(g.scena<4,"ritirata offerta in scena 5");
      const vs=window.__rv(l);
      // preferisci la variante non ancora vista (per coprirle entrambe nei vari run)
      let variante = (!varianti.has("mazzo") && vs.includes("mazzo")) ? "mazzo"
                   : (!varianti.has("prese") && vs.includes("prese")) ? "prese"
                   : (vs.includes("mazzo") ? "mazzo" : "prese");
      let useBtn = variante==="mazzo" ? btnR : btnS;
      if(!useBtn){ variante = variante==="mazzo" ? "prese" : "mazzo"; useBtn = variante==="mazzo" ? btnR : btnS; }
      const mazzoPre=g.lati[l].mazzo.length;
      click(useBtn);
      assert(modA(),"modale ritirata non aperto");
      const ni=document.getElementById("ritNarr"); if(ni) ni.value="Mi ritiro per riorganizzarmi.";
      click(document.getElementById("ritConferma"));
      const G2=G(), rec=G2.scene[G2.scena];
      assert(rec.perRitirata===l,"perRitirata non impostato");
      assert(rec.vincitore===(l==="P"?"O":"P"),"vincitore non assegnato all'altro lato");
      assert(G2.ritirata[l][variante]===true,"flag variante non impostato");
      assert(rec.riassunto && rec.riassunto.length>0,"riassunto della ritirata vuoto");
      assert(!window.__rv(l).includes(variante),"variante ancora disponibile dopo l'uso");
      if(variante==="mazzo") assert(G2.lati[l].mazzo.length===mazzoPre+1,"il mazzo non e' cresciuto di 1");
      varianti.add(variante); ritirate++;
      return;
    }
  }
  if(modA()){const f=document.getElementById("fanteOk"),rNo=document.getElementById("reNo");
    if(f){click(f);return} if(rNo){click(rNo);return}
    const p=document.getElementById("pngOk");if(p){let a=document.getElementById("m-png-nome");if(a)a.value="X";let b=document.getElementById("m-png-desc");if(b)b.value="Y";click(p);return}
    const q=document.getElementById("pngnOk");if(q){let a=document.getElementById("m-pngn-nome");if(a)a.value="X";click(q);return}throw new Error("modale sconosciuto");}
  if(veloA()){click(document.getElementById("veloBtn"));return}
  const f=fase();
  if(f==="modalita"){click(document.getElementById("md-locale"));return}
  if(f==="setup"){for(let k=0;k<10;k++){let i=document.getElementById("w-pitch-"+k);if(i)i.value="R"+k;}click(document.getElementById("w-avanti"));return;}
  if(f==="asta"){const c=[...document.querySelectorAll("#manoAsta .carta")].filter(x=>!x.classList.contains("jolly"));click(c[Math.floor(Math.random()*c.length)]);click(document.getElementById("confAsta"));return;}
  if(f==="asta_rivela"){click(document.getElementById("vaiApertura"));return}
  if(f==="apertura"){document.getElementById("a-titolo").value="S";click(document.getElementById("a-via"));return}
  if(f==="turno"){const carte=[...document.querySelectorAll("#manoTurno .carta")];click(carte[0]);
    const box=document.getElementById("pannelloAzione");
    const js=box.querySelector("#jScarta");if(js){click(js);return}
    const jv=[...box.querySelectorAll("button[data-v]")].filter(b=>!b.disabled);if(jv.length){click(jv[0]);click([...box.querySelectorAll("#jollyCombos button[data-c]")][0]);return}
    const opz=[...box.querySelectorAll(".opzioni button")].filter(b=>!b.disabled);click(opz[opz.length-1].dataset.piatto?opz[Math.floor(Math.random()*opz.length)]:opz[0]);return;}
  if(f==="narrazione"){click(document.getElementById("narrOk"));return;}
  if(f==="fine_scena"){const t=document.getElementById("fs-riassunto");if(t)t.value="x";click(document.getElementById("fs-avanti"));return}
  if(f==="mano_estesa"){let b=document.getElementById("estOk");if(b.disabled)[...document.querySelectorAll("#estCarte .carta")].slice(0,4).forEach(c=>click(c));click(b);return;}
  if(f==="mercato"){click(document.getElementById("m-fine"));return;}
  if(f==="jolly_intro"){click(document.getElementById("j-ok"));return}
  if(f==="primo_conteggio"){click(document.getElementById("pc-avanti"));return}
  if(f==="colpi"){const c=[...document.querySelectorAll("#riservaCarte .carta")];if(c.length){click(c[0]);let b=document.querySelector("button[data-bersaglio]");if(b)click(b);}return;}
  if(f==="neutralizza"){click(document.getElementById("n-ok"));return}
  if(f==="finale")return "FINALE";
  throw new Error("fase sconosciuta: "+f);
}

let done=false;
for(let i=0;i<4000;i++){ if(fase()==="finale"){done=true;break} passo(); }
if(!done){ console.log("PARTITA NON COMPLETATA"); process.exit(1); }
console.log("ritirata OK · partita completata · ritirate="+ritirate+" · varianti viste: "+([...varianti].join(",")||"nessuna"));
