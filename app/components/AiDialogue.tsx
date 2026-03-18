'use client';

import type { ReactElement } from 'react';

import { AiChatMessageRoleType, ChatMessage } from '@/utils/chatEventSource';

import { Input } from './ui/index';

interface AiDialogueProps {
  /** 表单触发 */
  formAction: (_payload: FormData) => void;
  /** 是否发送中 */
  isPending: boolean;
  /** 消息列表 */
  messageList: ChatMessage[];
  /** 是否加载中 */
  isLoading: boolean;
  /** 消息列表滚动事件 */
  onMessagePullUp: () => Promise<void>;
}

export default function AiDialogue({ formAction, isPending, messageList }: AiDialogueProps) {

  const renderingMap: Record<AiChatMessageRoleType, (_item: ChatMessage) => ReactElement> = {
    system: (item: ChatMessage) => {
      return (
        <div className="flex justify-center">
          <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] text-text-light/60 dark:text-text-dark/60">
            系统提示：{ item.content }
          </span>
        </div>
      );
    },
    assistant: (item: ChatMessage) => {
      return (
        <div className="flex justify-start">
          <div className="flex max-w-[85%] flex-col gap-1">
            <div className="rounded-2xl rounded-bl-md border border-primary/15 bg-primary/10 p-3 text-sm leading-6 text-text-light shadow-sm dark:text-text-dark">
              {item.content}
            </div>
            <span className="text-[10px] text-text-light/40 dark:text-text-dark/40">{item.createdAt}</span>
          </div>
        </div>
      );
    },
    user: (item: ChatMessage) => {
      return (
        <div className="flex justify-end">
          <div className="flex max-w-[85%] flex-col items-end gap-1">
            <div className="rounded-2xl rounded-br-md bg-primary p-3 text-sm leading-6 text-white shadow-sm">
              {item.content}
            </div>
            <span className="text-[10px] text-text-light/40 dark:text-text-dark/40">{item.createdAt}</span>
          </div>
        </div>
      );
    }
  };
  
  return (
    <div className='flex h-full min-h-0 w-full flex-col'>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
        { 
          messageList.map(item => {
            
            return (
              <div key={item.serverId}>
                { renderingMap[item.role](item) }
              </div>
            );
          })
        }
        
      </div>
      <div className="p-4 border-t border-primary/10">
        <div className="relative">
          <form className="flex items-center" action={formAction}>
            <Input placeholder="请输入消息" type="text" className='pr-12' name='message'></Input>
            <button type='submit' className="absolute right-2 flex size-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              {
                isPending ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm!">send</span>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
