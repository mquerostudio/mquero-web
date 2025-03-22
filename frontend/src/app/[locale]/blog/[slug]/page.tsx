import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getArticleBySlug } from '@/lib/posts';
import BlogArticleClient from './BlogArticleClient';

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
  const t = await getTranslations('BlogPage');
  
  // Fetch the article data to get the title
  try {
    const article = await getArticleBySlug(slug, locale);
    
    if (article?.title) {
      return {
        title: `${article.title}`,
      };
    }
  } catch (error) {
    console.error(`Error fetching blog article for metadata: ${slug}`, error);
  }
  
  // Fallback title if article not found
  return {
    title: `${t('articleNotFound')} | MQuero`,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<Props['params']> }) {
  // Await the params object before accessing properties
  const { slug, locale } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);
  
  // Pass the slug to the client component
  return <BlogArticleClient slug={slug} />;
} 