// Minimal service worker for D&D Scene Controller PWA
// Exists primarily to satisfy Android Chrome's installability requirement.
// Network-first: always tries the live version, so you always get the latest.

const CACHE = 'dnd-scene-controller-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Network-first, fall back to cache if offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache a copy of successful GET requests
        if (event.request.method === 'GET' && response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
