import type { Metadata } from "next";
import { Palanquin } from "next/font/google";
import "./globals.css";

import { getGlobalPageData } from "@/data/loaders";
import { Header } from "../components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { getLocaleFromHost } from "@/lib/localeUtils";

const palanquin = Palanquin({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ["latin"]
});

// Dynamically generate metadata
export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getGlobalPageData();
  const metaData = globalData?.data?.seo || {};

  return {
    title: {
      default: metaData.MetaTitle || "MQuero.",
      template: `%s - ${metaData.MetaTitle || "MQuero."}`
    },
    description: metaData.MetaDescription || "Hola! Soy Manuel Quero y me dedico a diseñar electrónica, programar y fabricar cosas :)",
    openGraph: {
      images: [
        {
          url: "/opengraph-image.png", // path to the Open Graph image
          width: 1200, // recommended Open Graph image dimensions
          height: 630,
          alt: "MQuero OpenGraph Image" // alternative text for the image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      images: "/opengraph-image.png" // include for Twitter cards as well
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = getLocaleFromHost();

  // Fetch global data based on the determined locale
  const globalData = await getGlobalPageData();

  return (
    <html lang={language}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="MyWebSite" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      
      <body className={`${palanquin.className} min-h-screen antialiased bg-gray-50`}>
        <Header data={globalData?.data?.header} language={language} />
        <div className="min-h-screen px-4">
          {children}
        </div>
        <Footer data={globalData?.data.footer} headerLink={globalData?.data?.header?.headerLink} />
      </body>
    </html>
  );
}
