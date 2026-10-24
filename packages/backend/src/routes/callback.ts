import { ResultVerificationError, type CallbackBody, type DeliveryEnvelope } from '@reclaimprotocol/client';
import type { FastifyPluginAsync } from 'fastify';
import { reclaim } from '../reclaim.js';
import * as store from '../verifications/store.js';

export const callbackRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: DeliveryEnvelope }>('/reclaim/callback', async (req, reply) => {
    // The expected session comes from the store, so a forged envelope can't pick its own session.
    const v = req.body?.sessionId && store.get(req.body.sessionId);
    if (!v) return reply.send();

    try {
      const delivery = await reclaim.results.receive(req.body as CallbackBody, { reclaimSessionId: v.id });
      if (delivery.kind === 'result') {
        const { payload, proofs = [] } = delivery.result;
        const { status } = payload.verification_session as { status: store.Verification['status'] };
        const fields = proofs
          .filter((p) => p.proofValid)
          .flatMap((p) => Object.entries(p.data?.extractedParameters ?? {}))
          .map(([label, value]) => ({ label, value }));
        store.update(v, status === 'success' ? { status, fields } : { status, error: { code: status } });
      }
      return reply.send();
    } catch (err) {
      if (!(err instanceof ResultVerificationError)) throw err;
      req.log.error({ reason: err.reason, proofs: err.outcome.proofs?.map((p) => p.reason) }, 'Result failed verification');
      if (err.retryable) return reply.code(503).send();
      store.update(v, { status: 'error', error: { code: err.reason } });
      return reply.send();
    }
  });
};
