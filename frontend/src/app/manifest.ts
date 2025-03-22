import { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Pick a locale that is representative of the app
  const locale = 'en';

  const t = await getTranslations({
    namespace: 'Manifest',
    locale
  });

  return {
    name: t('name'),
    short_name: t('short_name'),
    description: t('description'),
    start_url: `/${locale}`,
    display: 'standalone',
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}