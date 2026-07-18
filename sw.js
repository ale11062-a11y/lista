// Service Worker para PWA
const CACHE_NAME = 'app-orcamentos-v1';
const urlsToCache = [
  './',
  './index.html',
  './dashboard.html',
  './css/style.css',
  './js/auth.js',
  './js/api.js',
  './js/orcamento.js',
  './js/main.js',
  './manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Cache aberto');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Cache antigo removido:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Para requisições à API, usar network first
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clonar a resposta
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se falhar, retornar do cache
          return caches.match(event.request);
        })
    );
  } else {
    // Para outros recursos, usar cache first
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  }
});

// Sincronização de background (para quando voltar online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orcamentos') {
    event.waitUntil(
      // Aqui você pode adicionar lógica para sincronizar dados
      Promise.resolve()
    );
  }
});
