import type { NextConfig } from "next";

// Guard: never ship sample data to production.
if (process.env.DEPLOY_ENV === "production" && (process.env.NEXT_PUBLIC_API_MODE ?? "mock") !== "live") {
  throw new Error("Refusing to build for production with NEXT_PUBLIC_API_MODE != 'live'. Mock data must not be deployed.");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }, // stand-in photography (mock mode)
      { protocol: "https", hostname: "cdn.femurphysio.com" }, // CMS media (live)
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/(account|admin)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
