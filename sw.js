// Service Worker para funcionalidade offline
const CACHE_NAME = 'contas-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalar service worker
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativar service worker
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar requisições
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - retornar resposta do cache
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
