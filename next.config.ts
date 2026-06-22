import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Ignore TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Configure allowed image quality values used by `next/image`
    qualities: [75, 85],
  },
}

export default nextConfig
