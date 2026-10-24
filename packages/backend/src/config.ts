import { readFileSync } from 'node:fs';

export interface Config {
  providers: { id: string; name: string }[];
}

/** Settings from `config.json` in the package root. */
export const config: Config = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));
