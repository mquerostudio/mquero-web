import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import LinksPageClient from './LinksPageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  // Await the params object before accessing properties
  const { locale } = await params;
  
  setRequestLocale(locale);
  const t = await getTranslations('Metadata');
  
  return {
    title: t('links-title'),
  };
}

export default async function LinksPage({ params }: { params: Promise<{ locale: string }> }) {
  // Await the params object before accessing properties
  const { locale } = await params;
  
  setRequestLocale(locale);
  
  return <LinksPageClient />;
} 