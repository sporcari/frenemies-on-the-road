// Test mirato del terzo uso del Jolly (§22.6, v1.5): "il peccato emerge".
// Uso: npm i jsdom && node test/test_peccato.js  (il percorso di index.html è relativo a questo file).
// Forza uno scenario in cui l'Opposizione tiene il marcatore del Jolly e verifica:
//  - l'effetto è disponibile solo con un bersaglio nel piatto;
//  - toglie la carta di valore più basso dei Protagonisti (♥/♠);
//  - lascia intatte le altre (incluse quelle dell'Opposizione);
//  - consuma il marcatore (che finisce negli scarti) e quindi non è più ripetibile.
const {JSDOM}=require("jsdom");
let html=require("fs").readFileSync(require("path").join(__dirname,"..","index.html"),"utf8");
// niente script esterni nel test headless (peerjs, font)
html=html.replace(/<script src=[^>]+><\/script>/g,"");
// espone le funzioni che servono al test, agganciandosi all'ancora di avvio
html=html.replace("/* ================= AVVIO ================= */",
  "window.__G=()=>G; window.__carta=carta; window.__pecDisp=peccatoEmergeDisponibile; window.__pecEseg=eseguiJollyEffetto; window.__marker=jollyMarkerO;\n/* AVVIO */");
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
const {window}=dom;
const G=window.__G();

// Scenario: scena 3, turno dell'Opposizione, che tiene il marcatore del Jolly (come scopa).
G.modalita="locale"; G.fase="turno"; G.attore="O"; G.scena=2;
G.lati.O.scope.push(window.__carta(null,0,null,true));   // il marcatore del Jolly
// Piatto: 3 carte dei Protagonisti (3♥, 7♠, 1♥) + 1 dell'Opposizione (5♦). La più bassa dei Protagonisti è 1♥.
G.piatto=[ window.__carta("cuori",3), window.__carta("picche",7), window.__carta("cuori",1), window.__carta("quadri",5) ];

const dispPrima=window.__pecDisp();
const scartiPrima=G.scartiComuni.length;
window.__pecEseg("una vecchia spiata viene a galla");
const piattoDopo=G.piatto.map(c=>c.val+c.seme[0]).join(",");

const toltaPiuBassa = !G.piatto.some(c=>c.val===1&&c.seme==="cuori");   // 1♥ rimossa
const restaSette    =  G.piatto.some(c=>c.val===7&&c.seme==="picche");  // 7♠ resta
const restaOppost   =  G.piatto.some(c=>c.val===5&&c.seme==="quadri");  // 5♦ (Opposizione) resta
const markerVia     =  window.__marker()===null;                        // marcatore consumato
const dispDopo      =  window.__pecDisp();                              // non più disponibile
const scartiPiuDue  =  G.scartiComuni.length===scartiPrima+2;           // marcatore + carta tolta

// Senza bersaglio (piatto con sole carte dell'Opposizione) l'effetto non è disponibile.
G.fase="turno"; G.attore="O";
G.lati.O.prese.push(window.__carta(null,0,null,true));
G.piatto=[ window.__carta("quadri",4), window.__carta("fiori",2) ];
const dispSenzaBersaglio=window.__pecDisp();

console.log("disp prima:",dispPrima,"| piatto dopo:",piattoDopo,"| marker via:",markerVia,
  "| disp dopo:",dispDopo,"| scarti +2:",scartiPiuDue,"| disp senza bersaglio:",dispSenzaBersaglio);

const ok = dispPrima===true && toltaPiuBassa && restaSette && restaOppost
  && markerVia && dispDopo===false && scartiPiuDue && dispSenzaBersaglio===false;
console.log(ok ? "PECCATO TEST OK" : "PECCATO TEST FALLITO");
process.exit(ok?0:1);
