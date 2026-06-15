// Minimal service worker for D&D Scene Controller PWA
// Exists primarily to satisfy Android Chrome's installability requirement.
// Network-first for app files, but ignores local network + API requests entirely.

const CACHE = 'dnd-scene-controller-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Do NOT intercept anything that isn't a GitHub Pages app asset.
  // This lets Hue Bridge (local IP), Spotify, and GitHub API calls pass through untouched.
  if (!url.includes('danmay321.github.io')) {
    return; // let the browser handle it normally
  }

  // Network-first for app files, fall back to cache if offline
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (event.request.method === 'GET' && response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
