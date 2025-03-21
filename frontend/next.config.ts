import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tardis.mquero.com',
                pathname: '/assets/**',
            }
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
    },
    // Set to true if you want to force Edge Runtime only - default for Cloudflare Pages
    // Since we're using OpenNext, we can use the Node.js compatible runtime
    // experimental: {
    //    runtime: 'nodejs',
    // }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

// Initialize OpenNext Cloudflare for local development
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev(); 