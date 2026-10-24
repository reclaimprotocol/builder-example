# Frontend

A Vite and vanilla TypeScript demo that starts a verification, follows its progress, and shows the result. It uses the [Oat](https://oat.ink) UI library and talks to the backend through `/api`.

## Scripts

Run these from the repository root with `-w packages/frontend`, or from this directory.

- `npm run dev` starts the Vite dev server and proxies `/api` to the backend.
- `npm run build` type-checks the code and builds to `dist/`.
- `npm run preview` serves the production build locally.

## Configuration

The dev server proxies `/api` requests to `http://localhost:3000`. To use a different backend, set `API_URL`:

```bash
API_URL=http://localhost:4000 npm run dev
```

The proxy applies to `npm run dev` only. In production, serve the frontend and the API from the same origin.

## How it works

1. You choose a provider and select **Start verification**. The page creates a verification with `POST /api/verifications`.
2. The page long-polls `GET /api/verifications/:id?wait=20` until the status leaves `pending`.
3. While the status is `pending`, the status card shows an **Open verification page** link that opens in a new tab, a **Cancel** button, and the elapsed time. After about 30 seconds, it suggests that you reopen the tab or start over.
4. On `success`, the card lists the verified fields. On any other terminal status, it explains what happened and offers **Try again**, which reuses the same provider, and **Dismiss**.

The backend returns only an error code. The frontend owns the user-facing copy, which it keys by status, and by error code when the status is `error`.

## File layout

Root files:

- `index.html` is the page markup: header, start form, status card, and Recent table.
- `vite.config.ts` configures the dev proxy.

In `src/`:

- `main.ts` imports the styles, wires the event listeners, and starts loading providers.
- `theme.ts` applies and saves the theme preference.
- `style.css` adds small styles on top of Oat.

In `src/api/`:

- `types.ts` defines the shapes the backend returns.
- `client.ts` sends requests to `/api` and exposes one function per endpoint. A failed request throws an `Error` whose message is the failure code.

In `src/state/`:

- `providers.ts` loads the providers and looks up a provider name by ID.
- `history.ts` stores the verifications you've started, for the Recent table.

In `src/flows/`:

- `verification.ts` starts a verification, long-polls it, and cancels or dismisses it.
- `providers.ts` fills the provider select, or tells you to reload if loading fails.

In `src/views/`:

- `show.ts` renders a view and keeps the submit button, announcer, and focus in sync.
- `history-table.ts` renders the Recent table.
- `submit-button.ts` switches the submit button between busy and idle.
- `announcer.ts` announces that a verification started to screen readers.
- `badge.ts` renders status badges.

In `src/views/status/`:

- `index.ts` renders the idle state, picks the renderer for a view, ticks the elapsed time, and moves focus to the outcome.
- `running.ts`, `result.ts`, and `error.ts` render one state each.
- `heading.ts` renders the card heading that the states share.
- `steps.ts` renders the progress step badges.

In `src/lib/`:

- `html.ts` escapes text for HTML.
- `dom.ts` finds elements that `index.html` provides.
