import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { join } from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

const PORT = process.env.PORT || 8080;
const publicPath = join(process.cwd(), 'public');

// Serve static client dependencies
app.use('/uv/', express.static(uvPath));
app.use('/baremux/', express.static(baremuxPath));
app.use('/bareasmodule/', express.static(baremuxPath));
app.use('/epoxy/', express.static(epoxyPath));

// Serve frontend static files
app.use(express.static(publicPath));

// Route requests to Bare server or Express app
server.on('request', (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

// Upgrade WebSocket requests for Bare server
server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
