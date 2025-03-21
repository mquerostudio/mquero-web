import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AboutPageClient from './AboutPageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Await the params object before accessing properties
  const { locale } = await params;
  
  setRequestLocale(locale);
  const t = await getTranslations('AboutPage');
  
  return {
    title: t('title'),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  // Await the params object before accessing properties
  const { locale } = await params;
  
  setRequestLocale(locale);
  
  return <AboutPageClient />;
} 