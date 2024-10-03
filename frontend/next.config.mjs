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
          hostname: "stable-leader-451d052f52.media.strapiapp.com"
        },
      ],
    },
  };
  
  export default nextConfig;