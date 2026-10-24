import { $ } from '../lib/dom';

const button = $<HTMLButtonElement>('#submit');

/** Disables the button right away, so a second click can't start a duplicate while the request is in flight. */
export const lockSubmit = () => void (button.disabled = true);

/** Shows the busy label while a verification runs, and the idle label otherwise. */
export function renderSubmit(running: boolean) {
  button.disabled = running;
  button.ariaBusy = String(running);
  button.textContent = running ? 'Verifying…' : 'Start verification';
}
