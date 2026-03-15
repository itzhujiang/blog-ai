export interface UserInfo {
    /** id */
    id?: number,
    /** 手机号 */
    phone?: string,
    /** 是否登录 */
    isLogin: boolean
}

/**
 * 消息发送者类型
 */
export type AiChatMessageRoleType = 'user' | 'assistant' | 'system'

export type MessageType = 'chunk' | 'done' | 'typing' | 'connected'


/**
 * AI 聊天消息
 */
export interface ChatMessage {
  /** 客户端 ID */
  localId?: string;
  /** 服务端id */
  serverId: string;
  /** 消息内容 */
  content?: string;
  /** 发送者角色 */
  role: AiChatMessageRoleType;
  /** 创建时间 */
  createdAt: number;
  /** 消息状态 sending: 信息传输中，success：成功，fail: 失败 */
  status: 'sending' | 'success' | 'fail',
}


export type AiChatMessageType = 'text' | 'system';
