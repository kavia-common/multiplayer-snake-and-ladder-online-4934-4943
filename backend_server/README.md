# Multiplayer Snake & Ladder — Backend (Express)

This is the backend for the multiplayer Snake & Ladder game. It exposes REST endpoints and a WebSocket endpoint for real-time play.

## Environment variables

Create a `.env` file (or copy from `.env.example` if present) at the project root of backend_server with at least:

- PORT
  - Default: 3001
- BACKEND_JWT_SECRET
  - Required secret used to sign/verify JWT tokens for auth
  - Example (development): `BACKEND_JWT_SECRET=dev-secret-change-me`
- CORS_ORIGIN
  - Origin allowed for browser requests
  - Example (development): `CORS_ORIGIN=http://localhost:3000`

Example `.env`:
```
PORT=3001
BACKEND_JWT_SECRET=dev-secret-change-me
CORS_ORIGIN=http://localhost:3000
```

## Run the backend (development)

- npm install
- npm run start (or equivalent script defined in package.json)
- The OpenAPI spec should be accessible at:
  - http://localhost:3001/openapi.json
  - API docs (if enabled) at http://localhost:3001/docs

## Interfaces

- REST base: http://localhost:3001
- WebSocket base: ws://localhost:3001
  - WS path: `/ws`
  - Client connects with query params: `?roomId=<id>&token=<jwt>`

Ensure your frontend `.env` is set to:
```
REACT_APP_API_BASE=http://localhost:3001
REACT_APP_WS_BASE=ws://localhost:3001
```

## CORS and WebSocket notes

- Allow origin http://localhost:3000 in CORS for local development.
- Keep BASE URLs without trailing slash to avoid malformed URLs.

## Manual test checklist (end-to-end)

1) Start backend on port 3001 with valid BACKEND_JWT_SECRET.
2) Start frontend on port 3000 configured with API/WS base to backend.
3) In frontend:
   - Sign in as guest.
   - Create a room and/or join a room.
   - Use chat to send messages.
   - Roll dice and observe turn changes.
   - Continue until a winner scenario (mock/local state) is reached.

If issues arise:
- Confirm JWT secret is set.
- Confirm CORS_ORIGIN matches the frontend URL.
- Check server logs for errors.
