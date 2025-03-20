'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { Post, parseTagIds } from '@/lib/posts';
import { Tag, getTags } from '@/lib/tags';

interface Project {
  slug?: string;
  title?: string;
  summary?: string;
  body?: string;
  cover?: string;
  projects?: number[];
  tags?: number[];
  status?: string;
  date_created?: string;
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

interface ProjectWithRelatedArticles extends Project {
  relatedArticles: RelatedArticle[];
  tagNames?: string[];
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

export default function ProjectsPage() {
  const t = useTranslations('ProjectsPage');
  const [projects, setProjects] = useState<ProjectWithRelatedArticles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects
        const projectsResponse = await fetch('/api/projects');
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        const projectsData = await projectsResponse.json();
        
        // Fetch all project-post relations
        const relationsResponse = await fetch('/api/project-relations');
        if (!relationsResponse.ok) {
          throw new Error('Failed to fetch project relations');
        }
        const relationsData = await relationsResponse.json();
        
        // Fetch all project-tag relations
        const projectTagsResponse = await fetch('/api/project-tags');
        if (!projectTagsResponse.ok) {
          throw new Error('Failed to fetch project-tag relations');
        }
        const projectTagsData = await projectTagsResponse.json();
        
        // Fetch all tags
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
        
        // Create a map of project tags for quick lookup
        const projectTagsMap = new Map<string, number[]>();
        projectTagsData.relations.forEach((relation: ProjectTagRelation) => {
          if (!projectTagsMap.has(relation.projects_slug)) {
            projectTagsMap.set(relation.projects_slug, []);
          }
          projectTagsMap.get(relation.projects_slug)?.push(relation.tags_id);
        });
        
        // Fetch all posts for related articles
        const postsResponse = await fetch('/api/posts');
        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }
        const postsData = await postsResponse.json();
        
        // Create a map of posts by slug for easy lookup
        const postsMap = new Map<string, Post>();
        postsData.posts.forEach((post: Post) => {
          if (post.slug) {
            postsMap.set(post.slug, post);
          }
        });
        
        // Process projects and add related articles
        const processedProjects = projectsData.projects.map((project: Project) => {
          // Find relations for this project
          const projectRelations = relationsData.relations.filter(
            (relation: ProjectPostRelation) => relation.projects_slug === project.slug
          );
          
          // Get tag IDs directly from project or from relations
          const tagIds = project.tags || projectTagsMap.get(project.slug || '') || [];
          
          // Get tag names
          const tagNames = tagIds.map(id => {
            const tag = tagsMap.get(id);
            return tag ? tag.name : '';
          }).filter(Boolean);
          
          // Get related posts using the relations
          const relatedArticles = projectRelations.map((relation: ProjectPostRelation) => {
            const post = postsMap.get(relation.posts_slug);
            if (!post) return null;
            
            // Strip HTML from body for description
            const description = post.body 
              ? stripHtml(post.body).substring(0, 150) + '...'
              : '';
            
            // Get tag names from tag IDs
            const postTagIds = parseTagIds(post.tags);
            const categoryLabels = postTagIds.map(id => {
              const tag = tagsMap.get(id);
              return tag ? tag.name.toUpperCase() : '';
            }).filter(Boolean);
            
            return {
              id: relation.id,
              title: post.title || '',
              description,
              imageSrc: getDirectusImageUrl(post.cover, ImagePresets.thumbnail),
              link: `/blog/${post.slug}`,
              categoryLabels,
              date: post.date_created ? formatDate(post.date_created) : undefined
            };
          }).filter(Boolean) as RelatedArticle[];
          
          return {
            ...project,
            relatedArticles,
            tagNames
          };
        });
        
        setProjects(processedProjects);
      } catch (err) {
        console.error('Error fetching projects data:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectsData();
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

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <div className="animate-pulse">
            <div className="space-y-12">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-64 bg-gray-200"></div>
                    <div className="md:w-2/3 p-6">
                      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-1/4"></div>
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
          <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
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
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        {/* Projects List */}
        <div className="space-y-12">
          {projects.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">{t('noProjectsFound')}</p>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.slug} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Project Card */}
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-64 relative">
                  <Image
                    src={getDirectusImageUrl(project.cover, ImagePresets.featured)}
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
                          className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded"
                        >
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
                  <p className="text-gray-700 mb-4">{project.summary}</p>
                  
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="bg-black text-white px-6 py-2 rounded-md inline-block hover:bg-gray-800 transition-colors"
                  >
                    {t('viewProject')}
                  </Link>
                </div>
              </div>

              {/* Related Articles */}
                {project.relatedArticles.length > 0 && (
              <div className="bg-gray-50 p-6">
                <h3 className="text-xl font-bold mb-4">{t('relatedArticles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {project.relatedArticles.map(article => (
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
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 