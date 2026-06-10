// Verifica dell'adattatore di viewport: simula un main che trabocca e controlla che --k scenda.
const { JSDOM } = require("jsdom");
const html = require("fs").readFileSync(require("path").join(__dirname, "..", "index.html"), "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
const w = dom.window, d = w.document;

const main = d.querySelector("main");
let kCorrente = 1;
// scrollHeight finto: a scala piena il contenuto è alto 980px, e scala con --k
Object.defineProperty(main, "clientHeight", { get: () => 620, configurable: true });
let altezzaBase = 980;
Object.defineProperty(main, "scrollHeight", { get: () => Math.round(altezzaBase * kCorrente), configurable: true });
// intercetto l'aggiornamento di --k per far reagire lo scrollHeight finto
const setOrig = d.documentElement.style.setProperty.bind(d.documentElement.style);
d.documentElement.style.setProperty = (p, v) => { if (p === "--k") kCorrente = parseFloat(v); setOrig(p, v); };

w.adattaViewport();
const kFinale = parseFloat(d.documentElement.style.getPropertyValue("--k"));
console.log("k finale:", kFinale, "| scrollHeight simulato:", Math.round(980 * kFinale), "| clientHeight:", 620);
if (!(kFinale <= 0.65 && Math.round(980 * kFinale) <= 621)) { console.error("FALLITO"); process.exit(1); }

// caso opposto: contenuto che sta già nel viewport → k deve restare 1
kCorrente = 1;
altezzaBase = 500;
w.adattaViewport();
const k2 = parseFloat(d.documentElement.style.getPropertyValue("--k"));
console.log("k con contenuto corto:", k2);
if (k2 !== 1) { console.error("FALLITO"); process.exit(1); }
console.log("adattatore OK");
