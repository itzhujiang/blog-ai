/**
 * Axios HTTP 客户端配置
 * 统一 API 调用风格，前后端一致
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios';

import eventEmitter from '@/utils/eventEmitter';
import { showMessage } from '@/utils/utils';

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

type ResponseFormatType = 'arr' | 'obj';

export type ResponseType<T, C extends ResponseFormatType = 'arr'> = {
  code: 200 | 401 | 500;
  data: {
    data: C extends 'arr' ? Array<T> : T;
    pagination: {
      page: number;
      size: number;
      total: number;
    };
  } | null;
  msg: string;
};

type AiHttp = Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete'> & {
  get<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _config?: AxiosRequestConfig<T>
  ): Promise<ResponseType<D, C>>;
  post<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _data?: T,
    _config?: AxiosRequestConfig
  ): Promise<ResponseType<D, C>>;
  put<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _data?: T,
    _config?: AxiosRequestConfig
  ): Promise<ResponseType<D, C>>;
  delete<T = null, D = null, C extends ResponseFormatType = 'arr'>(
    _url: string,
    _config?: AxiosRequestConfig<T>
  ): Promise<ResponseType<D, C>>;
};

type Server = 'ai' | '';

const instance = <T extends Server>(server: T) => {
  const request = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  request.interceptors.request.use(
    (config) => {
      // 可以添加认证 token 等
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  request.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (server === 'ai') {
        if (error.response.status === 500) {
          showMessage({
            message: '服务器异常',
            type: 'error',
          });
        }
        if (error.response.status === 401) {
          showMessage({
            message: '权限不通，请重新登录',
            type: 'error',
          });
          eventEmitter.emit('API:UN_AUTH', error.response.config.url === '/api/ai/ai-chat/chat' && 'chat');
        }
      }
      return Promise.reject(error);
    }
  );
  return request as T extends 'ai' ? AiHttp : Http;
};

export const http = instance('');
export const aiHttp = instance('ai');
