import express from 'express';
import { createServer } from 'node:http';
import createBareServer from '@tomphttp/bare-server-node';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// Point up one directory ('..') to reach node_modules and public from src/
app.use('/baremux/', express.static(path.join(__dirname, '../node_modules/@mercuryworkshop/bare-mux/dist')));
app.use(express.static(path.join(__dirname, '../public')));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`ONYX server listening on port ${PORT}`);
});
