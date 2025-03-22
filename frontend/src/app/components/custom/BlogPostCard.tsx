'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/app/components/ThemeProvider';

interface CategoryLabel {
  id: string;
  label: string;
}

interface BlogPostCardProps {
  title: string;
  description: string;
  categoryLabels: string[];
  imageSrc: string;
  imageAlt?: string;
  link: string;
  date?: string;
}

const BlogPostCard = ({
  title,
  description,
  categoryLabels,
  imageSrc,
  imageAlt = 'Blog post image',
  link,
  date
}: BlogPostCardProps) => {
  const { resolvedTheme } = useTheme();
  
  return (
    <Link href={link} className="block h-full">
      <div className={`flex flex-col h-full relative border ${resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden transition-all duration-300 group`}>
        <div className="h-48 relative overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 w-full h-full"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className={`text-lg font-bold mb-2 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <p className={`text-sm mb-4 line-clamp-2 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
          
          <div className="flex justify-between items-center mt-auto">
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-1 mb-1">
                {categoryLabels.slice(0, 3).map((label, index) => (
                  <span 
                    key={index} 
                    className={`text-xs font-semibold ${
                      resolvedTheme === 'dark' 
                        ? 'text-purple-400 bg-purple-900/30' 
                        : 'text-purple-600 bg-purple-100'
                    } px-2 py-1 rounded`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              
              {date && (
                <span className={`text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {date}
                </span>
              )}
            </div>
            
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
              resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'
            } flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#ffaa00] group-hover:text-gray-800 group-hover:translate-x-1`}>
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
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard; 