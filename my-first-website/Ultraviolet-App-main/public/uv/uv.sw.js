/* global UVServiceWorker */
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js'); // fallback path if required by bundle

const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (sw.route(event)) {
        return await sw.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
