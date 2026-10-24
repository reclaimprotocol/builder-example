import type { Verification } from '../../api/types';
import { esc } from '../../lib/html';
import { providerName } from '../../state/providers';
import { heading } from './heading';
import { steps } from './steps';

// Keyed by status, except that an `error` status uses its error code when there's copy for it.
const COPY: Record<string, string> = {
  rejected: 'The provider rejected the verification. Check that you signed in to the right account, then try again.',
  cancelled: "You cancelled the verification. Start it again when you're ready.",
  expired: 'The verification session expired before you finished. Start a new one.',
  error: 'Something went wrong while verifying. Try again.',
  NETWORK_ERROR: "Can't reach the server. Check that the backend is running, then try again.",
  SESSION_CREATE_FAILED: "Couldn't start the verification. Check the backend logs, then try again.",
};

// `v` is missing when the failure happens before a verification exists. "Try again" then reuses the form's provider.
export const renderFailure = (status: Verification['status'], code: string, v?: Verification) => `
  ${heading(v ? providerName(v.providerId) : 'Something went wrong', status)}
  <div class="vstack">
    ${v ? steps(status) : ''}
    <div role="alert" data-variant="error">
      <div class="vstack">
        <span>${COPY[status === 'error' ? code : status] ?? COPY.error}</span>
        <small class="text-light">Error code: ${esc(code)}</small>
      </div>
    </div>
    <footer class="hstack">
      <button data-action="retry"${v ? ` data-provider-id="${esc(v.providerId)}"` : ''}>Try again</button>
      <button class="outline" data-action="reset">Dismiss</button>
    </footer>
  </div>`;
