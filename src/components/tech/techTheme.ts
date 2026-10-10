
import { useEffect, useState } from 'react';

export type TechTheme = 'dark' | 'light';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'sti_theme_preference';
const THEME_EVENT = 'sti-theme-change';

function readTheme(): TechTheme {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Usa o tema padrão se o armazenamento não estiver disponível.
  }

  return 'dark';
}

function applyTheme(theme: TechTheme) {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');

  try {
    document.body.dataset.theme = theme;
    document.body.style.backgroundColor =
      theme === 'dark' ? '#070e17' : '#f8fafc';
    document.body.style.color =
      theme === 'dark' ? '#f1f5f9' : '#0f172a';
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // O tema continua funcionando mesmo se não puder ser salvo.
  }
}

let currentTheme: TechTheme =
  typeof document !== 'undefined' ? readTheme() : 'dark';

const listeners = new Set<(theme: TechTheme) => void>();

function setGlobalTheme(theme: TechTheme) {
  currentTheme = theme;
  applyTheme(theme);
  listeners.forEach((listener) => listener(theme));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<TechTheme>(THEME_EVENT, { detail: theme }),
    );
  }
}

export function useTechTheme() {
  const [theme, setTheme] = useState<TechTheme>(currentTheme);

  useEffect(() => {
    const update = (nextTheme: TechTheme) => setTheme(nextTheme);

    listeners.add(update);

    const handleThemeEvent = (event: Event) => {
      const nextTheme = (event as CustomEvent<TechTheme>).detail;
      if (nextTheme === 'dark' || nextTheme === 'light') {
        currentTheme = nextTheme;
        setTheme(nextTheme);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        const nextTheme = event.newValue;
        if (nextTheme === 'dark' || nextTheme === 'light') {
          currentTheme = nextTheme;
          applyTheme(nextTheme);
          setTheme(nextTheme);
        }
      }
    };

    window.addEventListener(THEME_EVENT, handleThemeEvent);
    window.addEventListener('storage', handleStorage);

    applyTheme(currentTheme);

    return () => {
      listeners.delete(update);
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateTheme = (nextTheme: TechTheme) => {
    setGlobalTheme(nextTheme);
  };

  const toggleTheme = () => {
    setGlobalTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    isDark: theme === 'dark',
    updateTheme,
    toggleTheme,
  };
}