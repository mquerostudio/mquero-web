'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import BlogPostCard from '@/app/components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { Tag } from '@/lib/tags';
import { useTheme } from '@/app/components/ThemeProvider';

interface Article {
  id: string;
  slug: string;
  title?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  date_created: string;
  tagNames?: string[];
}

export default function BlogPageClient() {
  const t = useTranslations('BlogPage');
  const locale = useLocale();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Fetch all articles and tags only once on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch tags directly from the new tags endpoint
        const tagsResponse = await fetch('/api/tags');
        if (!tagsResponse.ok) {
          throw new Error('Failed to fetch tags');
        }
        const tagsData = await tagsResponse.json();
        
        // Fetch articles from API with the current locale
        const articlesResponse = await fetch(`/api/posts?locale=${locale}`);
        if (!articlesResponse.ok) {
          throw new Error('Failed to fetch articles');
        }
        const articlesData = await articlesResponse.json();
        
        setAllArticles(articlesData.articles || []);
        setAllTags(tagsData.tags || []);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  // Get the featured (latest) article
  const featuredArticle = useMemo(() => 
    allArticles.length > 0 ? allArticles[0] : null
  , [allArticles]);
  
  // All other articles (excluding featured)
  const remainingArticles = useMemo(() => 
    allArticles.slice(1)
  , [allArticles]);

  // Function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Function to get excerpt from content
  const getExcerpt = (summary?: string, content?: string, maxLength = 160) => {
    // Prefer summary if available
    if (summary) return summary;
    
    // Fall back to content if summary is not available
    if (!content) return '';
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]+>/g, '');
    
    // Truncate to maxLength and add ellipsis if needed
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>
        
        {isLoading ? (
          // Loading state with skeleton placeholders
          <div className="animate-pulse">
            {/* Featured post skeleton */}
            <div className="mb-16">
              <div className={`rounded-lg shadow-lg ${resolvedTheme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white'} overflow-hidden`}>
                <div className="md:flex">
                  <div className={`md:w-1/2 h-64 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="md:w-1/2 p-6">
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-4`}></div>
                    <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6 mb-4`}></div>
                    <div className={`h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4`}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Regular posts grid skeleton */}
            <div className="mb-8">
              <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-6`}></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className={`rounded-lg shadow-lg ${resolvedTheme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white'} overflow-hidden`}>
                    <div className={`h-48 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="p-4">
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-2`}></div>
                      <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <div className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-500'} mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-xl ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{error}</h3>
            <button 
              onClick={() => window.location.reload()} 
              className={`mt-4 px-4 py-2 ${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white rounded transition-colors`}
            >
              Try Again
            </button>
          </div>
        ) : allArticles.length === 0 ? (
          // No articles found state
          <div className="text-center py-16">
            <div className={`${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={`text-xl ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('noPostsFound')}</h3>
          </div>
        ) : (
          <>
            {/* Featured Article - Always show the most recent article */}
            {featuredArticle && (
              <div className="mb-16">
                <div className={`rounded-lg shadow-lg ${resolvedTheme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white'} overflow-hidden`}>
                  <div className="md:flex">
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                      {featuredArticle.cover_image && (
                        <Image
                          src={getDirectusImageUrl(featuredArticle.cover_image, ImagePresets.featured)}
                          alt={featuredArticle.title || ''}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className={`object-cover w-full h-full ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
                        />
                      )}
                    </div>
                    <div className="p-6 md:w-1/2">
                      <div className="mb-4">
                        <span className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(featuredArticle.date_created)}
                        </span>
                        {featuredArticle.tagNames && featuredArticle.tagNames.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-2">
                            {featuredArticle.tagNames.map((tagName: string, i: number) => (
                              <span 
                                key={i}
                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                  resolvedTheme === 'dark' 
                                    ? 'text-purple-400 bg-purple-900/30' 
                                    : 'text-purple-600 bg-purple-100'
                                }`}
                              >
                                {tagName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <h2 className={`text-3xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {featuredArticle.title}
                      </h2>
                      <p className={`mb-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {getExcerpt(featuredArticle.summary, featuredArticle.content)}
                      </p>
                      <Link 
                        href={`/blog/${featuredArticle.slug}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 ${
                          resolvedTheme === 'dark' 
                            ? 'bg-gray-700 hover:bg-[#ffaa00]' 
                            : 'bg-gray-800 hover:bg-[#ffaa00]'
                        } text-white hover:text-gray-800 rounded-lg transition-colors`}
                      >
                        {t('readNow')}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={2} 
                          stroke="currentColor" 
                          className="w-4 h-4"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* All Other Articles in a 3-column grid */}
            {remainingArticles.length > 0 && (
              <div>
                {/* Section title */}
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {t('relatedArticles')}
                  </h2>
                </div>
                
                {/* Articles grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {remainingArticles.map((article) => (
                    <BlogPostCard 
                      key={article.id} 
                      title={article.title || 'Untitled'} 
                      excerpt={getExcerpt(article.summary, article.content)}
                      slug={article.slug}
                      coverImage={article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.medium) : ''}
                      date={formatDate(article.date_created)}
                      tags={article.tagNames || []}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 