import { NextIntlClientProvider, Locale, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '../components/custom/Header';
import Footer from '../components/custom/Footer';
import { Inter } from 'next/font/google';
import '../globals.css';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from '../components/ThemeProvider';
import ThemeWrapper from '../components/ThemeWrapper';
import { CBraceStyling } from '../components/CBraceStyling';
import { CodeBlockEnhancer } from '../components/CodeBlockEnhancer';

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

  // Fetch translations for client components
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta name="apple-mobile-web-app-title" content="MQuero" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href={`/${locale}/manifest.webmanifest`} />
      </head>
      <body className={`${inter.className} h-full flex flex-col min-h-screen`}>
        <ThemeProvider>
          <ThemeWrapper>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <Header />
              <main className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                {children}
              </main>
              <Footer />
              <CBraceStyling />
              <CodeBlockEnhancer />
            </NextIntlClientProvider>
          </ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}