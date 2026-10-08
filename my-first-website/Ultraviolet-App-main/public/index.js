const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

async function setBareTransport() {
    const wssUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/wisp/`;
    
    // EpoxyTransport expects an options object containing the wss endpoint
    await connection.setTransport('/epoxy/index.mjs', [{ wss: wssUrl }]);
}

setBareTransport().catch(console.error);
