import { aiHttp } from '@/utils/http';

export type LoginRequest = {
  /** 手机号 */
  phone: string,
  /** 验证码 */
  code: string
};
/**
 * 发送短信
 * @param data 
 * @returns 
 */
export const login = async (data: LoginRequest) => 
  await aiHttp.post<LoginRequest, null, 'obj'>('/api/ai/ai-user/aiLogin', data);


export type UserInfo = {
  /** id */
  id: number,
  /** 手机号 */
  phone: string
}

/**
 * 获取用户信息
 * @returns 
 */
export const getUserInfo = async () => 
  await aiHttp.get<null, UserInfo, 'obj'>('/api/ai/ai-user/getUserInfo');
