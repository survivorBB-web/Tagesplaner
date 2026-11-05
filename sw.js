// Hält die App offline bereit. Bei jedem Bau ändert build-web.ps1 die Version, dann holt sich das Handy die neuen Dateien.
const CACHE = "tagesplaner-20261105214405";
const FILES = ["./", "index.html", "manifest.webmanifest", "bricolage.woff2", "schibsted.woff2", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
