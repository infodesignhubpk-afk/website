import type { NextConfig } from "next";

const r2PublicHost = (() => {
  try {
    const url = process.env.R2_PUBLIC_BASE_URL;
    return url ? new URL(url).hostname : null;
  } catch {
    return null;
  }
})();

// The site's public R2 bucket. Images already saved in D1 and hardcoded in
// components point here, so it stays allowed even if R2_PUBLIC_BASE_URL moves
// to a custom domain.
const R2_BUCKET_HOST = "pub-0e1879e89f994157b46dba1da3153292.r2.dev";

// Only the site's own hosts: a wildcard such as *.r2.dev would let anyone's
// bucket use this site's image optimizer as a free proxy. No query strings,
// so one image cannot be requested under endless distinct URLs.
const imageHosts = [...new Set([R2_BUCKET_HOST, ...(r2PublicHost ? [r2PublicHost] : [])])];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https" as const, hostname, search: "" })),
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
