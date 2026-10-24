import '@knadh/oat/oat.min.css';
import '@knadh/oat/oat.min.js';
import './style.css';
import { initProviders } from './flows/providers';
import { getCurrentId, reset, start, watch } from './flows/verification';
import { $ } from './lib/dom';
import { initTheme } from './theme';
import { show } from './views/show';

const form = $<HTMLFormElement>('#start');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  start(form);
});

$('#status').addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
  const action = btn?.dataset.action;
  if (action === 'retry') start(form, btn!.dataset.providerId);
  if (action === 'reset') reset();
});

$('#history').addEventListener('click', (e) => {
  const id = (e.target as HTMLElement).closest<HTMLElement>('button[data-id]')?.dataset.id;
  if (id && id !== getCurrentId()) watch(id);
});

initTheme($<HTMLSelectElement>('#theme'));
show({ kind: 'idle' });
initProviders($<HTMLSelectElement>('#provider'));
