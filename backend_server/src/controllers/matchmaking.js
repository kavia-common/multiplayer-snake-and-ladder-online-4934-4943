'use strict';

const matchmakingService = require('../services/matchmaking');

class MatchmakingController {
  // PUBLIC_INTERFACE
  join(req, res) {
    /** POST /api/matchmaking/join - Join queue, maybe returns created room */
    const userId = req.user.id;
    const result = matchmakingService.joinQueue(userId);
    return res.status(200).json(result);
  }

  // PUBLIC_INTERFACE
  cancel(req, res) {
    /** POST /api/matchmaking/cancel - Cancel queue */
    const userId = req.user.id;
    const result = matchmakingService.cancelQueue(userId);
    return res.status(200).json(result);
  }
}

module.exports = new MatchmakingController();
