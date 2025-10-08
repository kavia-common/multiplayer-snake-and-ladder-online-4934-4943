const express = require('express');
const matchmakingController = require('../controllers/matchmaking');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Matchmaking
 *     description: Matchmaking endpoints
 */

/**
 * @swagger
 * /api/matchmaking/join:
 *   post:
 *     summary: Join matchmaking queue
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Joined queue
 */
router.post('/join', authRequired, (req, res, next) => {
  try { matchmakingController.join(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/matchmaking/cancel:
 *   post:
 *     summary: Cancel matchmaking
 *     tags: [Matchmaking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cancelled
 */
router.post('/cancel', authRequired, (req, res, next) => {
  try { matchmakingController.cancel(req, res); } catch (e) { next(e); }
});

module.exports = router;
