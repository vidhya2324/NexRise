/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your existing configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me"
        //domains: ['randomuser.me'], // Add this line
      },
    ],
  },
  // Add these new settings
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Help with client component handling
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Force correct handling of client/server boundaries
    serverComponentsExternalPackages: [],
  },
  // Improve module resolution
  transpilePackages: ['sonner', 'react-hook-form', '@hookform/resolvers'],
  // Prevent certain React errors
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;




// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns:[
//             {
//                 protocol: "https",
//                 hostname: "randomuser.me"
//             },
//         ],
//     },
// };

// export default nextConfig;
