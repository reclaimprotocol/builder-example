# Builder example

This example app runs real [Reclaim](https://reclaimprotocol.org) verifications. A Fastify backend creates sessions with `@reclaimprotocol/client` and verifies the results that Builder delivers, and a Vite and [Oat](https://oat.ink) frontend starts verifications and shows the outcome.

A verification starts as `pending` and ends as `success`, `rejected`, `error`, `cancelled`, or `expired`.

## Before you begin

- Node.js 22 or later. To check your version, run `node -v`.
- npm, which is included with Node.js.
- A Reclaim organization key. Copy `packages/backend/example.env` to `packages/backend/.env` and set `RECLAIM_ORG_SECRET`.
- Callback delivery to the backend. For local development, use the Reclaim MCP `proxy_callback_events` tool to forward callbacks to `http://localhost:3000/reclaim/callback`. For more information, see the [backend README](packages/backend/README.md#before-you-begin).

## Run the app

1. Install the dependencies from the repository root:

   ```sh
   npm install
   ```

2. Start the backend and the frontend:

   ```sh
   npm run dev
   ```

3. Open <http://localhost:5173>.

The backend listens on port 3000. To use a different port, set the `PORT` environment variable.

## Project structure

```text
packages/
  backend/    Fastify API, in-memory store, and Reclaim client
  frontend/   Vite and Oat UI
```

The frontend runs at <http://localhost:5173> and proxies `/api` requests to port 3000. For backend details, see [`packages/backend/README.md`](packages/backend/README.md).

## Configuration

The backend reads `packages/backend/config.json` at startup. Restart the backend after you edit the file.

| Field | Type | Description |
| --- | --- | --- |
| `providers[].id` | string | Reclaim provider ID. Clients send this value as `providerId`. |
| `providers[].name` | string | Display name. |

## API reference

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/providers` | Lists providers as `{ id, name }`. |
| `POST` | `/api/verifications` | Starts a verification. |
| `GET` | `/api/verifications/:id` | Returns a verification, including its result or error. |
| `POST` | `/reclaim/callback` | Receives result deliveries from Builder. Clients don't call it. |

#### Start a verification

The request body has one field, `providerId`. It's required and must be one of the provider IDs from `/api/providers`. Open `verificationUrl` from the response to let the user complete the verification.

#### Get a verification

To wait for a change, add the `wait` query parameter, for example `/api/verifications/:id?wait=20`. `wait` is an integer from 0 to 30 seconds. While the status is `pending`, the request returns when the verification changes or when the time passes, whichever happens first.

#### Receive a callback

Builder posts a delivery. The backend looks up the session in memory, then verifies the result with `reclaim.results.receive`. Progress events change nothing. A verified result sets `status` and, on success, `fields`. The route returns `200` for unknown sessions and for results that fail verification, and `503` when a temporary condition caused the failure so that Builder retries.

### Status codes

| Endpoint | Code | Meaning |
| --- | --- | --- |
| `POST /api/verifications` | `201` | The verification started. |
| `POST /api/verifications` | `400` | The body or `providerId` is invalid. |
| `POST /api/verifications` | `502` | Builder rejected the session. The code is `SESSION_CREATE_FAILED`. |
| `GET /api/verifications/:id` | `200` | Returns the verification. |
| `GET /api/verifications/:id` | `400` | `wait` is not an integer from 0 to 30. |
| `GET /api/verifications/:id` | `404` | The verification doesn't exist. The code is `NOT_FOUND`. |
| `POST /reclaim/callback` | `200` | The delivery was handled or ignored. |
| `POST /reclaim/callback` | `503` | A temporary condition blocked verification. Builder retries. |

### Objects

`Verification`:

```json
{
  "id": "Reclaim session ID",
  "providerId": "string",
  "status": "pending | success | rejected | error | cancelled | expired",
  "verificationUrl": "string",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp",
  "fields": [{ "label": "string", "value": "string" }],
  "error": { "code": "string" }
}
```

`fields` appears only when `status` is `success`. `error` appears for every other final status.

### Error codes

| Code | Returned with | Description |
| --- | --- | --- |
| `NOT_FOUND` | `404` | The verification doesn't exist. |
| `SESSION_CREATE_FAILED` | `502` | Builder rejected the session. For example, the organization has no callback subscription. The backend logs the reason. |

`error.code` on a `Verification` is the final status (`rejected`, `error`, `cancelled`, or `expired`), or a verification failure reason such as `bad-signature` or `invalid-proof` when the status is `error`.
