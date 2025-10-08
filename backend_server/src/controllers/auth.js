'use strict';

const authService = require('../services/auth');
const { verifyToken } = require('../middleware/auth');

class AuthController {
  // PUBLIC_INTERFACE
  guest(req, res) {
    /** POST /api/auth/guest - Create a guest user with optional username */
    const { username } = req.body || {};
    const { user, token } = authService.guestLogin(username);
    return res.status(200).json({ user, token });
  }

  // PUBLIC_INTERFACE
  login(req, res) {
    /** POST /api/auth/login - Login or create by username */
    const { username } = req.body || {};
    const { user, token } = authService.usernameLogin(username);
    return res.status(200).json({ user, token });
  }

  // PUBLIC_INTERFACE
  logout(req, res) {
    /** POST /api/auth/logout - Stateless, client discards token */
    return res.status(200).json({ success: true });
  }

  // PUBLIC_INTERFACE
  me(req, res) {
    /** GET /api/auth/me - Return current user from token */
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid or expired token' });
    return res.status(200).json({ id: payload.sub, username: payload.username });
  }
}

module.exports = new AuthController();
