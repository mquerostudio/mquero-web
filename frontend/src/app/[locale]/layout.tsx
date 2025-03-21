import { NextIntlClientProvider, Locale, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '../components/custom/Header';
import Footer from '../components/custom/Footer';
import { Inter } from 'next/font/google';
import '../globals.css';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700'] });

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  // In Next.js 15, params is still a Promise that needs to be awaited
  const { locale } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: {
      template: '%s | MQuero',
      default: t('title') // Default title for the homepage
    },
    description: t('description'),
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;  // In Next.js 15, params is still a Promise
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  
  // Set the locale for this request to enable static rendering
  setRequestLocale(locale);
  
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta name="apple-mobile-web-app-title" content="MQuero" />
      </head>
      <body className={`${inter.className} h-full bg-gray-50 flex flex-col min-h-screen`}>
        <NextIntlClientProvider>
          <Header />
          <main className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}