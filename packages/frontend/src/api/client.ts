import type { Provider, Verification } from './types';

// A failed request throws an Error whose message is the failure code, because the UI owns the user-facing copy.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: init?.body ? { 'content-type': 'application/json' } : undefined,
  }).catch(() => {
    throw new Error('NETWORK_ERROR');
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.code ?? `HTTP_${res.status}`);
  return body as T;
}

export const api = {
  providers: () => request<Provider[]>('/providers'),
  start: (providerId: string) =>
    request<Verification>('/verifications', { method: 'POST', body: JSON.stringify({ providerId }) }),
  get: (id: string, waitS: number, signal?: AbortSignal) =>
    request<Verification>(`/verifications/${id}?wait=${waitS}`, { signal }),
};
