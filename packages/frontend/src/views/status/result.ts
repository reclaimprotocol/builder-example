import type { Verification } from '../../api/types';
import { esc } from '../../lib/html';
import { providerName } from '../../state/providers';
import { heading } from './heading';
import { steps } from './steps';

export const renderResult = (v: Verification) => `
  ${heading(providerName(v.providerId), v.status)}
  <div class="vstack">
    ${steps(v.status)}
    <div role="alert" data-variant="success">Verification succeeded.</div>
    <dl class="kv">
      ${(v.fields ?? []).map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join('')}
    </dl>
  </div>`;
