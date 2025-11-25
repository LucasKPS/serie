
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'br.web.img3.acsta.net' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'encrypted-tbn1.gstatic.com' },
      { protocol: 'https', hostname: 'encrypted-tbn2.gstatic.com' },
      { protocol: 'https', hostname: 'encrypted-tbn3.gstatic.com' },
      { protocol: 'https', hostname: 'resizing.flixster.com' },
      { protocol: 'https', hostname: 'www.europanet.com.br' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.alphacoders.com' },
      { protocol: 'https', hostname: 'picfiles.alphacoders.com' },
      { protocol: 'https', hostname: 'images8.alphacoders.com' },
      { protocol: 'https', hostname: 'images5.alphacoders.com' },
      { protocol: 'https', hostname: 'images2.alphacoders.com' },
    ],
  },
};

export default nextConfig;
