'use strict';

const { games } = require('../storage');
const { computeNextPosition, isWinningPosition } = require('../utils/gameLogic');

// PUBLIC_INTERFACE
function getGameState(gameId) {
  /** Fetch a current game state. */
  const game = games.findById(gameId);
  if (!game) {
    const err = new Error('Game not found');
    err.status = 404;
    throw err;
  }
  return game;
}

// PUBLIC_INTERFACE
function rollDice(gameId, userId, forcedRoll) {
  /** Process a dice roll for the current player's turn. Returns { game, roll, movedTo, winnerId? } */
  const game = games.findById(gameId);
  if (!game) {
    const err = new Error('Game not found');
    err.status = 404;
    throw err;
  }
  if (game.status !== 'active' && game.status !== 'waiting') {
    const err = new Error('Game not active');
    err.status = 400;
    throw err;
  }
  const currentPlayerId = game.players[game.currentTurnIndex % game.players.length];
  if (currentPlayerId !== userId) {
    const err = new Error('Not your turn');
    err.status = 400;
    throw err;
  }
  const roll = Number.isFinite(forcedRoll) ? Math.max(1, Math.min(6, Math.floor(forcedRoll))) : (Math.floor(Math.random() * 6) + 1);
  const currentPos = game.positions[userId] || 1;
  const nextPos = computeNextPosition(currentPos, roll, game.snakes, game.ladders);

  game.positions[userId] = nextPos;

  let winnerId = null;
  if (isWinningPosition(nextPos)) {
    winnerId = userId;
    games.setWinner(game.id, winnerId);
  } else {
    // advance turn
    const nextIdx = (game.currentTurnIndex + 1) % game.players.length;
    games.update(game.id, { positions: game.positions, currentTurnIndex: nextIdx, status: 'active' });
  }

  return {
    game: games.findById(game.id),
    roll,
    movedTo: nextPos,
    winnerId,
  };
}

module.exports = {
  getGameState,
  rollDice,
};
