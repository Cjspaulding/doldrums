const CACHE_NAME = 'doldrums-v5';
const STATIC_ASSETS = [
  '/icon-512.png',
  '/icon-180.png',
  '/icon-167.png',
  '/icon-152.png',
  '/icon.svg',
  '/og-image.png'
];

// Install: cache only static assets (not HTML)
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// Activate: delete ALL old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML/navigation, cache-first for static
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // External requests (APIs, fonts) — always network, no caching
  if (url.origin !== location.origin) {
    return; // let browser handle it normally
  }

  // HTML / navigation requests — network-first, but keep a fresh copy
  // cached so offline visits have something real to fall back to (the old
  // fallback pointed at /doldrums.html, a route this worker never actually
  // cached, so it silently served nothing when offline).
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Static assets (icons, images) — cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
        }
        return response;
      });
    })
  );
});
