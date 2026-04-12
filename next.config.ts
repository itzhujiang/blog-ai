import type { NextConfig } from 'next';


const nextConfig: NextConfig = {
  /* 配置优化 */
  // svg-captcha 依赖 __dirname 加载字体文件，需排除在 Turbopack 打包之外
  serverExternalPackages: ['svg-captcha'],
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
  // 转发 ai请求到后端服务
  rewrites: async () => {
    return [
      {
        source: '/api/ai/:path*',
        destination: `${process.env.AI_BASE_URL}/api/ai/:path*`,
      },
      {
        source: '/api/tool/:path*',
        destination: `${process.env.AI_BASE_URL}/api/tool/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.BACKEND_BASE_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
