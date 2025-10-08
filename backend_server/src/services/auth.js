'use strict';

const { users } = require('../storage');
const { signToken, verifyToken } = require('../middleware/auth');

// PUBLIC_INTERFACE
function guestLogin(username) {
  /** Create a guest user and return token and profile. */
  const uname = username && String(username).trim() ? String(username).trim() : `guest_${Math.random().toString(36).slice(2, 8)}`;
  const user = users.create(uname);
  const token = signToken({ sub: user.id, username: user.username });
  return { user, token };
}

// PUBLIC_INTERFACE
function usernameLogin(username) {
  /** Login with username: find existing or create; return token and profile. */
  const uname = String(username || '').trim();
  if (!uname) {
    const err = new Error('username is required');
    err.status = 400;
    throw err;
  }
  let user = users.findByUsername(uname);
  if (!user) user = users.create(uname);
  const token = signToken({ sub: user.id, username: user.username });
  return { user, token };
}

// PUBLIC_INTERFACE
function getMeFromToken(token) {
  /** Decode token to get current user. */
  const payload = verifyToken(token);
  if (!payload) return null;
  return users.findById(payload.sub);
}

module.exports = {
  guestLogin,
  usernameLogin,
  getMeFromToken,
};
