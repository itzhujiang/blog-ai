import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* 配置优化 */

  // svg-captcha 依赖 __dirname 加载字体文件，需排除在 Turbopack 打包之外
  serverExternalPackages: ['svg-captcha'],

  // 允许从后端服务加载远程图片
  images: {
    dangerouslyAllowLocalIP: true, // 允许私有网络 IP 的图片优化（开发环境）
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.2.106',
        port: '8089',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8089',
        pathname: '**',
      },
    ],
  },
  // 转发 ai请求到后端服务
  rewrites: async () => {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.BACKEND_BASE_URL}/uploads/:path*`,
      },
    ];
  },
  // 预连接第三方资源
  async headers() {
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
};

export default nextConfig;
