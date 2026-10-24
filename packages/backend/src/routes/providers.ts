import type { FastifyPluginAsync } from 'fastify';
import { config } from '../config.js';

export const providerRoutes: FastifyPluginAsync = async (app) => {
  app.get('/providers', async () => config.providers);
};
