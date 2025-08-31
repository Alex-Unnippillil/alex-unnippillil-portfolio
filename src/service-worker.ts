/* eslint-disable no-underscore-dangle */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

clientsClaim();
self.skipWaiting();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => ['document', 'script', 'style', 'font'].includes(request.destination),
  new StaleWhileRevalidate({ cacheName: 'app-shell' }),
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkOnly(),
);
