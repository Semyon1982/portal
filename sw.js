const CACHE_NAME = 'asosh-portal-v1';
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
  '/portal/gto_pdf/stage18.pdf'
];

// Установка Service Worker и кэширование
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache open failed:', err))
  );
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
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return caches.match('/portal/index.html');
        });
      })
  );
});