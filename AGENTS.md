# Working in this repository

This is the Reclaim example app: a Fastify backend (`packages/backend`) that creates verification sessions and receives results, and a Vite frontend (`packages/frontend`) that starts verifications and shows the outcome. Read the [root README](README.md) for the API and the [backend README](packages/backend/README.md) for setup.

## Run it

- Run `npm install`, then `npm run dev`, from the repository root. The backend listens on `PORT` from `packages/backend/.env` (default 3000). The frontend opens at <http://localhost:5173>, or at the next free port Vite prints.
- If the backend isn't on port 3000, start with `API_URL=http://localhost:<port> npm run dev` so the frontend's `/api` proxy reaches it.
- Run the dev server in the background with its output in a log file, for example `npm run dev > reclaim-dev.log 2>&1`. Read that file when a callback fails.
- Run `npm run typecheck` after every change.

## Rules

- Never print, log, or commit `packages/backend/.env` or `packages/backend/.env.backup`. They hold `RECLAIM_ORG_SECRET` and, when set, `RECLAIM_ORG_ETH_PRIVATE_KEY`. Use the Reclaim MCP tools (`issue_org_token`, `issue_org_keypair`) to write them.
- Providers come from `packages/backend/config.json`. The backend reads it at startup, so restart the backend after you edit it.
- The store is in memory. A restart drops verifications in progress, so start a new verification after any restart instead of retrying the old one.
- The callback (`src/routes/callback.ts`) must verify every result with `reclaim.results.receive` before it stores anything. Respond 503 only when `ResultVerificationError.retryable` is true; respond 2xx for everything else, including results that failed verification, so Builder doesn't retry what a retry can't fix.
- When the organization has a key pair (`get_org_keypair`), set `RECLAIM_ORG_ETH_PRIVATE_KEY` to its private key. The callback uses it to decrypt encrypted results (`canEncryptResult: true`) and to verify TEE-bound proofs. To turn encryption on or off, use `update_org_keypair`; to rotate the key, use `issue_org_keypair` with `replace: true`, which backs up the old key to `packages/backend/.env.backup`.
- For local callbacks, forward events with the Reclaim MCP `proxy_callback_events` tool, using the backend's port and the path `/reclaim/callback`. A deployed app needs a callback subscription for its public URL instead.

## Code style

- TypeScript, ES modules, two-space indentation, semicolons. Import local files with the `.js` extension.
- Keep the example small: no new dependencies or abstractions unless a feature needs them.
