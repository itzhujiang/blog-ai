/**
 * Axios HTTP 客户端配置
 * 统一 API 调用风格，前后端一致
 */

import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 统一错误处理
    console.error('请求失败:', error.message);
    return Promise.reject(error);
  }
);
