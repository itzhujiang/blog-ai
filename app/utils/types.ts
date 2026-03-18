export interface UserInfo {
    /** id */
    id?: number,
    /** 手机号 */
    phone?: string,
    /** 是否登录 */
    isLogin: boolean
}


export type AiChatMessageType = 'text' | 'system';
