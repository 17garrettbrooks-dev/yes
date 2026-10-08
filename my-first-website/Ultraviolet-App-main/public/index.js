const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

// 1. Initialize BareMux Transport with Epoxy
async function setBareTransport() {
    const wssUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/wisp/`;
    await connection.setTransport('/epoxy/index.mjs', [{ wss: wssUrl }]);
}

setBareTransport().catch(console.error);

// 2. Register Ultraviolet Service Worker
async function registerSW() {
    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/uv/sw.js', {
            scope: __uv$config.prefix
        });
    } else {
        throw new Error('Service workers are not supported in this browser.');
    }
}

// 3. Helper to format search queries into proxy URLs
function search(input, template) {
    try {
        return new URL(input).toString();
    } catch {
        // If not a valid URL, search using Google
        return template.replace('%s', encodeURIComponent(input));
    }
}

// 4. Attach form submit event listener
const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchEngine = 'https://www.google.com/search?q=%s';

if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Register worker prior to handling URL routing
        await registerSW();

        const url = search(address.value, searchEngine);
        
        // Encode URL using Ultraviolet config and navigate
        location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
    });
}
