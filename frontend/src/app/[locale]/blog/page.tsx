import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BlogPageClient from './BlogPageClient';

// Generate metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Await the params object before accessing properties
  const { locale } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('BlogPage');
  
  return {
    title: t('title')
  };
}

export default function BlogPage() {
  return <BlogPageClient />;
}