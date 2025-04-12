export default {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5999",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "realvn.top",
      },
      {
        protocol: "http",
        hostname: "realvn.top",
      },
      {
        protocol: "https",
        hostname: "api.realvn.top",
        port: "5999",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "api.realvn.top",
        port: "5999",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'fpt.edu.vn',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://api.realvn.top:5999/uploads/:path*'
      },
      {
        source: '/local-uploads/:path*',
        destination: 'http://localhost:5999/uploads/:path*'
      }
    ]
  },
  reactStrictMode: true,
  output: 'export'
}