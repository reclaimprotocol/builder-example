# zkFetch

A script that proves the `<title>` of <https://example.org> with [zkFetch](https://github.com/reclaimprotocol/zk-fetch) in Builder mode, then verifies the proof with `@reclaimprotocol/client`. Use zkFetch when your server fetches the data itself, for example from an API with your own key. No user and no provider are involved.

## Before you begin

Copy `example.env` to `.env` and set `RECLAIM_ORG_SECRET` to your organization key. Each zkFetch call draws one unit from your organization's `ZKFETCH` quota. When the quota runs out, `zkFetch` rejects with `BuilderQuotaExceededError`.

## Run it

From the repository root:

```sh
npm install
npm run zkfetch
```

The script prints the time the proof took and the verified title. A proof takes a few seconds.

## How it works

1. `new ReclaimClient({ orgToken })` creates a Builder-mode client. Before each call, the client asks Builder for an attestor authorization.
2. `client.zkFetch(url, options, secretOptions)` fetches the URL through a Reclaim attestor and returns an attestor-signed proof of the response. `responseMatches` is what the response must contain, and `responseRedactions` is the part that the proof reveals. Put API keys and cookies in `secretOptions`, never in `options`. They aren't revealed.
3. `hashProofClaimParams` hashes the request that you expect. `verifyRequestProof` checks the attestor signatures against the attestors that Builder publishes in its JWKS, and checks that the proof matches the hash. `result.data[0].extractedParameters` holds the named regex groups.

To verify a proof somewhere else, such as on another server, send the proof there and run step 3 with the same URL, method, matches, and redactions.
