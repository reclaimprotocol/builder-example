import type { Verification } from '../../api/types';
import { esc } from '../../lib/html';
import { providerName } from '../../state/providers';
import { heading } from './heading';
import { steps } from './steps';

export const secondsPending = (v: Verification) => Math.round((Date.now() - Date.parse(v.createdAt)) / 1000);

// The elapsed time is hidden from assistive technology because a value that changes every second would be noisy.
// The ticker in `index.ts` shows the hint after 30 seconds.
export const renderRunning = (v: Verification) => `
  ${heading(providerName(v.providerId), v.status)}
  <div class="vstack">
    ${steps(v.status)}
    <div>
      <p>Finish verifying in the new tab.</p>
      <p class="text-light">This page updates when you're done.</p>
    </div>
    <div class="hstack">
      <a class="button" href="${esc(v.verificationUrl)}" target="_blank" rel="noopener">Open verification page</a>
      <button class="outline" data-action="reset">Cancel</button>
    </div>
    <progress aria-label="Verification in progress"></progress>
    <div class="hstack justify-between">
      <small class="text-light" id="hint" hidden>Still waiting? If you closed the tab, open it again, or cancel and start over.</small>
      <small class="text-light" id="elapsed" aria-hidden="true">${secondsPending(v)}s</small>
    </div>
    <small class="text-light">Verification ID: <code class="mono">${esc(v.id)}</code></small>
  </div>`;
