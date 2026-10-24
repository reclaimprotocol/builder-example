import { api } from '../api/client';
import type { Provider } from '../api/types';

const names = new Map<string, string>();

/** Fetches the providers and remembers their names for display. */
export async function loadProviders(): Promise<Provider[]> {
  const list = await api.providers();
  list.forEach((p) => names.set(p.id, p.name));
  return list;
}

/** Returns the provider's name, or its id while the name is unknown. */
export const providerName = (id: string) => names.get(id) ?? id;
