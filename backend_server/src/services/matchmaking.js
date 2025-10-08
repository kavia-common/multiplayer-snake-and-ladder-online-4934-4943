'use strict';

const { rooms } = require('../storage');

const queue = []; // array of userIds
const PREFERRED_SIZE = 2;

// PUBLIC_INTERFACE
function joinQueue(userId) {
  /** Add user to matchmaking queue; create room when enough players. */
  if (!userId) {
    const err = new Error('userId required');
    err.status = 400;
    throw err;
  }
  if (!queue.includes(userId)) queue.push(userId);

  let createdRoom = null;
  if (queue.length >= PREFERRED_SIZE) {
    const players = queue.splice(0, PREFERRED_SIZE);
    const name = `Match ${new Date().toISOString()}`;
    createdRoom = rooms.create({ name, ownerId: players[0], playerIds: players });
  }
  return { queued: true, room: createdRoom };
}

// PUBLIC_INTERFACE
function cancelQueue(userId) {
  /** Remove user from queue. */
  const idx = queue.indexOf(userId);
  if (idx >= 0) queue.splice(idx, 1);
  return { queued: false };
}

// PUBLIC_INTERFACE
function getQueue() {
  /** Internal helper to inspect queue. */
  return queue.slice();
}

module.exports = {
  joinQueue,
  cancelQueue,
  getQueue,
};
