const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

async function setBareTransport() {
    await connection.setTransport('/baremux/index.js', ['/bare/']);
}

setBareTransport().catch(console.error);
