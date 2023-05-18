const cacheName = 'salus-v1';

const urlsToCache = [
  '/',
  'index.html',
  'favicon.ico',
  'css/style.css',
  'js/app.js',
  'js/jquery.min.js',
  'js/bootstrap.min.js',
  'img/icon-128.png',
  'img/icon-192.png',
  'img/icon-512.png'
];

// Install the service worker
self.addEventListener('install', function(event) {
  console.log('Service worker installed.');

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('caching urls');
      cache.addAll(urlsToCache);
  }));
});

// Cache and return requests
self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);

    event.respondWith(
      cashes.match(event.request)
      .then(cacheResponse => {
        return cacheResponse || fetch(event.request).then(fetchResponse => {
          return caches.open(cacheName).then(cache => {
            cache.put(event.request.url, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('pages/404.html');
        }
      })
    );
});

// Update a service worker
self.addEventListener('activate', function(event) {
  console.log('Service worker activated.');
});
