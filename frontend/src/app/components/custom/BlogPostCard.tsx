'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';

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
}

const BlogPostCard = ({
  title,
  description,
  categoryLabels,
  imageSrc,
  imageAlt = 'Blog post image',
  link
}: BlogPostCardProps) => {
  return (
    <div className="flex flex-col h-full relative border border-gray-200 rounded-lg overflow-hidden">
      <div className="h-48 relative overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-1 mb-1">
          {categoryLabels.map((label, index) => (
            <span 
              key={index} 
              className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
            >
              {label}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        
        <div className="flex justify-between items-end mt-auto pt-4">
          <p className="text-sm text-gray-600 pr-4 line-clamp-2">{description}</p>
          
          {/* Arrow button positioned at the bottom right */}
          <Link href={link} className="block flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all duration-300 hover:bg-[#ffaa00] hover:text-gray-800 hover:translate-x-1 group">
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard; 