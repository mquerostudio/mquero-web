'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light'
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or default to system
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme);
    }
    setMounted(true);
  }, []);

  // Update body class and localStorage when theme changes
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;

    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove('light', 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
    setResolvedTheme(isDark ? 'dark' : 'light');
    
    // Force a repaint to apply transitions properly
    document.body.style.color = document.body.style.color;
    
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Listen for system preference changes if in system mode
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = document.documentElement;
        const isDark = mediaQuery.matches;
        
        root.classList.remove('light', 'dark');
        root.classList.add(isDark ? 'dark' : 'light');
        setResolvedTheme(isDark ? 'dark' : 'light');
        
        // Force a repaint to apply transitions properly
        document.body.style.color = document.body.style.color;
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // For SSR, provide a default context value
  const value = {
    theme,
    setTheme,
    resolvedTheme
  };

  // During SSR and initial client render before hydration, return children directly
  // to avoid hydration mismatches
  if (!mounted) {
    return (
      <ThemeContext.Provider value={value}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 