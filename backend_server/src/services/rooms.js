'use strict';

const { rooms, games } = require('../storage');

// PUBLIC_INTERFACE
function listRooms() {
  /** List all rooms. */
  return rooms.list();
}

// PUBLIC_INTERFACE
function createRoom({ name, ownerId }) {
  /** Create new room owned by ownerId, with owner auto-joined. */
  if (!name || !ownerId) {
    const err = new Error('name and ownerId required');
    err.status = 400;
    throw err;
  }
  const room = rooms.create({ name, ownerId, playerIds: [ownerId] });
  return room;
}

// PUBLIC_INTERFACE
function joinRoom(roomId, userId) {
  /** Add user to room if not already present. */
  const room = rooms.addPlayer(roomId, userId);
  if (!room) {
    const err = new Error('Room not found');
    err.status = 404;
    throw err;
  }
  return room;
}

// PUBLIC_INTERFACE
function leaveRoom(roomId, userId) {
  /** Remove user from room. */
  const room = rooms.removePlayer(roomId, userId);
  if (!room) {
    const err = new Error('Room not found');
    err.status = 404;
    throw err;
  }
  return room;
}

// PUBLIC_INTERFACE
function startGameInRoom(roomId) {
  /** Start a game if none active; set on room and return game. */
  const room = rooms.findById(roomId);
  if (!room) {
    const err = new Error('Room not found');
    err.status = 404;
    throw err;
  }
  if (!room.playerIds || room.playerIds.length < 2) {
    const err = new Error('Need at least 2 players to start');
    err.status = 400;
    throw err;
  }
  let game = games.getActiveByRoom(roomId);
  if (game) return game;
  game = games.create({ roomId, players: room.playerIds.slice(), seed: Date.now() });
  rooms.setActiveGame(roomId, game.id);
  return game;
}

module.exports = {
  listRooms,
  createRoom,
  joinRoom,
  leaveRoom,
  startGameInRoom,
};
