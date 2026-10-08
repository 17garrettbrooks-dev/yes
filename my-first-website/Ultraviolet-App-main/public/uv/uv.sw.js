/* global UVServiceWorker */
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');

// Ensure UVServiceWorker attached to global scope
const UV = self.UVServiceWorker || window.UVServiceWorker || UVServiceWorker;

if (!UV) {
    throw new Error('UVServiceWorker failed to bind to global scope.');
}

const sw = new UV();

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
