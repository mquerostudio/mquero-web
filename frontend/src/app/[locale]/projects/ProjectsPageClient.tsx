'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { Tag, getTags } from '@/lib/tags';
import { useTheme } from '@/app/components/ThemeProvider';

interface Project {
  id: string;
  slug: string;
  title?: string;
  summary?: string;
  content?: string;
  cover_image?: string;
  date_created: string;
  link_repo?: string;
  tagNames?: string[];
}

interface RelatedArticle {
  id: string;
  slug: string;
  title?: string;
  summary?: string;
  cover_image?: string;
  date_created: string;
  tagNames?: string[];
}

interface ProjectWithRelatedArticles extends Project {
  relatedArticles: RelatedArticle[];
}

interface ProjectPostRelation {
  id: number;
  projects_slug: string;
  posts_slug: string;
}

interface ProjectTagRelation {
  id: number;
  projects_slug: string;
  tags_id: number;
}

export default function ProjectsPageClient() {
  const t = useTranslations('ProjectsPage');
  const locale = useLocale();
  const [projects, setProjects] = useState<ProjectWithRelatedArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects with the current locale
        const projectsResponse = await fetch(`/api/projects?locale=${locale}`);
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsData = await projectsResponse.json();
        
        // Process projects and add related articles
        const processedProjects = await Promise.all(projectsData.projects.map(async (project: Project) => {
          // Fetch related articles for this project
          const relationsResponse = await fetch(`/api/project-relations?project=${project.id}&locale=${locale}`);
          let relatedArticles: RelatedArticle[] = [];
          
          if (relationsResponse.ok) {
            const relationsData = await relationsResponse.json();
            relatedArticles = relationsData.relatedArticles || [];
          }
          
          return {
            ...project,
            relatedArticles
          };
        }));
        
        setProjects(processedProjects);
      } catch (err) {
        console.error('Error fetching projects data:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectsData();
  }, [locale]);
  
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

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className={`text-4xl font-bold mb-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>
          <div className="animate-pulse">
            <div className="space-y-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className={`border ${resolvedTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                  <div className="flex flex-col md:flex-row">
                    <div className={`md:w-1/3 h-64 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="md:w-2/3 p-6">
                      <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-4`}></div>
                      <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-2`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6 mb-4`}></div>
                      <div className={`h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto text-center">
          <h1 className={`text-4xl font-bold mb-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>
          <div className={`${resolvedTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} p-6 rounded-lg`}>
            <p className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className={`mt-4 ${resolvedTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-md transition-colors`}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className={`text-4xl font-bold mb-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>

        {/* Projects List */}
        <div className="space-y-12">
          {projects.length === 0 ? (
            <div className="text-center py-16">
            <div className={`${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className={`text-xl ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t('noProjectsFound')}</h3>
          </div>
          ) : (
            projects.map(project => (
              <div key={project.slug} className={`border ${resolvedTheme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} rounded-lg overflow-hidden transition-colors duration-300`}>
              {/* Project Card */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 relative">
                  <Image
                    src={getDirectusImageUrl(project.cover_image, ImagePresets.featured)}
                    alt={project.title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  {/* Project Tags */}
                  {project.tagNames && project.tagNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tagNames.map((tag, index) => (
                        <span 
                          key={index} 
                          className={`text-xs font-semibold ${
                            resolvedTheme === 'dark' 
                              ? 'text-purple-400 bg-purple-900/30' 
                              : 'text-purple-600 bg-purple-100'
                          } px-2 py-1 rounded`}
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className={`text-2xl font-bold mb-3 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h2>
                  <p className={`mb-4 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{project.summary}</p>
                  
                  <Link 
                    href={`/projects/${project.slug}`}
                    className={`${
                      resolvedTheme === 'dark' 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-black hover:bg-gray-800'
                    } text-white px-6 py-2 rounded-md inline-block transition-colors`}
                  >
                    {t('viewProject')}
                  </Link>
                </div>
              </div>

              {/* Related Articles */}
                {project.relatedArticles.length > 0 && (
              <div className={`${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
                <h3 className={`text-xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('relatedArticles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.relatedArticles.map(article => (
                    <BlogPostCard
                      key={article.id}
                      title={article.title || ''}
                      excerpt={article.summary || ''}
                      tags={article.tagNames || []}
                      coverImage={article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.medium) : ''}
                      slug={article.slug}
                      date={article.date_created ? formatDate(article.date_created) : undefined}
                    />
                  ))}
                </div>
              </div>
                )}
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 