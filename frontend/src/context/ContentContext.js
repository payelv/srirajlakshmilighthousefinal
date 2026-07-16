import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { DEFAULT_CONTENT } from '../mock';
import { contentApi } from '../api';

const ContentContext = createContext(null);
const CACHE_KEY = 'srl-content-cache-v2';
const THEME_KEY = 'srl-theme';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return { ...DEFAULT_CONTENT, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('[ContentContext] Failed to parse cached content:', err);
  }
  return DEFAULT_CONTENT;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(readCache);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentApi.get();
      const merged = { ...DEFAULT_CONTENT, ...data };
      setContent(merged);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (cacheErr) {
        console.warn('[ContentContext] Cache write failed:', cacheErr);
      }
    } catch (e) {
      console.warn('[ContentContext] content fetch failed:', e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateContent = useCallback(async (patch) => {
    // optimistic local update
    let nextLocal;
    setContent((prev) => {
      nextLocal = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(nextLocal));
      } catch (cacheErr) {
        console.warn('[ContentContext] Cache write failed:', cacheErr);
      }
      return nextLocal;
    });
    try {
      const body = typeof patch === 'function' ? nextLocal : patch;
      const saved = await contentApi.update(body);
      const merged = { ...DEFAULT_CONTENT, ...saved };
      setContent(merged);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
      } catch (cacheErr) {
        console.warn('[ContentContext] Cache write failed:', cacheErr);
      }
      return { ok: true };
    } catch (e) {
      console.error('[ContentContext] Save failed:', e);
      return { ok: false, error: e?.response?.data?.detail || e.message };
    }
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  const value = useMemo(
    () => ({ content, updateContent, refresh, loading, theme, toggleTheme }),
    [content, updateContent, refresh, loading, theme, toggleTheme]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
