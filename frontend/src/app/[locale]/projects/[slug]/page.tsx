import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProjectBySlug } from '@/lib/projects';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: {
    locale: string;
    slug: string;
  }
}

export async function generateMetadata({ params }: { params: Promise<Props['params']> }): Promise<Metadata> {
  // Await the params object before accessing properties
  const { locale, slug } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);
  
  // Get translations
  const t = await getTranslations('ProjectsPage');
  
  // Fetch the project data to get the title
  try {
    const project = await getProjectBySlug(slug, locale);
    
    if (project?.title) {
      return {
        title: `${project.title}`,
      };
    }
  } catch (error) {
    console.error(`Error fetching project for metadata: ${slug}`, error);
  }
  
  // Fallback title if project not found
  return {
    title: `${t('projectNotFound')} | MQuero`,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<Props['params']> }) {
  // Await the params object before accessing properties
  const { slug, locale } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);
  
  // Pass the slug to the client component
  return <ProjectDetailClient slug={slug} />;
} 