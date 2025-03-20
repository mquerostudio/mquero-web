import { NextIntlClientProvider, Locale, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '../components/custom/Header';
import Footer from '../components/custom/Footer';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className="h-full">
      <body className="h-full bg-gray-50 flex flex-col min-h-screen">
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