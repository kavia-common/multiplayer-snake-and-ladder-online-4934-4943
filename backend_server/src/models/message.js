'use strict';

/**
 * Message model schema and helpers.
 *
 * Shape of a Message:
 * {
 *   id: string,
 *   roomId: string,
 *   userId: string,
 *   content: string,
 *   createdAt: string (ISO),
 * }
 */

// PUBLIC_INTERFACE
function createMessage({ id, roomId, userId, content, createdAt }) {
  /** Create a Message object ensuring required fields and defaults. */
  const now = new Date().toISOString();
  if (!roomId || typeof roomId !== 'string') {
    throw new Error('roomId is required');
  }
  if (!userId || typeof userId !== 'string') {
    throw new Error('userId is required');
  }
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('content is required');
  }

  return {
    id: id || '',
    roomId,
    userId,
    content: content.trim(),
    createdAt: createdAt || now,
  };
}

module.exports = {
  createMessage,
};
