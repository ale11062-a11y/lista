// Service Worker para PWA - Offline Support

const CACHE_NAME = 'orcamentos-v1';
const urlsParaCache = [
    './',
    './index.html',
    './dashboard.html',
    './admin.html',
    './css/style.css',
    './js/auth-secure.js',
    './js/orcamento-isolado.js',
    './js/main.js',
    './manifest.json'
];

// Instalar Service Worker e fazer cache dos arquivos
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker - Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('💾 Cache aberto');
            return cache.addAll(urlsParaCache).catch(err => {
                console.log('⚠️ Alguns arquivos não foram cacheados:', err);
            });
        })
    );
    self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker - Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🧹 Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estratégia: Cache First, falling back to network
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return new Response(
                        JSON.stringify({ erro: 'Offline - API indisponível' }),
                        { status: 503, headers: { 'Content-Type': 'application/json' } }
                    );
                })
        );
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    
                    return response;
                })
                .catch(() => {
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});
