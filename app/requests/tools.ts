import { aiHttp } from '@/utils/http';

export type SendEmailCodeRequest = {
    /** 邮箱 */
    email: string
};
/**
 * 发送邮件验证码
 * @param data 
 * @returns 
 */
export const sendEmailCode = async (data: SendEmailCodeRequest) => 
  await aiHttp.post<SendEmailCodeRequest, null, 'obj'>('/api/tool/sendEmailCode', data);

