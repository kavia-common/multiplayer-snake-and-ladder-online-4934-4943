'use strict';

/**
 * Core game logic for Snake and Ladder.
 * - Dice roll is 1..6
 * - Must land exactly on 100 to win
 * - Apply ladders then snakes (or commonly: move then apply any snake or ladder at destination)
 */

// PUBLIC_INTERFACE
function applySnakesAndLadders(position, snakes, ladders) {
  /** Given current position and board, return final position after snakes/ladders. */
  let moved = position;
  let changed = true;
  // prevent infinite loops by limiting iterations
  let guard = 0;
  while (changed && guard < 10) {
    guard++;
    changed = false;
    const ladder = ladders.find(l => l.from === moved);
    if (ladder) {
      moved = ladder.to;
      changed = true;
      continue;
    }
    const snake = snakes.find(s => s.from === moved);
    if (snake) {
      moved = snake.to;
      changed = true;
    }
  }
  return moved;
}

// PUBLIC_INTERFACE
function computeNextPosition(current, roll, snakes, ladders) {
  /** Move according to roll; do not exceed 100; apply snakes/ladders. */
  let next = current + roll;
  if (next > 100) return current; // must land exactly
  next = applySnakesAndLadders(next, snakes, ladders);
  return next;
}

// PUBLIC_INTERFACE
function isWinningPosition(pos) {
  /** Check if position is winning cell. */
  return pos === 100;
}

module.exports = {
  applySnakesAndLadders,
  computeNextPosition,
  isWinningPosition,
};
