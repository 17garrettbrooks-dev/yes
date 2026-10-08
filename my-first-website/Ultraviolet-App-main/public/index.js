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

// 1. Serve bare-mux static worker scripts from node_modules
app.use('/baremux/', express.static(path.join(__dirname, 'node_modules/@mercuryworkshop/bare-mux/dist')));

// 2. Serve static frontend files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Intercept requests for the Bare Server endpoint
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
