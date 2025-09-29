
const CACHE_NAME = 'kruthika-v3';
const STATIC_ASSETS = [
  '/',
  '/chat-bg.png',
  '/og-image.png',
  '/manifest.json'
];

// Chat history offline support
const CHAT_CACHE_NAME = 'kruthika-chat-history';
const MAX_CHAT_ENTRIES = 100;

// Enhanced cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event with improved asset caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('Cache failed for some assets:', err);
          // Continue even if some assets fail to cache
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Enhanced fetch event with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests except for chat API
  if (request.method !== 'GET' && !url.pathname.includes('/api/chat')) return;

  // Cache chat messages for offline access
  if (url.pathname.includes('/api/chat') && request.method === 'POST') {
    event.respondWith(handleChatRequest(request));
    return;
  }

  // Handle chat history requests

// Chat request handler for offline support
async function handleChatRequest(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(CHAT_CACHE_NAME);
      await cache.put(request.url + '_' + Date.now(), response.clone());
      
      // Clean old entries
      const keys = await cache.keys();
      if (keys.length > MAX_CHAT_ENTRIES) {
        const oldKeys = keys.slice(0, keys.length - MAX_CHAT_ENTRIES);
        await Promise.all(oldKeys.map(key => cache.delete(key)));
      }
    }
    return response;
  } catch (error) {
    // Return offline message
    return new Response(JSON.stringify({
      success: false,
      response: "I'm currently offline, but I'll be back soon! Your message has been saved.",
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Chat page handler with offline support
async function handleChatPageRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request) || new Response('Offline - cached version not available');
  }
}

  if (url.pathname.includes('/maya-chat')) {
    event.respondWith(handleChatPageRequest(request));
    return;
  }

  // Cache static assets aggressively (Cache First)
  if (url.pathname.startsWith('/_next/static/') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.avif') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.woff')) {
    
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) return response;
          
          return fetch(request).then((fetchResponse) => {
            // Check if response is valid
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
            return fetchResponse;
          });
        })
        .catch(() => {
          // Return offline fallback for images
          if (url.pathname.match(/\.(png|jpg|jpeg|webp|avif)$/)) {
            return new Response('', { status: 404 });
          }
        })
    );
    return;
  }

  // Network first for API calls with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses for 5 minutes
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME + '-api')
              .then(cache => {
                cache.put(request, responseClone);
                // Set expiry for API cache
                setTimeout(() => {
                  cache.delete(request);
                }, 5 * 60 * 1000); // 5 minutes
              });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for API requests
          return caches.match(request);
        })
    );
    return;
  }

  // Stale while revalidate for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          const fetchPromise = fetch(request).then(fetchResponse => {
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
            }
            return fetchResponse;
          });
          
          return response || fetchPromise;
        })
    );
  }
});

// Activate event with better cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-api') {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

function handleBackgroundSync() {
  // Handle offline actions when back online
  return Promise.resolve();
}
