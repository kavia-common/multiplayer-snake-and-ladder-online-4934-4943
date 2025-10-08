const express = require('express');
const roomsController = require('../controllers/rooms');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Rooms
 *     description: Room management
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: List rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/', (req, res, next) => {
  try { roomsController.list(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Create a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authRequired, (req, res, next) => {
  try { roomsController.create(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/rooms/{id}/join:
 *   post:
 *     summary: Join room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Joined
 *       404:
 *         description: Not found
 */
router.post('/:id/join', authRequired, (req, res, next) => {
  try { roomsController.join(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/rooms/{id}/leave:
 *   post:
 *     summary: Leave room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Left
 *       404:
 *         description: Not found
 */
router.post('/:id/leave', authRequired, (req, res, next) => {
  try { roomsController.leave(req, res); } catch (e) { next(e); }
});

module.exports = router;
