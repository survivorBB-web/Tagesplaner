// Hält die App offline bereit. Bei jedem Bau ändert build-web.ps1 die Version, dann holt sich das Handy die neuen Dateien.
// Die Seite selbst kommt mit Internet immer frisch vom Server, ohne Internet aus dem Speicher.
const CACHE = "tagesplaner-20261106135744";
const FILES = ["./", "index.html", "manifest.webmanifest", "bricolage.woff2", "schibsted.woff2", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

// "reload": am Browser-Zwischenspeicher vorbei, sonst landet eine bis zu 10 Minuten alte Kopie im Offline-Speicher
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r, { cache: "no-cache" })
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./", copy)); } return res; })
      .catch(() => caches.match("./").then(hit => hit || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r)));
});
