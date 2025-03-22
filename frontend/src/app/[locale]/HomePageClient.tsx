'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import Card from '../components/custom/Card';
import SkillCard from '../components/custom/SkillCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { useTheme } from '../components/ThemeProvider';

export default function HomePageClient() {
  const t = useTranslations('HomePage');
  const commonT = useTranslations('Common');
  const { resolvedTheme } = useTheme();

  const [projects, setProjects] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsData = await projectsResponse.json();
        
        // Fetch articles
        const articlesResponse = await fetch('/api/articles');
        if (!articlesResponse.ok) {
          throw new Error('Failed to fetch articles');
        }
        const articlesData = await articlesResponse.json();
        
        // Process and set projects (limit to 2 most recent)
        const processedProjects = projectsData.projects
          .slice(0, 2)
          .map((project: any) => ({
            id: project.slug,
            title: project.title || '',
            description: project.summary || '',
            imageSrc: project.cover_image ? getDirectusImageUrl(project.cover_image, ImagePresets.thumbnail) : '',
            link: `/projects/${project.slug}`
          }));

        // Process and set articles (limit to 3 most recent)
        const processedArticles = articlesData.articles
          .slice(0, 3)
          .map((article: any) => {
            // Strip HTML for description
            const description = article.content 
              ? stripHtml(article.content).substring(0, 120) + '...'
              : article.summary || '';
              
            return {
              id: article.slug,
              title: article.title || '',
              description,
              imageSrc: article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.thumbnail) : '',
              link: `/blog/${article.slug}`
            };
          });
        
        setProjects(processedProjects);
        setArticles(processedArticles);
      } catch (err) {
        console.error('Error fetching data for homepage:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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

  // SVG Icons
  const schematicIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2M5 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );

  const prototypeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );

  const firmwareIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );

  const requirementsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  );

  const prototypingIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
    </svg>
  );

  const validationIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );

  // Skills data
  const skills = [
    {
      id: 1,
      title: t('skill-1-title'),
      description: t('skill-1-description'),
      color: "bg-blue-500",
      icon: schematicIcon
    },
    {
      id: 2,
      title: t('skill-2-title'),
      description: t('skill-2-description'),
      color: "bg-orange-400",
      icon: prototypeIcon
    },
    {
      id: 3,
      title: t('skill-3-title'),
      description: t('skill-3-description'),
      color: "bg-purple-500",
      icon: firmwareIcon
    },
    {
      id: 4,
      title: t('skill-4-title'),
      description: t('skill-4-description'),
      color: "bg-teal-500",
      icon: requirementsIcon
    },
    {
      id: 5,
      title: t('skill-5-title'),
      description: t('skill-5-description'),
      color: "bg-amber-500",
      icon: prototypingIcon
    },
    {
      id: 6,
      title: t('skill-6-title'),
      description: t('skill-6-description'),
      color: "bg-rose-500",
      icon: validationIcon
    }
  ];

  return (
    <div className="space-y-12 py-12 w-full">
      {/* Hero Section */}
      <section className="w-full">
        <div className={`max-w-6xl w-full flex flex-col lg:flex-row justify-between items-center mx-auto space-y-4 lg:space-y-0 lg:space-x-6 h-auto border-4 ${resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} rounded-3xl p-4 sm:p-8 transition-colors duration-300`}>
          <div className="sm:rounded-[80px] rounded-[40px] overflow-hidden h-auto w-48 sm:h-auto sm:w-80 flex-shrink-0">
            <Image
              src="/profile-picture.png"
              alt="Profile Picture"
              width={384}
              height={384}
              className={`w-full h-full object-cover rounded-xl ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
              priority
            />
          </div>

          <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
            <h1 className={`text-2xl sm:text-4xl font-bold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>
            <p className={`text-base sm:text-xl ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{t('subtitle')}</p>
            <Link
              href="/about"
              className={`text-base sm:text-xl font-medium ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-800'} text-white hover:bg-[#ffaa00ff] hover:text-black px-6 py-3 rounded-md transition-colors duration-200`}
            >
              {t('about')}
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className={`text-3xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('projects')}</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((item) => (
                <div key={item} className={`animate-pulse ${resolvedTheme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white'} rounded-lg overflow-hidden shadow-md`}>
                  <div className={`h-48 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="p-4">
                    <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-1`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={`${resolvedTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} p-6 rounded-lg text-center`}>
              <p className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={`mt-4 ${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-4 py-2 rounded transition-colors`}
              >
                Retry
              </button>
            </div>  
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.length > 0 ? (
                  projects.map(project => (
              <Card
                key={project.id}
                title={project.title}
                description={project.description}
                imageSrc={project.imageSrc}
                link={project.link}
              />
                  ))
                ) : (
                  <p className={`col-span-2 text-center ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-8`}>No projects found</p>
                )}
          </div>

          {/* See All Projects Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/projects"
              className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-full transition-colors`}
            >
              {t('projects-see-all')}
            </Link>
          </div>
            </>
          )}
        </div>
      </section>

      {/* Blog Articles Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className={`text-3xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('blog')}</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`animate-pulse ${resolvedTheme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white'} rounded-lg overflow-hidden shadow-md`}>
                  <div className={`h-40 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  <div className="p-4">
                    <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-1`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className={`${resolvedTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} p-6 rounded-lg text-center`}>
              <p className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            </div>
          ) : (
            <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.length > 0 ? (
                  articles.map(article => (
              <Card
                key={article.id}
                title={article.title}
                description={article.description}
                imageSrc={article.imageSrc}
                link={article.link}
              />
                  ))
                ) : (
                  <p className={`col-span-3 text-center ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-8`}>No blog posts found</p>
                )}
          </div>

          {/* See All Blog Posts Button */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog"
              className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-full transition-colors`}
            >
              {t('blog-read')}
            </Link>
          </div>
            </>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section className="w-full">
        <div className="max-w-6xl w-full mx-auto">
          <h2 className={`text-3xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('skills')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map(skill => (
              <SkillCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                color={skill.color}
                icon={skill.icon}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 