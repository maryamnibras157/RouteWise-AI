const CACHE_NAME = 'routewise-cache-v1';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/next.svg',
  '/vercel.svg',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Offline-first strategy for static assets, network-first otherwise
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Safe fallback if network fails
        return new Response('Offline request failed.', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
