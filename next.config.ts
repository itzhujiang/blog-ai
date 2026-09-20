import type { NextConfig } from 'next';


setInterval(() => {
  const usage = process.memoryUsage();
  console.log('[Server Memory]', {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
  });
}, 10000);

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.108', '192.168.2.109'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8089',
      },
    ],
  },
  /* 配置优化 */
  // svg-captcha 依赖 __dirname 加载字体文件，需排除在 Turbopack 打包之外
  serverExternalPackages: ['svg-captcha'],
  // 预连接第三方资源
  async headers() {
    // 开发环境跳过安全头（避免 localhost vs 127.0.0.1 的警告）
    if (process.env.NODE_ENV === 'development') {
      return [];
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  // 转发 ai请求到后端服务
  rewrites: async () => {
    return [
      {
        source: '/ai/api/:path*',
        destination: `${process.env.AI_BASE_URL}/api/:path*`,
      },
      {
        source: '/api/uploads/:path*',
        destination: `${process.env.BACKEND_BASE_URL}/api/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
