// Driver "intelligente" per Frenemies on the Road: gioca col motore reale (index.html via jsdom)
// applicando le euristiche di gioco (le stesse di REGOLE_IA in modalità VS Claude).
//   1) se puoi fare scopa, falla;
//   2) altrimenti prendi, scegliendo di catturare i semi avversari ed evitando i propri;
//   3) se devi solo calare, porta la somma del piatto sopra 10 (niente scopa subita);
//   4) se il rischio è inevitabile, conta le carte già uscite per stimarlo.
//   Asta: vuoi l'iniziativa solo se puoi scopare subito il carryover; col piatto vuoto la eviti.
// NON è il driver dell'actual play: la partita d'esempio del manuale resta su test/partita_esempio.js.
// Uso:
//   SEED=12 node test/partita_smart.js              riassunto di una riga
//   SEED=12 TRANSCRIPT=1 node test/partita_smart.js scrive transcript_smart_seed_12.txt
//   BATCH=80 node test/partita_smart.js             gioca i seed 1..80 e stampa un riassunto per riga
const {JSDOM}=require("jsdom");
const fs=require("fs");
const path=require("path");

const SEED=parseInt(process.env.SEED||"1");
const SEED2=parseInt(process.env.SEED2||String(SEED));
const SEED3=parseInt(process.env.SEED3||String(SEED2));
const BATCH=parseInt(process.env.BATCH||"0");
// FIXSEED=N: nel batch tiene FISSO il seed principale a N (scene 1-2 invariate) e fa variare il SOLO
// SEED2/SEED3 sul mazzo residuo (scene 3-5). Serve a cercare un finale migliore preservando S1-S2.
const FIXSEED=parseInt(process.env.FIXSEED||"0");
// MERCATO=canonico: replica gli acquisti della partita d'esempio (P Fante, P Regina, O Re) invece della
// politica "figura più potente". Serve a confrontare gioco ottimale e curato a PARITÀ di pescate (stesso mazzo).
const MERCATO_CANONICO=(process.env.MERCATO||"")==="canonico";
// SCOPA=3 (default 4): simula quanto vale una scopa, iniettandolo nel motore (scoring + pagamento al mercato).
// Serve solo a misurare l'effetto sul bilanciamento: il vero index.html non viene toccato.
const SCOPA=parseInt(process.env.SCOPA||"3");   // v1.15: la scopa vale 3
// presa con figura: v1.15 vale 1 come ogni presa (niente bonus). Resta come flag per eventuali simulazioni.
const FIGPRESA=parseInt(process.env.FIGPRESA||"1");
const HTML0=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");

/* ---------- scenario demo (come partita_esempio.js): solo per far girare il motore ---------- */
const MISSIONE="Prendere il Sole di Mezzanotte nella cripta di Zerzura, che l'eclissi apre tra cinque giorni, PRIMA che ci arrivi la Loggia del Basilisco.";
const PRIMADIFF="Il taccuino del professor Aldo Falco, l'unico che abbia mai annotato la via per Zerzura prima di sparire, stasera va all'asta in una sala privata del Cairo. La Loggia è già in città con una valigetta piena di banconote, e Vera e Otto non hanno nemmeno l'invito.";
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
const TITOLI=["L'asta del Cairo","Il treno per El Qara","Il mare di sabbia","Nella città perduta","La cripta del Sole"];
const POSTE=[
 "Prendere il taccuino di Aldo. Se va bene: hanno gli appunti su come raggiungere l'artefatto e un giorno di vantaggio. Se va male: il taccuino finisce nelle mani della Loggia e un giorno di vantaggio",
 "Raggiungere El Qara in tempo. Se va bene: si uniscono alla carovana dei mercanti di datteri e ingaggiano le guide indigene. Se va male: arrivano troppo tardi e restano senza quell'aiuto prezioso",
 "Orientarsi nel deserto e raggiungere l'oasi più vicina a dove dovrebbe trovarsi la città perduta. Se va bene: i protagonisti possono accamparsi e prepararsi alla ricerca. Se va male: si perdono nel deserto",
 "Trovare l'accesso alla cripta. Se va bene: sono a un passo dall'obiettivo. Se va male: restano in balia dei nemici e delle insidie della città perduta",
 "L'eclissi. Se va bene: mettono in salvo il Sole di Mezzanotte. Se va male: il Sole di Mezzanotte esce da Zerzura nella valigetta sbagliata"
];
const FIGVAL={F:8,D:9,R:10};

function runGame(seed, seed2, seed3, wantTranscript){
  let html=HTML0.replace(/<script src=[^>]+><\/script>/g,"");
  html=html.replace("/* ================= AVVIO ================= */","window.__G=()=>G; window.__idc=()=>idc; window.__comboFiguraDefault=comboFiguraDefault; window.__combosPresa=combosPresa;\n/* AVVIO */");
  html=html.replace("<script>",`<script>
(function(){let s=${seed}>>>0;window.__reseed=function(n){s=n>>>0};Math.random=function(){s|=0;s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};})();
`);
  // v1.32: lo scoring è ora FISSO nel motore (presa 1, scopa 3) tramite L.punti numerico, non più
  // iniettabile via replace (la vecchia rappresentazione a carte-marcatore è stata rimossa). Le costanti
  // SCOPA/FIGPRESA restano solo per l'euristica delle spinte e per le etichette dei report.
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true});
  const {window}=dom, {document}=window;
  const click=el=>{ if(el) el.dispatchEvent(new window.Event("click",{bubbles:true})); };
  const rnd=()=>window.Math.random();
  const cp=window.__combosPresa;
  const G=()=>window.__G();
  const fase=()=>window.__G?G().fase:"?";
  const veloAttivo=()=>document.getElementById("velo").classList.contains("attivo");
  const modaleAttivo=()=>document.getElementById("ovModale").classList.contains("attivo");

  const SYM={cuori:"♥",picche:"♠",quadri:"♦",fiori:"♣"};
  const cstr=c=>c?(c.jolly?"JOLLY":(c.fig?c.fig.charAt(0).toUpperCase():c.val)+SYM[c.seme]):"?";
  const mano=l=>G().lati[l].mano.map(cstr).join(" ");
  const piattoStr=()=>G().piatto.length?G().piatto.map(cstr).join(" "):"(vuoto)";
  const nomeL=l=>l==="P"?"PROTAGONISTI":"OPPOSIZIONE";
  const cardVal=x=>x.jolly?(x.val||0):(x.fig?FIGVAL[x.fig]:x.val);

  const T=[];
  const log=s=>T.push(s);
  let spinteUsate=0, colpiFatti=0, acquisti=0, jollyP=0, jollyO=0, reseedFatto=false, reseed3Fatto=false;
  let spintaScena=-1, ultimaLoggata="", pageError=null, resaCount=0, primoP=0, primoO=0;
  const grossP=[], grossO=[];   // punti lordi cumulativi a fine di ogni scena (indice = scena 0..4)
  const figCumP=[], figCumO=[];   // figure comprate cumulative dopo ogni mercato (1 voce per mercato, 4 mercati)
  let spentP=0, spentO=0, buysP=0, buysO=0;   // punti spesi e numero di figure comprate per lato
  const figset=new Set();
  const figP=new Set(), figO=new Set();       // figure COMPRATE per lato
  const figGiocate=new Set();                 // figure effettivamente GIOCATE in azione (F/D/R), via ultimaGiocata
  let fanteSbircia=false, fanteScambio=false; // l'effetto v1.15 del Fante si è VISTO (modale) / ha fatto uno scambio
  let jollyTipo="";                           // come è stato usato il Jolly: "scopa"/"presa" sleale, o "scarto"
  let reginaColpo=false, reColpo=false;        // figura calata DURANTE i colpi di scena (entrata scenica in cripta)
  let reginaPresa=false, reginaSacr=false;     // la Regina (Pablo) fa una PRESA VERA in scena vs si sacrifica da 1 pt
  let fanteSacr=false;                          // il Fante (Kalim) si sacrifica da 1 pt invece di catturare
  const COSTO={F:3,D:5,R:8};
  const astaScelte={P:null,O:null};
  const logUltima=()=>{ const u=G().ultimaGiocata; if(u && u!==ultimaLoggata){ log("   → "+u); ultimaLoggata=u;
    if(/Fante di/.test(u)){ figGiocate.add("F"); if(/sacrifica/.test(u)) fanteSacr=true; }
    if(/Regina di/.test(u)){ figGiocate.add("D"); if(/sacrifica/.test(u)) reginaSacr=true; else reginaPresa=true; }
    if(/Re di/.test(u)) figGiocate.add("R");
    if(/SCOPA col Jolly/.test(u)) jollyTipo="scopa";
    else if(/presa col Jolly/.test(u)) jollyTipo="presa";
    else if(/scarta il Jolly/.test(u)) jollyTipo="scarto";
  } };
  window.addEventListener("error",e=>{ pageError=e.message; });

  // v1.33: il Jolly è SPECULARE (lo usano entrambi i lati). La cattura non dà punti: il costo è armare
  // l'avversario (il Jolly gli passa). Il driver lo usa SOLO quando ASSICURA la scena alla mossa di
  // CHIUSURA del lato attore `a` (scopa che svuota, o presa che lo lascia avanti nella posta) e solo se
  // la giocata normale dell'ultima carta NON vincerebbe. Restituisce {v,ci,scopa,buryId} o null. Serve
  // anche a NON arrendersi quando il Jolly può vincere.
  function jollyPick(a){
    // v1.33: gioco OTTIMALE = usare il Jolly SOLO se fa vincere una scena che altrimenti si perderebbe.
    // Lo si valuta alla mossa di CHIUSURA (dove l'esito della posta è certo): se la carta normale NON vince
    // ma il Jolly (scopa, o presa che lascia avanti) sì, si gioca. Se la scena è già vinta, si tiene.
    if(!document.getElementById("btnUsaJolly")) return null;
    const g=G(), piatto=g.piatto, ME=g.lati[a], OPP=g.lati[a==="P"?"O":"P"];
    const closing = ME.mano.length===1 && OPP.mano.length===0 && !ME.astaCarta && !OPP.astaCarta;
    if(!closing) return null;
    const ownA=ME.semi, cval=x=>x.jolly?(x.val||0):(x.fig?FIGVAL[x.fig]:x.val);
    const meWins=(rem,scopaMe)=>{ if(!rem.length) return scopaMe;
      const mT=rem.filter(x=>ownA.includes(x.seme)).reduce((s,x)=>s+cval(x),0);
      const oT=rem.filter(x=>!ownA.includes(x.seme)).reduce((s,x)=>s+cval(x),0);
      return mT>oT; };   // parità: conservativo, non conta come vinta
    const c=ME.mano[0]; let normalWins=false;
    if(c.fig){
      const pot=piatto.filter(x=>!x.jolly);
      if(pot.length && Math.min(...pot.map(cval))<=FIGVAL[c.fig]){
        for(let v=1; v<=FIGVAL[c.fig] && !normalWins; v++) cp(v).forEach(cmb=>{ const rem=piatto.filter(x=>!cmb.some(y=>y.id===x.id)); if(meWins(rem, rem.length===0)) normalWins=true; });
      } else if(meWins(piatto.slice(), false)) normalWins=true;
    } else {
      const combos=cp(c.val);
      if(combos.length) combos.forEach(cmb=>{ const rem=piatto.filter(x=>!cmb.some(y=>y.id===x.id)); if(meWins(rem, rem.length===0)) normalWins=true; });
      else if(meWins([...piatto, c], false)) normalWins=true;
    }
    if(normalWins) return null;   // la scena è già vinta con la carta normale: NON sprecare il Jolly
    // v1.37: il Jolly cattura UNA sola carta. Scopa solo se nel piatto è rimasta una carta sola; altrimenti
    // cerca la singola carta la cui rimozione fa passare i totali dalla mia parte (preferisci la più alta).
    let pick=null;
    if(piatto.length===1 && meWins([], true)) pick={cardId:piatto[0].id, scopa:true};
    if(!pick){ const cand=[...piatto].sort((x,y)=>cval(y)-cval(x));
      for(const x of cand){ const rem=piatto.filter(y=>y.id!==x.id); if(meWins(rem,false)){ pick={cardId:x.id, scopa:false}; break; } } }
    if(!pick) return null;   // nemmeno il Jolly (una carta) fa vincere: tienilo
    const bury=ME.mano.filter(x=>!x.jolly).slice().sort((x,y)=>cval(x)-cval(y))[0];
    if(!bury) return null;
    pick.buryId=bury.id;
    return pick;
  }

  // --- scelta della mossa nel turno, secondo le euristiche ---
  function scegliMossa(a){
    const g=G(), piatto=g.piatto, own=g.lati[a].semi;
    const box=()=>document.getElementById("pannelloAzione");
    const domCards=[...document.querySelectorAll("#manoTurno .carta")];
    const objOf=el=>{ const id=parseInt(el.dataset.id), m=g.lati[a]; return m.mano.find(x=>x.id===id)||(m.astaCarta&&m.astaCarta.id===id?m.astaCarta:null); };
    const piattoSum=piatto.reduce((s,x)=>s+cardVal(x),0);
    const oppVal=cmb=>cmb.filter(x=>!own.includes(x.seme)).reduce((s,x)=>s+cardVal(x),0);
    const ownVal=cmb=>cmb.filter(x=>own.includes(x.seme)).reduce((s,x)=>s+cardVal(x),0);
    // carte di valore v ancora possibili in mano avversaria (conteggio carte, euristica 4)
    const viste=[...piatto, ...g.lati[a].mano, ...(g.scartiComuni||[])];   // v1.32: prese/scope sono già negli scarti comuni
    const ignote=v=>Math.max(0,4-viste.filter(x=>!x.fig&&!x.jolly&&x.val===v).length);
    let best=null;
    const consider=(score,exec)=>{ if(!best||score>best.score) best={score,exec}; };

    for(const el of domCards){
      const c=objOf(el); if(!c) continue;
      // v1.33: il Jolly non è più una carta della mano ma una risorsa (vedi jollyPick, considerato a fondo funzione).
      if(c.fig){
        const pot=piatto.filter(x=>!x.jolly);
        // v1.26: una figura che non cattura nulla si sacrifica come marcatore da 1 punto (mai scopa),
        // sia col piatto vuoto sia con sole carte fuori portata. Sprecarla così è quasi sempre peggio
        // che calare un numero: punteggio basso (fallback), proporzionale al valore buttato via.
        // v1.27: il Re cattura gruppi di somma fino a 10, è la carta che prende DI PIÙ: va trattenuto per la
        // presa maggiore. Non sacrificarlo (resta in mano, magari fa scena dopo) e non sprecarlo in una presa
        // piccola: penalizza forte sia il sacrificio sia le catture che lasciano molto margine sotto 10.
        const isRe=c.fig==="R";
        if(pot.length===0){ consider((isRe?-50:15)-0.5*FIGVAL[c.fig], ()=>{ click(el); click(document.getElementById("figSacrificio")); }); continue; }
        if(Math.min(...pot.map(x=>cardVal(x)))>FIGVAL[c.fig]){
          consider((isRe?-50:15)-0.5*FIGVAL[c.fig], ()=>{ click(el); click(document.getElementById("figSacrPresa")); }); continue;
        }
        for(let v=1; v<=FIGVAL[c.fig]; v++){
          cp(v).forEach((cmb,i)=>{
            const scopa=cmb.length===piatto.length;
            // anti-stranding: una figura che ha un BERSAGLIO ADESSO va incassata, non rimandata. Un numero
            // si può buttare sul piatto senza danno più tardi; una figura rischia il sacrificio da 1 pt se
            // il bersaglio sparisce. Bonus = FIGVAL: così una presa con figura batte la stessa presa fatta
            // con un numero, e tra due figure si cala prima la PIÙ ALTA (la più dolorosa da sprecare).
            // Per il Re (v1.27): trattienilo per la presa più grande (somma fino a 10). Una cattura che
            // sfrutta poco del suo raggio (margine 10 - somma catturata) è uno spreco: penalizza il margine,
            // così una presa piccola NON viene preferita a tenere il Re per dopo (salvo che chiuda con scopa).
            const catSum=cmb.reduce((s,x)=>s+cardVal(x),0);
            const reMargine=(isRe&&!scopa)?(10-catSum)*4:0;
            const score=(scopa?(1000+oppVal(cmb)-0.1*FIGVAL[c.fig]):(100+2*oppVal(cmb)-3*ownVal(cmb)+FIGVAL[c.fig]))-reMargine;
            consider(score, ()=>{ click(el);
              const bv=[...box().querySelectorAll("button[data-v]")].find(b=>parseInt(b.dataset.v)===v); click(bv);
              const fc=[...box().querySelectorAll("#figCombos button[data-c]")]; click(fc[i]||fc[0]); });
          });
        }
        continue;
      }
      const combos=cp(c.val);
      if(combos.length){
        combos.forEach((cmb,i)=>{
          const scopa=cmb.length===piatto.length;
          const score=scopa?(1000+oppVal(cmb)-0.1*c.val):(100+2*oppVal(cmb)-3*ownVal(cmb));
          consider(score, ()=>{ click(el); click(box().querySelector(`button[data-cmb="${i}"]`)); });
        });
      }else{
        const newSum=piattoSum+c.val;
        const score=newSum>10 ? (40-0.5*c.val) : (20-8*ignote(newSum));
        consider(score, ()=>{ click(el); click(box().querySelector("button[data-piatto]")); });
      }
    }
    // Jolly (speculare, entrambi i lati): usalo solo se ASSICURA la scena alla chiusura (vedi jollyPick).
    { const pk=jollyPick(a); if(pk) consider(pk.scopa?900:850, ()=>{
      click(document.getElementById("btnUsaJolly"));
      const be=[...document.querySelectorAll("#jollyBury .carta")].find(el=>parseInt(el.dataset.id)===pk.buryId); click(be);
      // v1.37: cattura di UNA carta: opzioniJolly mostra un bottone data-i per carta del piatto
      const opts=[...box().querySelectorAll("button[data-i]")];
      const idx=G().piatto.findIndex(x=>x.id===pk.cardId);
      click(opts[idx>=0?idx:0]);
      if(a==="P") jollyP++; else jollyO++; }); }
    return best;
  }

  function passo(){
    if(pageError) throw new Error("pagina: "+pageError);
    if(modaleAttivo()){
      const fanteSwap=document.getElementById("fanteSwap");
      if(fanteSwap){   // nuovo Fante (v1.15): sbircia 2, scambia la più alta con la carta di mano più bassa se conviene
        const g=G(), L=g.lati[g.attore];
        fanteSbircia=true;   // il modale è apparso: l'effetto v1.15 del Fante si è visto (mazzo non vuoto)
        const topAlta=L.mazzo.slice(0,2).slice().sort((a,b)=>b.val-a.val)[0];
        const manoBassa=L.mano.filter(c=>!c.jolly).slice().sort((a,b)=>a.val-b.val)[0];
        if(topAlta && manoBassa && topAlta.val>manoBassa.val){
          fanteScambio=true;
          click([...document.querySelectorAll("#fanteTop .carta")].find(x=>parseInt(x.dataset.id)===topAlta.id));
          click([...document.querySelectorAll("#fanteMano .carta")].find(x=>parseInt(x.dataset.id)===manoBassa.id));
          click(fanteSwap); log(`   → effetto FANTE: sbircia il mazzo e scambia ${cstr(manoBassa)} con ${cstr(topAlta)}.`);
        } else { click(document.getElementById("fanteNo")); log("   → effetto FANTE: sbircia il mazzo e lascia così."); }
        return "fante";
      }
      const reOk=document.getElementById("reOk");
      if(reOk){   // v1.27: il Re recupera la carta del suo seme di VALORE PIÙ ALTO dagli scarti comuni (massimizza)
        const g=G();
        // il modale mostra solo gli scarti del seme del Re: scelgo quello di valore più alto tra i visibili
        const cards=[...document.querySelectorAll("#reScarti .carta")]
          .map(el=>({el, c:(g.scartiComuni||[]).find(x=>x.id===parseInt(el.dataset.id))}))
          .filter(o=>o.c);
        if(cards.length){
          const top=cards.slice().sort((a,b)=>b.c.val-a.c.val)[0];
          click(top.el); click(reOk);
          log(`   → effetto RE: recupera ${cstr(top.c)} dagli scarti (${g.scena>=4?"nella riserva":"rimescolata nel mazzo"}).`);
        } else { click(document.getElementById("reNo")); log("   → effetto RE: nessuna carta del seme negli scarti."); }
        return "re";
      }
      const pngOk=document.getElementById("pngOk");
      if(pngOk){ const n=document.getElementById("m-png-nome"); if(n) n.value="PNG di prova";
        const d=document.getElementById("m-png-desc"); if(d) d.value="descrizione di prova"; click(pngOk); return "png-figura"; }
      const pngnOk=document.getElementById("pngnOk");
      if(pngnOk){ const n=document.getElementById("m-pngn-nome"); if(n) n.value="PNG narrativo di prova"; click(pngnOk); return "png-narr"; }
      throw new Error("modale sconosciuto");
    }
    if(veloAttivo()){ click(document.getElementById("veloBtn")); return "velo"; }
    const f=fase();

    if(f==="modalita"){ click(document.getElementById("md-locale")); return f; }

    if(f==="setup"){
      const set=(id,v)=>{const e=document.getElementById(id); if(e) e.value=v;};
      set("w-nomeP","Paola"); set("w-nomeO","Omar");
      set("w-missione",MISSIONE); set("w-primadiff",PRIMADIFF);
      set("w-persA","Vera Falco"); set("w-descA","Eroina d'azione: atletica, impulsiva, irruente.");
      set("w-persB","Otto Lenzi"); set("w-descB","Filologo delle lingue morte, pauroso e metodico.");
      set("w-nemici-input","La Loggia del Basilisco e i Veglianti di Zerzura");
      set("w-caos-input","Il deserto: tempeste, piste che spariscono, le trappole della cripta");
      for(let k=0;k<10;k++) set("w-pitch-"+k,PITCH[k]);
      if(G().passo===2){ const b=[...document.querySelectorAll('button[data-tono]')].find(x=>x.dataset.tono==="Action"); if(b&&G().tono!=="Action"){ click(b); return "tono"; } }
      click(document.getElementById("w-avanti")); return "setup"+G().passo;
    }

    if(f==="asta"){
      const a=G().attore, g=G();
      const objOf=el=>g.lati[a].mano.find(c=>c.id===parseInt(el.dataset.id));
      // v1.34: nell'asta si usano solo carte numeriche (Jolly e figure escluse)
      const carte=[...document.querySelectorAll("#manoAsta .carta")].filter(el=>{const c=objOf(el);return c&&!c.jolly&&!c.fig;});
      if(!carte.length) throw new Error("asta senza carte");
      // voglio l'iniziativa solo se posso scopare subito il carryover; col piatto vuoto la evito
      const piatto=g.piatto, ps=piatto.reduce((s,x)=>s+cardVal(x),0);
      let scopaSubito=false;
      if(piatto.length){
        for(const el of carte){ const c=objOf(el); if(!c) continue;
          if(c.fig){ if(ps<=FIGVAL[c.fig]) scopaSubito=true; }
          else if(cp(c.val).some(cmb=>cmb.length===piatto.length)) scopaSubito=true;
        }
      }
      const byVal=[...carte].sort((x,y)=>objOf(x).val-objOf(y).val);
      const el = scopaSubito ? byVal[byVal.length-1] : byVal[0];   // alta per avere l'iniziativa, bassa per evitarla
      astaScelte[a]=objOf(el)||null;
      click(el); click(document.getElementById("confAsta")); return f;
    }
    if(f==="asta_rivela"){
      const g=G(), rec=g.scene[g.scena];
      log(`   Asta: Protagonisti ${cstr(astaScelte.P)} contro Opposizione ${cstr(astaScelte.O)} → iniziativa a ${nomeL(rec.iniziativa)}.`);
      click(document.getElementById("vaiApertura")); return f;
    }
    if(f==="apertura"){
      const g=G();
      log(``); log(`== SCENA ${g.scena+1} — ${TITOLI[g.scena]} ==`);
      document.getElementById("a-titolo").value=TITOLI[g.scena];
      document.getElementById("a-posta").value=POSTE[g.scena];
      log(`   Posta: ${POSTE[g.scena]}`);
      if(g.piatto.length) log(`   Nel piatto dalla scena precedente: ${piattoStr()}`);
      click(document.getElementById("a-via")); return f;
    }

    if(f==="turno"){
      const a=G().attore;
      const carte=[...document.querySelectorAll("#manoTurno .carta")];
      if(!carte.length) throw new Error("turno senza carte");
      log(`   ${nomeL(a)} — mano: ${mano(a)} | piatto: ${piattoStr()}`);
      // RESA: ultimo a giocare (non iniziativa, 1 carta, scene 1-4) con carta ininfluente → cede la scena
      const bResa=document.getElementById("btnResa"), bRit=document.getElementById("btnRitirata");
      if(bResa||bRit){
        const g=G(), L=g.lati[a], c=L.mano[0], own=L.semi, piatto=g.piatto;
        const canCap = c && (c.fig ? (piatto.filter(x=>!x.jolly).length>0 && Math.min(...piatto.filter(x=>!x.jolly).map(cardVal))<=FIGVAL[c.fig])
                                    : (c.jolly ? piatto.length>0 : cp(c.val).length>0));
        const tOwn=piatto.filter(x=>own.includes(x.seme)).reduce((s,x)=>s+cardVal(x),0);
        const tOpp=piatto.filter(x=>!own.includes(x.seme)).reduce((s,x)=>s+cardVal(x),0);
        if(c && !canCap && (tOwn+cardVal(c))<=tOpp && !jollyPick(a)){   // la carta non cambia la scena e il Jolly non salva: arrenditi
          const b=bResa||bRit; click(b);
          const conf=document.getElementById("ritConferma"); if(conf) click(conf);
          resaCount++;
          log(`   → ${nomeL(a)} — ${bResa?"RESA ONOREVOLE":"RITIRATA STRATEGICA"}: ultima carta (${cstr(c)}) ininfluente, cede la scena.`);
          return "resa";
        }
      }
      const m=scegliMossa(a);
      if(!m) throw new Error("nessuna mossa scelta");
      m.exec(); logUltima(); return "gioca";
    }

    if(f==="narrazione"){
      const sp=[...document.querySelectorAll("button[data-spinta]")];
      if(sp.length && spintaScena!==G().scena){
        // Spinte (non valgono in scena 5 → spenderle entro la 4ª). Trasforma la presa in scopa se c'è roba
        // avversaria da togliere e non ti spazza via TROPPE carte tue: i 4 punti della scopa giustificano fino
        // a ~4 di valore tuo spazzato in più. Mai se nel residuo ci sono solo carte tue. Vale di più sulla
        // mossa conclusiva (assicura la posta).
        const g=G(), own=g.lati[g.attore].semi;
        const oppSwept=g.piatto.filter(c=>!own.includes(c.seme)).reduce((s,c)=>s+cardVal(c),0);
        const mySwept =g.piatto.filter(c=> own.includes(c.seme)).reduce((s,c)=>s+cardVal(c),0);
        const isClosing = g.lati.P.mano.length===0 && g.lati.O.mano.length===0 && !g.lati.P.astaCarta && !g.lati.O.astaCarta;
        if(oppSwept>0 && mySwept<=oppSwept+SCOPA){
          spintaScena=g.scena; spinteUsate++;
          log(`   → SPINTA DEL PITCH: «${sp[0].textContent.trim()}» — presa→scopa${isClosing?" (mossa conclusiva: assicura la scena)":""} (spazza ${oppSwept} avversario vs ${mySwept} mio).`);
          click(sp[0]); logUltima(); return "spinta";
        }
      }
      // v1.37: niente più spinta-Jolly. O usa il Jolly come CATTURA (una carta) nel proprio turno, come P
      // (gestito in scegliMossa/jollyPick), non in narrazione.
      click(document.getElementById("narrOk")); return f;
    }

    if(f==="fine_scena"){
      const g=G(), rec=g.scene[g.scena];
      // punti LORDI (guadagnati) cumulativi a fine scena: netto residuo + già speso al mercato.
      // Il mercato di questa transizione non è ancora avvenuto, quindi cattura esattamente
      // i punti fatti fino a questa scena inclusa (colpi di scena della S5 non danno punti).
      grossP[g.scena]=g.lati.P.punti+spentP; grossO[g.scena]=g.lati.O.punti+spentO;
      log(`   FINE SCENA ${g.scena+1}: piatto ${rec.totP} a ${rec.totO} → vince ${rec.vincitore==="parita"?"NESSUNO (parità)":nomeL(rec.vincitore)}. Seme dominante: ${SYM[rec.dominante]||rec.dominante||"—"} (diario: ${rec.rapporto}).`);
      if(g.scena===1 && seed2!==seed && !reseedFatto){ window.__reseed(seed2); reseedFatto=true; }
      if(g.scena===2 && seed3!==seed2 && !reseed3Fatto){ window.__reseed(seed3); reseed3Fatto=true; }
      click(document.getElementById("fs-avanti")); return f;
    }

    if(f==="mano_estesa"){
      const btn=document.getElementById("estOk");
      if(btn.disabled){
        const g=G(), L=g.lati[g.attore];
        const objOf=el=>L.mazzo.find(x=>x.id===parseInt(el.dataset.id));
        const valOf=el=>{ const c=objOf(el); return c?(c.val||0):0; };
        // v1.34: la figura comprata all'ultimo mercato è già in mano (sempre giocabile): #estCarte mostra
        // solo il mazzo (numeriche). Restano da scegliere slot = 4 - carte già in mano; prendo le più BASSE
        // (in mano riempiono i posti), le più ALTE vanno in riserva (nei colpi pesano di più).
        const slot=Math.max(0, 4-L.mano.length);
        const altre=[...document.querySelectorAll("#estCarte .carta")].sort((a,b)=>valOf(a)-valOf(b));
        altre.slice(0,slot).forEach(c=>click(c));
      }
      const g=G(); log(`   MANO ESTESA (scena 5): ${nomeL(g.attore)} tiene 4 carte, il resto in riserva.`);
      click(document.getElementById("estOk")); return f;
    }

    if(f==="mercato"){
      const NOMI_FIG={F:"il FANTE",D:"la REGINA",R:"il RE"};
      const ord={R:3,D:2,F:1};
      const buy=pick=>{
        if(!pick) return;
        figset.add(pick.dataset.f);
        if(pick.dataset.l==="P"){ figP.add(pick.dataset.f); spentP+=COSTO[pick.dataset.f]; buysP++; }
        else { figO.add(pick.dataset.f); spentO+=COSTO[pick.dataset.f]; buysO++; }
        log(`   MERCATO: ${nomeL(pick.dataset.l)} compra ${NOMI_FIG[pick.dataset.f]} di ${pick.dataset.s} ${SYM[pick.dataset.s]}.`);
        click(pick); acquisti++;
      };
      if(MERCATO_CANONICO){
        // CALENDARIO fisso della vecchia partita d'esempio: dopo S2 P Fante, dopo S3 P Regina, dopo S4 O Re.
        const sc=G().scena;
        const want = sc===1?{l:"P",f:"F"} : sc===2?{l:"P",f:"D"} : sc===3?{l:"O",f:"R"} : null;
        const btns=[...document.querySelectorAll("button[data-f]")].filter(x=>!x.disabled);
        buy(want ? btns.find(x=>x.dataset.l===want.l && x.dataset.f===want.f) : null);
      }else{
        // POLICY GREEDY (benchmark v1.32): ogni lato compra UNA SOLA figura per mercato, la PIÙ COSTOSA
        // che può permettersi tra quelle non ancora possedute (Re, se no Regina, se no Fante). Se non
        // può permettersene nessuna, passa (comprerà al mercato successivo). Es.: 8 punti col Re già
        // preso → compra la Regina, il Fante al mercato dopo.
        for(const l of ["P","O"]){
          const btns=[...document.querySelectorAll(`button[data-f][data-l="${l}"]`)].filter(x=>!x.disabled);
          if(btns.length) buy(btns.sort((x,y)=>ord[y.dataset.f]-ord[x.dataset.f])[0]);
        }
      }
      figCumP.push(buysP); figCumO.push(buysO);   // figure cumulative comprate dopo questo mercato
      click(document.getElementById("m-fine")); return f;
    }


    if(f==="primo_conteggio"){
      const g=G();
      primoP=g.piatto.filter(c=>g.lati.P.semi.includes(c.seme)).reduce((s,c)=>s+(c.jolly?0:cardVal(c)),0);
      primoO=g.piatto.filter(c=>g.lati.O.semi.includes(c.seme)).reduce((s,c)=>s+(c.jolly?0:cardVal(c)),0);
      log(``); log(`-- PRIMO CONTEGGIO (esito apparente) --`); log(`   Piatto finale: ${piattoStr()} (Prot ${primoP} · Opp ${primoO})`); click(document.getElementById("pc-avanti")); return f;
    }

    if(f==="colpi"){
      const carte=[...document.querySelectorAll("#riservaCarte .carta")];
      if(carte.length){
        // Regola v1.28: alternanza stretta, si gioca MENO carte, quindi la scelta conta.
        // 1) Bersagli eliminabili = carte avversarie nel piatto di val ≤ a quello di almeno una carta di riserva.
        // 2) Se c'è un bersaglio eliminabile: bersaglio = avversaria di val PIÙ ALTO eliminabile;
        //    carta di riserva = la più BASSA che riesce a eliminarlo (val ≥ val bersaglio), così conservi le alte.
        // 3) Se nessun bersaglio eliminabile: gioca la riserva di val PIÙ ALTO (massimizza il piatto), senza eliminare.
        // Le carte di #riservaCarte hanno data-id; i bottoni colpo hanno data-bersaglio (vuoto = "Metti senza eliminare").
        const g=G();
        const lat=g.attore;
        const riserva=g.lati[lat].riserva;
        const semiAvv=g.lati[lat==="P"?"O":"P"].semi;
        const avversarie=g.piatto.filter(c=>semiAvv.includes(c.seme));
        const maxRiserva=Math.max(...riserva.map(c=>c.val));
        // bersagli eliminabili: avversaria con val ≤ a una carta di riserva
        const elim=avversarie.filter(c=>c.val<=maxRiserva).sort((a,b)=>a.val-b.val);
        const cartaEl=id=>carte.find(c=>c.dataset.id==String(id));
        if(elim.length){
          const bers=elim[elim.length-1];                 // bersaglio di val più alto eliminabile
          // riserva di val più basso che lo elimina (val ≥ val bersaglio)
          const ris=riserva.filter(c=>c.val>=bers.val).sort((a,b)=>a.val-b.val)[0];
          click(cartaEl(ris.id));
          const btn=document.querySelector(`button[data-bersaglio="${bers.id}"]`);
          colpiFatti++; click(btn);
        }else{
          // nessun bersaglio: gioca la carta di valore più alto, senza eliminare
          const ris=[...riserva].sort((a,b)=>b.val-a.val)[0];
          click(cartaEl(ris.id));
          const no=document.querySelector('button[data-bersaglio=""]');
          if(no) click(no);
        }
      }
      logUltima();
      const u=G().ultimaGiocata||"";
      if(/Regina di/.test(u)) reginaColpo=true;
      if(/Re di/.test(u)) reColpo=true;
      return "colpo";
    }

    if(f==="neutralizza"){ log(`   Figure rimaste sul piatto: neutralizzate (contano come scope avversarie).`); click(document.getElementById("n-ok")); return f; }

    if(f==="finale") return "FINALE";
    throw new Error("fase sconosciuta: "+f);
  }

  for(let i=0;i<5000;i++){
    if(passo()==="FINALE"){
      const g=G();
      const esito=document.querySelector(".cartellone .grande");
      const outcome=esito?esito.textContent.trim():"?";
      const pv=l=>g.lati[l].punti;   // v1.32: i punti sono la valuta numerica (Crescita)
      const scopeCount=l=>g.lati[l].semi.reduce((a,s)=>a+(g.scopeGiocatore[s]||0),0);
      const ps=l=>g.piatto.filter(c=>g.lati[l].semi.includes(c.seme)).reduce((a,c)=>a+(c.jolly?0:cardVal(c)),0);
      log(``); log(`-- CONTEGGIO DEFINITIVO E FINALE --`);
      log(`   Piatto finale: ${piattoStr()}`);
      log(`   Valori nel piatto: Protagonisti (♥+♠) ${ps("P")} contro Opposizione (♦+♣) ${ps("O")}.`);
      log(`   Punti (presa 1, scopa ${SCOPA}): Protagonisti ${pv("P")}, Opposizione ${pv("O")}.`);
      log(`   Esito: ${outcome}`);
      log(`   Diario del rapporto per scena: ${g.scene.map(s=>s?s.rapporto:"-").join(", ")}`);
      const vinte=g.scene.map(s=>s?s.vincitore:"-").join(",");
      const sd=`${seed}${seed2!==seed?"/"+seed2:""}${seed3!==seed2?"/"+seed3:""}`;
      const finalP=ps("P"), finalO=ps("O");
      // robustezza: l'ultima scena deve avere il lordo cumulativo pari al totale finale
      // (i colpi di scena non danno punti); se il fine_scena della S5 non l'ha registrato, lo fissiamo qui.
      if(grossP[4]==null) grossP[4]=pv("P")+spentP;
      if(grossO[4]==null) grossO[4]=pv("O")+spentO;
      const riass=`SEED=${sd} scene=${vinte} scopeP=${scopeCount("P")} scopeO=${scopeCount("O")} puntiP=${pv("P")} puntiO=${pv("O")} jollyP=${jollyP} jollyO=${jollyO} spinte=${spinteUsate} colpi=${colpiFatti} acq=${acquisti} rese=${resaCount} figure=${[...figset].sort().join("")} outcome="${outcome}"`;
      const fnT=`transcript_smart_seed_${seed}${seed2!==seed?"_"+seed2:""}${seed3!==seed2?"_"+seed3:""}.txt`;
      const poste=g.scene.map(s=>s?s.vincitore:"-");
      const nP=poste.filter(x=>x==="P").length, nO=poste.filter(x=>x==="O").length;
      const arco=poste.map(x=>x==="P"?"P":x==="O"?"O":x==="parita"?"=":"-").join("");
      const __r={riass, T, fnT, ok:true, seed:sd, outcome, arco, figset:[...figset], resaCount,
        figP:[...figP].sort().join(""), figO:[...figO].sort().join(""), figGiocate:[...figGiocate].sort().join(""), jollyP, jollyO, jollyGiocati:jollyP+jollyO,
        fanteSbircia, fanteScambio, jollyTipo, reginaColpo, reColpo, reginaPresa, reginaSacr, fanteSacr,
        poste, sceneOK45: poste[3]==="O" && poste[4]==="P",
        nP, nO, primoP, primoO, finalP, finalO,
        flipDopoColpi: primoP<=primoO && finalP>finalO,   // sotto al primo conteggio, sopra dopo i colpi
        scopeP:scopeCount("P"), scopeO:scopeCount("O"), puntiP:pv("P"), puntiO:pv("O"),
        grossP:[...grossP], grossO:[...grossO], figCumP:[...figCumP], figCumO:[...figCumO],
        spentP, spentO, buysP, buysO, lordoP:pv("P")+spentP, lordoO:pv("O")+spentO};
      try{ dom.window.close(); }catch(e){}   // libera il JSDOM (cruciale nei batch)
      return __r;
    }
  }
  try{ dom.window.close(); }catch(e){}
  throw new Error("BLOCCATO in fase "+fase());
}

if(require.main!==module){
  // importato come modulo (es. da test/benchmark.js): esporta runGame, niente auto-run
  module.exports={runGame};
}else if(BATCH>0){
  const rows=[];
  // BATCHSTART=N: parte la ricerca dal seed N (default 1). Serve a scandire il residuo oltre i primi 300
  // senza superare il tetto memoria di JSDOM (BATCH ~300 alla volta): es. BATCHSTART=301 BATCH=600.
  const START=parseInt(process.env.BATCHSTART||"1");
  for(let s=START;s<=BATCH;s++){
    let r; try{ r=runGame(FIXSEED>0?FIXSEED:s, s, s, false); }catch(e){ continue; }
    const c1=(r.nP===3&&r.nO===2)||(r.nP===2&&r.nO===3);          // poste bilanciate 3/2
    const c2=/ROTTO DELLA CUFFIA/.test(r.outcome) && r.finalP>r.finalO; // Prot vincono di misura
    const c3=r.flipDopoColpi;                                     // sotto al primo conteggio, sopra dopo i colpi
    const c4=["F","D","R"].every(x=>r.figset.includes(x));        // tutte e 3 le figure comprate
    const c5=r.resaCount>=1;                                      // almeno una resa
    r._c={c1,c2,c3,c4,c5,n:[c1,c2,c3,c4,c5].filter(Boolean).length};
    r.T=null;   // libera la memoria del transcript nel batch
    rows.push(r);
  }
  const N=rows.length;
  const avg=f=>N?(rows.reduce((s,r)=>s+f(r),0)/N):0;
  const pct=f=>N?(100*rows.filter(f).length/N):0;
  console.log(`=== MEDIE su ${N} partite (gioco ottimale, scopa=${SCOPA}, presa-figura=${FIGPRESA}) ===`);
  console.log(`  punti NETTI a fine partita: Protagonisti ${avg(r=>r.puntiP).toFixed(2)} · Opposizione ${avg(r=>r.puntiO).toFixed(2)}`);
  console.log(`  punti SPESI al mercato:     Protagonisti ${avg(r=>r.spentP).toFixed(2)} · Opposizione ${avg(r=>r.spentO).toFixed(2)}`);
  console.log(`  punti LORDI (netto+speso):  Protagonisti ${avg(r=>r.lordoP).toFixed(2)} · Opposizione ${avg(r=>r.lordoO).toFixed(2)}`);
  console.log(`  FIGURE comprate/partita:    Protagonisti ${avg(r=>r.buysP).toFixed(2)} · Opposizione ${avg(r=>r.buysO).toFixed(2)}  (max teorico 3/lato: 1 per tipo)`);
  console.log(`  distribuzione figure Prot:  0→${pct(r=>r.buysP===0).toFixed(0)}%  1→${pct(r=>r.buysP===1).toFixed(0)}%  2→${pct(r=>r.buysP===2).toFixed(0)}%  3→${pct(r=>r.buysP===3).toFixed(0)}%`);
  console.log(`  scope: Protagonisti ${avg(r=>r.scopeP).toFixed(2)} · Opposizione ${avg(r=>r.scopeO).toFixed(2)}`);
  console.log(`  rese/partita ${avg(r=>r.resaCount).toFixed(2)} · poste vinte: Prot ${avg(r=>r.nP).toFixed(2)} Opp ${avg(r=>r.nO).toFixed(2)}`);
  console.log(`  vittoria finale Protagonisti ${pct(r=>r.finalP>r.finalO).toFixed(1)}% · "per il rotto della cuffia" ${pct(r=>/ROTTO DELLA CUFFIA/.test(r.outcome)).toFixed(1)}%`);
  const ESITI=["VITTORIA PIENA","PER IL ROTTO DELLA CUFFIA","SCONFITTA DIGNITOSA","FALLIMENTO TOTALE"];
  console.log(`  distribuzione esiti finali:`);
  ESITI.forEach(e=>{ const n=rows.filter(r=>r.outcome===e).length; console.log(`     ${e}: ${n} (${(100*n/N).toFixed(1)}%)`); });
  const altri=rows.filter(r=>!ESITI.includes(r.outcome));
  if(altri.length) console.log(`     (altri esiti non classificati: ${altri.length})`);
  console.log("");
  // ---- STATISTICHE RICHIESTE (lug 2026): punti per scena, vittorie, rapporto scene ----
  console.log(`  PUNTI GUADAGNATI (lordi) per scena — media su ${N} partite:`);
  for(let sc=0; sc<5; sc++){
    const dP=avg(r=>(r.grossP[sc]||0)-(sc>0?(r.grossP[sc-1]||0):0));
    const dO=avg(r=>(r.grossO[sc]||0)-(sc>0?(r.grossO[sc-1]||0):0));
    console.log(`     Scena ${sc+1}: Prot ${dP.toFixed(2)} · Opp ${dO.toFixed(2)}`);
  }
  console.log(`     TOTALE partita:  Prot ${avg(r=>r.grossP[4]||0).toFixed(2)} · Opp ${avg(r=>r.grossO[4]||0).toFixed(2)}`);
  const pWin=r=>r.outcome==="VITTORIA PIENA"||r.outcome==="PER IL ROTTO DELLA CUFFIA";
  const oWin=r=>r.outcome==="SCONFITTA DIGNITOSA"||r.outcome==="FALLIMENTO TOTALE";
  console.log(`  VITTORIE della partita (missione): Protagonisti ${pct(pWin).toFixed(1)}% · Opposizione ${pct(oWin).toFixed(1)}%`);
  const combos={};
  rows.forEach(r=>{ const k=`${r.nP}-${r.nO}`; combos[k]=(combos[k]||0)+1; });
  console.log(`  RAPPORTO scene vinte per partita (poste P-O, su 5):`);
  Object.keys(combos).sort((a,b)=>Number(b.split("-")[0])-Number(a.split("-")[0])).forEach(k=>console.log(`     ${k}: ${combos[k]} (${(100*combos[k]/N).toFixed(1)}%)`));
  const pariAvg=avg(r=>Math.max(0,5-r.nP-r.nO));
  if(pariAvg>0.005) console.log(`     (scene senza vincitore netto P/O, in media: ${pariAvg.toFixed(2)}/partita)`);
  console.log("");
  rows.sort((a,b)=>b._c.n-a._c.n);
  const fmt=r=>`SEED=${r.seed} arco=${r.arco} [${r._c.c1?"3/2":"---"} ${r._c.c2?"cuffia":"------"} ${r._c.c3?"ribalt":"------"} ${r._c.c4?"FDR":"---"} ${r._c.c5?"resa":"----"}] | primo ${r.primoP}-${r.primoO} → finale ${r.finalP}-${r.finalO} | scope ${r.scopeP}-${r.scopeO} | fig=${[...r.figset].sort().join("")} rese=${r.resaCount} | "${r.outcome}"`;
  const full=rows.filter(r=>r._c.n===5);
  const arcoCercato=process.env.ARCO||"";
  if(arcoCercato){
    const hit=full.filter(r=>r.arco===arcoCercato);
    console.log(`=== ${hit.length} seed con arco ${arcoCercato} E tutti e 5 i criteri ===`);
    hit.forEach(r=>console.log(fmt(r)));
    console.log(`--- (altri ${full.length} seed con tutti e 5 i criteri, arco qualsiasi) ---`);
  } else {
    console.log(`=== ${full.length} seed su ${BATCH} soddisfano TUTTI e 5 i criteri ===`);
  }
  full.forEach(r=>console.log(fmt(r)));
  console.log(`--- migliori parziali (4 su 5) ---`);
  rows.filter(r=>r._c.n===4).slice(0,15).forEach(r=>console.log(fmt(r)));

  if(process.env.FIGJOLLY){
    // Selezione alternativa (richiesta giu 2026): mercato canonico (P: Fante+Regina, O: Re),
    // tutte e 3 le figure E il jolly GIOCATI, unico vincolo su esiti: scena 4 = O, scena 5 = P.
    const regS=r=>r.reginaSacr?"SACR-1pt":r.reginaPresa?"PRESA":r.reginaColpo?"colpo":"-";
    const fmt2=r=>`SEED=${r.seed} arco=${r.arco} | Fante:${r.fanteSacr?"SACR-1pt":r.fanteScambio?"SCAMBIO":r.fanteSbircia?"sbircia":"NO-effetto"} Regina:${regS(r)} Jolly:${r.jollyTipo||"-"} | primo ${r.primoP}-${r.primoO}→${r.finalP}-${r.finalO} rese=${r.resaCount} | "${r.outcome}"`;
    const base=r=>r.figP==="DF" && r.figO==="R" && ["F","D","R"].every(x=>r.figGiocate.includes(x)) && r.jollyGiocati>0 && r.sceneOK45;
    const ok=rows.filter(base);
    console.log(``);
    console.log(`=== FIGJOLLY: ${ok.length} seed con P:Fante+Regina, O:Re, tutte le figure + jolly GIOCATI, S4=O S5=P ===`);
    // ranking per "vetrina ideale": la Regina (Pablo) deve fare qualcosa di SIGNIFICATIVO (presa vera, o
    // ingresso nei colpi di scena in cripta) e NON un sacrificio da 1 pt — questo è il criterio nuovo,
    // più importante; poi effetto Fante visibile, Jolly sleale e finale "per il rotto della cuffia".
    const punteggio=r=>(r.reginaPresa?4:r.reginaColpo?3:0)-(r.reginaSacr?4:0)-(r.fanteSacr?3:0)
        +(r.fanteScambio?3:r.fanteSbircia?1:0)+(r.jollyTipo==="scopa"?2:r.jollyTipo==="presa"?1:0)
        +(/ROTTO DELLA CUFFIA/.test(r.outcome)?2:0);
    ok.sort((a,b)=>punteggio(b)-punteggio(a));
    ok.forEach(r=>console.log(`[${punteggio(r)}] `+fmt2(r)));
    // IDEALI: nessuna figura sprecata (né Regina né Fante), effetto Fante visibile, finale "per il rotto della cuffia".
    const ideali=ok.filter(r=>(r.reginaPresa||r.reginaColpo) && !r.reginaSacr && !r.fanteSacr && (r.fanteScambio||r.fanteSbircia) && /ROTTO DELLA CUFFIA/.test(r.outcome));
    console.log(``);
    console.log(`=== IDEALI (nessuna figura sprecata + effetto Fante visibile + cuffia): ${ideali.length} ===`);
    ideali.forEach(r=>console.log(fmt2(r)));
  }
}else{
  try{
    const r=runGame(SEED,SEED2,SEED3,!!process.env.TRANSCRIPT);
    console.log(r.riass);
    if(process.env.TRANSCRIPT){ fs.writeFileSync(r.fnT, r.T.join("\n")); console.log(`transcript: ${r.fnT} (${r.T.length} righe)`); }
  }catch(e){ console.error(`SEED=${SEED} ECCEZIONE in gioco: ${e.message}`); process.exit(1); }
}
