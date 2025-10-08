const express = require('express');
const authController = require('../controllers/auth');

/**
 * Auth routes
 * - POST /guest
 * - POST /login
 * - POST /logout
 * - GET /me
 */

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: Guest login
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Optional display name
 *     responses:
 *       200:
 *         description: Returns user and token
 */
router.post('/guest', (req, res, next) => {
  try { authController.guest(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with username
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns user and token
 */
router.post('/login', (req, res, next) => {
  try { authController.login(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/logout', (req, res, next) => {
  try { authController.logout(req, res); } catch (e) { next(e); }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Unauthorized
 */
router.get('/me', (req, res, next) => {
  try { authController.me(req, res); } catch (e) { next(e); }
});

module.exports = router;
