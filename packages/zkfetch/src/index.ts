// Proves the <title> of https://example.org with zkFetch in Builder mode,
// then verifies the proof with @reclaimprotocol/client.
import { hashProofClaimParams, verifyRequestProof } from '@reclaimprotocol/client';
import { ReclaimClient } from '@reclaimprotocol/zk-fetch';

const TARGET_URL = 'https://example.org/';
const TITLE_REGEX = '<title>(?<title>[^<]*)</title>';

const orgToken = process.env.RECLAIM_ORG_SECRET?.trim();
if (!orgToken) throw new Error('RECLAIM_ORG_SECRET is not set. Add it to packages/zkfetch/.env.');

// Builder mode: each zkFetch call asks Builder for an attestor authorization
// and draws one unit from the organization's ZKFETCH quota.
const client = new ReclaimClient({ orgToken });

const started = performance.now();
const proof = await client.zkFetch(
  TARGET_URL,
  { method: 'GET', headers: { accept: 'text/html' } },
  {
    responseMatches: [{ type: 'regex', value: TITLE_REGEX }],
    // Reveal only the title. The rest of the response stays hidden.
    responseRedactions: [{ regex: TITLE_REGEX }],
  },
);
if (!proof) throw new Error('zkFetch returned no proof.');
console.log(`Proved in ${((performance.now() - started) / 1000).toFixed(1)}s`);

// A verifier must check that the proof is for the request it expects. zkFetch
// has no provider, so hash the request: URL, method, body, response matches,
// and redactions. Headers aren't part of the hash.
const hashes = hashProofClaimParams({
  url: TARGET_URL,
  method: 'GET',
  responseMatches: [{ type: 'regex', value: TITLE_REGEX }],
  responseRedactions: [{ regex: TITLE_REGEX }],
});

// Trusts the attestors that Builder publishes in its JWKS.
const result = await verifyRequestProof(proof, { hashes: [{ value: hashes }] });
if (!result.valid) {
  console.error('Proof not verified:', result.reason);
  process.exit(1);
}

console.log('Verified title:', result.data?.[0]?.extractedParameters.title);
// zkFetch keeps its attestor connection open, which keeps Node running.
process.exit(0);
