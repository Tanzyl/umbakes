import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Admin forms upload several photos at once (max 8 MB each, validated server-side).
    serverActions: { bodySizeLimit: "40mb" },
    proxyClientMaxBodySize: "40mb",
  },
  images: {
    // Uploads are already resized to ≤2000px WebP; next/image serves smaller variants per device.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
