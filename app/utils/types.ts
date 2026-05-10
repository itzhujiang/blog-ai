import { Role, Tool } from '@ag-ui/core';
import { JSX } from 'react';
import { z } from 'zod/v3';

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


type ChatMessageBase = {
  /** 创建时间 */
  createdAt: number;
  /** 消息状态 */
  status: AiChatMessageStatus;
  /** id */
  id: string;
  /** 内容位置，body:全局，chat: 聊天框内 */
  contentPos: 'body' | 'chat';
  /** 角色 */
  role: AiChatMessageRoleType;
};

export type ChatMessage =
  | (ChatMessageBase & { contentType: 'string'; content: string })
  | (ChatMessageBase & { contentType: 'reactDom'; content: JSX.Element })
  | (ChatMessageBase & { contentType: 'a2ui'; content: A2UI[] });

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

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


export type ToolType<T = any> = Omit<Tool, 'parameters'> & {
  /** 工具参数的Zod schema */
  parameters?: z.ZodType<T>;
  /** 工具类型，js执行/tsx渲染 */
  type: 'js' | 'tsx';
  /** 渲染位置 */
  renderingPos: 'chat' | 'body';
  /** 工具的执行函数，可以是同步或异步的 */
  run: (_args: T, _toolId: string) => Promise<any> | any;
};

export type A2UIComponent =
  | { id: string; component: 'Image'; src: string; alt?: string }
  | { id: string; component: 'Text'; text: string; variant?: string }
  | { id: string; component: 'Column'; children: string[] }
  | { id: string; component: 'Row'; children: string[] };

export type A2UI =
  | { version: string; createSurface: { surfaceId: string } }
  | { version: string; updateComponents: { surfaceId: string; components: A2UIComponent[] } }
  | { version: string; updateDataModel: { surfaceId: string; path: string; value: unknown } }

