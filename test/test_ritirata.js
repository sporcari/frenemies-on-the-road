// Collaudo di "Concedere la scena" (v1.44: mossa unica, +1 punto, carta agli scarti, una volta per lato).
// Forza la concessione appena il pulsante compare e verifica condizioni ed effetti. Gira in PvP (locale):
// verifica anche che in PvP NON compaia la textarea di narrazione (si narra al tavolo).
// Uso: node test/test_ritirata.js
const {JSDOM}=require("jsdom");
let html=require("fs").readFileSync(require("path").join(__dirname,"..","index.html"),"utf8").replace(/<script src=[^>]+><\/script>/g,"");
html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G;\n/* AVVIO */");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom,{document}=window;
const click=el=>el&&el.dispatchEvent(new window.Event("click",{bubbles:true}));
const G=()=>window.__G(), fase=()=>window.__G().fase;
const veloA=()=>document.getElementById("velo").classList.contains("attivo");
const modA=()=>document.getElementById("ovModale").classList.contains("attivo");

let concessioni=0;
function assert(c,m){ if(!c) throw new Error("VINCOLO VIOLATO: "+m); }

function passo(){
  if(fase()==="turno"){
    const g=G(), l=g.attore;
    const btn=document.getElementById("btnConcedi");
    if(btn){
      assert(l!==g.astaWinner,"concessione offerta a chi ha l'iniziativa");
      assert(g.lati[l].mano.length===1,"concessione offerta con != 1 carta in mano");
      assert(g.scena<4,"concessione offerta in scena 5");
      assert(g.concessione[l]===false,"concessione offerta a chi l'ha già usata");
      const puntiPre=g.lati[l].punti, mazzoPre=g.lati[l].mazzo.length;
      click(btn);
      assert(modA(),"modale concessione non aperto");
      assert(!document.getElementById("ritNarr"),"in PvP la textarea di concessione non deve comparire");
      click(document.getElementById("ritConferma"));
      const G2=G(), rec=G2.scene[G2.scena];
      assert(rec.concessaDa===l,"concessaDa non impostato");
      assert(rec.vincitore===(l==="P"?"O":"P"),"vincitore non assegnato all'altro lato");
      assert(G2.concessione[l]===true,"flag concessione non impostato");
      assert(G2.lati[l].punti===puntiPre+1,"la concessione non ha dato 1 punto");
      assert(G2.lati[l].mazzo.length===mazzoPre,"la carta della concessione non deve entrare nel mazzo");
      assert(G2.lati[l].mano.length===0,"la carta della concessione non è stata rimossa dalla mano");
      concessioni++;
      return;
    }
  }
  if(modA()){const fmm=document.getElementById("fanteMazzoMio"),fro=document.getElementById("fanteReordOk"),rNo=document.getElementById("reNo");
    if(fmm){click(fmm);return} if(fro){click(fro);return} if(rNo){click(rNo);return}
    const rs=document.getElementById("reginaScartiOk");if(rs){const c=document.querySelector("#reginaScarti .carta");if(c)click(c);click(rs);return}
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
  if(f==="pareggio_finale"){const sp=document.getElementById("pf-spendi");click(sp&&!sp.disabled?sp:document.getElementById("pf-cedi"));return}
  if(f==="primo_conteggio"){click(document.getElementById("pc-avanti"));return}
  if(f==="colpi"){const g=G(),top=g.colpi.top,gio=g.lati[g.attore].riserva.filter(c=>c.val>=top).sort((a,b)=>a.val-b.val);if(gio.length){const el=document.querySelector(`#riservaCarte .carta[data-id="${gio[0].id}"]`);if(el)click(el);}return;}
  if(f==="neutralizza"){click(document.getElementById("n-ok"));return}
  if(f==="finale")return "FINALE";
  throw new Error("fase sconosciuta: "+f);
}

let done=false;
for(let i=0;i<4000;i++){ if(fase()==="finale"){done=true;break} passo(); }
if(!done){ console.log("PARTITA NON COMPLETATA"); process.exit(1); }
console.log("concessione OK · partita completata · concessioni="+concessioni);
