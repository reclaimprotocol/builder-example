# Backend

A Fastify (v5) API that creates Reclaim verification sessions and receives their results. It keeps state in memory and runs TypeScript directly with `tsx`.

For endpoints, status codes, and object shapes, see the [API reference](../../README.md#api-reference) in the root README.

## Before you begin

1. Copy `example.env` to `.env` and set `RECLAIM_ORG_SECRET` to your organization key. The server doesn't start without it.
2. Set up callback delivery. Builder creates sessions only when your organization has a callback subscription.
   - For local development, forward Builder callbacks to `http://localhost:3000/reclaim/callback` with the Reclaim MCP `proxy_callback_events` tool.
   - In production, register a callback subscription for your public `/reclaim/callback` URL. Subscribe to all five session-ending events: `verification_success`, `verification_rejected`, `verification_error`, `verification_cancelled`, and `session_expired`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the server and restarts it when files change. |
| `npm start` | Starts the server. |
| `npm run typecheck` | Checks types with `tsc`. |

Both start scripts load `.env`. The server listens on port 3000. To change the port, set `PORT`.

## File layout

| File | Description |
| --- | --- |
| `config.json` | Lists the providers that clients can verify. |
| `src/index.ts` | Creates the app, registers the routes, and starts listening. |
| `src/config.ts` | Loads `config.json`. |
| `src/reclaim.ts` | Creates the Reclaim client from `RECLAIM_ORG_SECRET`. |
| `src/routes/providers.ts` | Defines `GET /api/providers`. |
| `src/routes/verifications.ts` | Defines the verification routes. |
| `src/routes/callback.ts` | Defines `POST /reclaim/callback`, which verifies and stores results. |
| `src/routes/schemas.ts` | Defines the JSON schemas that validate the request body and query string. |
| `src/verifications/store.ts` | Creates, gets, and updates verifications in memory. |
| `src/verifications/waiters.ts` | Holds long-poll requests until a verification changes or the wait ends. |
