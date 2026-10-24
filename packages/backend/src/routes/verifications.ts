import type { FastifyPluginAsync } from 'fastify';
import { reclaim } from '../reclaim.js';
import * as store from '../verifications/store.js';
import { waitForChange } from '../verifications/waiters.js';
import { createBody, getQuerystring } from './schemas.js';

export const verificationRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: { providerId: string } }>('/verifications', { schema: { body: createBody } }, async (req, reply) => {
    const { providerId } = req.body;
    try {
      const session = await reclaim.sessions.create({ providers: [{ providerId }], context: {} });
      return reply.code(201).send(store.create(providerId, session));
    } catch (err) {
      req.log.error({ err }, 'Builder rejected the session');
      return reply.code(502).send({ code: 'SESSION_CREATE_FAILED' });
    }
  });

  // With ?wait=N (seconds), holds the request until the record changes or N seconds pass.
  app.get<{ Params: { id: string }; Querystring: { wait?: number } }>(
    '/verifications/:id',
    { schema: { querystring: getQuerystring } },
    async (req, reply) => {
      const v = store.get(req.params.id);
      if (!v) return reply.code(404).send({ code: 'NOT_FOUND' });
      const wait = req.query.wait ?? 0;
      if (v.status === 'pending' && wait > 0) await waitForChange(v.id, wait * 1000);
      if (v.status === 'pending') {
        // The callback reports success only. Cancelled and expired sessions never deliver a result, so ask Builder.
        const { status } = await reclaim.sessions.get(v.id);
        // Success comes only from the verified callback, never from this read.
        if (status !== 'pending' && status !== 'success') store.update(v, { status, error: { code: status } });
      }
      return v;
    },
  );
};
