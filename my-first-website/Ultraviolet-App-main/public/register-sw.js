async function registerSW() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported in this browser.');
  }

  await navigator.serviceWorker.register('/uv/uv.sw.js', {
    scope: __uv$config.prefix,
  });
}
