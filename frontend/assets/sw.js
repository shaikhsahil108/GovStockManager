const CACHE_NAME = "govstock-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./restaurants.html",
  "./brands.html",
  "./updater.html",
  "./settings.html",
  "./css/style.css",
  "./js/api.js",
  "./js/dashboard.js",
  "./js/restaurants.js",
  "./js/brands.js",
  "./js/updater.js",
  "./js/settings.js",
  "./manifest.json"
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  // Skip API calls from cache
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
