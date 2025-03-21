import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPostBySlug } from '@/lib/posts';
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
  
  // Fetch the post data to get the title
  try {
    const post = await getPostBySlug(slug);
    
    if (post?.title) {
      return {
        title: `${post.title}`,
      };
    }
  } catch (error) {
    console.error(`Error fetching blog post for metadata: ${slug}`, error);
  }
  
  // Fallback title if post not found
  return {
    title: `${t('postNotFound')} | MQuero`,
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<Props['params']> }) {
  // Await the params object before accessing properties
  const { slug } = await params;
  
  // Pass the slug to the client component
  return <BlogArticleClient slug={slug} />;
} 