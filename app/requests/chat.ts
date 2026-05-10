import { aiHttp } from '@/utils/http';
import { AiChatMessageRoleType } from '@/utils/types';

import { AiChatMessageType } from '../utils/types';

export type ParamType = {
    /** 页码 */
    page?: number,
    /** 每页数量 */
    size?: number
} 

export type SessionListRequestType = {
    sort?: 'ASC' | 'DESC'
}


// 会话列表
export type SessionListResponseType = {
  /** id */
  id: number;
  /** 标题 */
  title: string;
  /** 最后一条实际消息的摘要，用于会话列表展示 */
  lastMessagePreview: string;
  /** 最后一条实际消息的时间，用于会话排序（毫秒级Unix时间戳） */
  lastMessageAt: number;
};

/**
 * 获取会话列表
 * @param param
 * @returns 
 */
export const getSessionList = async ({ page = 1, size = 10, sort = 'ASC' }: ParamType & SessionListRequestType) => 
  await aiHttp.get<SessionListRequestType, SessionListResponseType, 'arr'>('/api/ai/ai-chat/getSessionList', {
    params: {
      page,
      size,
      sort
    }
  });

export type MessageListRequestType = {
  /** id */
  id?: number;
  /** 排序 */
  sort?: 'ASC' | 'DESC'
} & ParamType

export type MessagesResponseType = {
  /** 消息id */
  id: number;
  /** 服务id */
  serverId: string;
  /** 会话id */
  sessionId: number;
  /** 角色 */
  role: AiChatMessageRoleType;
  /** 消息类型 */
  messageType: AiChatMessageType
  /** 内容 */
  content: string;
  /** 创建时间 */
  createdAt: number;
}


/**
 * 获取消息列表
 * @param param
 * @returns 
 */
export const getMessageList = async ( params: MessageListRequestType) => 
  await aiHttp.get<MessageListRequestType, MessagesResponseType, 'arr'>('/api/ai/ai-chat/getMessages', {
    params
  });

type SendMessageRequestType = {
  /** 用户消息 */
  message: string;
  /** 客户端信息id */
  localId: string;
  /** 会话id */
  sessionId?: number
}


type SendMessageResponseType = {
  /** 前端id */
  clientMessageId: string;
  /** 服务端id */
  serverId: string;
}

export const sendMessage = async (data: SendMessageRequestType) => 
  await aiHttp.post<SendMessageRequestType, SendMessageResponseType, 'obj'>('/api/ai/ai-chat/sendMessage', data);

type ToolResultResponseType = {
  /** 工具id */
  toolId: string;
  /** 工具返回结果 */
  toolResult: string;
}

export const toolResult = async (data:ToolResultResponseType) => await aiHttp.post<ToolResultResponseType, null, 'obj'>('/api/ai/ai-chat/toolResult', data);
