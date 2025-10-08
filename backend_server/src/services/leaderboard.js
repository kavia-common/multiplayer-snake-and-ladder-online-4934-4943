'use strict';

const { games } = require('../storage');

// PUBLIC_INTERFACE
function getLeaderboard() {
  /** Compute simple stats: wins per player based on finished games. */
  const stats = {};
  games.list().forEach((g) => {
    if (g.status === 'finished' && g.winnerId) {
      stats[g.winnerId] = (stats[g.winnerId] || 0) + 1;
    }
  });
  const items = Object.entries(stats).map(([userId, wins]) => ({ userId, wins }));
  items.sort((a, b) => b.wins - a.wins);
  return { items };
}

module.exports = {
  getLeaderboard,
};
