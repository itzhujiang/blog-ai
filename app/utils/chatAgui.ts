import { AgentSubscriber, HttpAgent } from '@ag-ui/client';
import type { RunAgentInput } from '@ag-ui/core';

// import { aiHttp } from '@/utils/http';

import eventEmitter from './eventEmitter';
import { showMessage } from './utils';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

// type RunInputWithUserMessageType = {
//   /** 消息 */
//   content: string;
//   /** 历史信息列表 */
//   messages: RunAgentInput['messages'];
//   /** 线程id */
//   threadId: string;
//   /** 本轮对话id */
//   runId: string;
//   /** 工具 */
//   tools?: RunAgentInput['tools']
//   /** 上下文 */
//   context?: RunAgentInput['context'],
//   /** 父runId */
//   parentRunId?: string;
//   state?: RunAgentInput['state']
// }

interface AgUiType {
  /** 订阅器 */
  subscriber?: AgentSubscriber,
  /** 历史信息 */
  historyMessages?: RunAgentInput['messages'],
  /** 线程ID */
  threadId?: string;
}


class AgUi {
  private agent: HttpAgent | null = null;
  private unsubscribe: () => void = () => {};

  constructor({ historyMessages, threadId, subscriber }:AgUiType) {
    this.connection({ historyMessages, threadId, subscriber });
  }
  /**
   * 切换会话
   * @param param0 
   */
  switchSession({ historyMessages, threadId, subscriber }:AgUiType) {
    this.connection({ historyMessages, threadId, subscriber });
  }
  
  private connection({ historyMessages, threadId, subscriber }:AgUiType) {
    this.agent = null;
    this.createAgent(threadId);
    if (historyMessages) {
      this.agent!.addMessages(historyMessages);
    }
    if (subscriber) {
      const { unsubscribe } = this.agent!.subscribe(subscriber);
      this.unsubscribe = unsubscribe;
    }
  }
  
  /**
   * 创建 agent 实例。
   */
  private createAgent(threadId?: string) {
    this.agent =  new HttpAgent({
      url: '/api/ai/ai-chat/chat',
      threadId,
    });
  }

  isConnection() {
    return !!this.agent;
  }

  /**
   * 发送信息
   * @param input 信息
   * @returns
   */
  async run(message: RunAgentInput['messages'][number], runId: string, tools?: RunAgentInput['tools']) {
    try {
      if (!this.isConnection()) {
        return;
      }
      this.agent!.addMessage(message);
      return await this.agent!.runAgent({
        runId,
        tools,
      });
    } catch (error: any) {

      if (error.status === 500) {
        showMessage({
          message: '服务器异常',
          type: 'error',
        });
      }
      if (error.status === 401) {
        showMessage({
          message: '权限不通，请重新登录',
          type: 'error',
        });
        eventEmitter.emit('API:UN_AUTH', error.response?.config.url === '/api/ai/ai-chat/chat' && 'chat');
      }
    }
  }
  /**
   * 创建runid
   * @returns 
   */
  createRunId() {
    return createId('run');
  }

  createUserMessage(content: string): RunAgentInput['messages'][number] {
    return {
      id: createId('user'),
      content,
      role: 'user'
    };
  }

  clearSubscribe() {
    this.unsubscribe();
  }
}

export default AgUi;
