import type { reclaim } from '../reclaim.js';
import { notify } from './waiters.js';

type Session = Awaited<ReturnType<typeof reclaim.sessions.create>>;

export interface Verification {
  id: string;
  providerId: string;
  status: Session['status'];
  verificationUrl: string;
  createdAt: string;
  updatedAt: string;
  fields?: { label: string; value: string }[];
  error?: { code: string };
}

const verifications = new Map<string, Verification>();

/** Stores a verification for a new Reclaim session. */
export function create(providerId: string, session: Session): Verification {
  const now = new Date().toISOString();
  const { id, status, verificationUrl } = session;
  const v = { id, providerId, status, verificationUrl, createdAt: now, updatedAt: now };
  verifications.set(id, v);
  return v;
}

export const get = (id: string) => verifications.get(id);

/** Applies `patch`, bumps `updatedAt`, and wakes pending long polls. */
export function update(v: Verification, patch: Partial<Verification>) {
  Object.assign(v, patch, { updatedAt: new Date().toISOString() });
  notify(v.id);
}
