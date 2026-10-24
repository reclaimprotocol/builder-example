import type { Verification } from '../api/types';
import { $ } from '../lib/dom';
import { esc } from '../lib/html';
import { badge } from './badge';

/** Renders the Recent table body. Each provider name is a button that opens that verification. */
export function renderHistory(items: Verification[], name: (id: string) => string, currentId?: string) {
  // Keep the empty-state row from index.html until there's something to show.
  if (!items.length) return;
  $('#history').innerHTML = items
    .map(
      (v) => `
      <tr${v.id === currentId ? ' aria-current="true"' : ''}>
        <td><button type="button" class="ghost small" data-id="${esc(v.id)}">${esc(name(v.providerId))}</button></td>
        <td>${badge(v.status)}</td>
        <td class="text-light">${new Date(v.createdAt).toLocaleTimeString()}</td>
      </tr>`,
    )
    .join('');
}
