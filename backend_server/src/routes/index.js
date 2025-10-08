const express = require('express');
const healthController = require('../controllers/health');

const authRoutes = require('./auth');
const roomsRoutes = require('./rooms');
const matchmakingRoutes = require('./matchmaking');
const leaderboardRoutes = require('./leaderboard');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount API namespaces
router.use('/api/auth', authRoutes);
router.use('/api/rooms', roomsRoutes);
router.use('/api/matchmaking', matchmakingRoutes);
router.use('/api/leaderboard', leaderboardRoutes);

module.exports = router;
