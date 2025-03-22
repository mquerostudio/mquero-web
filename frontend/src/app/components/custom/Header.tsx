'use client'

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useState } from 'react';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../ThemeProvider';

const Header = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Common.navigation');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image 
                src="/mq-logo.svg" 
                alt="Logo" 
                width={100} 
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/projects" 
              className={`px-3 py-2 text-md font-bold rounded-md ${
                pathname === '/projects' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              } transition-colors duration-300`}
            >
              {t('projects')}
            </Link>
            <Link 
              href="/blog" 
              className={`px-3 py-2 text-md font-bold rounded-md ${
                pathname === '/blog' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              } transition-colors duration-300`}
            >
              {t('blog')}
            </Link>
            <Link 
              href="/links" 
              className={`px-3 py-2 text-md font-bold rounded-md ${
                pathname === '/links' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              } transition-colors duration-300`}
            >
              {t('links')}
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-md font-bold rounded-md ${
                pathname === '/about' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              } transition-colors duration-300`}
            >
              {t('about')}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium ${
                  resolvedTheme === 'dark' 
                    ? 'text-gray-300 border-gray-700 hover:bg-gray-800' 
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                <span>{locale.toUpperCase()}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isOpen && (
                <div className={`absolute right-0 mt-2 w-28 ${
                  resolvedTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-300'
                } border rounded-md shadow-lg z-10`}>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      locale === 'en' 
                        ? 'font-medium text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                        : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('es')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      locale === 'es' 
                        ? 'font-medium text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                        : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-md ${
                resolvedTheme === 'dark' 
                  ? 'text-gray-300 hover:bg-amber-900/20' 
                  : 'text-gray-700 hover:bg-amber-50'
              } hover:text-[#ffaa00ff] focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t ${
            resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <Link 
              href="/projects" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/projects' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('projects')}
            </Link>
            <Link 
              href="/blog" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/blog' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('blog')}
            </Link>
            <Link 
              href="/links" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/links' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('links')}
            </Link>
            <Link 
              href="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/about' 
                  ? 'text-[#ffaa00ff] ' + (resolvedTheme === 'dark' ? 'bg-amber-900/20' : 'bg-amber-50')
                  : (resolvedTheme === 'dark' ? 'text-gray-300 hover:bg-amber-900/20' : 'text-gray-700 hover:bg-amber-50') + ' hover:text-[#ffaa00ff]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
