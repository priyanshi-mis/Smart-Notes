
const CACHE_NAME = "smart-notes-v1";
const FILES = [
  "/Smart-Notes/",
  "/Smart-Notes/index.html",
  "/Smart-Notes/style.css",
  "/Smart-Notes/script.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response =>
      response || fetch(event.request)
    )
  );
});
