'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '@/app/components/custom/BlogPostCard';
import { useEffect, useState } from 'react';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { useTheme } from '@/app/components/ThemeProvider';
import { markdownToHtml } from '@/utils/markdownToHtml';
import { useRouter } from 'next/navigation';
import hljs from 'highlight.js';

interface Article {
  id: string;
  slug: string;
  title?: string;
  content?: string; // This replaces body in the old model
  summary?: string; // This replaces description in the old model
  cover_image?: string; // This replaces cover in the old model
  tags?: number[];
  tagNames?: string[];
  date_created?: string;
  user_created?: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  coverImage: string;
  slug: string;
  date?: string;
}

interface BlogArticleClientProps {
  slug: string;
}

export default function BlogArticleClient({ slug }: BlogArticleClientProps) {
  const t = useTranslations('BlogArticleClient');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  
  // Apply syntax highlighting to code blocks after the component mounts or content changes
  useEffect(() => {
    if (htmlContent && typeof window !== 'undefined') {
      // Wait for the DOM to update
      setTimeout(() => {
        // Find all code blocks and apply syntax highlighting
        document.querySelectorAll('pre code').forEach((el) => {
          const language = el.getAttribute('data-language');
          if (language && hljs.getLanguage(language)) {
            hljs.highlightElement(el as HTMLElement);
          }
        });
      }, 0);
    }
  }, [htmlContent]);
  
  // Hardcoded author info
  const author = {
    name: 'Manuel Quero',
    title: 'Electronics Engineer',
    image: '/profile-picture.png',
  };
  
  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') {
      // Server-side or during SSR
      return html.replace(/<[^>]+>/g, '');
    } else {
      // Client-side with DOM available
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
  };

  // Function to fetch related articles
  const fetchRelatedArticles = async (articleId: string, tagIds: number[]) => {
    try {
      // Fetch all articles
      const articlesResponse = await fetch(`/api/articles?locale=${locale}`);
      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json();
        
        // Filter out current article and find related ones
        const related = articlesData.articles
          .filter((relatedArticle: Article) => relatedArticle.id !== articleId)
          .slice(0, 3)
          .map((article: Article) => ({
            id: article.slug || '',
            title: article.title || '',
            excerpt: article.summary || (article.content ? stripHtml(article.content).substring(0, 150) + '...' : ''),
            tags: article.tagNames || [],
            coverImage: article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.thumbnail) : '',
            slug: article.slug || '',
            date: article.date_created ? formatDate(article.date_created) : undefined
          }));
          
        setRelatedArticles(related);
      }
    } catch (err) {
      console.error('Error fetching related articles:', err);
      // Don't set an error for the whole page if just related articles fail
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/post/${slug}?locale=${locale}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError(t('articleNotFound'));
          } else {
            throw new Error('Failed to fetch article');
          }
          return;
        }
        
        const { data } = await response.json();
        
        if (!data) {
          setError(t('articleNotFound'));
          return;
        }
        
        setArticle(data);
        
        // Convert markdown to HTML and process Directus image links
        if (data.content) {
          // First, replace Directus image URLs with fully qualified URLs
          // While preserving alt text (captions) in markdown format: ![Caption text](image-url)
          let processedContent = data.content.replace(
            /!\[(.*?)\]\((https:\/\/tardis\.mquero\.com\/assets\/[^)]+)\)/g,
            (match: string, altText: string, imageUrl: string) => {
              // Keep the alt text as is to preserve captions
              return `![${altText}](${imageUrl})`;
            }
          );
          
          try {
            const html = await markdownToHtml(processedContent);
            
            // Make sure code blocks are rendered correctly
            if (typeof window !== 'undefined') {
              // We're on the client, we can process the HTML properly
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              
              // Process each code block with highlight.js
              doc.querySelectorAll('pre code').forEach((codeElement) => {
                const language = codeElement.getAttribute('data-language');
                if (language) {
                  // Ensure the code has correct class
                  codeElement.className = `hljs language-${language}`;
                }
              });
              
              // Get the processed HTML
              setHtmlContent(doc.body.innerHTML);
            } else {
              // We're on the server, just use the original HTML
              setHtmlContent(html);
            }
          } catch (err) {
            console.error('Error processing markdown:', err);
            // Fallback to just displaying the plain content if markdown processing fails
            setHtmlContent(`<div>${processedContent}</div>`);
          }
        }
        
        // Fetch related articles if available
        if (data.tags && data.tags.length > 0) {
          fetchRelatedArticles(data.id, data.tags);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to load article');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [slug, locale, t]);
  
  if (isLoading) {
  return (
      <div className="w-full pb-6">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="animate-pulse">
            {/* Featured Image */}
            <div className={`w-full h-64 md:h-96 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-b-lg mb-8`}></div>
            
            {/* Article Title */}
            <div className="text-center">
              <div className={`h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mx-auto mb-6`}></div>
              
              {/* Article Summary */}
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3 mx-auto mb-2`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mx-auto mb-6`}></div>
              
              {/* Author and Date */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                  <div>
                    <div className={`h-3 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-20 mb-1`}></div>
                    <div className={`h-2 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-16`}></div>
                  </div>
                </div>
                <div className={`h-3 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-16`}></div>
                <div className={`h-3 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-16`}></div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-6 w-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                ))}
              </div>
            </div>
            
            {/* Article Content */}
            <div className="space-y-4 mb-12 text-left">
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-4/5`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
            </div>
            
            {/* Author Bio */}
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-lg mb-12`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full`}></div>
                  <div>
                    <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-24 mb-2`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-32`}></div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`w-10 h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Related Articles */}
            <div className="mb-12">
              <div className="text-left mb-6">
                <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4`}></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
                    <div className={`h-48 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="p-4">
                      <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-4`}></div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2].map((j) => (
                          <div key={j} className={`h-6 w-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Back to Blog Button */}
            <div className="flex justify-center">
              <div className={`h-10 w-32 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
            </div>
          </div>
              </div>
            </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="w-full py-6">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="text-center py-12">
            <h1 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {error || t('articleNotFound')}
            </h1>
            <Link 
              href="/blog" 
              className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-full transition-colors`}
            >
              {t('backToBlog')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Format the date
  const publishDate = article.date_created ? formatDate(article.date_created) : '';
  
  // Read time estimation (roughly 200 words per minute)
  const wordCount = stripHtml(article.content || '').split(/\s+/).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

  return (
    <div className="w-full pb-6">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Featured Image - Now at the top */}
        <div className="w-full h-64 md:h-96 relative mb-8 rounded-b-lg overflow-hidden">
          <Image
            src={article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.featured) : ''}
            alt={article.title || ''}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className={`object-cover ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
            priority
          />
        </div>

        {/* Article Title */}
        <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{article.title}</h1>
        
        {/* Article Summary/Excerpt */}
        <p className={`mb-6 max-w-2xl mx-auto ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {article.summary || (article.content ? stripHtml(article.content).substring(0, 200) + '...' : '')}
        </p>
        
        {/* Author, Date and Read Time in a Row */}
        <div className={`flex items-center justify-center gap-4 text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden relative">
              <Image 
                src={author.image} 
                alt={author.name}
                width={32}
                height={32}
                className={`object-cover w-full h-full ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
              />
            </div>
            <div className="text-left">
              <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-black'}`}>{author.name}</span>
              <span className="block text-xs">{author.title}</span>
            </div>
          </div>
          <span>•</span>
          <span>{publishDate}</span>
          <span>•</span>
          <span>{readTime}</span>
        </div>
        
        {/* Tags at the Bottom */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {article.tagNames && article.tagNames.map((tag, index) => (
            <span 
              key={index} 
              className={`text-xs font-semibold px-2 py-1 rounded ${
                resolvedTheme === 'dark' 
                  ? 'text-purple-400 bg-purple-900/30' 
                  : 'text-purple-600 bg-purple-100'
              }`}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Article Content - Back to left alignment for readability */}
        <div 
          className={`prose prose-lg max-w-none mb-12 text-left ${resolvedTheme === 'dark' ? 'prose-invert' : ''} prose-img:rounded-lg prose-img:mx-auto prose-p:my-5 prose-table:table-auto prose-ul:list-disc prose-ol:list-decimal`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Author Bio */}
        <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-lg mb-12 text-left`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden relative">
              <Image 
                  src={author.image} 
                  alt={author.name}
                  width={64}
                  height={64}
                  className={`object-cover w-full h-full ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
              />
            </div>
            <div>
                <h3 className={`font-bold text-xl ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{author.name}</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{author.title}</p>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-6 items-center mt-4 md:mt-0">
              <a 
                href="https://www.instagram.com/mquerostudio" 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Image 
                  src="/social-logos/instagram-logo.svg" 
                  alt="Instagram" 
                  width={40} 
                  height={40} 
                />
              </a>
              <a 
                href="https://www.tiktok.com/@mquerostudio" 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <Image 
                  src="/social-logos/tiktok-logo.svg" 
                  alt="TikTok" 
                  width={40} 
                  height={40} 
                />
              </a>
              <a 
                href="https://x.com/mquerostudio" 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <Image 
                  src="/social-logos/x-logo-black.svg" 
                  alt="X" 
                  width={40} 
                  height={40} 
                  className={resolvedTheme === 'dark' ? 'filter invert' : ''}
                />
              </a>
              <a 
                href="https://www.reddit.com/user/mquerostudio" 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reddit"
              >
                <Image 
                  src="/social-logos/reddit-logo.svg" 
                  alt="Reddit" 
                  width={40} 
                  height={40} 
                />
              </a>
              <a 
                href="https://www.linkedin.com/in/manuelquero" 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Image 
                  src="/social-logos/linkedin-logo.svg" 
                  alt="LinkedIn" 
                  width={40} 
                  height={40} 
                />
              </a>
              <a 
                href="https://www.youtube.com/@MQuero." 
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Image 
                  src="/social-logos/youtube-logo.svg" 
                  alt="YouTube" 
                  width={40} 
                  height={40} 
                />
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
        <div className="mb-8 text-left">
          <h2 className={`text-2xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('relatedArticles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
              <BlogPostCard
                  key={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  tags={article.tags}
                  coverImage={article.coverImage}
                  slug={article.slug}
                  date={article.date}
              />
            ))}
          </div>
        </div>
        )}

        {/* Back to Blog Button */}
        <div className="flex justify-center">
          <Link 
            href="/blog" 
            className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-full transition-colors`}
          >
            {t('backToBlog')}
          </Link>
        </div>
      </div>
    </div>
  );
} 