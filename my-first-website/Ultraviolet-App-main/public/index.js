const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

// 1. Initialize BareMux Transport with Epoxy
async function setBareTransport() {
    const wssUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/wisp/`;
    await connection.setTransport('/epoxy/index.mjs', [{ wss: wssUrl }]);
}

// 2. Register Ultraviolet Service Worker
async function registerSW() {
    if ('serviceWorker' in navigator) {
        // Point to the correct Ultraviolet service worker path (/uv/uv.sw.js)
        return await navigator.serviceWorker.register('/uv/uv.sw.js', {
            scope: __uv$config.prefix
        });
    } else {
        throw new Error('Service workers are not supported in this browser.');
    }
}

// Initialize BareMux and Register Service Worker on page load
async function init() {
    await setBareTransport();
    await registerSW();
}

init().catch(console.error);

// 3. Helper to format search queries into proxy URLs
function search(input, template) {
    try {
        return new URL(input).toString();
    } catch {
        // Handle queries like "discord" or "math games" by prepending https:// if it looks like a domain
        if (input.includes('.') && !input.includes(' ')) {
            return `https://${input}`;
        }
        return template.replace('%s', encodeURIComponent(input));
    }
}

// 4. Attach form submit event listener
const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchEngine = 'https://www.google.com/search?q=%s';

if (form && address) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = address.value.trim();
        if (!query) return;

        try {
            // Ensure Service Worker is ready before redirecting
            await registerSW();

            const url = search(query, searchEngine);
            location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        } catch (err) {
            console.error('Failed to navigate:', err);
        }
    });
}
