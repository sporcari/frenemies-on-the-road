/* Frenemies on the Road — service worker.
   Strategia network-first: in rete si scarica sempre la versione nuova
   (niente versioni stantie durante lo sviluppo), la cache serve solo offline. */
const CACHE = "frenemies-v2";
const BASE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  /* PeerJS e API Anthropic passano sempre dalla rete, mai dalla cache */
  if (url.origin !== location.origin && !url.hostname.includes("fonts.")) return;
  e.respondWith(
    /* cache:"reload" salta la cache HTTP del browser: la network-first prende
       sempre il file fresco dal server, non una copia stantia (la cache CACHE serve solo offline) */
    fetch(e.request, { cache: "reload" })
      .then(r => {
        const copia = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })
        .then(m => m || caches.match("./index.html")))
  );
});
