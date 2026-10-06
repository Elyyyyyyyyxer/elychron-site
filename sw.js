/* Elychron PWA —— 只缓存外壳，不缓存任何数据 */
const CACHE = 'elychron-shell-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request).then(function (res) { const copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {}); return res; }).catch(function () { return caches.match('./index.html'); }); }));
});
