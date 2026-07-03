/* Service worker for the WHRS FRMS Calculator.
   Bump CACHE (e.g. frms-v2) whenever index.html or assets change so
   clients pick up the new version. */
const CACHE = 'frms-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        // Cache each asset individually so one missing file (e.g. icon.png)
        // doesn't fail the whole install.
        await Promise.all(ASSETS.map((asset) => cache.add(asset).catch(() => {})));
        self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
        self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});
