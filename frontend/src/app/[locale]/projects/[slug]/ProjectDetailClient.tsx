'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import BlogPostCard from '../../../components/custom/BlogPostCard';
import { getDirectusImageUrl, ImagePresets } from '@/utils/imageUtils';
import { formatDate } from '@/utils/formatDate';
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
  gallery?: string;
  tags?: number[];
  tagNames?: string[];
}

interface RelatedArticle {
  id: string;
  slug: string;
  title?: string;
  excerpt?: string;
  summary?: string;
  cover_image?: string;
  tags?: string[];
  tagNames?: string[];
  coverImage?: string;
  date_created: string;
  date?: string;
}

interface ProjectDetailClientProps {
  slug: string;
}

export default function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  const t = useTranslations('ProjectsPage');
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  const [project, setProject] = useState<Project>({} as Project);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagNames, setTagNames] = useState<string[]>([]);

  // Hardcoded author info
  const author = {
    name: 'Manuel Quero',
    title: 'Electronics Engineer',
    image: '/profile-picture.png',
  };
  
  // Gallery modal state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // Fetch project with the current locale
        const projectResponse = await fetch(`/api/projects/${slug}?locale=${locale}`);
        if (!projectResponse.ok) {
          throw new Error('Failed to fetch project');
        }
        const projectData = await projectResponse.json();
        setProject(projectData.project);

        // The tags should already be included in the project data
        if (projectData.project.tagNames) {
          setTagNames(projectData.project.tagNames);
        }

        // Fetch gallery images if there's a gallery
        if (projectData.project.gallery) {
          // In the new model, gallery is a single image or collection field
          // You might need to update your API to support fetching all gallery images
          const galleryImages = [projectData.project.gallery]; // For now, just use the single image
          setGalleryImages(galleryImages);
        }

        // Fetch related articles
        const relationsResponse = await fetch(`/api/project-relations?project=${projectData.project.id}&locale=${locale}`);
        if (relationsResponse.ok) {
        const relationsData = await relationsResponse.json();

          // Map the related articles to the format expected by BlogPostCard
          const mappedArticles = (relationsData.relatedArticles || []).map((article: RelatedArticle) => ({
            ...article,
            excerpt: article.summary || '',
            tags: article.tagNames || [],
            coverImage: article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.thumbnail) : '',
            date: article.date_created ? formatDate(article.date_created) : undefined
          }));
          
          setRelatedArticles(mappedArticles);
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
  }, [slug, locale]);

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

  // Gallery navigation functions
  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
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
        <div className="max-w-4xl w-full mx-auto">
          <div className="animate-pulse">
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-6 w-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              ))}
            </div>
            
            {/* Title and summary */}
            <div className={`h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-4`}></div>
            <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-2/3 mb-8`}></div>

            {/* Featured image */}
            <div className={`w-full h-64 md:h-96 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg mb-8`}></div>

            {/* Project details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3 mb-2`}></div>
                  <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
                </div>
              ))}
            </div>

            {/* Project content */}
            <div className="space-y-4 mb-12">
              <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-5/6`}></div>
              <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full`}></div>
              <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4`}></div>
            </div>

            {/* Gallery section */}
            <div className="mb-12">
              <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-6`}></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`aspect-square ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
                ))}
              </div>
            </div>

            {/* GitHub repo button */}
            <div className="flex justify-center mb-12">
              <div className={`h-12 w-48 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
            </div>

            {/* Author bio skeleton */}
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} p-6 rounded-lg mb-12`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded-full`}></div>
                  <div>
                    <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-24 mb-2`}></div>
                    <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-32`}></div>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related articles */}
            <div className="mb-12">
              <div className={`h-8 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/4 mb-6`}></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg overflow-hidden`}>
                    <div className={`h-48 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                    <div className="p-4">
                      <div className={`h-6 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-2`}></div>
                      <div className={`h-4 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded w-full mb-4`}></div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2].map((j) => (
                          <div key={j} className={`h-6 w-16 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to projects button */}
            <div className="flex justify-center">
              <div className={`h-12 w-40 ${resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12">
        <div className="max-w-4xl w-full mx-auto text-center">
          <div className={`${resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-500'} mb-4`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t('projectNotFound')}
          </h2>
          <p className={`mb-8 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {error}
          </p>
          <Link
            href="/projects"
            className={`inline-flex items-center px-4 py-2 ${
              resolvedTheme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'
            } text-white rounded transition-colors`}
          >
            {t('backToProjects')}
          </Link>
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
        {project.cover_image && (
          <div className="w-full h-64 md:h-96 relative mb-8 rounded-lg overflow-hidden">
            <Image
              src={getDirectusImageUrl(project.cover_image, ImagePresets.featured)}
              alt={project.title || 'Project image'}
              fill
              className="object-cover"
            />
          </div>
        )}
        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Date */}
          <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>{t('date')}</h3>
            <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>{project.date_created ? formatDate(project.date_created) : 'Unknown'}</p>
          </div>
          
          {/* Author - Always display since we have hardcoded author info */}
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
              <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Author</h3>
            <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>{author.name}</p>
            </div>
          
          {/* Tags */}
          <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
            <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Tags</h3>
            <p className={resolvedTheme === 'dark' ? 'text-white' : ''}>{tagNames.join(', ') || 'None'}</p>
          </div>
          {project.link_repo && (
            <div className={`${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
              <h3 className={`font-bold ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Repository</h3>
              <a
                href={project.link_repo}
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
          className={`prose prose-lg max-w-none mb-12 ${
            resolvedTheme === 'dark' 
              ? 'prose-invert prose-headings:text-white prose-a:text-cyan-400' 
              : 'prose-headings:text-gray-900 prose-a:text-cyan-600'
          } prose-img:rounded-lg`}
          dangerouslySetInnerHTML={{ __html: project.content || '' }}
        />

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('gallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={getDirectusImageUrl(image, ImagePresets.thumbnail)}
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
        {project.link_repo && (
          <div className="flex justify-center mb-12">
            <a
              href={project.link_repo}
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

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t('relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <BlogPostCard
                  key={article.id}
                  title={article.title || ''}
                  excerpt={article.excerpt || article.summary || ''}
                  tags={article.tags || article.tagNames || []}
                  coverImage={article.coverImage || (article.cover_image ? getDirectusImageUrl(article.cover_image, ImagePresets.thumbnail) : '')}
                  slug={article.slug}
                  date={article.date || (article.date_created ? formatDate(article.date_created) : undefined)}
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
        {showGalleryModal && galleryImages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeGallery}>
            <div className="relative w-full max-w-5xl px-4" onClick={e => e.stopPropagation()}>
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                aria-label="Close gallery"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative aspect-video">
                <Image
                  src={getDirectusImageUrl(galleryImages[currentImageIndex], ImagePresets.featured)}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="absolute inset-y-0 left-0 flex items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-r-lg"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                  onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                  className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-l-lg"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center text-white mt-4">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 