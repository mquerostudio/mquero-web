'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { parseTagIds } from '@/lib/posts';
import BlogPostCard from '@/app/components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { Tag } from '@/lib/tags';

export default function BlogPage() {
  const t = useTranslations('BlogPage');
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all posts and tags only once on component mount
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
        
        // Fetch posts from API
        const postsResponse = await fetch('/api/posts');
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        
        setAllPosts(postsData.posts || []);
        setAllTags(tagsData.tags || []);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get the featured (latest) post
  const featuredPost = useMemo(() => 
    allPosts.length > 0 ? allPosts[0] : null
  , [allPosts]);
  
  // All other posts (excluding featured)
  const remainingPosts = useMemo(() => 
    allPosts.slice(1)
  , [allPosts]);

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

  // Function to get excerpt from body
  const getExcerpt = (body?: string, maxLength = 160) => {
    if (!body) return '';
    // Remove HTML tags and get plain text
    const plainText = body.replace(/<[^>]+>/g, '');
    // Truncate to maxLength and add ellipsis if needed
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  // Get tag names for a post
  const getTagNamesForPost = (post: any) => {
    if (post.tagNames && Array.isArray(post.tagNames)) {
      return post.tagNames;
    }
    
    // If we don't have tagNames, we need to convert tag IDs to names
    if (post.tags && Array.isArray(post.tags)) {
      const tagIds = parseTagIds(post.tags);
      return tagIds.map(id => {
        const tag = allTags.find(t => t.id === id);
        return tag ? tag.name : '';
      }).filter(Boolean);
    }
    
    return [];
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-6xl w-full mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
        
        {isLoading ? (
          // Loading state
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl text-gray-600">{error}</h3>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post - Always show the most recent post */}
            {featuredPost && (
              <div className="mb-16">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                      <Image
                        src={getDirectusImageUrl(featuredPost.cover, ImagePresets.featured)}
                        alt={featuredPost.title || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-6 md:w-1/2">
                      <div className="mb-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(featuredPost.date_created)}
                        </span>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {getTagNamesForPost(featuredPost).map((tagName: string, i: number) => (
                            <span 
                              key={i}
                              className="text-xs font-semibold px-2 py-1 rounded text-purple-600 bg-purple-100"
                            >
                              {tagName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                      <p className="text-gray-700 mb-6">{getExcerpt(featuredPost.body)}</p>
                      <Link 
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-[#ffaa00] hover:text-gray-800 transition-colors"
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
            
            {/* All Other Posts in a 3-column grid */}
            {remainingPosts.length > 0 && (
              <div>
                {/* Section title */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    {t('relatedArticles')}
                  </h2>
                </div>
                
                {/* Grid of posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map(post => {
                    const tagNames = getTagNamesForPost(post);
                    
                    return (
                      <div key={post.slug} className="group relative">
                        <BlogPostCard
                          title={post.title || ''}
                          description={getExcerpt(post.body, 120)}
                          categoryLabels={tagNames.map((tag: string) => tag.toUpperCase())}
                          imageSrc={getDirectusImageUrl(post.cover, ImagePresets.thumbnail)}
                          link={`/blog/${post.slug}`}
                          date={formatDate(post.date_created)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}