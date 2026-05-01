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
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(r2PublicHost
        ? [{ protocol: "https" as const, hostname: r2PublicHost }]
        : []),
      { protocol: "https" as const, hostname: "*.r2.dev" },
      { protocol: "https" as const, hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https" as const, hostname: "imagedelivery.net" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
