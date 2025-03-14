import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
             protocol: 'https',
             hostname: String(process.env.DIRECTUS_API_ENDPOINT)?.replace('https://', ''),
            }
        ]
    }
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig); 