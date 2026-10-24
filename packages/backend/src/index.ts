import Fastify from 'fastify';
import { callbackRoutes } from './routes/callback.js';
import { providerRoutes } from './routes/providers.js';
import { verificationRoutes } from './routes/verifications.js';

const app = Fastify({ logger: true });
await app.register(providerRoutes, { prefix: '/api' });
await app.register(verificationRoutes, { prefix: '/api' });
await app.register(callbackRoutes);

app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
