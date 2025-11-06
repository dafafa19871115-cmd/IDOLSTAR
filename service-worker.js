// Simple cache-first Service Worker
const CACHE_NAME = 'idolstar-pro-cache-v1';
const urlsToCache = ['/', '/index.html', '/main.js', '/firebase.js'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', event => event.waitUntil(clients.claim()));

self.addEventListener('fetch', event => {
  if (event.request.url.includes('firebase') || event.request.url.includes('firestore') || event.request.url.includes('google')) return;
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request).then(r=>{
    if (r && r.status === 200 && event.request.method === 'GET') {
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, r.clone()));
    }
    return r;
  })).catch(()=> caches.match('/')));
});
