'use client';
import { AgentSubscriber, AgentSubscriberParams, RunAgentInput, RunStartedEvent, StepStartedEvent, TextMessageContentEvent, TextMessageEndEvent, TextMessageStartEvent, ToolCallStartEvent } from '@ag-ui/client';
import { applyPatch } from 'fast-json-patch';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import { getMessageList, getSessionList, SessionListResponseType, ParamType, SessionListRequestType, MessageListRequestType } from '@/requests/index';
import { createTools, toolsArr } from '@/tool';
import AgUi from '@/utils/chatAgui';
import { A2UI, AiChatMessageStatus, ChatMessage, SSEMessage } from '@/utils/types';
import { showMessage } from '@/utils/utils';

type SessionParam = ParamType & SessionListRequestType;


const DEFAULT_SESSION_PARAM: SessionParam = {
  page: 1,
  size: 10,
  sort: 'DESC'
};

const DEFAULT_MESSAGE_PARAM: MessageListRequestType = {
  page: 1,
  size: 20,
  id: undefined,
  sort: 'DESC'
};

interface AiChateState {
  /** 是否显示ai窗口 */
  visible: boolean;
  /** 消息列表 */
  messages: ChatMessage[];
  /** 会话列表 */
  sessionList: SessionListResponseType[];
  /** 标签页：1 为聊天，2 为历史 */
  tab: 1 | 2;
  /** 会话请求参数 */
  sessionParam: SessionParam;
  /** 消息请求参数 */
  messageParam: MessageListRequestType;
  /** 会话列表是否加载中 */
  isSessionLoading: boolean;
  /** 消息列表是否加载中 */
  isMessageLoading: boolean;
  /** 会话列表请求是否终止 */
  sessionTerminate: boolean;
  /** 消息列表请求是否终止 */
  messageTerminate: boolean;
  /** 线程id(会话id) */
  threadId: string;
}

type AiChateAction =  {
  /** 打开对话窗口 */
  type: 'openChat'
} | {
  /** 关闭对话窗口 */
  type: 'closeChat'
} | {
  /** 重置所有状态 */
  type: 'resetState',
  payload?: {
    visible?: boolean
  }
} | {
  /** 应用SSE消息 */
  type: 'applySseMessage',
  payload: {
    message: SSEMessage
  }
} | {
  /** 重置session相关的state */
  type: 'resetSessionState'
} | {
  /** 重置message相关的state */
  type: 'resetMessageState',
  payload: {
    id?: number
  }
} | {
  /** 设置loading */
  type: 'setSessionLoading' | 'setMessageLoading',
  payload: {
    loading: boolean
  }
} | {
  /** 设置terminate */
  type: 'setSessionTerminate' | 'setMessageTerminate',
  payload: {
    terminate: boolean
  }
} | {
  /** 追加会话列表，并在 reducer 中统一处理去重、终止标记和分页推进 */
  type: 'appendSessionList',
  payload: {
    sessionList: SessionListResponseType[];
    total: number;
  }
} | {
  /** 追加消息列表（如需实现消息分页） */
  type: 'appendMessageList',
  payload: {
    messageList: ChatMessage[];
    total: number;
  }
} | {
  type: 'pushMessage',
  payload: {
    message: ChatMessage
  }
} | {
  type: 'updateMessage',
  payload: {
    status?: AiChatMessageStatus;
    content?: string;
    id: string
  }
} | {
  type: 'switchTab',
  payload: {
    tab: 1 | 2
  }
} | {
  type: 'setThreadId',
  payload:{
    threadId: string
  }
}

const initialState: AiChateState = {
  visible: false,
  messages: [],
  sessionList: [],
  tab: 1,
  threadId: '',
  sessionParam: DEFAULT_SESSION_PARAM,
  messageParam: DEFAULT_MESSAGE_PARAM,
  isSessionLoading: false,
  isMessageLoading: false,
  sessionTerminate: false,
  messageTerminate: false
};


function reducer(state: AiChateState, action: AiChateAction): AiChateState {
  switch (action.type) {
    case 'openChat':
      return {
        ...state,
        visible: true,
        tab: 1,
      };
    case 'closeChat':
      return {
        ...state,
        visible: false
      };
    case 'resetState':
      return {
        ...initialState,
        visible: action.payload?.visible || false,
        threadId: action.payload?.visible ? state.threadId : '', // 如果关闭聊天窗口，则重置 threadId
        messages: action.payload?.visible ? state.messages : [], // 如果关闭聊天窗口，则清空消息列表
      };
    case 'applySseMessage':
      return {
        ...state,
      };
    case 'resetSessionState':
      return {
        ...state,
        sessionList: [],
        sessionParam: DEFAULT_SESSION_PARAM,
        isSessionLoading: false,
        sessionTerminate: false,
      };
    case 'resetMessageState':
      return {
        ...state,
        messages: [],
        messageParam: {
          ...DEFAULT_MESSAGE_PARAM,
          id: action.payload.id
        },
        isMessageLoading: false,
        messageTerminate: false
      };
    case 'setSessionLoading':
      return {
        ...state,
        isSessionLoading: action.payload.loading
      };
    case 'setMessageLoading':
      return {
        ...state,
        isMessageLoading: action.payload.loading
      };
    case 'setMessageTerminate':
      return {
        ...state,
        messageTerminate: action.payload.terminate
      };
    case 'setSessionTerminate':
      return {
        ...state,
        sessionTerminate: action.payload.terminate
      };
    case 'appendSessionList':
      const existingIds = new Set(state.sessionList.map((item) => item.id));
      const nextItems = action.payload.sessionList.filter((item) => !existingIds.has(item.id));
      const mergedSessionList = [...state.sessionList, ...nextItems];
      const isDone = action.payload.total > 0 && mergedSessionList.length >= action.payload.total;

      return {
        ...state,
        sessionList: mergedSessionList,
        sessionTerminate: isDone,
        sessionParam: {
          ...state.sessionParam,
          page: (state.sessionParam.page || 0) + 1,
        },
      };
    case 'pushMessage':
      return {
        ...state,
        messages: [
          ...state.messages,
          action.payload.message
        ]
      };
    case 'updateMessage':
      const message = state.messages.map(item => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            status: action.payload.status || item.status,
            content: action.payload.content !== undefined ? action.payload.content : item.content
          } as ChatMessage;
        }
        return item;
      });  
      
      return {
        ...state,
        messages: message
      };
    case 'switchTab':
      return {
        ...state,
        tab: action.payload.tab
      };
    case 'appendMessageList':
      const existingMsgIds = new Set(state.messages.map((item) => item.id));
      const nextMsgItems = action.payload.messageList.filter((item) => !existingMsgIds.has(item.id));
      const mergedMessageList = [...state.messages, ...nextMsgItems];
      const isMsgDone = action.payload.total > 0 && mergedMessageList.length >= action.payload.total;
      return {
        ...state,
        messages: mergedMessageList.reverse(),
        messageTerminate: isMsgDone,
        messageParam: {
          ...state.messageParam,
          page: (state.messageParam.page || 0) + 1,
        },
      };
    case 'setThreadId':
      return {
        ...state,
        threadId: action.payload.threadId
      };
    default:
      return state;
  }
}


/**
 * AI 聊天业务编排 Hook。
 * 负责聊天弹窗状态、SSE 订阅、会话列表、消息列表和发送消息等交互逻辑。
 */
export const useAiChat = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const agUiRef = useRef<AgUi>(null);
  const isCloseView = useRef<boolean>(true); // 是否是关闭窗口引起的 threadId 变更，避免误触发 useEffect
  const subscriber: AgentSubscriber  = {
    onRunInitialized: (params: AgentSubscriberParams) => {
      console.log('onRunInitialized', params);
      const msg = params.messages[params.messages.length - 1];
      dispatch({
        type: 'pushMessage',
        payload: {
          message: {
            contentPos: 'chat',
            contentType: 'string',
            id: msg.id,
            content: msg.content as string,
            role: msg.role,
            createdAt: Date.now(),
            status: 'pending',
          }
        }
      });
    },
    onStepStartedEvent: (params: { event: StepStartedEvent } & AgentSubscriberParams) => {
      console.log('onStepStartedEvent', params);
    },
    onActivitySnapshotEvent: (params) => {
      dispatch({
        type: 'pushMessage',
        payload: {
          message: {
            contentPos: 'chat',
            contentType: 'string',
            id: params.event.messageId,
            content: params.event.content.content,
            role: 'activity',
            createdAt: params.event.timestamp!,
            status: params.event.content.status,
          }
        }
      });
    },
    onActivityDeltaEvent: (params) => {
      console.log('onActivityDeltaEvent', params, state.messages);
      const activityMessage = params.activityMessage;
      if (!activityMessage) {
        return;
      }

      const newMsg = applyPatch(activityMessage.content, params.event.patch).newDocument as {
        content: string;
        status: AiChatMessageStatus;
      };
      dispatch({
        type: 'updateMessage',
        payload: {
          id: params.event.messageId,
          content: newMsg.content,
          status: newMsg.status,
        }
      });
    },
    // agent开始生成文本消息
    onTextMessageStartEvent: (params: { event: TextMessageStartEvent } & AgentSubscriberParams) => {
      console.log('onTextMessageStartEvent', params);
      dispatch({
        type: 'pushMessage',
        payload: {
          message: {
            contentPos: 'chat',
            contentType: 'string',
            id: params.event.messageId,
            content: '',
            role: params.event.role,
            createdAt: params.event.timestamp!,
            status: 'pending',
          }
        }
      });
    },

    // agent内容输出中
    onTextMessageContentEvent: (params: { event: TextMessageContentEvent; textMessageBuffer: string } & AgentSubscriberParams) => {
      console.log('onTextMessageContentEvent', params);
      dispatch({
        type: 'updateMessage',
        payload: {
          id: params.event.messageId,
          content: params.textMessageBuffer + params.event.delta,
          status: 'pending'
        }
      });
    },
    onTextMessageEndEvent: (params: { event: TextMessageEndEvent; textMessageBuffer: string } & AgentSubscriberParams) => {
      console.log('onTextMessageEndEvent', params);
      dispatch({
        type: 'updateMessage',
        payload: {
          id: params.event.messageId,
          content: params.textMessageBuffer,
          status: 'success'
        }      
      });
    },
    onToolCallStartEvent: (params: { event: ToolCallStartEvent & {toolType: 'clientTool' | 'serverTool', toolCallArgs: {input: string}} } & AgentSubscriberParams ) => {
      const toolType = params.event.toolType;
      const toolCallName = params.event.toolCallName;
      const toolParams = params.event.toolCallArgs.input;
      const toolId = params.event.toolCallId;
      if (toolType === 'clientTool') {
        const tool = toolsArr.find(item => item.name === toolCallName);
        if (!tool) {
          return;
        }
        const dom = tool.run(JSON.parse(toolParams), toolId);
        dispatch({
          type: 'pushMessage',
          payload: {
            message: {
              contentType: 'reactDom',
              content: dom,
              id: toolId,
              createdAt: params.event.timestamp!,
              role: 'assistant',
              status: 'success',
              contentPos: tool.renderingPos,
            }
          }
        });
      }
    },
    onToolCallEndEvent(params) {
      const toolId = params.event.toolCallId;
      if (toolId) {
        dispatch({
          type: 'updateMessage',
          payload: {
            id: toolId,
            status:  'success'
          }
        });
      }
    },
    // agent开始
    onRunStartedEvent: (params: { event: RunStartedEvent } & AgentSubscriberParams) => {
      console.log('onRunStartedEvent', params);
      const msg = params.messages[params.messages.length - 1];
      dispatch({
        type: 'updateMessage',
        payload: {
          id: msg.id,
          status: 'success'
        }
      });
    },
    onCustomEvent: (params) => {
      console.log('onCustomEvent', params);
      const event = params.event;
      if (event.name === 'a2ui') {
        const content = event.value as A2UI[];
        const id = event.customId as string;
        dispatch({
          type: 'pushMessage',
          payload: {
            message: {
              id,
              content,
              contentPos: 'chat',
              contentType: 'a2ui',
              createdAt: params.event.timestamp!,
              role: 'assistant',
              status: 'success'
            }
          }
        });
      }
    }
  };
  /**
   * 在聊天窗口打开时建立 SSE 订阅，并在关闭或卸载时清理连接。
   */
  useEffect(() => {
    if (!state.visible) {
      return;
    }
    console.log('state.messages', JSON.stringify(state.messages), state.threadId);
    agUiRef.current = new AgUi({
      threadId: state.threadId || '',
      subscriber,
      historyMessages: state.messages.map(item => {
        return {
          role: item.role,
          content: item.contentType === 'string' ? item.content as string : '',
          id: item.id,
        };
      }) as RunAgentInput['messages'],
    });

    return () => {
      agUiRef.current?.clearSubscribe();
      agUiRef.current = null;
      dispatch({
        type: 'resetState',
        payload: {
          visible: !isCloseView.current || false,

        }
      });
    };
  }, [state.visible, state.threadId]);

  /**
   * 重置会话列表及其分页状态
   */
  const resetSessionState = useCallback(() => {
    dispatch({
      type: 'resetSessionState'
    });
  }, []);

  /**
   * 按会话维度重置消息列表、分页参数和加载终止标记。
   */
  const resetMessageState = useCallback((sessionId?: number) => {
    dispatch({
      type: 'resetMessageState',
      payload: {
        id: sessionId
      }
    });
  }, []);

  /**
   * 拉取会话分页数据，追加到会话列表中。
   */
  const loadSessionList = useCallback(async (params?: SessionParam) => {
    const requestParam = params || state.sessionParam;

    if (state.isSessionLoading || state.sessionTerminate) {
      return;
    }

    dispatch({
      type: 'setSessionLoading',
      payload: {
        loading: true
      }
    });

    try {
      const res = await getSessionList({
        page: requestParam.page,
        size: requestParam.size,
        sort: requestParam.sort,
      });

      if (res.code !== 200) {
        showMessage({
          message: res.msg,
          type: 'error',
        });
        return;
      }
      dispatch({
        type: 'appendSessionList',
        payload: {
          sessionList: res.data?.data || [],
          total: res.data?.pagination.total || 0,
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: 'setSessionLoading',
        payload: {
          loading: false
        }
      });
    }
  }, [state.isSessionLoading, state.sessionParam, state.sessionTerminate]);

  /**
   * 拉取指定会话的历史消息，并在顶部追加更早的消息记录。
   * @param {Boolean} isAppend 是否强制追加 
   * 
   */
  const loadMessageList = useCallback(async (params?: MessageListRequestType, isAppend: boolean = false) => {
    const requestParam = params || state.messageParam;
    if ((state.isMessageLoading || state.messageTerminate || !requestParam.id) && !isAppend) {
      return;
    }
    dispatch({
      type: 'setMessageLoading',
      payload: {
        loading: true
      }
    });
    try {
      const res = await getMessageList({
        id: requestParam.id,
        page: requestParam.page || 1,
        size: requestParam.size || 20,
        sort: requestParam.sort || 'DESC',
      });
      if (res.code !== 200) {
        showMessage({
          message: res.msg,
          type: 'error',
        });
        return;
      }
      const messageList: ChatMessage[] = res.data?.data.map(item => {
        if (item.messageType === 'A2UI') {
          return {
            id: item.messageId,
            createdAt: item.createdAt,
            status: 'success' as AiChatMessageStatus,
            content: item.content as unknown as A2UI[],
            contentPos: 'chat' as const,
            contentType: 'a2ui' as const,
            role: item.role,
          };
        }
        return {
          id: item.messageId,
          createdAt: item.createdAt,
          status: 'success' as AiChatMessageStatus,
          content: item.content as string,
          contentPos: 'chat' as const,
          contentType: 'string' as const,
          role: item.role,
        };
      }) || [];
      console.log('loadMessageList', messageList);
      console.log('state.threadId', state.threadId);
      dispatch({
        type: 'appendMessageList',
        payload: {
          messageList: messageList,
          total: res.data?.pagination.total || 0,
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({
        type: 'setMessageLoading',
        payload: {
          loading: false
        }
      });
    }
  }, [state.isMessageLoading, state.messageParam, state.messageTerminate]);

  /**
   * 切换聊天窗口显隐，并在打开时初始化会话与消息数据。
   */
  const openChat = useCallback(async () => {
    dispatch({
      type: 'openChat'
    });
    resetSessionState();
    resetMessageState();
    await loadSessionList(DEFAULT_SESSION_PARAM);
  }, [loadSessionList, resetMessageState, resetSessionState]);

  /**
   * 关闭聊天窗口。
   */
  const closeChat = useCallback(() => {
    isCloseView.current = true;
    dispatch({
      type: 'closeChat'
    });
  }, []);

  /**
   * 发送用户消息，并根据接口结果更新本地消息状态。
   */
  const submitMessage = useCallback(async (content: string) => {
    const localMessage = agUiRef.current!.createUserMessage(content);
    const runId = agUiRef.current!.createRunId();
    try {
      const tools = createTools(toolsArr);
      await agUiRef.current!.run(localMessage, runId, tools);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * 处理会话列表滚动。
   */
  const onSessionScroll = useCallback(async () => {
    await loadSessionList();
  }, [loadSessionList]);

  /**
   * 处理消息列表滚动。
   */
  const onMessageScroll = useCallback(async () => {
    if (!state.messageParam.id) {
      return;
    }
    await loadMessageList({
      ...state.messageParam,
      id: state.messageParam.id,
    });
  }, [loadMessageList, state.messageParam]);

  /**
   * 切换聊天与历史标签，并在需要时补拉会话列表。
   */
  const onTabSwitchClick = useCallback(async (nextTab: 1 | 2 = 1) => {
    dispatch({
      type: 'switchTab',
      payload: {
        tab: nextTab
      }
    });
    if (nextTab === 2 && state.sessionList.length === 0) {
      await loadSessionList();
    }
  }, [loadSessionList, state.sessionList]);

  /**
   * 选择历史会话后重置当前消息状态，并加载对应的聊天记录。
   */
  const onSelectSessionClick = useCallback(async (id: number, threadId: string) => {
    const nextMessageParam: MessageListRequestType = {
      ...DEFAULT_MESSAGE_PARAM,
      id
    };
    resetMessageState(id);
    dispatch({
      type: 'switchTab',
      payload: {
        tab: 1
      }
    });
    isCloseView.current = false;
    
    await loadMessageList(nextMessageParam, true);
    dispatch({
      type: 'setThreadId',
      payload: {
        threadId,
      }
    });
  }, [loadMessageList, resetMessageState]);

  return useMemo(() => ({
    state,
    openChat,
    closeChat,
    submitMessage,
    onSessionScroll,
    onMessageScroll,
    onTabSwitchClick,
    onSelectSessionClick,
  }), [
    state,
    closeChat,
    onMessageScroll,
    onSelectSessionClick,
    onSessionScroll,
    onTabSwitchClick,
    openChat,
    submitMessage,
  ]);
};
