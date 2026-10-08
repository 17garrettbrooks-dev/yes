import express from 'express';
import { createServer } from 'node:http';
import createBareServer from '@tomphttp/bare-server-node';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

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

server.listen(process.env.PORT || 8080);
