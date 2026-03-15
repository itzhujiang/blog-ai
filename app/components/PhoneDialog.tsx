'use client';

import React, { useEffect, useState } from 'react';

import aiEventSource from '@/app/utils/chatEventSource';
import { userInfoStore } from '@/store/index';
import eventEmitter from '@/utils/eventEmitter';
import { useCountdown } from '@/utils/hook';


import { showMessage } from '../utils/utils';

import { Modal, ModalContainer, Input, Button } from './ui';

import { getUserInfo, login, sendPhoneCode } from '@/requests/index';


export default function PhoneDialog() {
  const { setUserInfo } = userInfoStore();

  const [formData, setFormData] = useState({
    phone: '',
    code: ''
  });
  const [countdown, isSending, startCountdown, clearCountdown] = useCountdown();
  const [visible, setVisible] = useState(false);
  const [isChat, setIsChat] = useState(false);

  useEffect(() => {
    const handleUnAuth = (isChat: boolean = false) => {
      setVisible(true);
      setIsChat(isChat);
    };
    eventEmitter.on('API:UN_AUTH', handleUnAuth);
  }, []);

  const onClose = () => {
    setVisible(false);
    setFormData({ phone: '', code: '' });
    clearCountdown();
  };

  /**
   * 发送验证码点击事件
   */
  const onSendCodeClick = async () => {
    if (!isSending) {
      if (!formData.phone) {
        showMessage({ type: 'error', message: '请输入手机号' });
        return;
      }
      if (!/^[1](([3-9][0-9]))[0-9]{8}$/.test(formData.phone)) {
        showMessage({ type: 'error', message: '请输入正确的手机号' });
        return;
      }
      const res = await sendPhoneCode({
        phone: formData.phone
      });
      if (res.code === 200) {
        startCountdown(60);
        showMessage({
          message: res.msg,
          type: 'success'
        });
      } else {
        showMessage({
          message: res.msg,
          type: 'error'
        });
      }
    }
  };

  const onLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      showMessage({ type: 'error', message: '请输入手机号' });
      return;
    }
    if (!/^[1](([3-9][0-9]))[0-9]{8}$/.test(formData.phone)) {
      showMessage({ type: 'error', message: '请输入正确的手机号' });
      return;
    }
    if (!formData.code) {
      showMessage({ type: 'error', message: '请输入验证码' });
      return;
    }
    const res = await login(formData);
    if (res.code === 200) {
      const result = await getUserInfo();
      if (result.code !== 200) {
        showMessage({
          message: res.msg,
          type: 'error'
        });
        return;
      }
      if (isChat) {
        aiEventSource.createConnection();
      }
      setUserInfo({
        id: result.data?.data.id,
        phone: result.data?.data.phone,
        isLogin: true,
      });
      showMessage({
        message: res.msg,
        type: 'success'
      });
      onClose();
    } else {
      showMessage({
        message: res.msg,
        type: 'error'
      });
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
          <form className='space-y-5' onSubmit={(e) => onLoginSubmit(e)}>
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
