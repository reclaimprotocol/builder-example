import type { Verification } from '../api/types';

const items = new Map<string, Verification>();

/** Saves the latest state of a verification. Updating an existing one keeps its position. */
export const track = (v: Verification) => void items.set(v.id, v);

/** Returns the verifications, newest first. */
export const list = () => [...items.values()].reverse();

export const get = (id: string) => items.get(id);
