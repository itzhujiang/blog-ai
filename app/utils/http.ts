/**
 * Axios HTTP 客户端配置
 * 统一 API 调用风格，前后端一致
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

/**
 * 响应拦截器已提取 response.data，
 * 重新声明接口让 TS 知道返回值是 T 而非 AxiosResponse<T>
 */
interface Http extends AxiosInstance {
  get<T = unknown>(_url: string, _config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(_url: string, _data?: unknown, _config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(_url: string, _data?: unknown, _config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(_url: string, _data?: unknown, _config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(_url: string, _config?: AxiosRequestConfig): Promise<T>;
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 客户端环境，使用 console.error
    console.error('请求失败:', error.message);
    return Promise.reject(error);
  }
);

export const http = instance as Http;
