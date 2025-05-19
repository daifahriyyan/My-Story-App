import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { precacheAndRoute } from "workbox-precaching";
import CONFIG from "./scripts/config";

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({ url }) => url.href.startsWith('https://example-api.com'),
  new CacheFirst({
    cacheName: 'example-cache'
  })
)

registerRoute(
  ({ url }) => {
    return url.origin.includes('maptiler');
  },
  new CacheFirst({
    cacheName: 'maptiler-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination !== 'image';
  },
  new NetworkFirst({
    cacheName: 'story-api',
  }),
);

registerRoute(
  ({ request, url }) => {
    const baseUrl = new URL(CONFIG.BASE_URL);
    return baseUrl.origin === url.origin && request.destination === 'image';
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api',
  }),
);

self.addEventListener('push', event => {
  console.log('Service worker pushing...');

  event.waitUntil(
    self.registration.showNotification('Ada Story Baru!', {
      body: 'Seseorang baru saja menambahkan cerita!',
    })
  );
});