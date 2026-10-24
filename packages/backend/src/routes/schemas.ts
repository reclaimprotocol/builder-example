import { config } from '../config.js';

export const createBody = {
  type: 'object',
  required: ['providerId'],
  properties: { providerId: { type: 'string', enum: config.providers.map((p) => p.id) } },
} as const;

// The 30-second cap keeps a held request under typical proxy and browser timeouts.
export const getQuerystring = {
  type: 'object',
  properties: { wait: { type: 'integer', minimum: 0, maximum: 30 } },
} as const;
