/* La Scuola dei Professoracci — service worker
   Serve a rendere il sito installabile come app.
   Strategia "prima la rete": si vede sempre l'ultima versione pubblicata;
   la copia in cache serve solo se la rete manca.
   Le chiamate a Gemini (POST verso Google) non passano di qui. */
const CACHE = 'professoracci-v9';
const BASE = [
  './', './index.html', './registro.html', './crea-professore.html', './aule/aula.html',
  './assets/aula.css', './assets/professoracci.js', './assets/classi.js',
  './assets/orologio.js', './assets/app.js', './manifest.webmanifest',
  './assets/icone/icona-192.png', './assets/icone/icona-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n.startsWith('professoracci-') && n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
