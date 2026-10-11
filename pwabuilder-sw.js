const CACHE_NAME = "neon-calc-v7";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  // बाहरी आइकॉन को भी कैश करें ताकि ऑफलाइन में दिखे
  "https://cdn-icons-png.flaticon.com/512/891/891175.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
