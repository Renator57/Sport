// Fit & Leicht – Service Worker für den Offline-Modus.
// Bei Änderungen an den Dateien VERSION erhöhen, damit Handys die neue Version laden.
const VERSION = 'v2';
const CACHE = 'fit-leicht-' + VERSION;
const APP_FILES = [
  './',
  './index.html',
  './README.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './fonts/barlow-400.woff2',
  './fonts/barlow-600.woff2',
  './fonts/barlow-700.woff2',
  './fonts/barlow-condensed-700.woff2'
];

self.addEventListener('install', (event) => {
  // cache: 'reload' umgeht den HTTP-Cache, damit wirklich die neue Version gespeichert wird
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(APP_FILES.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('fit-leicht-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Erst aus dem Speicher antworten (sofort, auch offline), im Hintergrund aktualisieren.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const key = req.mode === 'navigate' && url.pathname.endsWith('/') ? './index.html' : req;
      const cached = await cache.match(key, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(key, res.clone());
          return res;
        })
        .catch(() => undefined);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      if (res) return res;
      if (req.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    })
  );
});

// Tippen auf eine Erinnerung öffnet die App
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) if ('focus' in c) return c.focus();
      return self.clients.openWindow('./');
    })
  );
});
