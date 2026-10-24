import { loadProviders } from '../state/providers';
import { esc } from '../lib/html';

/** Fills the provider select, or tells you to reload if the providers can't load. */
export function initProviders(select: HTMLSelectElement) {
  loadProviders()
    .then((list) => (select.innerHTML = list.map((p) => `<option value="${esc(p.id)}">${esc(p.name)}</option>`).join('')))
    .catch(() => (select.innerHTML = '<option value="">Can\'t load providers. Reload the page.</option>'));
}
