'use strict';

/**
 * Storage index to allow swapping with another backend (e.g., DB) later.
 * Exports repositories constructed over the in-memory store.
 */

const {
  createUsersRepository,
  createRoomsRepository,
  createGamesRepository,
  createMessagesRepository,
} = require('./repositories');
const { resetStore } = require('./memoryStore');

// Singletons
const users = createUsersRepository();
const rooms = createRoomsRepository();
const games = createGamesRepository();
const messages = createMessagesRepository();

// PUBLIC_INTERFACE
function getStorage() {
  /** Returns object with repository singletons. */
  return { users, rooms, games, messages, resetStore };
}

module.exports = {
  users,
  rooms,
  games,
  messages,
  resetStore,
  getStorage,
};
