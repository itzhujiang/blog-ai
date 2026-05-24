'use client';

import { useActionState } from 'react';

import { useAiChat } from '@/hooks/useAiChat';

import { showMessage } from '../utils/utils';

import AiDialogue from './AiDialogue';
import AiSessionList from './AiSessionList';


export default function AiChat() {
  const [_state, formAction, isPending] = useActionState(submitAction, '');
  const {
    closeChat,
    state,
    onMessageScroll,
    onSelectSessionClick,
    onSessionScroll,
    onTabSwitchClick,
    openChat,
    submitMessage,
  } = useAiChat();

  async function submitAction(previousState: string, formData: FormData) {
    const message = formData.get('message');

    if (!message || !message.toString().trim()) {
      showMessage({
        message: '请输入消息',
        type: 'error',
      });
      return previousState;
    }

    await submitMessage(message.toString().trim());

    return '';
  }
  return (
    <div className="absolute bottom-10 right-10 z-30 flex flex-col items-end">
      {state.visible ?
        <div className="z-50 mb-5 flex h-[70vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl border border-primary/20 bg-background-light shadow-natural-hover dark:bg-background-dark sm:h-[500px] sm:w-96 md:h-[600px] md:w-[500px]">
          <div className="flex items-center justify-between border-b border-primary/20 bg-primary/10 p-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <span className="font-bold text-text-light dark:text-text-dark">AI 助手</span>
            </div>
            <button className="cursor-pointer text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark" onClick={closeChat}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-primary/10 bg-background-light/50 p-2 dark:bg-background-dark/50">
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 transition-all cursor-pointer ${
                state.tab === 1
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary'
                  : 'text-text-light/70 hover:bg-primary/10 dark:text-text-dark/70'
              }`}
              onClick={() => onTabSwitchClick(1)}
            >
              <span className="material-symbols-outlined !text-lg">forum</span>
              <span className="text-sm font-medium">聊天</span>
            </button>

            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 transition-all cursor-pointer ${
                state.tab === 2
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary'
                  : 'text-text-light/70 hover:bg-primary/10 dark:text-text-dark/70'
              }`}
              onClick={() => onTabSwitchClick(2)}
            >
              <span className="material-symbols-outlined !text-lg">history</span>
              <span className="text-sm font-medium">历史</span>
            </button>
          </div>

          {state.tab === 1 ? (
            <AiDialogue
              formAction={formAction}
              isPending={isPending}
              isLoading={state.isMessageLoading}
              messageList={state.messages}
              onMessagePullUp={onMessageScroll}
            />
          ) : (
            <AiSessionList
              isLoading={state.isSessionLoading}
              onSelectSessionClick={onSelectSessionClick}
              onSessionPullUp={onSessionScroll}
              id={state.messageParam.id}
              sessionList={state.sessionList}
            />
          )}
        </div>
        : ''}

      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-natural transition-all duration-300 hover:scale-105 hover:shadow-natural-hover active:scale-95 cursor-pointer" onClick={openChat}>
        <span className="material-symbols-outlined text-3xl!">chat_bubble</span>
      </button>
    </div>
  );
}
