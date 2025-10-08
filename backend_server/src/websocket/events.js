'use strict';

const { rooms, games, messages } = require('../storage');
const roomsService = require('../services/rooms');
const gameService = require('../services/game');

// PUBLIC_INTERFACE
async function handleEvent(ctx) {
  /**
   * Handle incoming websocket event.
   * Supports:
   * - room:join { roomId }
   * - room:leave { roomId }
   * - room:start { roomId }
   * - game:rollDice { roomId, gameId? }
   * - chat:send { roomId, content }
   */
  const { type, body, ws, joinRoomSocket, leaveRoomSocket, broadcast } = ctx;

  if (!type) return;

  if (type === 'room:join') {
    const { roomId } = body || {};
    const room = rooms.findById(roomId);
    if (!room) return;
    joinRoomSocket(roomId, ws);
    broadcast(roomId, 'playerJoined', { userId: ws.user.id, roomId });
    // emit current room state
    const game = room.activeGameId ? games.findById(room.activeGameId) : null;
    ws.send(JSON.stringify({ type: 'room:state', payload: { room, game } }));
    if (game) {
      ws.send(JSON.stringify({ type: 'game:state', payload: game }));
      const turnId = game.players[game.currentTurnIndex % game.players.length];
      broadcast(roomId, 'game:turn', { userId: turnId, gameId: game.id });
    }
    return;
  }

  if (type === 'room:leave') {
    const { roomId } = body || {};
    leaveRoomSocket(roomId, ws);
    broadcast(roomId, 'playerLeft', { userId: ws.user.id, roomId });
    return;
  }

  if (type === 'room:start') {
    const { roomId } = body || {};
    try {
      const game = roomsService.startGameInRoom(roomId);
      broadcast(roomId, 'room:started', { roomId, gameId: game.id });
      broadcast(roomId, 'game:state', game);
      const turnId = game.players[game.currentTurnIndex % game.players.length];
      broadcast(roomId, 'game:turn', { userId: turnId, gameId: game.id });
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', payload: { message: e.message } }));
    }
    return;
  }

  if (type === 'game:rollDice') {
    const { roomId, gameId } = body || {};
    try {
      const targetGameId = gameId || (rooms.findById(roomId) || {}).activeGameId;
      const result = gameService.rollDice(targetGameId, ws.user.id);
      broadcast(roomId, 'game:diceResult', {
        userId: ws.user.id,
        roll: result.roll,
        movedTo: result.movedTo,
        gameId: targetGameId,
      });
      broadcast(roomId, 'game:state', result.game);
      if (result.winnerId) {
        broadcast(roomId, 'room:ended', { roomId, winnerId: result.winnerId, gameId: targetGameId });
      } else {
        const turnId = result.game.players[result.game.currentTurnIndex % result.game.players.length];
        broadcast(roomId, 'game:turn', { userId: turnId, gameId: targetGameId });
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', payload: { message: e.message } }));
    }
    return;
  }

  if (type === 'chat:send') {
    const { roomId, content } = body || {};
    if (!content || !content.trim()) return;
    const msg = messages.create({ roomId, userId: ws.user.id, content: String(content).trim() });
    broadcast(roomId, 'chat:message', msg);
    return;
  }
}

module.exports = {
  handleEvent,
};
