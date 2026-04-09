# AG-UI 客户端使用与 AiChat 改造说明

## 1. 文档目标

本文档用于整理 `@ag-ui/client` 的核心用法，并结合当前项目的 `AiChat` 场景，说明前端如何基于 AG-UI 协议与后端进行交互。

适用范围：
- 前端 `app/components/AiChat.tsx`
- 前端 `app/hooks/useAiChat.ts`
- 前端 `app/utils/chatAgUi.ts`
- 前端聊天消息状态管理
- 基于 AG-UI 协议的后端 Agent 接口

---

## 2. 什么是 AG-UI

AG-UI 是一套面向 AI Agent 与前端界面的事件协议。

它的核心目标是：
- 统一前后端 AI 交互协议
- 统一消息流式输出模型
- 支持运行状态、消息事件、工具调用事件的标准化传输
- 让前端不再依赖自定义 SSE 字段拼装，而是基于标准事件进行 UI 更新

对当前项目而言，AG-UI 的价值主要在于：
- 替代当前自定义 SSE 消息结构
- 用标准事件流驱动聊天消息状态更新
- 让 `AiChat` 的流式渲染逻辑更稳定、更清晰

---

## 3. 安装方式

### 3.1 安装客户端 SDK

```bash
npm install @ag-ui/client
```

如果需要协议类型，一般也会一起安装：

```bash
npm install @ag-ui/core @ag-ui/client
```

---

## 4. 核心类与能力

根据官方 SDK 文档，`@ag-ui/client` 的常用能力主要包括：

- `HttpAgent`
  - 用于连接支持 AG-UI 协议的 HTTP Agent 服务
- `runAgent()`
  - 发起一次 agent 运行
- `subscribe()`
  - 订阅 agent 生命周期事件、文本消息事件、工具调用事件等
- `use()`
  - 给 agent 添加 middleware

---

## 5. 最小可用示例

### 5.1 通过 HttpAgent 发起一次请求

```ts
import { HttpAgent } from '@ag-ui/client';

const agent = new HttpAgent({
  url: 'https://api.example.com/agent',
  headers: {
    Authorization: 'Bearer token',
  },
});

const result = await agent.runAgent({
  messages: [
    {
      role: 'user',
      content: 'Hello!',
    },
  ],
});

console.log(result.newMessages);
```

说明：
- `url`：后端 AG-UI Agent 接口地址
- `headers`：可用于传登录态、鉴权信息
- `messages`：本次运行输入的消息列表
- `result.newMessages`：本次运行新增的消息结果

---

## 6. 流式事件订阅

在聊天 UI 场景中，重点不只是最终结果，而是运行过程中的流式事件。

### 6.1 典型订阅方式

```ts
import { HttpAgent } from '@ag-ui/client';
import type { AgentSubscriber } from '@ag-ui/client';

const agent = new HttpAgent({
  url: 'https://api.example.com/agent',
});

const subscriber: AgentSubscriber = {
  onRunStartedEvent: ({ event }) => {
    console.log('run started:', event.runId);
  },

  onTextMessageStartEvent: ({ event }) => {
    console.log('message start:', event.messageId);
  },

  onTextMessageContentEvent: ({ event, textMessageBuffer }) => {
    console.log('delta:', event.delta);
    console.log('buffer:', textMessageBuffer);
  },

  onTextMessageEndEvent: ({ event, textMessageBuffer }) => {
    console.log('message end:', event.messageId, textMessageBuffer);
  },

  onRunFinishedEvent: ({ result }) => {
    console.log('run finished:', result);
  },

  onRunFailed: ({ error }) => {
    console.error('run failed:', error.message);
    return { stopPropagation: true };
  },
};

const subscription = agent.subscribe(subscriber);

await agent.runAgent({
  messages: [
    {
      role: 'user',
      content: '你好，请介绍一下自己',
    },
  ],
});

subscription.unsubscribe();
```

---

## 7. 常见事件与聊天 UI 的映射关系

对于当前项目的 `AiChat` 场景，最重要的是把 AG-UI 事件映射成前端消息状态变更。

### 7.1 推荐映射关系

| AG-UI 事件 | 含义 | 前端动作 |
| --- | --- | --- |
| `onRunStartedEvent` | 本次运行开始 | 设置本次请求开始状态 |
| `onTextMessageStartEvent` | assistant 开始输出一条消息 | 创建 assistant 占位消息 |
| `onTextMessageContentEvent` | assistant 流式输出增量文本 | 追加消息内容 |
| `onTextMessageEndEvent` | 一条 assistant 消息结束 | 标记消息完成 |
| `onRunFinishedEvent` | 本次运行结束 | 清理 loading，结束本轮交互 |
| `onRunFailed` | 本次运行失败 | 标记消息失败或提示错误 |

---

## 8. 在 React 中的基础用法

### 8.1 适合聊天界面的基本模式

```tsx
'use client';

import { useMemo, useState } from 'react';
import { HttpAgent } from '@ag-ui/client';
import type { AgentSubscriber } from '@ag-ui/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'sending' | 'streaming' | 'success' | 'fail';
}

export default function AgUiChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const agent = useMemo(() => {
    return new HttpAgent({
      url: '/api/agent',
    });
  }, []);

  const sendMessage = async (content: string) => {
    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: 'user',
        content,
        status: 'success',
      },
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        status: 'streaming',
      },
    ]);

    setIsLoading(true);

    const subscriber: AgentSubscriber = {
      onTextMessageContentEvent: ({ event }) => {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantMessageId
              ? {
                  ...item,
                  content: item.content + event.delta,
                  status: 'streaming',
                }
              : item
          )
        );
      },

      onTextMessageEndEvent: () => {
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantMessageId
              ? {
                  ...item,
                  status: 'success',
                }
              : item
          )
        );
      },

      onRunFailed: ({ error }) => {
        console.error(error);
        setMessages((prev) =>
          prev.map((item) =>
            item.id === assistantMessageId
              ? {
                  ...item,
                  status: 'fail',
                }
              : item
          )
        );
        setIsLoading(false);
        return { stopPropagation: true };
      },

      onRunFinalized: () => {
        setIsLoading(false);
      },
    };

    await agent.runAgent(
      {
        messages: [
          {
            role: 'user',
            content,
          },
        ],
      },
      subscriber
    );
  };

  return null;
}
```

说明：
- 用户消息可以本地直接追加
- assistant 消息适合先插入一个空占位，再根据流式事件持续更新
- `onTextMessageContentEvent` 非常适合用来驱动逐字输出

---

## 9. 中间件能力

`@ag-ui/client` 支持 middleware，可用于：
- 打印日志
- 注入埋点
- 统一错误处理
- 过滤工具调用事件

### 9.1 示例

```ts
import { HttpAgent, FilterToolCallsMiddleware } from '@ag-ui/client';

const agent = new HttpAgent({
  url: 'https://api.example.com/agent',
});

agent.use(
  (input, next) => {
    console.log('starting run:', input.runId);
    return next.run(input);
  },
  new FilterToolCallsMiddleware({
    allowedToolCalls: ['search', 'calculate'],
  })
);

await agent.runAgent({
  messages: [
    {
      role: 'user',
      content: '帮我搜索 React 文档',
    },
  ],
});
```

---

## 10. 与当前项目 AiChat 的关系

当前项目已有聊天能力，核心特点包括：
- `AiChat` 作为聊天弹窗入口
- `useAiChat` 负责聊天状态编排
- 当前消息列表有本地消息、历史消息、SSE 消息更新逻辑
- 已存在 `app/utils/chatAgUi.ts`

因此 AG-UI 改造的重点不是重新发明一套聊天系统，而是：
- 用 AG-UI 的标准事件替换当前自定义 SSE 消息流
- 让消息状态更新围绕 AG-UI 事件收口
- 复用当前 `useReducer` 状态模型

---

## 11. 推荐改造方向

### 11.1 前端分层建议

推荐按以下层次接入 AG-UI：

#### 第一层：Agent 连接层
建议放在：
- `app/utils/chatAgUi.ts`

职责：
- 创建 `HttpAgent`
- 统一处理 `url`、`headers`
- 对外暴露 `runAgent`、`subscribe`、middleware 能力

#### 第二层：业务编排层
建议放在：
- `app/hooks/useAiChat.ts`

职责：
- 管理消息列表、会话、分页、loading
- 把 AG-UI 事件转换成 reducer action
- 管理一次运行过程中的占位消息、失败状态、完成状态

#### 第三层：界面展示层
建议放在：
- `app/components/AiChat.tsx`
- `app/components/AiDialogue.tsx`

职责：
- 展示消息
- 触发发送
- 展示 loading、失败、历史会话等 UI

---

## 12. 推荐消息状态设计

为了兼容当前项目，建议前端消息结构继续保留本地管理字段。

### 12.1 推荐结构

```ts
interface ChatMessage {
  localId: string;
  serverId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: 'sending' | 'streaming' | 'success' | 'fail';
  createdAt: number;
  isMessageEnd: boolean;
}
```

字段说明：
- `localId`：本地唯一标识，适合 React 列表与乐观更新
- `serverId`：服务端消息标识，适合与 AG-UI `messageId` 对齐
- `status`：用于展示发送中、流式中、成功、失败
- `isMessageEnd`：用于判断一条 assistant 消息是否已完成

---

## 13. AG-UI 事件到当前消息模型的映射建议

### 13.1 assistant 消息生命周期

#### 收到 `onTextMessageStartEvent`
前端应：
- 创建一条 assistant 占位消息
- 记录其 `serverId` 或 `messageId`
- 初始状态设为 `streaming`

#### 收到 `onTextMessageContentEvent`
前端应：
- 按 `messageId` 找到对应 assistant 消息
- 将 `event.delta` 累加到 `content`
- 不重复追加新的 assistant 消息对象

#### 收到 `onTextMessageEndEvent`
前端应：
- 将该消息状态改为 `success`
- 标记 `isMessageEnd = true`

#### 收到 `onRunFailed`
前端应：
- 将当前运行对应消息标记为 `fail`
- 给用户错误提示

---

## 14. 当前改造中的关键注意点

### 14.1 不要直接修改已有 state 对象

无论是自定义 SSE 还是 AG-UI，消息更新都应保持纯函数风格：
- 输入旧消息数组
- 返回新消息数组
- 不要直接修改已有对象引用

### 14.2 不要为同一条 assistant 消息重复追加新对象

对于流式事件：
- 同一 `messageId` 应对应同一条 assistant 消息
- `content` 只做累加更新
- `end` 只做状态收尾

### 14.3 用户消息和 assistant 消息要分开处理

用户消息：
- 通常可以乐观插入
- 发送失败时可按 `localId` 回退为 `fail`

assistant 消息：
- 应按 AG-UI 返回的 `messageId` 聚合更新
- 不应把每个 chunk 都渲染成一条新消息

### 14.4 loading 不应只靠闭包状态防重入

对于发送和分页加载：
- UI loading 可以继续放在 state 中
- 如需同步防重入，可额外使用 `useRef` 作为请求锁
- 但不要用 `useRef` 取代真正参与渲染的 state

---

## 15. 一种适合当前项目的接入思路

### 15.1 sendMessage 的变化

当前项目原本更偏向：
- 发送接口 + SSE 通道分离

如果改为 AG-UI，更推荐：
- 发送动作由 `agent.runAgent()` 统一驱动
- 流式消息通过 subscriber 统一接收

### 15.2 useAiChat 的职责变化

`useAiChat` 中建议保留：
- 打开聊天
- 关闭聊天
- 切换历史会话
- 加载历史消息
- 发送消息
- reducer 状态管理

但“流式消息处理来源”改为：
- 从自定义 SSE `subscribe` 改成 AG-UI `runAgent(..., subscriber)` 或 `agent.subscribe(...)`

### 15.3 chatAgUi.ts 的职责

建议 `app/utils/chatAgUi.ts` 负责：
- 创建单例或工厂形式的 `HttpAgent`
- 注入通用 headers
- 封装 `runChatAgent`
- 封装与当前项目消息结构兼容的事件适配层

---

## 16. 一个更贴近当前项目的伪代码示例

```ts
import { HttpAgent } from '@ag-ui/client';
import type { AgentSubscriber } from '@ag-ui/client';

const chatAgent = new HttpAgent({
  url: '/api/ag-ui/chat',
});

export async function runChatAgent(
  content: string,
  handlers: {
    onAssistantStart: (messageId: string) => void;
    onAssistantDelta: (messageId: string, delta: string) => void;
    onAssistantEnd: (messageId: string) => void;
    onError: (error: Error) => void;
  }
) {
  const subscriber: AgentSubscriber = {
    onTextMessageStartEvent: ({ event }) => {
      handlers.onAssistantStart(event.messageId);
    },
    onTextMessageContentEvent: ({ event }) => {
      handlers.onAssistantDelta(event.messageId, event.delta);
    },
    onTextMessageEndEvent: ({ event }) => {
      handlers.onAssistantEnd(event.messageId);
    },
    onRunFailed: ({ error }) => {
      handlers.onError(error);
      return { stopPropagation: true };
    },
  };

  await chatAgent.runAgent(
    {
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    },
    subscriber
  );
}
```

这个思路适合在 `useAiChat` 中进一步转成 reducer action。

---

## 17. 当前阶段的改造建议总结

如果要把当前 `AiChat` 改造成基于 AG-UI 协议，建议按以下顺序推进：

1. 明确后端是否已经提供 AG-UI 标准接口
2. 在 `app/utils/chatAgUi.ts` 中完成 `HttpAgent` 封装
3. 在 `useAiChat` 中把流式消息来源替换成 AG-UI 事件
4. 保留现有消息数组结构，但让 assistant 消息按 `messageId` 聚合更新
5. 保留会话列表和历史消息查询逻辑，逐步替换实时消息链路
6. 最后再统一处理鉴权、重试、失败态、工具调用展示等增强能力

---

## 18. 结论

`@ag-ui/client` 的使用核心可以概括为三点：

1. 用 `HttpAgent` 连接后端 AG-UI 服务
2. 用 `runAgent()` 发起一次聊天运行
3. 用 `AgentSubscriber` 订阅流式事件，并把事件映射成前端消息状态更新

对当前项目来说，AG-UI 改造的重点不是简单替换一个请求库，而是把：
- 自定义 SSE 消息协议
- 前端 assistant 流式消息拼接逻辑
- 运行状态管理

统一收口到 AG-UI 事件模型中。

这样做的好处是：
- 协议更标准
- 前后端职责更清晰
- 消息流式更新更稳定
- 后续扩展工具调用、多模态事件、运行状态展示会更容易
