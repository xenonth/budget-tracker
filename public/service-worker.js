//Multiple image files
const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map(
  (size) => `/icons/icon-${size}x${size}.png`
);

const DATA_CACHE_NAME = "data-cache-v1";

const cacheName = 'my-cache';
//setup for install
const filesToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/styles.css',
  "/manifest.webmanifest",
  '/icons/app.js',
  '/img/logo.png'
].concat(iconFiles);


// install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
    
  );
  self.skipWaiting();
});


// activate
self.addEventListener("activate", function(event) {
  //Clering out localised caches
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== cacheName && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
    //Activating new caches
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(event) {
  const {url} = event.request;
  if (url.includes("/api/transaction")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request)
          .then(response => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            //modify to call api for get route
            

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(event.request);
          });
      }).catch(err => console.log(err))
    );
  } else {
    // respond from static cache, request is not for /api/*
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
        });
      })
    );
  }
});
