import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_CONTENT } from '../mock';
import { contentApi } from '../api';

const ContentContext = createContext(null);
const CACHE_KEY = 'srl-content-cache-v2';

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) return { ...DEFAULT_CONTENT, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_CONTENT;
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('srl-theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('srl-theme', theme);
  }, [theme]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentApi.get();
      const merged = { ...DEFAULT_CONTENT, ...data };
      setContent(merged);
      localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
    } catch (e) {
      // keep cached / default
      console.warn('content fetch failed', e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateContent = useCallback(
    async (patch) => {
      // optimistic local update
      const nextLocal = typeof patch === 'function' ? patch(content) : { ...content, ...patch };
      setContent(nextLocal);
      localStorage.setItem(CACHE_KEY, JSON.stringify(nextLocal));
      try {
        const saved = await contentApi.update(typeof patch === 'function' ? nextLocal : patch);
        const merged = { ...DEFAULT_CONTENT, ...saved };
        setContent(merged);
        localStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e?.response?.data?.detail || e.message };
      }
    },
    [content]
  );

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ContentContext.Provider value={{ content, updateContent, refresh, loading, theme, toggleTheme }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
