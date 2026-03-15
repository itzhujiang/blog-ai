import { aiHttp } from '@/utils/http';

export type SendPhoneCodeRequest = {
    /** 手机号 */
    phone: string
};
/**
 * 发送短信
 * @param data 
 * @returns 
 */
export const sendPhoneCode = async (data: SendPhoneCodeRequest) => 
  await aiHttp.post<SendPhoneCodeRequest, null, 'obj'>('/api/tool/code/sendPhoneCode', data);

