'use strict';

const leaderboardService = require('../services/leaderboard');

class LeaderboardController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** GET /api/leaderboard - Return computed stats */
    const data = leaderboardService.getLeaderboard();
    return res.status(200).json(data);
  }
}

module.exports = new LeaderboardController();
