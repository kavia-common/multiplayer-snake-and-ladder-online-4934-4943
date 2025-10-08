'use strict';

const gameService = require('../services/game');

class GameController {
  // PUBLIC_INTERFACE
  state(req, res) {
    /** GET /api/games/:id - Get game state */
    const { id } = req.params;
    const game = gameService.getGameState(id);
    return res.status(200).json(game);
  }
}

module.exports = new GameController();
