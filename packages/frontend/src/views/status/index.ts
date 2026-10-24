import type { Verification } from '../../api/types';
import { $ } from '../../lib/dom';
import { renderFailure } from './error';
import { renderResult } from './result';
import { renderRunning, secondsPending } from './running';

export type View =
  | { kind: 'idle' }
  | { kind: 'verification'; v: Verification }
  | { kind: 'error'; code: string; v?: Verification };

const renderIdle = () => `
  <div class="empty vstack items-center">
    <h4 id="status-heading" tabindex="-1">No verification running</h4>
    <p class="text-light">Start a verification to follow its progress here.</p>
  </div>`;

const el = $('#status');
let ticker: number | undefined;

// Any status without an entry here is a failure.
const RENDERERS: Partial<Record<Verification['status'], (v: Verification) => string>> = {
  pending: renderRunning,
  success: renderResult,
};

function body(view: View) {
  switch (view.kind) {
    case 'idle':
      return renderIdle();
    case 'verification': {
      const { v } = view;
      return (RENDERERS[v.status] ?? (() => renderFailure(v.status, v.error?.code ?? v.status, v)))(v);
    }
    case 'error':
      return renderFailure('error', view.code, view.v);
  }
}

/** Renders `view` into the status card and keeps the elapsed time ticking while a verification runs. */
export function renderStatus(view: View) {
  clearInterval(ticker);
  el.innerHTML = body(view);
  if (view.kind === 'verification' && view.v.status === 'pending') {
    const { v } = view;
    // Update the text in place, because re-rendering every second would restart the progress animation.
    ticker = window.setInterval(() => {
      const s = secondsPending(v);
      $('#elapsed').textContent = `${s}s`;
      $('#hint').hidden = s < 30;
    }, 1000);
  }
}

/** Moves focus to the card heading and scrolls the card into view. Call this only for terminal states. */
export function focusOutcome() {
  document.getElementById('status-heading')?.focus({ preventScroll: true });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { top, bottom } = el.getBoundingClientRect();
  // 'nearest' leaves a tall card mostly below the fold on phones, so align its top instead.
  if (top < 0 || bottom > innerHeight) el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
}
