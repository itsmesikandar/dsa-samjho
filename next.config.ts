import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // GitHub Pages serves the site under /<repo>/; CI sets PAGES_BASE_PATH. Local dev stays at /.
  basePath: process.env.PAGES_BASE_PATH || '',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
