// 1. Search helper function
function search(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {
    if (input.includes('.') && !input.includes(' ')) {
      return `https://${input}`;
    }
    return template.replace('%s', encodeURIComponent(input));
  }
}

// 2. Service Worker registration helper
async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  // Register Ultraviolet's service worker
  await navigator.serviceWorker.register('/uv/uv.sw.js', {
    scope: __uv$config.prefix,
  });
}

// 3. Form event listener
const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchTemplate = 'https://duckduckgo.com/?q=%s';

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      // Ensure Service Worker is registered
      await registerSW();

      // Resolve raw input into a search engine query or valid URL
      const url = search(address.value, searchTemplate);

      // Encode the URL using Ultraviolet's encoder
      const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

      // Redirect an iframe if present, otherwise redirect the tab
      const iframe = document.getElementById('uv-frame');
      if (iframe) {
        iframe.src = encodedUrl;
      } else {
        window.location.href = encodedUrl;
      }
    } catch (err) {
      console.error('Failed to route request:', err);
    }
  });
}
