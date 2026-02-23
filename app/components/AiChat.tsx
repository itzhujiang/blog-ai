'use client';

import { useState } from 'react';

import { PhoneDialog } from './PhoneDialog';

export default function AiChat() {
  const [isAiChatVisible, setVisible] = useState(false);
  const [isPhoneDialogVisible, setPhoneDialogVisible] = useState(false);

  /**
   * 点击显示AI聊天窗口时，先进行数据校验，如果校验通过则显示窗口，否则提示用户进行手机号验证
   */
  const onVisibleClick = () => {
    if (!isAiChatVisible) {
      console.log('数据校验');
      setPhoneDialogVisible(true);
      return;
    }
    setVisible(!isAiChatVisible);
  };

  return (
    <div className="absolute bottom-10 right-10 flex flex-col items-end">
      {
        isAiChatVisible ? <div className="w-80 z-50 sm:w-96 flex flex-col overflow-hidden rounded-xl border border-primary/20 bg-background-light shadow-natural-hover dark:bg-background-dark md:w-[400px] mb-5">
          <div className="flex items-center justify-between bg-primary/10 p-4 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <span className="font-bold text-text-light dark:text-text-dark">AI 助手</span>
            </div>
            <button className="text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark cursor-pointer" onClick={() => setVisible(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="h-80 overflow-y-auto p-4 flex flex-col gap-4">

          </div>
          <div className="p-4 border-t border-primary/10">
            <div className="relative">
              <form className="flex items-center">
                <input className="w-full rounded-full border-primary/30 bg-background-light py-2 pl-4 pr-10 text-sm focus:border-primary focus:ring-1 focus:ring-primary dark:bg-background-dark dark:border-primary/50" placeholder="请输入消息" type="text"></input>
                <button className="absolute right-2 flex size-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined !text-sm">send</span>
                </button>
              </form>
            </div>  
          </div>
        </div> : ''
      }
      
      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-natural hover:shadow-natural-hover transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer" onClick={onVisibleClick}>
        <span className="material-symbols-outlined !text-3xl">chat_bubble</span>
      </button>
      <PhoneDialog visible={isPhoneDialogVisible} onClose={() => setPhoneDialogVisible(false)}></PhoneDialog>
    </div>
  );
}
