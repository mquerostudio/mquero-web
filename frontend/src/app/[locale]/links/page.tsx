'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface LinkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: string;
  color: string;
  featured?: boolean;
  newTab?: boolean;
}

export default function LinksPage() {
  const t = useTranslations('LinksPage');
  
  // Links data
  const links: LinkItem[] = [
    {
      id: 'github',
      title: 'GitHub',
      description: 'Check out my open-source projects and contributions',
      url: 'https://github.com/username',
      icon: '/icons/github.svg',
      color: 'bg-gray-900',
      featured: true,
      newTab: true
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      description: 'Connect with me professionally',
      url: 'https://linkedin.com/in/username',
      icon: '/icons/linkedin.svg',
      color: 'bg-blue-700',
      featured: true,
      newTab: true
    },
    {
      id: 'twitter',
      title: 'Twitter',
      description: 'Follow me for updates on embedded systems and electronics',
      url: 'https://twitter.com/username',
      icon: '/icons/twitter.svg',
      color: 'bg-blue-400',
      newTab: true
    },
    {
      id: 'youtube',
      title: 'YouTube',
      description: 'Watch my tutorials and project demonstrations',
      url: 'https://youtube.com/c/username',
      icon: '/icons/youtube.svg',
      color: 'bg-red-600',
      newTab: true
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Read my articles on electronics and embedded systems',
      url: '/blog',
      icon: '/icons/blog.svg',
      color: 'bg-purple-600'
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Explore my portfolio of electronics and firmware projects',
      url: '/projects',
      icon: '/icons/projects.svg',
      color: 'bg-green-600'
    },
    {
      id: 'hackaday',
      title: 'Hackaday.io',
      description: 'See my hardware projects on Hackaday',
      url: 'https://hackaday.io/username',
      icon: '/icons/hackaday.svg',
      color: 'bg-black',
      newTab: true
    },
    {
      id: 'instructables',
      title: 'Instructables',
      description: 'Step-by-step guides for my DIY electronics projects',
      url: 'https://www.instructables.com/member/username',
      icon: '/icons/instructables.svg',
      color: 'bg-blue-500',
      newTab: true
    },
    {
      id: 'contact',
      title: 'Contact Me',
      description: 'Get in touch for collaborations or questions',
      url: 'mailto:email@example.com',
      icon: '/icons/email.svg',
      color: 'bg-yellow-500'
    }
  ];

  // Separate featured links
  const featuredLinks = links.filter(link => link.featured);
  const regularLinks = links.filter(link => !link.featured);

  return (
    <div className="w-full py-12">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
            <Image 
              src="/profile-picture.png" 
              alt="Profile Picture" 
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Manuel Quero</h1>
          <p className="text-gray-600 mb-4">Electronics & Embedded Systems Engineer</p>
          <p className="text-gray-700 max-w-lg mx-auto">
            Connect with me on various platforms and check out my work in electronics design, 
            embedded firmware, and more.
          </p>
        </div>

        {/* Featured Links (larger) */}
        {featuredLinks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {featuredLinks.map(link => (
              <LinkCard 
                key={link.id} 
                link={link} 
                featured={true}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Link Card Component
function LinkCard({ link, featured = false }: { link: LinkItem, featured?: boolean }) {
  const LinkComponent = link.url.startsWith('http') || link.url.startsWith('mailto') 
    ? 'a' 
    : Link;
  
  const linkProps = link.url.startsWith('http') || link.url.startsWith('mailto')
    ? { 
        href: link.url,
        target: link.newTab ? '_blank' : undefined,
        rel: link.newTab ? 'noopener noreferrer' : undefined
      }
    : { href: link.url };

  return (
    <LinkComponent
      {...linkProps}
      className={`block rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
        featured ? 'h-40' : 'h-32'
      }`}
    >
      <div className={`w-full h-full ${link.color} text-white p-6 flex flex-col`}>
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 mr-3 relative">
            <Image
              src={link.icon}
              alt={`${link.title} icon`}
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-bold">{link.title}</h2>
        </div>
        {link.description && (
          <p className="text-sm opacity-90 line-clamp-2">{link.description}</p>
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