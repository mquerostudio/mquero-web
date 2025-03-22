'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../../components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
import { parseTagIds } from '@/lib/posts';
import { useTheme } from '@/app/components/ThemeProvider';

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
  linkRepo?: string;
  gallery?: number[];
}

interface GalleryImage {
  id: number;
  projects_slug: string;
  directus_files_id: string;
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

interface ProjectDetailClientProps {
  slug: string;
}

export default function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  const t = useTranslations('ProjectsPage');
  const { resolvedTheme } = useTheme();

  const [project, setProject] = useState<Project | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hardcoded author info
  const author = {
    name: 'Manuel Quero',
    title: 'Electronics Engineer',
    image: '/profile-picture.png',
  };

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

        // Fetch gallery images
        const galleryResponse = await fetch(`/api/project-gallery?project=${slug}`);
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          setGalleryImages(galleryData.galleryImages || []);
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

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setShowGalleryModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setShowGalleryModal(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-6xl w-full mx-auto">
          <div className="animate-pulse">
            <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-4`}></div>
            <div className={`h-12 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
            <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3 mb-8`}></div>

            <div className={`w-full h-64 md:h-96 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-8`}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-4 rounded-lg`}>
                  <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3 mb-2`}></div>
                  <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
              <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
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
          <h1 className={`text-4xl font-bold mb-8 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('title')}</h1>
          <div className={`${resolvedTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'} p-6 rounded-lg`}>
            <p className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>{error || 'Project not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-4 ${resolvedTheme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-black hover:bg-gray-800'} text-white px-6 py-2 rounded-md transition-colors`}
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
      <div className="max-w-4xl w-full mx-auto">
        {/* Project Header */}
        <div className="mb-8">
          {/* Project Tags */}
          {tagNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tagNames.map((tag, index) => (
                <span
                  key={index}
                  className={`text-xs font-semibold ${resolvedTheme === 'dark' ? 'text-purple-400 bg-purple-900/30' : 'text-purple-600 bg-purple-100'} px-2 py-1 rounded`}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h1>
          <p className={`text-xl mb-6 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{project.summary}</p>
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
          <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Created</h3>
            <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>{project.date_created ? formatDate(project.date_created) : 'Unknown'}</p>
          </div>
          {project.user_created && (
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
              <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Author</h3>
              <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>Manuel Quero</p>
            </div>
          )}
          <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Tags</h3>
            <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>{tagNames.join(', ') || 'None'}</p>
          </div>
          {project.linkRepo && (
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
              <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Repository</h3>
              <a
                href={project.linkRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div
          className={`prose prose-lg max-w-none mb-12 ${resolvedTheme === 'dark' ? 'prose-invert' : ''}`}
          dangerouslySetInnerHTML={{ __html: project.body || '' }}
        />

        {/* Project Gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Project Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={getDirectusImageUrl(image.directus_files_id, ImagePresets.thumbnail)}
                    alt={`Project image ${index + 1}`}
                    fill
                    className="object-cover transition hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Repository Button */}
        {project.linkRepo && (
          <div className="flex justify-center mb-12">
            <a
              href={project.linkRepo}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 ${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-3 rounded-full transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub Repository
            </a>
          </div>
        )}

        {/* Author Bio */}
        <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-lg mb-12 text-left`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                <Image
                  src={author.image}
                  alt={author.name}
                  width={64}
                  height={64}
                  className={`object-cover w-full h-full ${resolvedTheme === 'dark' ? 'brightness-90' : ''}`}
                />
              </div>
              <div>
                <h3 className={`font-bold text-xl ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{author.name}</h3>
                <p className={`${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{author.title}</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6 items-center mt-4 md:mt-0">
              <a
                href="https://www.instagram.com/mquerostudio"
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
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
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
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
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
              >
                <Image
                  src="/social-logos/x-logo-black.svg"
                  alt="X"
                  width={40}
                  height={40}
                  className={resolvedTheme === 'dark' ? 'filter invert' : ''}
                />
              </a>
              <a
                href="https://www.reddit.com/user/mquerostudio"
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Reddit"
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
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
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
                className="flex items-center hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
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

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('relatedArticles')}</h2>
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

        {/* Back to projects button */}
        <div className="flex justify-center">
          <Link
            href="/projects"
            className={`${resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'} text-white px-6 py-3 rounded-full transition-colors`}
          >
            {t('backToProjects')}
          </Link>
        </div>

        {/* Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-6xl p-4">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white z-10 bg-black bg-opacity-50 p-2 rounded-full"
                onClick={closeGallery}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>

              {/* Previous button */}
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10 bg-black bg-opacity-50 p-2 rounded-full"
                onClick={prevImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg>
              </button>

              {/* Next button */}
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 bg-black bg-opacity-50 p-2 rounded-full"
                onClick={nextImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>

              {/* Current Image */}
              <div className="relative w-full h-[80vh]">
                <Image
                  src={getDirectusImageUrl(galleryImages[currentImageIndex]?.directus_files_id, ImagePresets.featured)}
                  alt={`Project image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-1 rounded-full">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 