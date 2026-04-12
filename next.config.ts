import type { NextConfig } from 'next';

const backendBaseUrl = process.env.BACKEND_BASE_URL;

const nextConfig: NextConfig = {
  /* 配置优化 */
  // svg-captcha 依赖 __dirname 加载字体文件，需排除在 Turbopack 打包之外
  serverExternalPackages: ['svg-captcha'],
  // 转发 ai请求到后端服务
  rewrites: async () => {
    if (!backendBaseUrl) {
      return [];
    }

    return [
      {
        source: '/uploads/:path*',
        destination: `${backendBaseUrl.replace(/\/$/, '')}/uploads/:path*`,
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
