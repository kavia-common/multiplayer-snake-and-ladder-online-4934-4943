'use strict';

const crypto = require('crypto');

/**
 * Simple JWT-lite token using HMAC-SHA256 over payload.
 * Not a full JWT implementation, but includes:
 * base64url(payload JSON).base64url(signature)
 * where signature = HMAC(secret, base64payload)
 */

function getSecret() {
  const secret = process.env.BACKEND_JWT_SECRET || 'dev_insecure_secret_change_me';
  return String(secret);
}

function base64url(input) {
  return Buffer.from(input).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function unbase64url(input) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (input.length % 4);
  if (pad !== 4) {
    input += '='.repeat(pad);
  }
  return Buffer.from(input, 'base64').toString();
}

// PUBLIC_INTERFACE
function signToken(payload, expiresInSeconds = 60 * 60 * 24 * 7) {
  /** Sign a payload and return token. Adds iat and exp. */
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const payloadB64 = base64url(JSON.stringify(body));
  const hmac = crypto.createHmac('sha256', getSecret());
  hmac.update(payloadB64);
  const sig = base64url(hmac.digest());
  return `${payloadB64}.${sig}`;
}

// PUBLIC_INTERFACE
function verifyToken(token) {
  /** Verify token, return payload or null. */
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, sig] = token.split('.');
  const hmac = crypto.createHmac('sha256', getSecret());
  hmac.update(payloadB64);
  const expected = base64url(hmac.digest());
  if (expected !== sig) return null;
  try {
    const json = JSON.parse(unbase64url(payloadB64));
    const now = Math.floor(Date.now() / 1000);
    if (json.exp && now > json.exp) return null;
    return json;
  } catch (e) {
    return null;
  }
}

// PUBLIC_INTERFACE
function authRequired(req, res, next) {
  /** Express middleware to require Authorization: Bearer token. */
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.user = { id: payload.sub, username: payload.username };
  return next();
}

module.exports = {
  signToken,
  verifyToken,
  authRequired,
};
