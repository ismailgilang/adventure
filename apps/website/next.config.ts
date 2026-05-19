import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@adventure/database"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
