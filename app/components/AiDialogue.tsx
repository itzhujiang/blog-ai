'use client';

import type { ReactElement } from 'react';
import ReactDOM from 'react-dom';


import { userInfoStore } from '@/store/index';
import { AiChatMessageRoleType, ChatMessage } from '@/utils/types';
import { formatDate } from '@/utils/utils';

import { A2UIRenderer } from './A2UIRenderer';
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

const getActivityStyle = (status: ChatMessage['status']) => {
  if (status === 'fail') {
    return {
      containerClassName: 'border-red-500/15 bg-[linear-gradient(135deg,rgba(239,68,68,0.10),rgba(255,255,255,0.92))] text-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.12)] dark:border-red-400/20 dark:bg-[linear-gradient(135deg,rgba(248,113,113,0.14),rgba(24,24,27,0.92))] dark:text-red-300',
      dotClassName: 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.55)] dark:bg-red-300',
      icon: 'error',
      labelClassName: 'text-red-500/90 dark:text-red-300/90',
      badgeClassName: 'bg-red-500/10 text-red-500 dark:bg-red-400/15 dark:text-red-300',
    };
  }

  if (status === 'success') {
    return {
      containerClassName: 'border-emerald-500/15 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),rgba(255,255,255,0.92))] text-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.12)] dark:border-emerald-400/20 dark:bg-[linear-gradient(135deg,rgba(52,211,153,0.14),rgba(24,24,27,0.92))] dark:text-emerald-300',
      dotClassName: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] dark:bg-emerald-300',
      icon: 'check_circle',
      labelClassName: 'text-emerald-600/90 dark:text-emerald-300/90',
      badgeClassName: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
    };
  }

  return {
    containerClassName: 'border-primary/15 bg-[linear-gradient(135deg,rgba(212,165,116,0.14),rgba(255,255,255,0.96))] text-primary shadow-[0_12px_32px_rgba(212,165,116,0.16)] dark:border-primary/20 dark:bg-[linear-gradient(135deg,rgba(212,165,116,0.18),rgba(20,20,20,0.94))] dark:text-[#f0c99b]',
    dotClassName: 'bg-primary shadow-[0_0_14px_rgba(212,165,116,0.65)]',
    icon: 'neurology',
    labelClassName: 'text-primary/90 dark:text-[#f0c99b]/90',
    badgeClassName: 'bg-primary/10 text-primary dark:bg-primary/15 dark:text-[#f0c99b]',
  };
};

export default function AiDialogue({
  formAction,
  isPending,
  messageList,
  isLoading: _isLoading,
  onMessagePullUp: _onMessagePullUp,
}: AiDialogueProps) {

  const { userInfo } = userInfoStore();
  
  const renderingMap: Record<AiChatMessageRoleType, (_item: ChatMessage) => ReactElement> = {
    system: (item: ChatMessage) => {
      if (item.contentType !== 'a2ui') {
        return (
          <div className="flex justify-center">
            <span className="rounded-full border border-primary/10 bg-primary/[0.04] px-3 py-1 text-[11px] leading-5 text-text-light/60 shadow-sm dark:text-text-dark/60">
              系统提示：{item.content}
            </span>
          </div>
        );
      }
      return <></>;
    },
    assistant: (item: ChatMessage) => {
      return (
        <div className="flex justify-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-sm">
            AI
          </div>
          <div className="flex max-w-[88%] flex-col gap-2">
            <div className="rounded-3xl rounded-tl-md border border-primary/10 bg-white px-4 py-3 text-sm leading-7 text-text-light shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:bg-background-dark dark:text-text-dark">
              {
                item.contentType === 'a2ui' ? <A2UIRenderer value={item.content} /> : item.content
              }
            </div>
            <span className="px-1 text-[10px] text-text-light/35 dark:text-text-dark/35">{formatDate(item.createdAt)}</span>
          </div>
        </div>
      );
      
    },
    user: (item: ChatMessage) => {
      if (item.contentPos === 'body' && item.contentType !== 'a2ui') {
        return  <>{ReactDOM.createPortal(item.content, document.body)}</>;
      };
      if (item.contentType !== 'a2ui') {
        return (
          <div className="flex justify-end">
            <div className="flex max-w-[82%] flex-col items-end gap-2">
              <span className="px-1 text-[11px] font-medium text-text-light/45 dark:text-text-dark/45">
                {userInfo.phone}
              </span>
              <div className="rounded-3xl rounded-br-md bg-primary px-4 py-3 text-sm leading-7 text-white shadow-[0_8px_20px_rgba(212,165,116,0.28)]">
                {item.content}
              </div>
              <span className="px-1 text-[10px] text-text-light/35 dark:text-text-dark/35">{formatDate(item.createdAt)}</span>
            </div>
          </div>
        );
      }

      return <></>;
    },
    activity: (item: ChatMessage) => {
      const activityStyle = getActivityStyle(item.status);
      const isPendingStatus = item.status === 'pending';
      return (
        <div className="flex justify-center">
          <div className={`group inline-flex max-w-[88%] items-center gap-3 rounded-full border px-2.5 py-2 text-[11px] font-medium leading-5 backdrop-blur-md transition-all ${activityStyle.containerClassName}`}>
            <div className={`flex size-7 shrink-0 items-center justify-center rounded-full ${activityStyle.badgeClassName}`}>
              {
                isPendingStatus ? (
                  <span className="material-symbols-outlined animate-spin text-[15px]!">{activityStyle.icon}</span>
                ) : (
                  <span className="material-symbols-outlined text-[15px]!">{activityStyle.icon}</span>
                )
              }
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <span className="max-w-[220px] truncate text-text-light/70 dark:text-text-dark/70">
                {item.content}
              </span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className='flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,246,242,0.92)_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] dark:bg-[linear-gradient(180deg,rgba(18,18,18,0.96)_0%,rgba(10,10,10,0.92)_100%)]'>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(212,165,116,0.08),transparent_36%)] px-4 py-5 md:px-5">
        {
          messageList.map(item => {
            return (
              <div key={item.id}>
                { renderingMap[item.role](item) }
              </div>
            );
          })
        }

      </div>
      <div className="border-t border-primary/10 bg-white/80 p-4 backdrop-blur-md dark:bg-background-dark/70">
        <div className="rounded-[24px] border border-primary/10 bg-background-light/80 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:bg-background-dark/80">
          <div className="relative">
            <form className="flex items-center" action={formAction}>
              <Input placeholder="给 AI 助手发送消息" type="text" className='h-12 border-none bg-transparent pr-14 shadow-none focus:ring-0' name='message'></Input>
              <button type='submit' className="absolute right-2 flex size-9 items-center justify-center rounded-full bg-primary text-white transition-all hover:scale-[1.02] hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70" disabled={isPending}>
                {
                  isPending ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined text-sm!">arrow_upward</span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
