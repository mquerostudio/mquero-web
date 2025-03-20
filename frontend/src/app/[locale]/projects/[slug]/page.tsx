'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import BlogPostCard from '../../../components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { parseTagIds } from '@/lib/posts';

interface Project {
  slug?: string;
  title?: string;
  body?: string;
  summary?: string;
  cover?: string;
  tags?: number[];
  status?: string;
  date_created?: string;
  user_created?: string;
}

interface RelatedArticle {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  categoryLabels: string[];
  date?: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function ProjectDetailPage() {
  const t = useTranslations('ProjectsPage');
  const params = useParams();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project
        const projectResponse = await fetch(`/api/projects/${slug}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        
        setProject(projectData.project);
        
        // Fetch tags
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
        
        // Get tag names
        if (projectData.project.tags && Array.isArray(projectData.project.tags)) {
          const names = projectData.project.tags.map((tagId: number) => {
            const tag = tagsMap.get(tagId);
            return tag ? tag.name : '';
          }).filter(Boolean);
          setTagNames(names);
        }
        
        // Fetch related articles
        const relationsResponse = await fetch(`/api/project-relations?project=${slug}`);
        if (!relationsResponse.ok) {
          throw new Error('Failed to fetch project relations');
        }
        const relationsData = await relationsResponse.json();
        
        // Only set related articles if there are any
        if (relationsData.relatedPosts && relationsData.relatedPosts.length > 0) {
          setRelatedArticles(relationsData.relatedPosts.map((post: any) => {
            // Get tag names from tag IDs
            const tagIds = parseTagIds(post.tags);
            const categoryLabels = tagIds.map((id: number) => {
              const tag = tagsMap.get(id);
              return tag ? tag.name.toUpperCase() : '';
            }).filter(Boolean);
            
            return {
              id: post.id || Math.random(),
              title: post.title || '',
              description: post.summary || '',
              imageSrc: getDirectusImageUrl(post.cover, ImagePresets.thumbnail),
              link: `/blog/${post.slug}`,
              categoryLabels,
              date: post.date_created ? formatDate(post.date_created) : undefined
            };
          }));
        }
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchProjectData();
    }
  }, [slug]);

  // Helper function to strip HTML tags
  const stripHtml = (html?: string) => {
    if (!html) return '';
    
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
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-8"></div>
            
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-red-600">{error || 'Project not found'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl w-full mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          {/* Project Tags */}
          {tagNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tagNames.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{project.summary}</p>
        </div>

        {/* Featured Image */}
        {project.cover && (
          <div className="w-full h-64 md:h-96 relative mb-8 rounded-lg overflow-hidden">
            <Image
              src={getDirectusImageUrl(project.cover, ImagePresets.featured)}
              alt={project.title || 'Project image'}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Created</h3>
            <p>{project.date_created ? formatDate(project.date_created) : 'Unknown'}</p>
          </div>
          {project.user_created && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-500 mb-1">Author</h3>
              <p>Manuel Quero</p>
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-bold text-gray-500 mb-1">Tags</h3>
            <p>{tagNames.join(', ') || 'None'}</p>
          </div>
        </div>

        {/* Project Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: project.body || '' }}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <BlogPostCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  categoryLabels={article.categoryLabels}
                  imageSrc={article.imageSrc}
                  link={article.link}
                  date={article.date}
                />
              ))}
            </div>
          </div>
        )}

        {/* Back to Projects Button */}
        <div className="flex justify-center">
          <Link
            href="/projects"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {t('backToProjects')}
          </Link>
        </div>
      </div>
    </div>
  );
} 