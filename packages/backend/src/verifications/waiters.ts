// Keeping waiters apart from the store lets the store stay a plain data layer.
const waiters = new Map<string, Set<() => void>>();

/** Resolves on the next `notify(id)`, or after `timeoutMs`, whichever comes first. */
export function waitForChange(id: string, timeoutMs: number) {
  return new Promise<void>((resolve) => {
    const set = waiters.get(id) ?? new Set();
    waiters.set(id, set);
    const wake = () => {
      clearTimeout(timer);
      set.delete(wake);
      resolve();
    };
    const timer = setTimeout(wake, timeoutMs);
    set.add(wake);
  });
}

/** Wakes every request that waits on `id`. */
export function notify(id: string) {
  waiters.get(id)?.forEach((wake) => wake());
  waiters.delete(id);
}
