/*
 * Minimal service worker - it exists only so browsers treat the site as an installable app.
 * There's deliberately no caching: the clock is only useful with a live forecast, and a
 * pass-through worker can never serve a stale build after a deploy.
 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {
    // no respondWith: every request goes straight to the network as normal
});
