import { announce } from './announcer';
import { focusOutcome, renderStatus, type View } from './status';
import { renderSubmit } from './submit-button';

/**
 * Renders `view` and syncs the submit button and screen reader announcement with it.
 *
 * Focus moves only on terminal states, so intermediate updates don't interrupt you.
 */
export function show(view: View) {
  const running = view.kind === 'verification' && view.v.status === 'pending';
  renderSubmit(running);
  renderStatus(view);
  announce(running ? view.v : undefined);
  if (view.kind !== 'idle' && !running) focusOutcome();
}
