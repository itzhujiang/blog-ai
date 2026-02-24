'use client';

import { useState } from 'react';

import { useCountdown } from '@/utils/hook';

import { showMessage } from '../utils/utils';

import { Modal, ModalContainer, Input, Button } from './ui';


export interface PhoneDialogProps {
  /** 是否展示 */
  visible?: boolean;
  /** 点击关闭 */
  onClose?: () => void;
}


export function PhoneDialog({ visible = false, onClose }: PhoneDialogProps) {
  
  const [formData, setFormData] = useState({
    phone: '',
    code: ''
  });
  const [countdown, isSending, startCountdown, clearCountdown] = useCountdown();
  const [prevVisible, setPrevVisible] = useState(visible);

  // 渲染期状态调整：仅在弹窗从关闭→打开时重置表单
  if (visible && !prevVisible) {
    setFormData({ phone: '', code: '' });
    clearCountdown();
  }
  if (visible !== prevVisible) {
    setPrevVisible(visible);
  }

  /**
   * 发送验证码点击事件
   */
  const onSendCodeClick = () => {
    if (!isSending) {
      if (!formData.phone) {
        showMessage({ type: 'error', message: '请输入手机号' });
        return;
      }
      if (!/^[1](([3-9][0-9]))[0-9]{8}$/.test(formData.phone)) {
        showMessage({ type: 'error', message: '请输入正确的手机号' });
        return;
      }
      startCountdown(60);
    }
  };

  return (
    <Modal visible={visible}>
      <ModalContainer>
        <button className='absolute top-4 right-4 text-muji-taupe hover:text-muji-brown dark:text-primary/60 dark:hover:text-primary transition-colors p-1 cursor-pointer' onClick={onClose}>
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
        <div className='p-8 pt-10'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4'>
              <span className='material-symbols-outlined text-primary text-[28px]'>phonelink_ring</span>
            </div>
            <h2 className='text-muji-brown dark:text-slate-100 text-2xl font-bold tracking-tight'>手机号验证</h2>
            <p className='text-muji-taupe dark:text-slate-400 text-sm mt-2'>因: AI服务需要消耗token，使用的是我的账户，无法随意供人使用，需要手机验证</p>
          </div>
          <form className='space-y-5' >
            <div className='space-y-1.5'>
              <label className='text-muji-brown dark:text-slate-200 text-sm font-medium ml-1'>手机号</label>
              <div className='relative flex items-center mt-1'>
                <Input 
                  className='w-full pl-11 pr-28 py-3.5 bg-white dark:bg-background-dark/50  rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-muji-brown dark:text-slate-100 placeholder:text-muji-taupe/50'
                  icon={<span className="text-muji-taupe dark:text-primary/60 material-symbols-outlined text-[24px]">smartphone</span>}
                  placeholder='请输入手机号'
                  value={formData.phone}
                  maxLength={11}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <button 
                  type='button'
                  className='absolute right-2 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 rounded-md transition-colors border border-transparent hover:border-primary/20 cursor-pointer'
                  onClick={onSendCodeClick}  
                >
                  { isSending ? `${countdown}s后重试` : '发送验证码' }
                </button>
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='text-muji-brown dark:text-slate-200 text-sm font-medium ml-1'>验证码</label>
              <div className='relative flex items-center mt-1'>
                <Input 
                  className='w-full pl-11 pr-28 py-3.5 bg-white dark:bg-background-dark/50  rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all text-muji-brown dark:text-slate-100 placeholder:text-muji-taupe/50'
                  icon={<span className="text-muji-taupe dark:text-primary/60 material-symbols-outlined text-[24px]">shield_lock</span>}
                  placeholder='请输入验证码'
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
            </div>
            <div className='pt-4'>
              <Button type='submit' className='w-full transition-all hover:bg-primary/90 cursor-pointer flex items-center justify-center gap-1'>
                <span>验证手机号</span>
                <span className='material-symbols-outlined text-[18px]! group-hover:translate-x-1 transition-transform'>arrow_forward</span>
              </Button>
            </div>
          </form>
        </div>
      </ModalContainer>
    </Modal>
  );
}
