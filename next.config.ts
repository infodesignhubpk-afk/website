import type { NextConfig } from "next";

const r2PublicHost = (() => {
  try {
    const url = process.env.R2_PUBLIC_BASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2PublicHost
        ? [{ protocol: "https" as const, hostname: r2PublicHost }]
        : []),
      { protocol: "https" as const, hostname: "*.r2.dev" },
      { protocol: "https" as const, hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https" as const, hostname: "imagedelivery.net" },
    ],
  },
};

export default nextConfig;
