import { api } from '../api/client';
import type { Verification } from '../api/types';
import * as history from '../state/history';
import { providerName } from '../state/providers';
import { renderHistory } from '../views/history-table';
import { show } from '../views/show';
import { lockSubmit } from '../views/submit-button';

let controller: AbortController | undefined;
let currentId: string | undefined;

export const getCurrentId = () => currentId;

function refreshHistory() {
  renderHistory(history.list(), providerName, currentId);
}

function render(v: Verification) {
  history.track(v);
  refreshHistory();
  show({ kind: 'verification', v });
}

/** Shows a failure code. `v` is missing when the failure happens before a verification exists. */
function fail(code: string, v?: Verification) {
  show({ kind: 'error', code, v });
}

/** Long-polls until the verification leaves `pending`, then shows the outcome. */
export async function watch(id: string) {
  // Abort the previous watch so a slow response for it can't overwrite this one.
  controller?.abort();
  const { signal } = (controller = new AbortController());
  currentId = id;
  refreshHistory();

  try {
    let v = await api.get(id, 0, signal);
    render(v);
    while (v.status === 'pending') {
      v = await api.get(id, 20, signal);
      // Skip pending updates, because re-rendering would restart the progress animation.
      if (v.status !== 'pending') render(v);
    }
  } catch (e) {
    if (!signal.aborted) fail((e as Error).message, history.get(id));
  }
}

/** Starts a verification and watches it. Retry passes `providerId` so it reuses the provider that failed. */
export async function start(form: HTMLFormElement, providerId?: string) {
  lockSubmit();
  try {
    const v = await api.start(providerId ?? String(new FormData(form).get('providerId')));
    history.track(v);
    await watch(v.id);
  } catch (e) {
    fail((e as Error).message);
  }
}

/** Dismisses the current verification and returns the status card to idle. */
export function reset() {
  controller?.abort();
  currentId = undefined;
  refreshHistory();
  show({ kind: 'idle' });
}
