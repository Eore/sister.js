let cacheName = "sister";
let assets = [
  "app/database.js",
  "app/connection.js",
  "app/app.js",
  "home.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("Chacing assets");
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

self.addEventListener("activate", () => console.log("Activated"));
