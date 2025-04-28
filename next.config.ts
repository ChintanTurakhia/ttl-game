import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Needed for Frames SDK proper functioning
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      // Add any other required fallbacks
      encoding: false,
      crypto: false,
      stream: false,
      zlib: false,
    };

    // Suppress warnings about these modules
    config.ignoreWarnings = [{ module: /@farcaster\/frame-sdk/ }];

    return config;
  },
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  // Disable type checking in production build (only if needed for deployment)
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
