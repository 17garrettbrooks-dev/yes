const connection = new BareMux.BareMuxConnection('/baremux/worker.js');

async function setBareTransport() {
    await connection.setTransport('/bareasmodule/index.mjs', ['/bare/']);
}

setBareTransport().catch(console.error);
