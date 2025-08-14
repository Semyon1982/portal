const CACHE_NAME = 'asosh-portal-v2';
const urlsToCache = [
  '/portal/',
  '/portal/index.html',
  '/portal/radio.html',
  '/portal/gto.html',
  '/portal/images/logo.png',
  '/portal/images/radio.png',
  '/portal/images/vk.png',
  '/portal/images/telegram.png',
  '/portal/images/youtube.png',
  '/portal/images/icon-192.png',
  '/portal/images/icon-512.png',
  '/portal/images/icon-maskable.png',
  '/portal/gto_pdf/stage1.pdf',
  '/portal/gto_pdf/stage2.pdf',
  '/portal/gto_pdf/stage3.pdf',
  '/portal/gto_pdf/stage4.pdf',
  '/portal/gto_pdf/stage5.pdf',
  '/portal/gto_pdf/stage6.pdf',
  '/portal/gto_pdf/stage7.pdf',
  '/portal/gto_pdf/stage8.pdf',
  '/portal/gto_pdf/stage9.pdf',
  '/portal/gto_pdf/stage10.pdf',
  '/portal/gto_pdf/stage11.pdf',
  '/portal/gto_pdf/stage12.pdf',
  '/portal/gto_pdf/stage13.pdf',
  '/portal/gto_pdf/stage14.pdf',
  '/portal/gto_pdf/stage15.pdf',
  '/portal/gto_pdf/stage16.pdf',
  '/portal/gto_pdf/stage17.pdf',
  '/portal/gto_pdf/stage18.pdf',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Установка Service Worker и кэширование начальных ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching initial files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache open failed:', err))
  );
  // Активировать Service Worker сразу после установки
  self.skipWaiting();
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // Захват клиентов (вкладок) сразу после активации
  self.clients.claim();
});

// Перехват запросов с динамическим кэшированием
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если ресурс есть в кэше, вернуть его
        if (response) {
          return response;
        }
        // Иначе загрузить из сети и кэшировать
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Кэшировать только успешные ответы
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(() => {
            // При оффлайн вернуть index.html для HTML-запросов
            if (event.request.mode === 'navigate') {
              return caches.match('/portal/index.html');
            }
            return new Response('Offline content not available', { status: 503 });
          });
      })
  );
});
