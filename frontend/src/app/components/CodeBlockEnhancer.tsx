'use client';

import { useEffect } from 'react';

export function CodeBlockEnhancer() {
  useEffect(() => {
    // Function to enhance code blocks
    const enhanceCodeBlocks = () => {
      console.log('Running code block enhancement...');
      
      // Find all code blocks inside pre elements (broader targeting)
      const codeBlocks = document.querySelectorAll('pre > code');
      console.log(`Found ${codeBlocks.length} code blocks`);
      
      codeBlocks.forEach((block, index) => {
        // Skip if already processed
        if (block.getAttribute('data-enhanced') === 'true') {
          return;
        }
        
        // Get the parent pre element
        const preElement = block.parentElement;
        if (!preElement) return;
        
        // Ensure the pre element has relative positioning
        if (window.getComputedStyle(preElement).position !== 'relative') {
          preElement.style.position = 'relative';
        }
        
        // Get language from class (language-xxx) or data-language attribute
        let language = 'plaintext';
        
        // Try to get from className first
        if (block.className) {
          const langMatch = block.className.match(/language-(\w+)/);
          if (langMatch && langMatch[1]) {
            language = langMatch[1];
          }
        }
        
        // Fallback to data-language attribute
        if (language === 'plaintext' && block.getAttribute('data-language')) {
          language = block.getAttribute('data-language') || 'plaintext';
        }
        
        console.log(`Code block ${index + 1} language: ${language}`);
        
        // Mark as processed
        block.setAttribute('data-enhanced', 'true');
        
        // Create the controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'code-block-controls';
        controlsContainer.id = `code-controls-${index}`;
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.title = 'Copy code';
        copyButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
        
        // Create language indicator
        const langIndicator = document.createElement('span');
        langIndicator.textContent = language.toUpperCase();
        langIndicator.className = 'code-lang-indicator';
        
        // Apply CSS for better vertical alignment
        langIndicator.style.display = 'flex';
        langIndicator.style.alignItems = 'center';
        langIndicator.style.height = '16px'; // Match the height of the SVG in the copy button
        
        // Add click handler for copy
        copyButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const code = block.textContent || '';
          const originalContent = copyButton.innerHTML;
          
          console.log(`Copying code of length: ${code.length}`);
          
          navigator.clipboard.writeText(code).then(
            () => {
              // Success feedback
              copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              `;
              copyButton.style.color = '#22863a';
              
              // Reset after 2 seconds
              setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.style.color = '';
              }, 2000);
            },
            (err) => {
              console.error('Failed to copy: ', err);
              copyButton.textContent = 'Failed';
              
              // Reset after 2 seconds
              setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.style.color = '';
              }, 2000);
            }
          );
          
          return false;
        });
        
        // Add elements to controls - copy button first, then language indicator
        controlsContainer.appendChild(copyButton);
        controlsContainer.appendChild(langIndicator);
        
        // Add controls to pre element
        preElement.prepend(controlsContainer);
        
        console.log(`Enhanced code block ${index + 1} successfully`);
      });
    };
    
    // Run immediately after mount
    enhanceCodeBlocks();
    
    // And run again after a short delay to catch dynamically rendered blocks
    const timers = [
      setTimeout(enhanceCodeBlocks, 500),
      setTimeout(enhanceCodeBlocks, 1000),
      setTimeout(enhanceCodeBlocks, 2000)
    ];
    
    // Setup mutation observer to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      let shouldEnhance = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'PRE' || 
                (node.nodeType === Node.ELEMENT_NODE && 
                 (node as Element).querySelector && 
                 (node as Element).querySelector('pre'))) {
              shouldEnhance = true;
            }
          });
        }
      }
      
      if (shouldEnhance) {
        setTimeout(enhanceCodeBlocks, 50);
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Cleanup
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);
  
  return null;
} 