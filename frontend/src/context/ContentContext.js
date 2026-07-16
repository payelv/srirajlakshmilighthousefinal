import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_CONTENT, loadContent, saveContent, resetContent } from '../mock';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => loadContent());
  const [theme, setTheme] = useState(() => localStorage.getItem('srl-theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('srl-theme', theme);
  }, [theme]);

  const updateContent = useCallback((patch) => {
    setContent((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      saveContent(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    resetContent();
    setContent(DEFAULT_CONTENT);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ContentContext.Provider value={{ content, updateContent, resetAll, theme, toggleTheme }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
