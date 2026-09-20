'use client';

import { ChatMessage } from '@/utils/types';

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


export default function AiDialogue({
  formAction,
  isPending,
  messageList,
  isLoading: _isLoading,
  onMessagePullUp: _onMessagePullUp,
}: AiDialogueProps) {

  // const { userInfo } = userInfoStore();
  
 
  return (
    <div className='flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[28px] border border-primary/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,246,242,0.92)_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] dark:bg-[linear-gradient(180deg,rgba(18,18,18,0.96)_0%,rgba(10,10,10,0.92)_100%)]'>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(212,165,116,0.08),transparent_36%)] px-4 py-5 md:px-5">
        {
          messageList.map(item => {
            return (
              <div key={item.id}>
                {/* { renderingMap[item.role](item) } */}
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
