'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

const Footer = () => {
  const t = useTranslations('Common.footer');

  return (
    <footer className="bg-neutral-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Column 1: Location */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-4">{t('location')}</h3>
            <p className="text-base text-white">{t('basedInSpain')}</p>
            <div className="w-24 h-24 relative">
              <Image 
                src="/mq-logo.svg" 
                alt="Logo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Column 2: Pages */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-4">{t('pages')}</h3>
            <nav className="flex flex-col space-y-3 items-center">
              <Link href="/" className="text-base text-white hover:text-gray-300">
                {t('projects')}
              </Link>
              <Link href="/about" className="text-base text-white hover:text-gray-300">
                {t('blog')}
              </Link>
              <Link href="/contact" className="text-base text-white hover:text-gray-300">
                {t('links')}
              </Link>
              <Link href="/about" className="text-base text-white hover:text-gray-300">
                {t('about')}
              </Link>
            </nav>
          </div>

          {/* Column 3: Social Media */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-white mb-4">{t('followMe')}</h3>
            <div className="flex space-x-6 items-center">
              <a 
                href="https://www.instagram.com/mquerostudio" 
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
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
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
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
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image 
                  src="/social-logos/x-logo.svg" 
                  alt="X" 
                  width={32} 
                  height={32} 
                />
              </a>
              <a 
                href="https://www.reddit.com/user/mquerostudio" 
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
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
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
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
                className="flex items-center text-white hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
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
      </div>
    </footer>
  );
};

export default Footer; 