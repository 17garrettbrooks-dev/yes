const form = document.getElementById('uv-form');
const address = document.getElementById('uv-address');
const searchEngine = document.getElementById('uv-search-engine');
const error = document.getElementById('uv-error');
const errorCode = document.getElementById('uv-error-code');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      await registerSW();

      const url = search(address.value, searchEngine.value);
      const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

      const iframe = document.getElementById('uv-frame');
      if (iframe && iframe.style.display !== 'none') {
        iframe.src = encodedUrl;
      } else {
        window.location.href = encodedUrl;
      }
    } catch (err) {
      if (error) error.textContent = 'Failed to route request.';
      if (errorCode) errorCode.textContent = err.toString();
      console.error(err);
    }
  });
}
