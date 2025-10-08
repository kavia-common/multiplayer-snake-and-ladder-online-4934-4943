'use strict';

const url = require('url');
const WebSocket = require('ws');
const { verifyToken } = require('../middleware/auth');
const events = require('./events');

// PUBLIC_INTERFACE
function attachWebSocket(server) {
  /** Attach authenticated WebSocket server on path /ws to an existing HTTP server. */
  const wss = new WebSocket.Server({ server, path: '/ws' });

  // Map of roomId -> Set of sockets
  const rooms = new Map();

  function joinRoomSocket(roomId, ws) {
    if (!rooms.has(roomId)) rooms.set(roomId, new Set());
    rooms.get(roomId).add(ws);
    ws._rooms = ws._rooms || new Set();
    ws._rooms.add(roomId);
  }
  function leaveRoomSocket(roomId, ws) {
    const set = rooms.get(roomId);
    if (set) {
      set.delete(ws);
      if (set.size === 0) rooms.delete(roomId);
    }
    if (ws._rooms) ws._rooms.delete(roomId);
  }
  function broadcast(roomId, type, payload) {
    const set = rooms.get(roomId);
    if (!set) return;
    const msg = JSON.stringify({ type, payload });
    for (const client of set) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  }

  wss.on('connection', (ws, req) => {
    try {
      // Authenticate via token query or Authorization header
      const parsed = url.parse(req.url, true);
      const token = (parsed.query && parsed.query.token) ||
        ((req.headers.authorization || '').startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
      const payload = verifyToken(token);
      if (!payload) {
        ws.close(4401, 'Unauthorized');
        return;
      }
      ws.user = { id: payload.sub, username: payload.username };

      ws.on('message', async (message) => {
        let data;
        try { data = JSON.parse(message); } catch (e) { return; }
        const { type, payload: body } = data || {};
        await events.handleEvent({
          type,
          body,
          ws,
          joinRoomSocket,
          leaveRoomSocket,
          broadcast,
        });
      });

      ws.on('close', () => {
        // leave all rooms
        if (ws._rooms) {
          for (const r of Array.from(ws._rooms)) {
            leaveRoomSocket(r, ws);
            broadcast(r, 'playerLeft', { userId: ws.user.id, roomId: r });
          }
        }
      });
    } catch (e) {
      try { ws.close(1011, 'Internal error'); } catch (_) { /* noop */ }
    }
  });

  return wss;
}

module.exports = {
  attachWebSocket,
};
