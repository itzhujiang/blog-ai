'use client';

import { ChatMessage } from '../utils/types';

import { Input } from './ui/index';

interface AiDialogueProps {
  formAction: (_payload: FormData) => void;
  isPending: boolean;
  messageList: ChatMessage[];
}

export default function AiDialogue({ formAction, isPending, messageList }: AiDialogueProps) {
  return (
    <div className='flex flex-col h-full w-full'>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        { JSON.stringify(messageList) }
      </div>
      <div className="p-4 border-t border-primary/10">
        <div className="relative">
          <form className="flex items-center" action={formAction}>
            <Input placeholder="请输入消息" type="text" className='pr-12' name='message'></Input>
            <button type='submit' className="absolute right-2 flex size-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors">
              {
                isPending ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <span className="material-symbols-outlined !text-sm">send</span>
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
