// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   headers: async () => {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Cross-Origin-Opener-Policy",
//             value: "same-origin",
//           },
//           {
//             key: "Cross-Origin-Embedder-Policy",
//             value: "require-corp",
//           },
//         ],
//       },
//     ];
//   },
//   webpack: (config) => {
//     config.experiments = { 
//       asyncWebAssembly: true,
//       layers: true,
//     };
//     return config;
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-streak-stats.herokuapp.com',
      },
      {
        protocol: 'https',
        hostname: 'github-readme-stats.vercel.app',
        pathname: '/api/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.experiments = { 
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;