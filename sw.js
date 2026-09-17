var CACHE = 'conti-viaggio-v4';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return c.addAll(ASSETS);
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  var isHtml = e.request.mode === 'navigate' ||
    e.request.destination === 'document' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html');

  if(isHtml){
    e.respondWith(
      fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ try{ c.put(e.request, copy); }catch(_){} });
        return res;
      }).catch(function(){
        return caches.match(e.request).then(function(hit){ return hit || caches.match('./index.html'); });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        var copy = res.clone();
        caches.open(CACHE).then(function(c){ try{ c.put(e.request, copy); }catch(_){} });
        return res;
      }).catch(function(){ return caches.match('./index.html'); });
    })
  );
});
