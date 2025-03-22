'use client';

import { useEffect } from 'react';

export function CBraceStyling() {
  useEffect(() => {
    // Function to ensure syntax highlighting classes are applied correctly
    const ensureCBracesStyling = () => {
      // Find all code blocks with the c-braces attribute
      const cCodeBlocks = document.querySelectorAll('pre code[data-c-braces="styled"]');
      
      cCodeBlocks.forEach(block => {
        // If not already processed
        if (block.getAttribute('data-js-processed') === 'true') {
          return;
        }
        
        // Mark as processed
        block.setAttribute('data-js-processed', 'true');
        
        // Check if the block uses rehype-highlight classes
        const hasHighlightClasses = block.querySelectorAll('.hljs-keyword, .hljs-string').length > 0;
        
        if (!hasHighlightClasses) {
          // Only apply custom styling if highlight.js classes are missing
          // This is a fallback for when syntax highlighting didn't work
          const isDarkMode = document.documentElement.classList.contains('dark') || 
                            window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Apply basic color instead of manipulating DOM
          const textColor = isDarkMode ? '#d1d5db' : '#24292e';
          block.setAttribute('style', `color: ${textColor};`);
        }
      });
    };

    // Initial run and setup for mutations
    ensureCBracesStyling();
    
    // Add observer to handle dynamically loaded content
    const observer = new MutationObserver(() => {
      ensureCBracesStyling();
    });
    
    // Observe for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', ensureCBracesStyling);
    
    // Also observe the html element for theme class changes
    const htmlObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          ensureCBracesStyling();
        }
      }
    });
    
    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
      htmlObserver.disconnect();
      mediaQuery.removeEventListener('change', ensureCBracesStyling);
    };
  }, []);
  
  return null;
} 