import { aiHttp } from '@/utils/http';
import { showMessage } from '@/utils/utils';

import { ChatMessage, MessageType } from './types';

import { getMessageList, getSessionList, ParamType, sendMessage, SessionListRequestType, SessionListResponseType } from '@/requests/index';
/**
 * SSE 服务端推送的数据格式
 */
export interface SSEMessage {
  /** 消息类型 */
  type: MessageType;
  /** 消息内容（流式传输的文本片段） */
  content?: string;
  /** 服务端信息 ID */
  serverId: string;
  createdAt?: number;
}


class SSE {
  private eventSource: EventSource | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // 初始延迟 1 秒
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private messageList: ChatMessage[] = [];
  private sessionList: SessionListResponseType[] = [];

  /**
   * messageList修改后触发的
   */
  onUpdateMessage: (_messages: ChatMessage[]) => void = () => {};

  /**
   * sessionList修改后触发
   */
  onUpdateSession: (_sessionList: SessionListResponseType[])  => void = () => {};


  /**
   * 创建连接
   */
  createConnection() {
    if (this.getConnectionState() === 'not-created' || this.getConnectionState() === 'closed') {
      this.eventSource = new EventSource('/api/ai/ai-chat/chat', {
        withCredentials: true,
      });

      this.eventSource.addEventListener('open', () => {
        console.log('连接成功');
        this.reconnectAttempts = 0; // 重置重连次数
        this.reconnectDelay = 1000; // 重置延迟
      });

      this.eventSource.addEventListener('system', (event: MessageEvent<string>) => {
        this.handleMessage(event.data);
      });

      this.eventSource.addEventListener('message', (event: MessageEvent<string>) => {
        this.handleMessage(event.data);
      });

      this.eventSource.addEventListener('error', async (err) => {
        console.error('连接断开，准备重连...', err);
        await aiHttp.head('/api/ai/ai-chat/chat');
        this.closeConnection();
        this.autoReconnect(); // 自动重连
      });
    }
  }

  /**
   * 关闭连接
   */
  closeConnection() {
    // 清除重连定时器
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      console.log('连接已关闭');
      this.eventSource = null;
    }
  }

  /**
   * 自动重连（带指数退避）
   */
  private autoReconnect() {
    // 超过最大重连次数
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`重连失败，已达到最大重连次数 ${this.maxReconnectAttempts}`);
      return;
    }

    this.reconnectAttempts = this.reconnectAttempts + 1;
    console.log(`第 ${this.reconnectAttempts} 次重连，延迟 ${this.reconnectDelay}ms`);

    // 设置重连定时器
    this.reconnectTimer = setTimeout(() => {
      this.createConnection();
      // 指数退避：每次延迟翻倍，最大 30 秒
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }

  private handleMessage(data: string) {
    console.log('data', data);
    const msg = JSON.parse(data) as SSEMessage;
    switch (msg.type) {
      // 连接时信息
      case 'connected':
        const connectedMsg = [{
          serverId: msg.serverId,
          role: 'system' as const,
          status: 'success' as const,
          content: msg.content,
          createdAt: msg.createdAt!
        }];
        this.setMessageList('push', connectedMsg);
        break;
      // 信息流开始时
      case 'typing':
        const typingMsg = [{
          serverId: msg.serverId,
          role: 'assistant' as const,
          content: '',
          status: 'sending' as const,
          createdAt: msg.createdAt!
        }];
        this.setMessageList('push', typingMsg);
        break;
      // 信息流中间时
      case 'chunk':
        const messageChunk = this.messageList.find(item => item.serverId === msg.serverId);
        if (messageChunk) {
          messageChunk.content = messageChunk.content + msg.content!;
          this.setMessageList('update', messageChunk, messageChunk.localId!);
        }
        
        break;
      case 'done':
        const messageDone = this.messageList.find(item => item.serverId === msg.serverId);
        if (messageDone) {
          messageDone.status = 'success';
          this.setMessageList('update', messageDone, messageDone.localId!);
        }
        break;
    }
    this.onUpdateMessage(this.messageList);
  }

  /**
   * 手动重连（重置重连次数）
   */
  reconnect() {
    console.log('手动重连...');
    this.reconnectAttempts = 0; // 重置重连次数
    this.reconnectDelay = 1000; // 重置延迟
    this.closeConnection();
    this.createConnection();
  }

  /**
   * 停止自动重连
   */
  stopAutoReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
      console.log('已停止自动重连');
    }
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  /**
   * 获取连接状态
   */
  getConnectionState(): 'connecting' | 'open' | 'closed' | 'not-created' {
    if (!this.eventSource) return 'not-created';
    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return 'connecting';
      case EventSource.OPEN:
        return 'open';
      case EventSource.CLOSED:
        return 'closed';
      default:
        return 'not-created';
    }
  }
  /**
   * 设置信息列表
   * @param msg
   * @param insert
   */
  private setMessageList(_insert: 'reset'): void;
  private setMessageList(_insert: 'push', _msg: ChatMessage[]): void;
  private setMessageList(_insert: 'unshift', _msg: ChatMessage[]): void;
  private setMessageList(_insert: 'update', _msg: ChatMessage, _localId: string): void;
  private setMessageList(
    insert: 'reset' | 'push' | 'unshift' | 'update',
    msg?: ChatMessage[] | ChatMessage,
    localId?: string
  ): void {
    const msgMap = {
      push: () => {
        this.messageList = [...this.messageList, ...(msg as ChatMessage[])];
      },
      unshift: () => {
        this.messageList = [...(msg as ChatMessage[]), ...this.messageList];
      },
      reset: () => {
        this.messageList = [];
      },
      update: () => {
        if (!localId) {
          return;
        }
        this.messageList = this.messageList.map((item) => {
          return item.localId === localId ? msg as ChatMessage : item;
        });
      }
    };
    msgMap[insert]();
    this.onUpdateMessage(this.messageList);
  }
  
  private setSessionList(sessionList: SessionListResponseType[]) {
    this.sessionList = [...this.sessionList, ...sessionList];
    this.onUpdateSession(this.sessionList);
  }

  /**
   * 发送消息
   * @param msg 信息 
   * @param sessionId 会话id
   * @returns 
   */
  async sendMessage(msg: string, sessionId?: number) {
    try {
      const localId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const data = {
        message: msg,
        localId,
        sessionId
      };
      this.messageList.push({
        role: 'user',
        content: msg,
        serverId: '',
        localId,
        status: 'sending',
        createdAt: Date.now(),
      });
      const res = await sendMessage(data);
      if (res.code === 200) {
        const clientMessageId = res.data!.data.clientMessageId;
        const message = this.messageList.find(item => item.localId === clientMessageId);
        if (message) {
          message.serverId = clientMessageId;
          message.status = 'success';
        }
        showMessage({
          message: res.msg,
          type: 'success'
        });
        return;
      }
      const message = this.messageList.find(item => item.localId === localId);
      if (message) {
        message.status = 'fail';
      }
      showMessage({
        message: res.msg,
        type:  'error' 
      });
    } catch (error) {
      console.error(error);
    }
  }
  

  /**
   * 获取会话列表
   */
  async getSessionList({ page = 1, size = 10, sort = 'ASC' }: ParamType & SessionListRequestType) {
    const res = await getSessionList({
      page,
      size,
      sort
    });
    if (res.code === 200) {
      console.log('setSessionList', res.data?.data);
      
      this.setSessionList(res.data?.data || []);
      return res;
    } else {
      showMessage({
        message: res.msg,
        type: 'error'
      });
    }
  }

  /**
   * 获取会话信息
   * @param id 会话id
   */
  async getMessages(id?: number, page: number = 1, size: number = 10, sort: 'ASC' | 'DESC' = 'ASC') {
    const res = await getMessageList({
      id,
      page,
      size,
      sort
    });
    if (res.code === 200) {
      const result = res.data?.data.map(item => {
        return {
          localId: '',
          serverId: item.serverId,
          content: item.content,
          role: item.role,
          createdAt: item.createdAt,
          status: 'success' as const
        };
      });
      result && this.setMessageList('push', result);
    } else {
      showMessage({
        message: res.msg,
        type: 'error'
      });
    }

  }
  /**
   * 重置会话列表
   */
  resetSessionList() {
    this.setMessageList('reset');
  }

  /**
   * 重置消息列表
   */
  resetMessages() {
    this.setSessionList([]);
  }

};

const aiEventSource = new SSE();

export default aiEventSource;
