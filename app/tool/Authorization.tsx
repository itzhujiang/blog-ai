// 权限AI工具函数
import { useState } from 'react';
import { z } from 'zod/v3';

import { Modal, ModalContainer, ModalFooter, ModalHeader, ModalBody } from '@/components/ui';
import { toolResult } from '@/requests';
import { ToolType } from '@/utils/types';


/**
 * 授权工具，接收权限名称作为参数，返回一个React组件用于展示授权界面
 */
export const authorization: ToolType<{ name: string, toolId?: string }> = {
  name: 'authorization',
  description: '授权工具，用于处理权限相关的操作',
  type: 'tsx',
  renderingPos: 'body',
  parameters: z.object({
    name: z.string().describe('权限名称'),
  }),
  /**
   * 工具执行函数，接收参数并返回结果
   */
  run: ({ name }, toolId) => {
    const AuthorizationModal = () => {
      const [visible, setVisible] = useState(true);
      const onClick = async (isSuccess: boolean) => {
        if (toolId) {
          await toolResult({
            toolId,
            toolResult: isSuccess ? '同意' : '不同意'
          });
        }
        setVisible(false);
      };
      return (
        <Modal visible={visible} >
          <ModalContainer>
            <ModalHeader title='工具授权' onClose={() => onClick(false)}></ModalHeader>
            <ModalBody>
              <p>工具 {name} 需要授权才能使用，请进行进行授权。</p>
            </ModalBody>
            <ModalFooter  onClose={() => onClick(false)} onConfirm={() => onClick(true)}/>
          </ModalContainer>
        </Modal>
      );
    };

    return <AuthorizationModal />;
  }
};
