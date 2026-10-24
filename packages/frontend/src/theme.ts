type Theme = 'system' | 'light' | 'dark';

const isTheme = (t: unknown): t is Theme => t === 'system' || t === 'light' || t === 'dark';

// Oat colors use light-dark(), so color-scheme switches the theme. An empty value follows the OS.
function apply(t: Theme) {
  document.documentElement.style.colorScheme = t === 'system' ? '' : t;
}

/** Applies the saved theme preference and saves changes made through `select`. */
export function initTheme(select: HTMLSelectElement) {
  let saved: unknown;
  try {
    saved = localStorage.getItem('theme');
  } catch {}
  const theme = isTheme(saved) ? saved : 'system';
  select.value = theme;
  apply(theme);

  select.addEventListener('change', () => {
    const t = isTheme(select.value) ? select.value : 'system';
    apply(t);
    try {
      localStorage.setItem('theme', t);
    } catch {}
  });
}
