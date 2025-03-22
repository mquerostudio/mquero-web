'use client';

import { useTheme } from './ThemeProvider';
import { useEffect } from 'react';

interface ThemeWrapperProps {
  children: React.ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { resolvedTheme } = useTheme();
  
  useEffect(() => {
    // Apply dynamic classes to the body
    document.body.classList.remove('bg-gray-50', 'dark:bg-gray-900', 'text-gray-900', 'dark:text-gray-100');
    
    if (resolvedTheme === 'dark') {
      document.body.classList.add('bg-gray-900', 'text-gray-100');
    } else {
      document.body.classList.add('bg-gray-50', 'text-gray-900');
    }
    
    // Force a repaint to ensure styles are applied
    document.body.style.color = document.body.style.color;
  }, [resolvedTheme]);
  
  return (
    <div className="transition-colors duration-200">
      {children}
    </div>
  );
} 