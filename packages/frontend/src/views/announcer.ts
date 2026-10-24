import type { Verification } from '../api/types';
import { $ } from '../lib/dom';

const el = $('#announcer');

let announced = '';

/**
 * Announces a running verification to screen readers. Pass nothing when none is running.
 *
 * Terminal states announce themselves through their own `role="alert"` blocks. This de-duplicates on verification
 * id, not text, so that switching from one running verification to another announces again.
 */
export function announce(running?: Verification) {
  const key = running?.id ?? '';
  if (key === announced) return;
  announced = key;
  // Screen readers ignore a live region whose text doesn't change, so clear it first and set the text a moment later.
  el.textContent = '';
  if (key) setTimeout(() => announced === key && (el.textContent = 'Verification started. Finish it in the new tab.'), 50);
}
