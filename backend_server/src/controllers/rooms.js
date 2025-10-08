'use strict';

const roomsService = require('../services/rooms');

class RoomsController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** GET /api/rooms - List rooms */
    return res.status(200).json({ rooms: roomsService.listRooms() });
  }

  // PUBLIC_INTERFACE
  create(req, res) {
    /** POST /api/rooms - Create room (auth required) */
    const userId = req.user.id;
    const { name } = req.body || {};
    const room = roomsService.createRoom({ name, ownerId: userId });
    return res.status(201).json(room);
  }

  // PUBLIC_INTERFACE
  join(req, res) {
    /** POST /api/rooms/:id/join - Join room */
    const userId = req.user.id;
    const { id } = req.params;
    const room = roomsService.joinRoom(id, userId);
    return res.status(200).json(room);
  }

  // PUBLIC_INTERFACE
  leave(req, res) {
    /** POST /api/rooms/:id/leave - Leave room */
    const userId = req.user.id;
    const { id } = req.params;
    const room = roomsService.leaveRoom(id, userId);
    return res.status(200).json(room);
  }
}

module.exports = new RoomsController();
