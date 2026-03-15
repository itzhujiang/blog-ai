import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { USER_INFO_KEY } from '@/utils/constants';
import { UserInfo } from '@/utils/types';

type UserInfoStore = {
    userInfo: UserInfo,
    setUserInfo: (_userInfo: UserInfo) =>  void;
    isLogin: () => boolean;
}

const userInfoStore = create<UserInfoStore>()(
  persist((set, get) => ({
    userInfo: {
      id: undefined,
      phone: undefined,
      isLogin: false
    },
    /**
     * 设置用户信息
     * @param userInfo 
     * @returns 
     */
    setUserInfo: (userInfo) => set(() => ({
      userInfo
    })),
    isLogin: () => get().userInfo.isLogin
  }), {
    name: USER_INFO_KEY
  }));

export default userInfoStore;
