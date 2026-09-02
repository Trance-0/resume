import { createMDX } from 'fumadocs-mdx/next';
import { basePath } from './lib/base-path.ts';

const config = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default createMDX()(config);
