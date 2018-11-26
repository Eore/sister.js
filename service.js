let cacheName = "sister";
let assets = ["app.js", "home.html"];

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
    caches.match(event.request).then(res => (res ? res : fetch(event.request)))
  );
});

self.addEventListener("activate", () => console.log("Activated"));
