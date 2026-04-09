import { Role } from '@ag-ui/core';

export interface UserInfo {
    /** id */
    id?: number,
    /** 手机号 */
    phone?: string,
    /** 是否登录 */
    isLogin: boolean
}

export type AiChatMessageStatus = 'pending' | 'success' | 'fail'

export type AiChatMessageType = 'text' | 'system';

export type AiChatMessageRoleType = Role;


export type ChatMessage = {
  /** 创建时间 */
  createdAt: number;
  /** 消息状态 */
  status: AiChatMessageStatus;
  /** id */
  id: string;
  /** 内容 */
  content: string;
  /** 角色 */
  role: AiChatMessageRoleType
};

export interface SSEMessage {
  /** 服务端id */
  serverId: string;
  /** 消息内容 */
  content?: string;
  /** 发送者角色 */
  role: AiChatMessageRoleType;
  /** 创建时间 */
  createdAt: number;
  /** 会话id */
  sessionId: number;
}
