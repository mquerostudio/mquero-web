import type { Metadata } from "next";
import { Palanquin } from "next/font/google";
import "./globals.css";

import { getGlobalPageData } from "@/data/loaders";
import { Header } from "../components/custom/Header";
import { Footer } from "@/components/custom/Footer";
import { headers } from "next/headers"; // Import headers to access request headers
import { getLocale } from "next-intl/server";
import { getLocaleFromHost } from "@/lib/localeUtils";

const palanquin = Palanquin({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: "MQuero.",
    template: "%s - MQuero."
  },
  description: "Hola! Soy Manuel Quero y me dedico a diseñar electrónica, programar y fabricar cosas :)",
  twitter: {
    card: "summary_large_image"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use headers to determine if the request came from .es or .com
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

      <body className={`${palanquin.className} min-h-screen antialiased bg-[#FFFAF5]`}>
        <Header data={globalData?.data?.header} language={language}/>
        <div className="min-h-screen px-4">
          {children}
        </div>
        <Footer data={globalData?.data.footer} headerLink={globalData?.data?.header?.headerLink} />
      </body>
    </html>
  );
}
