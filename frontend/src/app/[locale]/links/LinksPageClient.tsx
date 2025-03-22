'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { useTheme } from '@/app/components/ThemeProvider';

interface LinkItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  position: string;
  color: string;
  featured: boolean | null;
  description: string | null;
}

export default function LinksPageClient() {
  const t = useTranslations('LinksPage');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/links');
        
        if (!response.ok) {
          throw new Error('Failed to fetch links');
        }
        
        const data = await response.json();
        setLinks(data.data || []);
      } catch (err) {
        console.error('Error fetching links:', err);
        setError('Failed to load links');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinks();
  }, []);

  // Separate featured links
  const featuredLinks = links.filter(link => link.featured);
  const regularLinks = links.filter(link => !link.featured);

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
            <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-48 mx-auto mb-2 animate-pulse`}></div>
            <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-64 mx-auto mb-4 animate-pulse`}></div>
            <div className={`h-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded max-w-lg mx-auto animate-pulse`}></div>
          </div>

          {/* Featured Links (skeleton) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((_, index) => (
              <div key={index} className={`h-40 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl animate-pulse`}></div>
            ))}
          </div>

          {/* Regular Links Grid (skeleton) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className={`h-32 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl animate-pulse`}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-4xl w-full mx-auto text-center">
          <h1 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Error</h1>
          <p className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-500'} mb-4`}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white rounded transition-colors`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-3xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
            <Image 
              src="/profile-picture.png" 
              alt="Profile Picture" 
              fill
              className={`object-cover ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
            />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manuel Quero</h1>
          <p className={`mb-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('title')}</p>
        </div>

        {/* Featured Links (larger) */}
        {featuredLinks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {featuredLinks.map(link => (
              <LinkCard 
                key={link.id} 
                link={link} 
                featured={true}
                resolvedTheme={resolvedTheme}
              />
            ))}
          </div>
        )}

        {/* Regular Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {regularLinks.map(link => (
            <LinkCard 
              key={link.id} 
              link={link} 
              resolvedTheme={resolvedTheme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Link Card Component
function LinkCard({ link, featured = false, resolvedTheme }: { link: LinkItem, featured?: boolean, resolvedTheme: string }) {
  const isExternalLink = link.url.startsWith('http') || link.url.startsWith('mailto');
  
  const LinkComponent = isExternalLink ? 'a' : Link;
  
  const linkProps = isExternalLink
    ? { 
        href: link.url,
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    : { href: link.url };

  // Format color for CSS (if it's a hex code, keep it as is; otherwise, use a bg-color class)
  const colorStyle = link.color.startsWith('#') 
    ? { backgroundColor: link.color } 
    : { backgroundColor: link.color };

  return (
    <LinkComponent
      {...linkProps}
      className={`block rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        featured ? 'h-40' : 'h-32'
      } ${resolvedTheme === 'dark' ? 'shadow-gray-900/30' : 'shadow-gray-200/60'}`}
    >
      <div className={`w-full h-full text-white p-6 flex flex-col`} style={colorStyle}>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 mr-3 relative">
            <Image
              src={getDirectusImageUrl(link.icon)}
              alt={`${link.title} icon`}
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold">{link.title}</h2>
        </div>
        {link.description && (
          <p className="text-md opacity-90 line-clamp-2">{link.description}</p>
        )}
        <div className="mt-auto flex justify-end">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" 
            />
          </svg>
        </div>
      </div>
    </LinkComponent>
  );
} 