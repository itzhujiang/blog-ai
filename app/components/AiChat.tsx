'use client';
import { useState, useActionState } from 'react';

import { MessageListRequestType, SessionListResponseType } from '@/requests/index';
import aiEventSource, { ChatMessage } from '@/utils/chatEventSource';

import { showMessage } from '../utils/utils';

import AiDialogue from './AiDialogue';
import AiSessionList from './AiSessionList';


export default function AiChat() {
  const [isAiChatVisible, setVisible] = useState(false);
  const [_state, formAction, isPending] = useActionState(submitAction, '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionList, setSessionList] = useState<SessionListResponseType[]>([]);
  const [tab, setTab] = useState<1 | 2>(1);
  const [sessionParam, setSessionParam] = useState({
    page: 1,
    size: 10,
  });
  const [isSessionLoading, setSessionLoading] = useState(false);
  const [isMessageLoading, setMessageLoading] = useState(false);
  const [sessiionTerminate, setSessionTerminate] = useState(false);
  const [messageTerminate, setMessageTerminate] = useState(false);
  const [messageParam, setMessageParam] = useState<{
    page: number,
    size: number,
    sessionId?: number
  }>({
    page: 1,
    size: 10,
    sessionId: undefined
  }); // 当前选中的会话id

  
  /**
   * 提交
   * @param previousState
   * @param formData
   * @returns
   */
  async function submitAction(previousState: string, formData: FormData) {
    const message = formData.get('message');
    if (!message) {
      showMessage({
        message: '请输入消息',
        type: 'error'
      });
      return '';
    }
    await aiEventSource.sendMessage(message!.toString());
    return '';
  };

  /**
   * 处理消息
   */
  const handleMessage = () => {
    aiEventSource.onUpdateMessage = (msg) => {
      setMessages([
        ...messages,
        ...msg
      ]);
    };
  };

  const handleSession = () => {
    aiEventSource.onUpdateSession = (session) => {
      setSessionList([
        ...sessionList,
        ...session
      ]);
    };
  };

  /**
   * 点击显示AI聊天窗口时，先进行数据校验，如果校验通过则显示窗口，否则提示用户进行手机号验证
   */
  const onVisibleClick = async () => {
    setVisible(!isAiChatVisible);
    handleMessage();
    handleSession();
    aiEventSource.resetMessages();
    aiEventSource.createConnection();
    await onSessionScoll();
  };
  /**
   * 滚动触发获取Session列表
   * @returns 
   */
  const onSessionScoll = async () => {
    if (isSessionLoading || sessiionTerminate) {
      return;
    }
    setSessionLoading(true);
    const res = await aiEventSource.getSessionList({
      page: sessionParam.page, size: sessionParam.size, sort: 'DESC'
    }).catch(err => {
      console.log('err', err);
    });
    setSessionParam({
      ...sessionParam,
      page: sessionParam.page + 1
    });
    if (res?.data?.pagination.total && res.data.pagination.total >= sessionList.length) {
      setSessionTerminate(true);
    }
    setSessionLoading(false);
  };

  /**
   * 获取信息列表
   * @param params 
   * @returns 
   */
  const getMessageList = async (params: MessageListRequestType) => {
    if (isMessageLoading || messageTerminate || !messageParam.sessionId) {
      return;
    }
    setMessageLoading(false);
    const res = await aiEventSource.getMessages(params).catch(err => {
      console.log('err', err);
    });
    setMessageParam({
      ...messageParam,
      page: messageParam.page + 1,
    });
    if (res?.data?.pagination.total &&  res.data.pagination.total >= messages.length) {
      setMessageTerminate(true);
    }
    setMessageLoading(false);
  };

  /**
   * 消息列表滚动
   * @returns 
   */
  const onMessageScoll = async () => {
    getMessageList(messageParam);
  };

  /**
   * 列表、聊天切换
   */
  const onTabSwitchClcik = async (tab: 1 | 2 = 1) => {
    if (tab === 2) {
      setSessionParam({
        ...sessionParam,
        page: 0
      });
      aiEventSource.resetSessionList();
    }
    setTab(tab);
  };

  /**
   * 点击选择对应的会话
   * @param id 
   */
  const onSelectSessionClick = (id: number) => {
    setMessageParam({
      page: 1,
      size: 10,
      sessionId: id
    });
    setMessageTerminate(false);
    setTab(1);
  };

  
  return (
    <div className="absolute bottom-10 right-10 flex flex-col items-end z-30">
      { isAiChatVisible ?
        <div className="z-50 w-full max-w-[90vw] h-[70vh] flex flex-col overflow-hidden rounded-xl border border-primary/20 bg-background-light shadow-natural-hover dark:bg-background-dark sm:w-96 sm:h-[500px] md:w-[500px] md:h-[600px] mb-5">
          {/* 头部 */}
          <div className="flex items-center justify-between bg-primary/10 p-4 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <span className="font-bold text-text-light dark:text-text-dark">AI 助手</span>
            </div>
            <button className="text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark cursor-pointer" onClick={() => setVisible(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Tab 功能区 */}
          <div className="flex items-center gap-1 p-2 bg-background-light/50 dark:bg-background-dark/50 border-b border-primary/10">
            <button
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer flex-1 ${
                tab === 1
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary'
                  : 'text-text-light/70 dark:text-text-dark/70 hover:bg-primary/10'
              }`}
              onClick={() => onTabSwitchClcik(1)}
            >
              <span className='material-symbols-outlined !text-lg'>forum</span>
              <span className="text-sm font-medium">聊天</span>
            </button>

            <button
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer flex-1 ${
                tab === 2
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary'
                  : 'text-text-light/70 dark:text-text-dark/70 hover:bg-primary/10'
              }`}
              onClick={() => onTabSwitchClcik(2)}
            >
              <span className='material-symbols-outlined !text-lg'>history</span>
              <span className="text-sm font-medium">历史</span>
            </button>
          </div>

          {
            tab === 1 ? <AiDialogue formAction={formAction} isPending={isPending} isLoading={isMessageLoading} messageList={messages} onMessagePullUp={onMessageScoll}></AiDialogue> :  <AiSessionList sessionList={sessionList} onSessionPullUp={onSessionScoll} isLoading={isSessionLoading} sessionId={massageParam.sessionId} onSelectSessionClick={onSelectSessionClick}></AiSessionList>
          }
        </div>
        : '' }

      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-natural hover:shadow-natural-hover transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer" onClick={onVisibleClick}>
        <span className="material-symbols-outlined !text-3xl">chat_bubble</span>
      </button>
    </div>
  );
}
