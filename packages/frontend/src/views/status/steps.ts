import type { Verification } from '../../api/types';

// Index of the step in play; everything before it is done.
const REACHED: Partial<Record<Verification['status'], number>> = { pending: 1, success: 3 };

/** Renders the three progress badges. Color is paired with the numbered label, so it's never the only signal. */
export function steps(status: Verification['status']) {
  const reached = REACHED[status] ?? 2;
  const labels = ['Created', 'Verify in new tab', reached === 2 ? 'Failed' : 'Verified'];
  return `<ol class="steps">${labels
    .map((label, i) => {
      const variant = i < reached ? 'success' : i === reached ? (status === 'pending' ? 'warning' : 'danger') : '';
      return `<li><span class="badge ${variant ? '' : 'outline'}" ${variant ? `data-variant="${variant}"` : ''}>${i + 1}. ${label}</span></li>`;
    })
    .join('')}</ol>`;
}
