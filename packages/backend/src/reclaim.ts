import { ReclaimVerification } from '@reclaimprotocol/client';

const orgSecret = process.env.RECLAIM_ORG_SECRET;
if (!orgSecret) throw new Error('RECLAIM_ORG_SECRET is not set. Add it to packages/backend/.env.');

export const reclaim = ReclaimVerification.create({ orgSecret });
