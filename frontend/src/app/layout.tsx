import type { Metadata } from "next";
import { Palanquin } from "next/font/google";
import "./globals.css";

import { getGlobalPageData } from "@/data/loaders";
import { Header } from "../components/custom/Header";
import { Footer } from "@/components/custom/Footer";

export const runtime = "edge";

const palanquin = Palanquin({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title:{
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
  const globalData = await getGlobalPageData();
  return (
    <html lang="en">
      <body className={`${palanquin.className} min-h-screen antialiased bg-gray-100`}>
        <Header data={globalData?.data?.header} />
        <div className="px-5 min-h-screen">
          {children}
        </div>
        <Footer data={globalData?.data.footer} headerLink={globalData?.data?.header?.headerLink} />

      </body>
    </html>
  );
}