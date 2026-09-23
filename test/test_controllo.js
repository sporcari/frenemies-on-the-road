// Collaudo del controllo della mano condivisa a 3/4 giocatori (manuale, Appendice C):
// maggioranza di seme; in parità gioca chi non ha controllato la scena precedente;
// alla prima scena, in parità, Picche e Quadri.
const { JSDOM } = require("jsdom");
const html = require("fs").readFileSync(require("path").join(__dirname, "..", "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const w = dom.window;
const ev = s => w.eval(s);

function scena(n, P, O){
  ev(`G.scena=${n};
    G.lati.P.mano=${JSON.stringify(P)}.map((s,i)=>({id:"p"+i,seme:s,valore:1}));
    G.lati.O.mano=${JSON.stringify(O)}.map((s,i)=>({id:"o"+i,seme:s,valore:1}));
    calcolaControllo();`);
  return ev(`G.controllo.P+"/"+G.controllo.O`);
}
ev(`G.nGiocatori=4; G.controllo={P:"picche",O:"quadri"};`);
const pari=["cuori","picche","cuori","picche"], pariO=["quadri","fiori","quadri","fiori"];
const attesi=[
  [0, pari, pariO, "picche/quadri"],
  [1, ["cuori","cuori","cuori","picche"], ["fiori","fiori","fiori","quadri"], "cuori/fiori"],
  [2, pari, pariO, "picche/quadri"],
  [3, ["picche","picche","picche","cuori"], pariO, "picche/fiori"],
  [4, pari, pariO, "cuori/quadri"],
];
let ok=true;
for(const [n,P,O,atteso] of attesi){
  const r=scena(n,P,O);
  console.log(`scena ${n+1}: ${r}${r===atteso?"":"  ATTESO "+atteso}`);
  if(r!==atteso) ok=false;
}
if(!ok){ console.error("FALLITO"); process.exit(1); }
console.log("controllo della mano OK");
