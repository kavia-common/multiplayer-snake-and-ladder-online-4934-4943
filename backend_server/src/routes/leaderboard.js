const express = require('express');
const leaderboardController = require('../controllers/leaderboard');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Leaderboard
 *     description: Leaderboard stats
 */

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Leaderboard
 */
router.get('/', (req, res, next) => {
  try { leaderboardController.list(req, res); } catch (e) { next(e); }
});

module.exports = router;
