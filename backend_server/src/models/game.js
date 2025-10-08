'use strict';

/**
 * Game model schema and helpers.
 *
 * Shape of a Game:
 * {
 *   id: string,
 *   roomId: string,
 *   players: string[], // userIds in turn order
 *   positions: { [userId]: number }, // 1..100
 *   currentTurnIndex: number, // index into players
 *   snakes: Array<{ from: number, to: number }>,
 *   ladders: Array<{ from: number, to: number }>,
 *   status: 'waiting' | 'active' | 'finished',
 *   winnerId: string | null,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO),
 * }
 */

/**
 * Deterministic snake/ladder generator.
 * We avoid randomness to keep tests and local behavior stable.
 * Uses a simple pseudo-random sequence based on a numeric seed.
 */

// PUBLIC_INTERFACE
function createDeterministicBoard(seed = 42) {
  /** Returns { snakes, ladders } arrays for a standard 10x10 board (1..100). */
  // Linear Congruential Generator for reproducibility
  let state = Number.isFinite(seed) ? Math.floor(seed) : 42;
  const lcg = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };

  const taken = new Set();

  const chooseDistinct = (min, max) => {
    // choose integer [min, max]
    const r = Math.floor(lcg() * (max - min + 1)) + min;
    return r;
  };

  const snakes = [];
  const ladders = [];

  // Create 6 ladders and 6 snakes with constraints to avoid clashes and trivial ranges
  const ladderCount = 6;
  const snakeCount = 6;

  const isFree = (pos) => pos >= 2 && pos <= 99 && !taken.has(pos);

  // Ladders go up: from low to high
  for (let i = 0; i < ladderCount; i++) {
    let from = 0;
    let to = 0;
    let guard = 0;
    while (guard < 500) {
      guard++;
      from = chooseDistinct(2, 70); // start not too high
      to = chooseDistinct(from + 5, Math.min(from + 30, 95)); // at least 5 steps up
      if (isFree(from) && isFree(to) && to > from) {
        taken.add(from);
        taken.add(to);
        ladders.push({ from, to });
        break;
      }
    }
  }

  // Snakes go down: from high to low
  for (let i = 0; i < snakeCount; i++) {
    let from = 0;
    let to = 0;
    let guard = 0;
    while (guard < 500) {
      guard++;
      from = chooseDistinct(30, 98); // start not too low
      to = chooseDistinct(Math.max(2, from - 30), from - 5); // at least 5 steps down
      if (isFree(from) && isFree(to) && from > to) {
        taken.add(from);
        taken.add(to);
        snakes.push({ from, to });
        break;
      }
    }
  }

  // Sort for predictable inspection
  ladders.sort((a, b) => a.from - b.from);
  snakes.sort((a, b) => a.from - b.from);

  return { snakes, ladders };
}

// PUBLIC_INTERFACE
function createGame({
  id,
  roomId,
  players,
  positions,
  currentTurnIndex,
  snakes,
  ladders,
  status,
  winnerId,
  createdAt,
  updatedAt,
  seed,
}) {
  /** Create a Game object ensuring required fields and defaults. */
  const now = new Date().toISOString();
  if (!roomId || typeof roomId !== 'string') {
    throw new Error('roomId is required');
  }
  const turnOrder = Array.isArray(players) ? players.slice() : [];

  let board = { snakes: [], ladders: [] };
  if (Array.isArray(snakes) && Array.isArray(ladders) && snakes.length && ladders.length) {
    board = { snakes, ladders };
  } else {
    board = createDeterministicBoard(seed);
  }

  const pos = {};
  for (const uid of turnOrder) {
    pos[uid] = (positions && Number.isFinite(positions[uid])) ? positions[uid] : 1;
  }

  return {
    id: id || '',
    roomId,
    players: turnOrder,
    positions: pos,
    currentTurnIndex: Number.isFinite(currentTurnIndex) ? currentTurnIndex : 0,
    snakes: board.snakes,
    ladders: board.ladders,
    status: status || (turnOrder.length ? 'active' : 'waiting'),
    winnerId: winnerId || null,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
  };
}

module.exports = {
  createGame,
  createDeterministicBoard,
};
