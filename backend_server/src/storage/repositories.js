'use strict';

const { store, id } = require('./memoryStore');
const { createUser } = require('../models/user');
const { createRoom } = require('../models/room');
const { createGame } = require('../models/game');
const { createMessage } = require('../models/message');

/**
 * Repository utilities.
 */

function stampUpdated(entity) {
  return { ...entity, updatedAt: new Date().toISOString() };
}

/**
 * Users Repository
 */
// PUBLIC_INTERFACE
function createUsersRepository() {
  /** CRUD for Users: create, findById, findByUsername, list, update, remove */
  return {
    create(username) {
      const obj = createUser({ id: id.user(), username });
      const withId = { ...obj, id: obj.id || id.user() }; // ensure id if custom create omitted
      store.users.set(withId.id, withId);
      return withId;
    },
    findById(userId) {
      return store.users.get(userId) || null;
    },
    findByUsername(username) {
      for (const u of store.users.values()) {
        if (u.username === username) return u;
      }
      return null;
    },
    list() {
      return Array.from(store.users.values());
    },
    update(userId, patch) {
      const existing = store.users.get(userId);
      if (!existing) return null;
      const updated = stampUpdated({ ...existing, ...patch, id: userId });
      store.users.set(userId, updated);
      return updated;
    },
    remove(userId) {
      return store.users.delete(userId);
    },
  };
}

/**
 * Rooms Repository
 */
// PUBLIC_INTERFACE
function createRoomsRepository() {
  /** CRUD for Rooms with list and membership helpers. */
  return {
    create({ name, ownerId, playerIds }) {
      const roomObj = createRoom({ id: id.room(), name, ownerId, playerIds });
      store.rooms.set(roomObj.id, roomObj);
      return roomObj;
    },
    findById(roomId) {
      return store.rooms.get(roomId) || null;
    },
    list() {
      return Array.from(store.rooms.values());
    },
    listByOwner(ownerId) {
      return this.list().filter((r) => r.ownerId === ownerId);
    },
    addPlayer(roomId, userId) {
      const room = store.rooms.get(roomId);
      if (!room) return null;
      if (!room.playerIds.includes(userId)) {
        room.playerIds = room.playerIds.concat(userId);
        store.rooms.set(roomId, stampUpdated(room));
      }
      return store.rooms.get(roomId);
    },
    removePlayer(roomId, userId) {
      const room = store.rooms.get(roomId);
      if (!room) return null;
      room.playerIds = room.playerIds.filter((id) => id !== userId);
      store.rooms.set(roomId, stampUpdated(room));
      return store.rooms.get(roomId);
    },
    setActiveGame(roomId, gameId) {
      const room = store.rooms.get(roomId);
      if (!room) return null;
      room.activeGameId = gameId;
      store.rooms.set(roomId, stampUpdated(room));
      return store.rooms.get(roomId);
    },
    update(roomId, patch) {
      const room = store.rooms.get(roomId);
      if (!room) return null;
      const updated = stampUpdated({ ...room, ...patch, id: roomId });
      store.rooms.set(roomId, updated);
      return updated;
    },
    remove(roomId) {
      return store.rooms.delete(roomId);
    },
  };
}

/**
 * Games Repository
 */
// PUBLIC_INTERFACE
function createGamesRepository() {
  /** CRUD for Games with helper getActiveByRoom and turn operations scaffolding. */
  return {
    create({ roomId, players, seed }) {
      const gameObj = createGame({ id: id.game(), roomId, players, seed });
      store.games.set(gameObj.id, gameObj);
      return gameObj;
    },
    findById(gameId) {
      return store.games.get(gameId) || null;
    },
    list() {
      return Array.from(store.games.values());
    },
    listByRoom(roomId) {
      return this.list().filter((g) => g.roomId === roomId);
    },
    getActiveByRoom(roomId) {
      const games = this.listByRoom(roomId);
      return games.find((g) => g.status === 'active' || g.status === 'waiting') || null;
    },
    update(gameId, patch) {
      const game = store.games.get(gameId);
      if (!game) return null;
      const updated = stampUpdated({ ...game, ...patch, id: gameId });
      store.games.set(gameId, updated);
      return updated;
    },
    setWinner(gameId, winnerId) {
      const game = store.games.get(gameId);
      if (!game) return null;
      game.winnerId = winnerId;
      game.status = 'finished';
      store.games.set(gameId, stampUpdated(game));
      return store.games.get(gameId);
    },
    remove(gameId) {
      return store.games.delete(gameId);
    },
  };
}

/**
 * Messages Repository
 */
// PUBLIC_INTERFACE
function createMessagesRepository() {
  /** CRUD for Messages with list by room and by user. */
  return {
    create({ roomId, userId, content }) {
      const messageObj = createMessage({ id: id.message(), roomId, userId, content });
      store.messages.set(messageObj.id, messageObj);
      return messageObj;
    },
    findById(messageId) {
      return store.messages.get(messageId) || null;
    },
    list() {
      return Array.from(store.messages.values());
    },
    listByRoom(roomId) {
      return this.list()
        .filter((m) => m.roomId === roomId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    },
    listByUser(userId) {
      return this.list().filter((m) => m.userId === userId);
    },
    remove(messageId) {
      return store.messages.delete(messageId);
    },
    removeByRoom(roomId) {
      let count = 0;
      for (const [k, v] of store.messages.entries()) {
        if (v.roomId === roomId) {
          store.messages.delete(k);
          count++;
        }
      }
      return count;
    },
  };
}

module.exports = {
  createUsersRepository,
  createRoomsRepository,
  createGamesRepository,
  createMessagesRepository,
};
