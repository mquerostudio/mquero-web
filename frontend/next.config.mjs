import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "optimistic-kindness-c344eba2ae.media.strapiapp.com"
      },
    ],
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    domains: [
      {
        domain: 'mquero.com',
        defaultLocale: 'en',
      },
      {
        domain: 'mquero.es',
        defaultLocale: 'es',
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;