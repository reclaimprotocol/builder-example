import type { Verification } from '../api/types';

const BADGES: Record<Verification['status'], string> = {
  pending: '<span class="badge" data-variant="secondary">Pending</span>',
  success: '<span class="badge" data-variant="success">Verified</span>',
  rejected: '<span class="badge" data-variant="danger">Rejected</span>',
  error: '<span class="badge" data-variant="danger">Failed</span>',
  cancelled: '<span class="badge" data-variant="warning">Cancelled</span>',
  expired: '<span class="badge" data-variant="warning">Expired</span>',
};

/** Returns a status badge. The text carries the meaning, so color is never the only signal. */
export const badge = (status: Verification['status']) => BADGES[status];
