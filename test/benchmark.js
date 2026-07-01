// Benchmark di bilanciamento DETERMINISTICO per Frenemies on the Road.
// Gira un set FISSO di seed con policy FISSA (greedy di mercato) e scoring v1.32 (presa 1, scopa 3),
// calcola le metriche aggregate (A esito · B punti · C scene · D meccaniche) e le rende PERSISTENTI,
// così da confrontare i run tra loro DOPO un cambio di regole (stessi seed => stesse partite, salvo
// che cambino le regole/il motore: è esattamente ciò che il confronto deve far emergere).
//
//   node test/benchmark.js            // N di default (250)
//   BENCH_N=200 node test/benchmark.js
//
// Persistenza (versionata nel repo, da committare insieme al cambio di regole):
//   test/simulazioni/storico.jsonl    // append: 1 record JSON per run (metadati + tutte le metriche)
//   test/simulazioni/ultimo.md        // report leggibile dell'ultimo run + confronto col precedente
//
// NB: tetto memoria JSDOM ~300 partite/processo; il default 250 sta sotto. N è nel record: confronta
// solo run con lo STESSO N.

// 250 partite JSDOM superano l'heap di default di Node: ci si rilancia una volta con più heap,
// così il comando documentato `node test/benchmark.js` funziona senza flag da ricordare.
if(!process.env.__BENCH_REEXEC){
  const r=require("child_process").spawnSync(process.execPath,
    ["--max-old-space-size=8192", __filename, ...process.argv.slice(2)],
    {stdio:"inherit", env:{...process.env, __BENCH_REEXEC:"1"}});
  process.exit(r.status==null?1:r.status);
}

const fs=require("fs"), path=require("path"), cp=require("child_process");
// JSDOM può lanciare un errore di teardown ("_location") su timer/animation-frame pendenti dopo che
// il lavoro è finito e i file sono già scritti: lo ignoriamo per uscire pulito (come fanno gli altri test).
process.on("uncaughtException", e=>{ if(String((e&&e.message)||"").includes("_location")) return; console.error(e); process.exit(1); });
const {runGame}=require("./partita_smart");

const N=parseInt(process.env.BENCH_N||"250");
const SEED_FROM=1, SEED_TO=N;
const POLICY="greedy: 1 figura per mercato per lato, la piu costosa acquistabile non ancora posseduta (Re>Regina>Fante)";
const SCORING="presa 1, scopa 3 (v1.32)";

// ---------------- esecuzione ----------------
process.stdout.write(`Benchmark: ${N} partite (seed ${SEED_FROM}-${SEED_TO})`);
const rows=[]; let skipped=0;
for(let s=SEED_FROM; s<=SEED_TO; s++){
  let r; try{ r=runGame(s,s,s,false); }catch(e){ skipped++; continue; }
  r.T=null; rows.push(r);
  if(s%25===0) process.stdout.write(".");
}
process.stdout.write("\n");
const n=rows.length;
if(!n){ console.error("Nessuna partita completata."); process.exit(1); }

// ---------------- helper ----------------
const round=(x,d=2)=>Math.round(x*10**d)/10**d;
const avg=f=>round(rows.reduce((s,r)=>s+f(r),0)/n);
const pct=f=>round(100*rows.filter(f).length/n,1);
const ESITI=["VITTORIA PIENA","PER IL ROTTO DELLA CUFFIA","SCONFITTA DIGNITOSA","FALLIMENTO TOTALE"];
const pWin=r=>r.outcome===ESITI[0]||r.outcome===ESITI[1];
const oWin=r=>r.outcome===ESITI[2]||r.outcome===ESITI[3];
// media dei punti GUADAGNATI in ogni scena (delta del cumulato lordo)
const perScenaPunti=k=>{ const o=[]; for(let sc=0;sc<5;sc++) o.push(avg(r=>(r[k][sc]||0)-(sc>0?(r[k][sc-1]||0):0))); return o; };
// media figure POSSEDUTE a fine di ogni scena (figCum ha 1 voce per mercato: dopo S1..S4; S5 = come S4)
const perScenaFig=k=>{ const o=[]; for(let sc=0;sc<5;sc++) o.push(avg(r=>(r[k][Math.min(sc,3)]||0))); return o; };

// ---------------- metriche ----------------
const metrics={
  esito:{
    vittP_pct:pct(pWin), vittO_pct:pct(oWin),
    esiti:Object.fromEntries(ESITI.map(e=>[e,pct(r=>r.outcome===e)])),
    ribaltoni:{ proP_pct:pct(r=>r.primoP<=r.primoO && r.finalP>r.finalO),
                proO_pct:pct(r=>r.primoP>=r.primoO && r.finalO>r.finalP) },
  },
  puntiLordiPerScena:{ P:perScenaPunti("grossP"), O:perScenaPunti("grossO") },
  puntiTotali:{ lordoP:avg(r=>r.grossP[4]||0), lordoO:avg(r=>r.grossO[4]||0),
                nettoP:avg(r=>r.puntiP), nettoO:avg(r=>r.puntiO),
                spesoP:avg(r=>r.spentP), spesoO:avg(r=>r.spentO) },
  figurePerScena:{ P:perScenaFig("figCumP"), O:perScenaFig("figCumO") },
  scene:{
    vittoriaPerScena:(()=>{ const o=[]; for(let sc=0;sc<5;sc++) o.push({P:pct(r=>r.poste[sc]==="P"), O:pct(r=>r.poste[sc]==="O")}); return o; })(),
    posteMedie:{ P:avg(r=>r.nP), O:avg(r=>r.nO) },
    rapporto:(()=>{ const c={}; rows.forEach(r=>{const k=`${r.nP}-${r.nO}`; c[k]=(c[k]||0)+1;});
      return Object.fromEntries(Object.entries(c).sort((a,b)=>Number(b[0].split("-")[0])-Number(a[0].split("-")[0])).map(([k,v])=>[k,pct(r=>`${r.nP}-${r.nO}`===k)])); })(),
  },
  meccaniche:{
    figureComprateP:avg(r=>r.buysP), figureComprateO:avg(r=>r.buysO),
    distrFigureP:[0,1,2,3].map(k=>pct(r=>r.buysP===k)), distrFigureO:[0,1,2,3].map(k=>pct(r=>r.buysO===k)),
    scopeP:avg(r=>r.scopeP), scopeO:avg(r=>r.scopeO),
    resePerPartita:avg(r=>r.resaCount), jollyGiocati:avg(r=>r.jollyGiocati), jollyP:avg(r=>r.jollyP), jollyO:avg(r=>r.jollyO),
  },
};

// ---------------- metadati ----------------
const git=c=>{ try{ return cp.execSync(c,{cwd:__dirname,stdio:["pipe","pipe","ignore"]}).toString().trim(); }catch(e){ return "?"; } };
const commit=git("git rev-parse --short HEAD");
const dirty=git("git status --porcelain")!=="";
let kbVersion="?"; try{ const m=fs.readFileSync(path.join(__dirname,"..","docs","frenemies_on_the_road_kb_v1_2.md"),"utf8").match(/Knowledge Base v([0-9.]+)/); if(m) kbVersion=m[1]; }catch(e){}
const record={ data:new Date().toISOString(), commit, dirty, kbVersion, n, seed:`${SEED_FROM}-${SEED_TO}`, policy:POLICY, scoring:SCORING, skipped, metrics };

// ---------------- persistenza JSONL ----------------
const dir=path.join(__dirname,"simulazioni");
fs.mkdirSync(dir,{recursive:true});
const jsonl=path.join(dir,"storico.jsonl");
const storico = fs.existsSync(jsonl) ? fs.readFileSync(jsonl,"utf8").trim().split("\n").filter(Boolean).map(l=>{try{return JSON.parse(l);}catch(e){return null;}}).filter(Boolean) : [];
const before = storico.length ? storico[storico.length-1] : null;   // run precedente (per il confronto)
fs.appendFileSync(jsonl, JSON.stringify(record)+"\n");

// ---------------- report Markdown ----------------
// delta rispetto al run precedente (solo se confrontabile: stesso N)
const cmp = before && before.n===n ? before.metrics : null;
const d=(cur,prev)=>{ if(prev==null) return ""; const v=round(cur-prev,2); return ` (${v>=0?"+":""}${v})`; };
const fixed=x=>Number(x).toFixed(2);
let md=`# Benchmark di bilanciamento — ultimo run\n\n`;
md+=`**Data:** ${record.data} · **Commit:** ${commit}${dirty?" (working tree sporco)":""} · **KB:** v${kbVersion}\n`;
md+=`**Campione:** ${n} partite (seed ${record.seed})${skipped?` · ${skipped} scartate`:""} · **Scoring:** ${SCORING}\n`;
md+=`**Policy mercato:** ${POLICY}\n\n`;
if(cmp) md+=`> Confronto (Δ) rispetto al run precedente: commit ${before.commit}, KB v${before.kbVersion}, ${before.data} (stesso N=${n}).\n\n`;
else if(before) md+=`> Run precedente con N diverso (${before.n}): niente confronto Δ.\n\n`;

md+=`## A) Esito della partita\n\n`;
md+=`- **Vittorie della missione:** Protagonisti **${fixed(metrics.esito.vittP_pct)}%**${d(metrics.esito.vittP_pct,cmp?.esito.vittP_pct)} · Opposizione **${fixed(metrics.esito.vittO_pct)}%**${d(metrics.esito.vittO_pct,cmp?.esito.vittO_pct)}\n`;
md+=`- **Esiti:** `+ESITI.map(e=>`${e} ${fixed(metrics.esito.esiti[e])}%${d(metrics.esito.esiti[e],cmp?.esito.esiti[e])}`).join(" · ")+`\n`;
md+=`- **Ribaltoni dopo i colpi di scena:** pro-Protagonisti ${fixed(metrics.esito.ribaltoni.proP_pct)}%${d(metrics.esito.ribaltoni.proP_pct,cmp?.esito.ribaltoni.proP_pct)} · pro-Opposizione ${fixed(metrics.esito.ribaltoni.proO_pct)}%${d(metrics.esito.ribaltoni.proO_pct,cmp?.esito.ribaltoni.proO_pct)}\n\n`;

md+=`## B.1) Punti guadagnati (lordi) per scena\n\n`;
md+=`| Scena | Protagonisti | Opposizione |\n|---|---|---|\n`;
for(let sc=0;sc<5;sc++) md+=`| ${sc+1} | ${fixed(metrics.puntiLordiPerScena.P[sc])}${d(metrics.puntiLordiPerScena.P[sc],cmp?.puntiLordiPerScena.P[sc])} | ${fixed(metrics.puntiLordiPerScena.O[sc])}${d(metrics.puntiLordiPerScena.O[sc],cmp?.puntiLordiPerScena.O[sc])} |\n`;
md+=`| **Totale** | **${fixed(metrics.puntiTotali.lordoP)}**${d(metrics.puntiTotali.lordoP,cmp?.puntiTotali.lordoP)} | **${fixed(metrics.puntiTotali.lordoO)}**${d(metrics.puntiTotali.lordoO,cmp?.puntiTotali.lordoO)} |\n\n`;
md+=`A fine partita — **netti** (Crescita): P ${fixed(metrics.puntiTotali.nettoP)} · O ${fixed(metrics.puntiTotali.nettoO)} · **spesi** al mercato: P ${fixed(metrics.puntiTotali.spesoP)} · O ${fixed(metrics.puntiTotali.spesoO)}\n\n`;

md+=`## B.2) Figure possedute (cumulative) a fine scena\n\n`;
md+=`*Spesa "quantizzata": ogni figura è un blocco di punti (Fante 3, Regina 5, Re 8).*\n\n`;
md+=`| Scena | Protagonisti | Opposizione |\n|---|---|---|\n`;
for(let sc=0;sc<5;sc++) md+=`| ${sc+1} | ${fixed(metrics.figurePerScena.P[sc])}${d(metrics.figurePerScena.P[sc],cmp?.figurePerScena.P[sc])} | ${fixed(metrics.figurePerScena.O[sc])}${d(metrics.figurePerScena.O[sc],cmp?.figurePerScena.O[sc])} |\n`;
md+=`\n`;

md+=`## C) Scene\n\n`;
md+=`**Vittoria per singola scena (% partite):**\n\n| Scena | Protagonisti | Opposizione |\n|---|---|---|\n`;
for(let sc=0;sc<5;sc++) md+=`| ${sc+1} | ${fixed(metrics.scene.vittoriaPerScena[sc].P)}% | ${fixed(metrics.scene.vittoriaPerScena[sc].O)}% |\n`;
md+=`\nPoste medie vinte: P **${fixed(metrics.scene.posteMedie.P)}** · O **${fixed(metrics.scene.posteMedie.O)}**\n\n`;
md+=`**Rapporto scene vinte per partita (P-O su 5):**\n\n`;
md+=Object.entries(metrics.scene.rapporto).map(([k,v])=>`- ${k}: ${fixed(v)}%${d(v,cmp?.scene.rapporto[k])}`).join("\n")+`\n\n`;

md+=`## D) Meccaniche\n\n`;
md+=`- **Figure comprate/partita:** P ${fixed(metrics.meccaniche.figureComprateP)} · O ${fixed(metrics.meccaniche.figureComprateO)}\n`;
md+=`  - distribuzione P (0/1/2/3): ${metrics.meccaniche.distrFigureP.map(fixed).join("% / ")}%\n`;
md+=`  - distribuzione O (0/1/2/3): ${metrics.meccaniche.distrFigureO.map(fixed).join("% / ")}%\n`;
md+=`- **Scope/partita:** P ${fixed(metrics.meccaniche.scopeP)} · O ${fixed(metrics.meccaniche.scopeO)}\n`;
md+=`- **Rese/partita:** ${fixed(metrics.meccaniche.resePerPartita)} · **Jolly usati/partita:** ${fixed(metrics.meccaniche.jollyGiocati)} (cattura P ${fixed(metrics.meccaniche.jollyP)} · spinta O ${fixed(metrics.meccaniche.jollyO)})\n`;

fs.writeFileSync(path.join(dir,"ultimo.md"), md);

// ---------------- report HTML (storico impaginato: un run per "scheda") ----------------
const allRec=[...storico, record];
const fx=x=>Number(x).toFixed(2);
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const dH=(cur,prev)=>{ if(prev==null||prev===undefined) return ""; const v=Math.round((cur-prev)*100)/100; const cls=v>0?"up":v<0?"down":"flat"; return ` <span class="d ${cls}">${v>=0?"+":""}${v}</span>`; };
const prevSameN=i=>{ for(let j=i-1;j>=0;j--) if(allRec[j].n===allRec[i].n) return allRec[j]; return null; };
function card(rec, idx, prev){
  const m=rec.metrics, pm = prev ? prev.metrics : null;
  const scene=[1,2,3,4,5];
  let h=`<section class="run" id="run${idx}"><h2>Run #${idx+1} — ${esc(rec.data)}</h2>`;
  h+=`<p class="meta">commit <code>${esc(rec.commit)}</code>${rec.dirty?' <span class="warn">(working tree sporco)</span>':""} · KB v${esc(rec.kbVersion)} · ${rec.n} partite (seed ${esc(rec.seed)}) · scoring ${esc(rec.scoring)}</p>`;
  h+=`<p class="meta small">policy: ${esc(rec.policy)}${pm?"":' · <em>nessun run precedente confrontabile</em>'}</p>`;
  // A
  h+=`<h3>A · Esito della partita</h3><table><tr><th></th><th>Protagonisti</th><th>Opposizione</th></tr>`;
  h+=`<tr><td>Vittorie missione</td><td class="big">${fx(m.esito.vittP_pct)}%${dH(m.esito.vittP_pct,pm?.esito.vittP_pct)}</td><td class="big">${fx(m.esito.vittO_pct)}%${dH(m.esito.vittO_pct,pm?.esito.vittO_pct)}</td></tr>`;
  h+=`<tr><td>Ribaltoni post-colpi</td><td>${fx(m.esito.ribaltoni.proP_pct)}%${dH(m.esito.ribaltoni.proP_pct,pm?.esito.ribaltoni.proP_pct)}</td><td>${fx(m.esito.ribaltoni.proO_pct)}%${dH(m.esito.ribaltoni.proO_pct,pm?.esito.ribaltoni.proO_pct)}</td></tr></table>`;
  h+=`<p class="esiti">`+Object.entries(m.esito.esiti).map(([k,v])=>`<span>${esc(k)}: <b>${fx(v)}%</b>${dH(v,pm?.esito.esiti[k])}</span>`).join(" · ")+`</p>`;
  // B.1
  h+=`<h3>B.1 · Punti guadagnati (lordi) per scena</h3><table><tr><th>Scena</th><th>Protagonisti</th><th>Opposizione</th></tr>`;
  scene.forEach((s,i)=>{ h+=`<tr><td>${s}</td><td>${fx(m.puntiLordiPerScena.P[i])}${dH(m.puntiLordiPerScena.P[i],pm?.puntiLordiPerScena.P[i])}</td><td>${fx(m.puntiLordiPerScena.O[i])}${dH(m.puntiLordiPerScena.O[i],pm?.puntiLordiPerScena.O[i])}</td></tr>`; });
  h+=`<tr class="tot"><td>Totale</td><td>${fx(m.puntiTotali.lordoP)}${dH(m.puntiTotali.lordoP,pm?.puntiTotali.lordoP)}</td><td>${fx(m.puntiTotali.lordoO)}${dH(m.puntiTotali.lordoO,pm?.puntiTotali.lordoO)}</td></tr></table>`;
  h+=`<p class="small">netti (Crescita): P ${fx(m.puntiTotali.nettoP)} · O ${fx(m.puntiTotali.nettoO)} — spesi: P ${fx(m.puntiTotali.spesoP)} · O ${fx(m.puntiTotali.spesoO)}</p>`;
  // B.2
  h+=`<h3>B.2 · Figure possedute (cumulative) a fine scena</h3><table><tr><th>Scena</th><th>Protagonisti</th><th>Opposizione</th></tr>`;
  scene.forEach((s,i)=>{ h+=`<tr><td>${s}</td><td>${fx(m.figurePerScena.P[i])}${dH(m.figurePerScena.P[i],pm?.figurePerScena.P[i])}</td><td>${fx(m.figurePerScena.O[i])}${dH(m.figurePerScena.O[i],pm?.figurePerScena.O[i])}</td></tr>`; });
  h+=`</table>`;
  // C
  h+=`<h3>C · Scene</h3><table><tr><th>Scena</th><th>Vince P</th><th>Vince O</th></tr>`;
  scene.forEach((s,i)=>{ h+=`<tr><td>${s}</td><td>${fx(m.scene.vittoriaPerScena[i].P)}%</td><td>${fx(m.scene.vittoriaPerScena[i].O)}%</td></tr>`; });
  h+=`</table><p class="small">Poste medie: P <b>${fx(m.scene.posteMedie.P)}</b> · O <b>${fx(m.scene.posteMedie.O)}</b></p>`;
  h+=`<p class="esiti">`+Object.entries(m.scene.rapporto).map(([k,v])=>`<span>${k}: <b>${fx(v)}%</b>${dH(v,pm?.scene.rapporto[k])}</span>`).join(" · ")+`</p>`;
  // D
  h+=`<h3>D · Meccaniche</h3><p class="small">Figure comprate: P ${fx(m.meccaniche.figureComprateP)} · O ${fx(m.meccaniche.figureComprateO)} — Scope: P ${fx(m.meccaniche.scopeP)} · O ${fx(m.meccaniche.scopeO)} — Rese: ${fx(m.meccaniche.resePerPartita)} — Jolly: ${fx(m.meccaniche.jollyGiocati)} (P ${fx(m.meccaniche.jollyP)} · O ${fx(m.meccaniche.jollyO)})</p>`;
  h+=`</section>`;
  return h;
}
// tabella riassuntiva (tutti i run, dal più recente)
let sumRows="";
for(let i=allRec.length-1;i>=0;i--){ const r=allRec[i], m=r.metrics;
  sumRows+=`<tr><td><a href="#run${i}">#${i+1}</a></td><td>${esc(r.data.slice(0,10))}</td><td>v${esc(r.kbVersion)}</td><td><code>${esc(r.commit)}</code></td><td>${r.n}</td><td>${fx(m.esito.vittP_pct)}%</td><td>${fx(m.esito.vittO_pct)}%</td><td>${fx(m.puntiTotali.lordoP)}</td><td>${fx(m.puntiTotali.lordoO)}</td><td>${fx(m.scene.posteMedie.P)}-${fx(m.scene.posteMedie.O)}</td></tr>`;
}
let cards="";
for(let i=allRec.length-1;i>=0;i--) cards+=card(allRec[i], i, prevSameN(i));
const CSS=`:root{--fg:#1c1a17;--mut:#6b645b;--line:#e6e0d6;--card:#fbf9f5;--accent:#7a5c2e}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:var(--fg);background:#f3efe7;padding:24px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:0 0 2px;color:var(--accent)}h3{font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--mut);margin:16px 0 6px}
.wrap{max-width:920px;margin:0 auto}.sub{color:var(--mut);margin:0 0 20px}
table{border-collapse:collapse;width:100%;margin:4px 0;font-variant-numeric:tabular-nums}
th,td{border:1px solid var(--line);padding:5px 9px;text-align:right}th:first-child,td:first-child{text-align:left}
th{background:#efe9df;color:var(--mut);font-weight:600;font-size:13px}
tr.tot td{font-weight:700;background:#f6f1e8}td.big{font-weight:700;font-size:16px}
.run{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 20px;margin:0 0 18px}
.meta{color:var(--mut);margin:2px 0}.small{font-size:13px;color:var(--mut)}.esiti{font-size:13px;color:var(--mut);margin:8px 0}.esiti span{white-space:nowrap}
code{background:#ece5d8;padding:1px 5px;border-radius:4px;font-size:12px}.warn{color:#a4442a}
.d{font-size:11px;font-weight:600;padding:0 3px;border-radius:3px}.d.up{color:#2f7d34}.d.down{color:#b23b2e}.d.flat{color:#9a938a}
.summary{overflow-x:auto}.summary a{color:var(--accent);text-decoration:none;font-weight:600}`;
const htmlDoc=`<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Benchmark Frenemies on the Road</title><style>${CSS}</style></head><body><div class="wrap">
<h1>Benchmark di bilanciamento — Frenemies on the Road</h1>
<p class="sub">${allRec.length} run nello storico · confronto tra run con stesso N · i Δ sono rispetto al run precedente confrontabile</p>
<h3>Riepilogo (dal più recente)</h3>
<div class="summary"><table><tr><th>Run</th><th>Data</th><th>KB</th><th>Commit</th><th>N</th><th>Vitt. P</th><th>Vitt. O</th><th>Punti P</th><th>Punti O</th><th>Poste P-O</th></tr>${sumRows}</table></div>
${cards}
</div></body></html>`;
fs.writeFileSync(path.join(dir,"report.html"), htmlDoc);

// ---------------- console ----------------
console.log(`\n== Benchmark v${kbVersion} · ${n} partite · commit ${commit}${dirty?" (sporco)":""} ==`);
console.log(`Vittorie missione: P ${fixed(metrics.esito.vittP_pct)}%${d(metrics.esito.vittP_pct,cmp?.esito.vittP_pct)} · O ${fixed(metrics.esito.vittO_pct)}%${d(metrics.esito.vittO_pct,cmp?.esito.vittO_pct)}`);
console.log(`Punti lordi totali: P ${fixed(metrics.puntiTotali.lordoP)}${d(metrics.puntiTotali.lordoP,cmp?.puntiTotali.lordoP)} · O ${fixed(metrics.puntiTotali.lordoO)}${d(metrics.puntiTotali.lordoO,cmp?.puntiTotali.lordoO)}`);
console.log(`Poste medie: P ${fixed(metrics.scene.posteMedie.P)} · O ${fixed(metrics.scene.posteMedie.O)}`);
console.log(`Record aggiunto a test/simulazioni/storico.jsonl · report in test/simulazioni/ultimo.md`);
if(!cmp && before) console.log(`(run precedente con N=${before.n}: nessun confronto Δ)`);
