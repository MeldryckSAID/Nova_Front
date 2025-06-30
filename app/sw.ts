/// <reference lib="webworker" />

const CACHE_NAME = 'nova-pwa-v2';
const STATIC_CACHE = 'nova-static-v2';
const DYNAMIC_CACHE = 'nova-dynamic-v2';

// Assets statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/helper',
  '/connexion',
  '/dashboard',
  '/helper-dashboard',
  '/manifest.json',
  '/images/nova_logo.svg',
  '/images/avatars/guy-1.svg',
  '/images/avatars/guy-2.svg',
  '/images/avatars/guy-3.svg',
  '/images/avatars/guy-4.svg',
  '/images/avatars/woman-1.svg',
  '/images/avatars/woman-2.svg',
  '/images/avatars/woman-3.svg',
  '/images/avatars/woman-4.svg',
  '/images/avatars/woman-5.svg',
];

// Installation du Service Worker
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('🔧 Service Worker: Installation');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Service Worker: Mise en cache des assets statiques');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  const swEvent = event as ExtendableEvent;
  console.log('✅ Service Worker: Activation');
  swEvent.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log(
              '🗑️ Service Worker: Suppression ancien cache',
              cacheName
            );
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégies de cache
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith('http')) return;

  // Cache First pour les assets statiques
  if (
    STATIC_ASSETS.some((asset) => url.pathname === asset) ||
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network First pour les pages HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Network First par défaut
  event.respondWith(networkFirst(request));
});

// Cache First
async function cacheFirst(request: Request): Promise<Response> {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    console.log('📦 Cache Hit:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🌐 Network + Cache:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('❌ Cache + Network Failed:', request.url);
    throw error;
  }
}

// Network First
async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🌐 Network Fresh:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('🔄 Network Failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Cache Fallback:', request.url);
      return cachedResponse;
    }
    throw error;
  }
}

// Network First avec fallback
async function networkFirstWithFallback(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🌐 Page Fresh:', request.url);
    }
    return networkResponse;
  } catch (error) {
    console.log('🔄 Page Network Failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Page Cache:', request.url);
      return cachedResponse;
    }

    const fallback = await caches.match('/');
    if (fallback) {
      console.log('🏠 Fallback to home:', request.url);
      return fallback;
    }

    throw error;
  }
}

// Messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});

// Utilitaires
async function getCacheSize(): Promise<number> {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    totalSize += requests.length;
  }

  return totalSize;
}

async function clearAllCaches(): Promise<void> {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('🗑️ Tous les caches supprimés');
}

// Synchronisation en arrière-plan
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background Sync:', event.tag);
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    const pendingData = await getStoredData('pendingSync');
    if (pendingData && pendingData.length > 0) {
      console.log('📤 Syncing pending data:', pendingData.length, 'items');
      await clearStoredData('pendingSync');
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

async function getStoredData(key: string): Promise<any> {
  return [];
}

async function clearStoredData(key: string): Promise<void> {
  console.log('🗑️ Cleared stored data:', key);
}
