import type { Metadata } from "next";
import { Palanquin } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"

import { getGlobalPageData } from "@/data/loaders";
import { Header } from "../components/custom/Header";
import { Footer } from "@/components/custom/Footer";

const palanquin = Palanquin({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "MQuero.",
  description: "Engineering, Design, and Development",
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
        <div className="px-10 min-h-screen">
          {children}
          <SpeedInsights />
          <Analytics />
        </div>
        <Footer data={globalData?.data.footer} headerLink={globalData?.data?.header?.headerLink} />

      </body>
    </html>
  );
}