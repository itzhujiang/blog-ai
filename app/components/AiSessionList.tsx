'use client';

import { useRef, type UIEvent } from 'react';

import { Loading } from '@/components/ui';
import { cn } from '@/utils/utils';
import { formatDate } from '@/utils/utils';

import { SessionListResponseType } from '../requests';

interface AiSessionListProps {
  /** 会话列表 */
  sessionList: SessionListResponseType[],
  /** 滚动触发 */
  onSessionPullUp: () => Promise<void>;
  /** 是否加载中 */
  isLoading: boolean,
  /** 当前选中的会话id */
  sessionId: number,
  /** 选中会话事件 */
  onSelectSessionClick: (_id: number) => void
}

export default function AiSessionList({ sessionList, onSessionPullUp, isLoading = false, sessionId, onSelectSessionClick }: AiSessionListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const onSessionScroll = async (e: UIEvent<HTMLDivElement>) => {
    console.log(e.currentTarget.scrollTop + e.currentTarget.clientHeight);
    if (scrollContainerRef.current!.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight) < 50) {
      onSessionPullUp();
    }
  };

  return (
    <div className='flex flex-col h-full w-full'>
      <div className="flex-1 custom-scrollbar  overflow-y-auto p-4 flex flex-col gap-3 relative w-full" onScroll={(e) => onSessionScroll(e)} ref={scrollContainerRef}>
        
        {
          isLoading && sessionList.length === 0 ? <Loading variant='bars' text='加载中...' className='absolute left-1/2 top-1/2 -translate-1/2'></Loading> : <>
            {
              sessionList.map(item => {
                // group flex items-start gap-4 rounded-xl border border-primary/10 bg-white/50 p-4 text-left transition-all hover:bg-primary/5 dark:bg-white/5 dark:hover:bg-primary/10
                return (<button className={
                  cn(
                    'group flex items-start gap-4 rounded-xl border  p-4 text-left transition-all hover:bg-primary/5 dark:bg-white/5 dark:hover:bg-primary/10 cursor-pointer',
                    sessionId === item.id ? 'border-primary/10 bg-white/50' : 'border-transparent'
                  )
                } key={item.id} onClick={() => onSelectSessionClick(item.id)}>
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <span className='material-symbols-outlined text-xl!'>nature_people</span>
                  </div>
                  <div className='flex-1 overflow-hidden' title={item.title}>
                    <div className='flex items-center justify-between gap-2'>
                      <span className="truncate text-sm font-bold text-text-light dark:text-text-dark">{item.title}</span>
                      <span className="shrink-0 text-[10px] text-text-light/40 dark:text-text-dark/40">{formatDate(item.lastMessageAt, 'YYYY-MM-DD HH:mm:ss') }</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-text-light/60 dark:text-text-dark/60">{item.lastMessagePreview}</p>
                  </div>
                </button>);
              })
            }
            
            {
              isLoading && sessionList.length > 0 ? <Loading variant='bars' text='加载更多中...' ></Loading> : ''
            }
          </>
        }
        
      </div>
      <div className="p-4 border-t border-primary/10 bg-primary/5">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-bold text-white shadow-natural transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
          <span className="material-symbols-outlined text-lg!">add</span>
          <span>开启新对话</span>
        </button>
      </div>
    </div>
  );
}
