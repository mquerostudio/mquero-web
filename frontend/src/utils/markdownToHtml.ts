import { unified } from 'unified';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// A simple rehype plugin to make all links open in a new tab
const rehypeExternalLinks = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string' &&
        node.properties.href.startsWith('http')
      ) {
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    });
  };
};

// Helper function to visit nodes
const visit = (tree: any, test: string, visitor: (node: any) => void) => {
  if (!tree || typeof tree !== 'object') return;
  
  if (Array.isArray(tree)) {
    tree.forEach((node) => visit(node, test, visitor));
    return;
  }
  
  if (tree.type === test || tree.tagName === test) {
    visitor(tree);
  }
  
  const children = tree.children || tree.content;
  if (Array.isArray(children)) {
    children.forEach((child) => visit(child, test, visitor));
  }
};

// Custom plugin to handle image captions
const rehypeImageCaptions = () => {
  return (tree: any) => {
    // Find and collect all the image nodes first
    const imageNodes: any[] = [];
    visit(tree, 'element', (node: any) => {
      // Only process original img nodes, not ones we've already processed
      if (node.tagName === 'img' && 
          node.properties && 
          node.properties.alt && 
          !node.processed) {
        imageNodes.push(node);
      }
    });

    // Now process all the collected image nodes
    imageNodes.forEach(node => {
      const captionText = node.properties.alt;
      if (captionText && captionText.trim() !== '') {
        // Create a simpler figure wrapper
        const wrapper = {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: [
            // Create a new img node with the same properties
            {
              type: 'element',
              tagName: 'img',
              properties: { ...node.properties, processed: true },
              children: []
            },
            // Add a figcaption element
            {
              type: 'element',
              tagName: 'figcaption',
              properties: {},
              children: [{ type: 'text', value: captionText }]
            }
          ]
        };
        
        // Replace the properties of the original node with the wrapper
        node.tagName = wrapper.tagName;
        node.properties = wrapper.properties;
        node.children = wrapper.children;
        node.processed = true; // Mark as processed
      }
    });
  };
};

// Custom plugin to ensure C language braces have consistent styling
const rehypeCBraces = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (
        node.tagName === 'code' && 
        node.properties && 
        node.properties.className && 
        node.properties.className.includes('language-c')
      ) {
        // Just add a custom data attribute for styling with CSS
        node.properties['data-c-braces'] = 'styled';
      }
    });
  };
};

// Custom plugin to ensure ordered and unordered lists have proper styling
const rehypeListStyling = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Add class to all list elements
      if (node.tagName === 'ul' || node.tagName === 'ol') {
        node.properties = node.properties || {};
        node.properties.className = node.properties.className || [];
        
        if (typeof node.properties.className === 'string') {
          node.properties.className = [node.properties.className];
        }
        
        node.properties.className.push(`markdown-${node.tagName}`);
      }
    });
  };
};

// Create an expanded schema that allows all the formatting we need
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Allow classNames for all core elements
    '*': [
      ...(defaultSchema.attributes?.['*'] || []),
      'className',
      'data-language'
    ],
    // Code-specific attributes
    code: [
      ...(defaultSchema.attributes?.code || []),
      'className',
      'data-language',
      'data-c-braces',
      // Allow highlight.js classes
      ['className', /^language-/],
      ['className', /^hljs$/],
      ['className', /^hljs-/]
    ],
    // Table-specific attributes
    table: [
      ...(defaultSchema.attributes?.table || []),
      'className',
      'border',
      'cellpadding',
      'cellspacing'
    ],
    th: [
      ...(defaultSchema.attributes?.th || []),
      'scope',
      'colspan',
      'rowspan',
      'align'
    ],
    td: [
      ...(defaultSchema.attributes?.td || []),
      'colspan',
      'rowspan',
      'align'
    ],
    // Span for formatting
    span: [
      ...(defaultSchema.attributes?.span || []),
      'className',
      'style',
      ['className', /^hljs-/],
      ['className', /^c-brace$/]
    ]
  },
  // Allow all elements we need for Markdown
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'span',
    'figure',
    'figcaption',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'strike',
    'del',
    's',
    'details',
    'summary'
  ]
};

export async function markdownToHtml(markdown: string): Promise<string> {
  if (!markdown) {
    return '';
  }

  const result = await remark()
    .use(remarkGfm) // Adds support for GitHub Flavored Markdown (tables, strikethrough, etc)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert markdown to HTML
    .use(rehypeExternalLinks) // Add target="_blank" to external links
    .use(rehypeImageCaptions) // Process image captions
    .use(rehypeListStyling) // Add styling to lists
    .use(rehypeHighlight) // Add syntax highlighting to code blocks
    .use(rehypeCBraces) // Add special styling for C language braces
    .use(rehypeSanitize, schema as any) // Sanitize HTML with our expanded schema
    .use(rehypeStringify, { allowDangerousHtml: true }) // Convert AST to HTML string
    .process(markdown);

  return result.toString();
} 