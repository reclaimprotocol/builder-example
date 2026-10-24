import type { Verification } from '../../api/types';
import { esc } from '../../lib/html';
import { badge } from '../badge';

/** The card heading. Its id lets `focusOutcome()` move focus here, and `tabindex="-1"` makes that possible. */
export const heading = (text: string, status?: Verification['status']) => `
  <header class="hstack justify-between">
    <h4 id="status-heading" tabindex="-1">${esc(text)}</h4>${status ? badge(status) : ''}
  </header>`;
