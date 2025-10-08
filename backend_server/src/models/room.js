'use strict';

/**
 * Room model schema and helpers.
 * A room is a lobby for players and can host an active game.
 *
 * Shape of a Room:
 * {
 *   id: string,
 *   name: string,
 *   ownerId: string,
 *   playerIds: string[],
 *   activeGameId: string | null,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO),
 * }
 */

// PUBLIC_INTERFACE
function createRoom({ id, name, ownerId, playerIds, activeGameId, createdAt, updatedAt }) {
  /** Create a Room object ensuring required fields and defaults. */
  const now = new Date().toISOString();
  if (!name || typeof name !== 'string') {
    throw new Error('name is required');
  }
  if (!ownerId || typeof ownerId !== 'string') {
    throw new Error('ownerId is required');
  }

  return {
    id: id || '',
    name,
    ownerId,
    playerIds: Array.isArray(playerIds) ? playerIds : [],
    activeGameId: typeof activeGameId === 'string' ? activeGameId : null,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
  };
}

module.exports = {
  createRoom,
};
