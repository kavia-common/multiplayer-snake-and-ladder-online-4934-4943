'use strict';

/**
 * User model schema and helpers.
 * CommonJS exports as the backend uses sourceType 'commonjs'.
 */

/**
 * Shape of a User:
 * {
 *   id: string,
 *   username: string,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO),
 * }
 */

// PUBLIC_INTERFACE
function createUser({ id, username, createdAt, updatedAt }) {
  /** Create a User object ensuring required fields and timestamps. */
  const now = new Date().toISOString();
  if (!username || typeof username !== 'string') {
    throw new Error('username is required');
  }
  return {
    id: id || '',
    username,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now,
  };
}

module.exports = {
  createUser,
};
