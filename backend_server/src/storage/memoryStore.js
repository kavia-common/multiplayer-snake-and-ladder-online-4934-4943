'use strict';

/**
 * Simple in-memory storage for models.
 * Uses Maps keyed by id and a simple deterministic ID generator.
 */

function createIdGenerator(prefix = '') {
  let n = 0;
  return function nextId() {
    n += 1;
    return `${prefix}${Date.now().toString(36)}${n.toString(36)}`;
  };
}

const store = {
  users: new Map(),
  rooms: new Map(),
  games: new Map(),
  messages: new Map(),
};

const id = {
  user: createIdGenerator('usr_'),
  room: createIdGenerator('room_'),
  game: createIdGenerator('game_'),
  message: createIdGenerator('msg_'),
};

// PUBLIC_INTERFACE
function resetStore() {
  /** Clears all in-memory maps. Useful for tests. */
  store.users.clear();
  store.rooms.clear();
  store.games.clear();
  store.messages.clear();
}

module.exports = {
  store,
  id,
  resetStore,
};
