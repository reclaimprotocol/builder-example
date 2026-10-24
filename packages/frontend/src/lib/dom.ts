/** Finds an element that `index.html` always contains, so a missing one fails fast. */
export const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
