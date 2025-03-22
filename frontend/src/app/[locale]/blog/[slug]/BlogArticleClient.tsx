'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../../components/custom/BlogPostCard';
import { useEffect, useState } from 'react';
import { parseTagIds } from '@/lib/posts';
import { formatDate } from '@/utils/formatDate';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { Tag } from '@/lib/tags';
import { useTheme } from '@/app/components/ThemeProvider';

interface Post {
  slug?: string;
  title?: string;
  body?: string;
  cover?: string;
  tags?: number[];  // Now an array of tag IDs
  tagNames?: string[]; // For convenience when enriched by the API
  date_created?: string;
  user_created?: string;
}

interface RelatedPost {
  id: number;
  title: string;
  description: string;
  categoryLabels: string[];
  imageSrc: string;
  link: string;
  date?: string;
}

interface BlogArticleClientProps {
  slug: string;
}

export default function BlogArticleClient({ slug }: BlogArticleClientProps) {
  const t = useTranslations('BlogPage');
  const { resolvedTheme } = useTheme();
  
  const [post, setPost] = useState<Post | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Hardcoded author info
  const author = {
    name: 'Manuel Quero',
    title: 'Electronics Engineer',
    image: '/profile-picture.png',
  };
  
  // Related articles
  const [relatedArticles, setRelatedArticles] = useState<RelatedPost[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all tags first
        const tagsResponse = await fetch('/api/tags');
        if (!tagsResponse.ok) {
          throw new Error('Failed to fetch tags');
        }
        const tagsData = await tagsResponse.json();
        
        // Create a map of tags by ID for quick lookup
        const tagsMap = new Map<number, Tag>();
        tagsData.tags.forEach((tag: Tag) => {
          tagsMap.set(tag.id, tag);
        });
        
        // Fetch the post
        const response = await fetch(`/api/post/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data.post);
        
        // Get tag names from post's tag IDs
        if (data.post && data.post.tags) {
          const tagIds = parseTagIds(data.post.tags);
          const tagNames = tagIds.map(id => {
            const tag = tagsMap.get(id);
            return tag ? tag.name : '';
          }).filter(Boolean);
          
          setTags(tagNames);
        }
        
        // Fetch related posts
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          
          // Filter out current post and limit to 3 posts
          const filteredPosts = postsData.posts
            .filter((p: Post) => p.slug !== slug)
            .slice(0, 3)
            .map((p: Post) => {
              // Get category labels either from enriched tagNames or convert from tag IDs
              const categoryLabels = p.tagNames || 
                (p.tags ? parseTagIds(p.tags).map(id => {
                  const tag = tagsMap.get(id);
                  return tag ? tag.name.toUpperCase() : '';
                }).filter(Boolean) : []);
              
              return {
                id: p.slug || '',
                title: p.title || '',
                description: p.body ? stripHtml(p.body).substring(0, 150) + '...' : '',
                categoryLabels,
                imageSrc: getDirectusImageUrl(p.cover, ImagePresets.thumbnail),
                link: `/blog/${p.slug}`,
                date: p.date_created ? formatDate(p.date_created) : undefined
              };
            });
            
          setRelatedArticles(filteredPosts);
        }
      } catch (err) {
        console.error('Error fetching post data:', err);
        setError('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);
  
  // Helper function to strip HTML tags that works safely in both client and server environments
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
  
  if (isLoading) {
  return (
      <div className="w-full py-6">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="animate-pulse">
            <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
            <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-8`}></div>
            <div className={`h-64 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-8`}></div>
            <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
            <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
            <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6 mb-8`}></div>
          </div>
              </div>
            </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="w-full py-6">
        <div className="max-w-4xl w-full mx-auto px-4">
          <div className="text-center py-12">
            <h1 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {error || 'Post not found'}
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
  const publishDate = post.date_created ? formatDate(post.date_created) : '';
  
  // Read time estimation (roughly 200 words per minute)
  const wordCount = stripHtml(post.body || '').split(/\s+/).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

  return (
    <div className="w-full pb-6">
      <div className="max-w-4xl w-full mx-auto px-4 text-center">
        {/* Featured Image - Now at the top */}
        <div className="w-full h-64 md:h-96 relative mb-8 rounded-b-lg overflow-hidden">
          <Image
            src={getDirectusImageUrl(post.cover, ImagePresets.featured)}
            alt={post.title || ''}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className={`object-cover ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
            priority
          />
        </div>

        {/* Article Title */}
        <h1 className={`text-3xl md:text-4xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h1>
        
        {/* Article Summary/Excerpt */}
        <p className={`mb-6 max-w-2xl mx-auto ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {stripHtml(post.body || '').substring(0, 200)}...
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
          {tags.map((tag, index) => (
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
          className={`prose prose-lg max-w-none mb-12 text-left ${resolvedTheme === 'dark' ? 'prose-invert' : ''}`}
          dangerouslySetInnerHTML={{ __html: post.body || '' }}
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
            {relatedArticles.map(post => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                description={post.description}
                categoryLabels={post.categoryLabels}
                imageSrc={post.imageSrc}
                link={post.link}
                date={post.date}
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