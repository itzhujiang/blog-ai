# useReducer 介绍与在 AI 聊天场景中的应用

## 1. 文档目标

本文档用于说明 React 中 `useReducer` 的核心概念、适用场景、与 `useState` 的区别，以及它在当前 AI 聊天业务中的适用性。

适用范围：
- React 函数式组件
- 自定义 Hook
- 复杂前端状态管理场景
- 当前项目中的 `app/hooks/useAiChat.ts`

---

## 2. 什么是 useReducer

`useReducer` 是 React 提供的一个状态管理 Hook，适合管理**多个相互关联的状态**，或者**状态更新逻辑较复杂**的场景。

它的基本形式如下：

```ts
const [state, dispatch] = useReducer(reducer, initialState);
```

其中：
- `state`：当前状态
- `dispatch`：派发动作的方法
- `reducer`：根据旧状态和动作计算新状态的纯函数
- `initialState`：初始状态

可以把它理解为：

> 用统一的动作入口来驱动状态变化，而不是在各处直接调用多个 `setState`。

---

## 3. 核心组成

## 3.1 state

`state` 是当前状态对象。

示例：

```ts
interface CounterState {
  count: number;
}
```

---

## 3.2 action

`action` 用来描述“发生了什么”。

示例：

```ts
type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };
```

这里的重点不是“怎么改字段”，而是“当前发生了什么业务动作”。

---

## 3.3 reducer

`reducer` 是一个纯函数，根据旧状态和动作返回新状态。

```ts
function reducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };
    case 'reset':
      return {
        count: 0,
      };
    default:
      return state;
  }
}
```

`reducer` 有两个重要特点：
- 只负责计算新状态
- 不应该在里面写请求、定时器、订阅等副作用逻辑

---

## 3.4 dispatch

`dispatch` 用来触发状态变更。

```ts
dispatch({ type: 'increment' });
```

它表示：

> 派发一个动作，让 reducer 根据规则更新状态。

---

## 4. 最小示例

```tsx
import { useReducer } from 'react';

interface CounterState {
  count: number;
}

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const initialState: CounterState = {
  count: 0,
};

function reducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  );
}
```

---

## 5. useReducer 和 useState 的区别

## 5.1 useState 更适合什么场景

`useState` 更适合：
- 状态数量少
- 状态之间彼此独立
- 更新逻辑简单
- 不需要统一收口管理

例如：

```ts
const [open, setOpen] = useState(false);
```

这种简单开关状态没有必要使用 `useReducer`。

---

## 5.2 useReducer 更适合什么场景

`useReducer` 更适合：
- 状态较多
- 多个状态之间有关联
- 一个业务动作会同时修改多个字段
- 存在明显的“动作”语义
- 希望把状态更新逻辑集中管理

例如聊天场景中的这些动作：
- 打开聊天窗口
- 关闭聊天窗口
- 切换标签页
- 重置消息列表
- 开始加载会话
- 加载会话成功
- 加载消息成功
- 收到 SSE 消息
- 发送消息失败

这些都更像“动作”，而不只是单纯的字段赋值。

---

## 6. 为什么复杂状态更适合 useReducer

在复杂业务中，如果继续使用很多 `useState`，就很容易出现以下问题：

- 状态更新逻辑分散在多个函数里
- 同一个动作要调用多个 setter
- 状态变更意图不直观
- 维护时容易漏改某个字段
- 难以统一管理重置逻辑

例如：

```ts
setMessageLoading(true);
setMessageTerminate(false);
setMessages([]);
setMessageParam({
  page: 1,
  size: 10,
  sessionId,
});
```

这段代码虽然能工作，但它表达的是多个字段更新，不容易一眼看出业务意图。

如果改成 reducer 风格，可以写成：

```ts
dispatch({
  type: 'resetMessages',
  payload: { sessionId },
});
```

这样会更接近业务语言，更容易理解和维护。

---

## 7. useReducer 的优点

### 7.1 状态更新逻辑集中

所有状态变化都在 reducer 中管理，代码结构更清晰。

### 7.2 业务语义更明确

`dispatch({ type: 'switchTab' })` 比多个 `setState` 更能表达业务意图。

### 7.3 更适合联动更新

一个 action 可以统一更新多个字段，避免逻辑分散。

### 7.4 更容易测试

reducer 是纯函数，输入旧状态和动作，就能得到确定的新状态。

### 7.5 更适合大型 Hook

对于状态较多的自定义 Hook，`useReducer` 往往比大量 `useState` 更容易维护。

---

## 8. useReducer 的限制

### 8.1 样板代码更多

你需要定义：
- `State`
- `Action`
- `initialState`
- `reducer`

对于简单场景来说，这会显得偏重。

### 8.2 reducer 不能写副作用

`reducer` 必须保持纯函数特性，不能直接做这些事：
- 发请求
- 开定时器
- 建立订阅
- 调用浏览器副作用 API

也就是说：
- `reducer` 负责计算状态
- `useEffect` / `async function` 负责副作用

### 8.3 不能自动解决所有闭包旧值问题

如果有长期存在的异步回调、事件订阅、SSE 回调，依然可能需要 `ref` 来获取最新值。

所以 `useReducer` 的作用是：
- 让状态变化更集中
- 让代码更有业务语义

但它不是消灭所有 `useEffect` 和 `useRef` 的万能方案。

---

## 9. useRef 是什么

`useRef` 是 React 提供的另一个常用 Hook，用于在多次渲染之间保存一个**可变引用**。

基本写法如下：

```ts
const ref = useRef(initialValue);
```

返回值是一个包含 `current` 属性的对象：

```ts
ref.current
```

它最重要的特点是：
- 可以在多次渲染之间保留值
- 修改 `ref.current` 不会触发组件重新渲染
- 既可以引用 DOM，也可以保存普通变量、实例、定时器 ID 等

---

## 10. useRef 和 useState 的区别

### 10.1 useState

`useState` 适合保存会影响界面展示的状态。

特点：
- 修改后会触发重新渲染
- 用于驱动 UI

例如：

```ts
const [isVisible, setIsVisible] = useState(false);
```

---

### 10.2 useRef

`useRef` 适合保存“不需要驱动 UI，但需要跨渲染保留”的值。

特点：
- 修改后不会触发重新渲染
- 更适合保存逻辑控制变量

例如：

```ts
const loadingRef = useRef(false);
```

---

## 11. useRef 的常见用途

## 11.1 获取 DOM 引用

这是最常见的用途之一。

```tsx
const inputRef = useRef<HTMLInputElement | null>(null);

useEffect(() => {
  inputRef.current?.focus();
}, []);

return <input ref={inputRef} />;
```

适用场景：
- 聚焦输入框
- 控制滚动位置
- 获取元素尺寸
- 操作原生 DOM API

---

## 11.2 保存跨渲染的最新值

在异步函数、定时器、订阅回调中，直接读取 state 有时会遇到闭包旧值问题。此时可以用 `useRef` 缓存最新值。

```tsx
const countRef = useRef(0);

useEffect(() => {
  countRef.current = count;
}, [count]);
```

这样在异步逻辑里读取 `countRef.current`，通常会比直接读取闭包中的 `count` 更稳妥。

---

## 11.3 保存实例或流程控制变量

`useRef` 也很适合保存这些值：
- 定时器 ID
- EventSource / WebSocket 实例
- 请求中的并发锁
- 是否终止加载的标记
- 不需要渲染到页面的临时变量

例如：

```ts
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const requestLockRef = useRef(false);
```

---

## 12. 为什么 AI 聊天场景里会同时使用 useReducer / useState 和 useRef

在聊天场景中，并不是所有值都适合放进状态系统里。

### 12.1 适合放在 state 或 reducer 里的值

这类值会直接影响界面：
- 当前 tab
- 聊天窗口是否显示
- 消息列表
- 会话列表
- loading 状态文案

这些值变化后，页面需要重新渲染，因此通常应该用 `useState` 或 `useReducer`。

---

### 12.2 适合放在 ref 里的值

这类值主要用于异步流程控制，不直接负责界面渲染：
- 当前请求是否正在进行
- 当前分页参数的最新快照
- 是否已经终止继续分页
- 定时器 / SSE 实例 / 订阅句柄

这些值变化后，不一定需要刷新界面，因此使用 `useRef` 更合适。

---

## 13. useRef 在当前 useAiChat 场景中的作用

在当前 `app/hooks/useAiChat.ts` 中，`useRef` 的主要职责不是获取 DOM，而是辅助异步逻辑读取最新值。

例如：
- `sessionParamRef`：缓存最新会话分页参数
- `messageParamRef`：缓存最新消息分页参数
- `sessionLoadingRef`：用于并发保护，避免重复加载会话
- `messageLoadingRef`：用于并发保护，避免重复加载消息
- `sessionTerminateRef`：标记会话列表是否已加载完成
- `messageTerminateRef`：标记消息列表是否已加载完成

这些 ref 的作用可以概括为：
- 避免异步回调读取旧值
- 避免重复请求
- 给 SSE / 请求 / 分页逻辑提供最新控制变量

因此在当前 AI 聊天场景里，更准确的职责划分是：
- `useState` / `useReducer`：负责驱动 UI
- `useRef`：负责异步流程控制和最新值缓存
- `useEffect`：负责副作用和同步逻辑

---

## 14. useReducer 能解决什么问题，不能解决什么问题

当前 `useAiChat` 中维护了较多状态，例如：

- 聊天窗口显隐
- 当前标签页
- 消息列表
- 历史会话列表
- 会话分页参数
- 消息分页参数
- 会话加载状态
- 消息加载状态
- 是否已加载完全部数据

这些状态并不是完全独立的，而是会随着业务动作联动变化。

例如：
- 打开聊天窗口时，需要重置会话和消息状态
- 切换到历史标签时，需要展示会话列表
- 选择某个会话时，需要重置消息状态并拉取历史消息
- 接收到 SSE 消息时，需要更新消息列表
- 请求成功后，需要同时更新列表、分页参数和终止标记

这种场景很适合引入 `useReducer` 来统一管理状态。

---

## 10. AI 聊天场景的 reducer 设计示例

## 10.1 状态结构示例

```ts
interface AiChatState {
  isVisible: boolean;
  tab: 1 | 2;
  messages: ChatMessage[];
  sessionList: SessionListResponseType[];
  isSessionLoading: boolean;
  isMessageLoading: boolean;
  sessionTerminate: boolean;
  messageTerminate: boolean;
  sessionParam: SessionParam;
  messageParam: MessageParam;
}
```

---

## 10.2 动作类型示例

```ts
type AiChatAction =
  | { type: 'openChat' }
  | { type: 'closeChat' }
  | { type: 'switchTab'; payload: 1 | 2 }
  | { type: 'resetSessions' }
  | { type: 'resetMessages'; payload?: { sessionId?: number } }
  | { type: 'loadSessionsStart' }
  | { type: 'loadSessionsSuccess'; payload: SessionListResponseType[] }
  | { type: 'loadMessagesStart' }
  | { type: 'loadMessagesSuccess'; payload: ChatMessage[] }
  | { type: 'appendLocalMessage'; payload: ChatMessage }
  | { type: 'applySseMessage'; payload: SSEMessage };
```

这些 action 名称本身就能表达业务含义。

---

## 10.3 reducer 示例

```ts
function aiChatReducer(state: AiChatState, action: AiChatAction): AiChatState {
  switch (action.type) {
    case 'openChat':
      return {
        ...state,
        isVisible: true,
      };

    case 'closeChat':
      return {
        ...state,
        isVisible: false,
      };

    case 'switchTab':
      return {
        ...state,
        tab: action.payload,
      };

    case 'resetSessions':
      return {
        ...state,
        sessionList: [],
        sessionTerminate: false,
        sessionParam: {
          page: 1,
          size: 10,
        },
      };

    default:
      return state;
  }
}
```

---

## 11. 它能解决什么问题，不能解决什么问题

## 11.1 能改善的问题

如果在 `useAiChat` 中使用 `useReducer`，主要能改善：

- 大量 `setXxx` 分散在各个函数中的问题
- 重置逻辑分散的问题
- 状态联动不够清晰的问题
- 业务动作表达不明确的问题
- 大型 Hook 可维护性下降的问题

---

## 11.2 不能直接解决的问题

`useReducer` 不能直接消除：

- SSE 订阅本身需要的 `useEffect`
- HTTP 请求需要的异步函数
- 长生命周期回调里的闭包旧值问题
- 并发保护和节流防重的全部需求

例如当前 `useAiChat` 中为了避免异步回调读取旧值，使用了：
- `sessionParamRef`
- `messageParamRef`
- `sessionLoadingRef`
- `messageLoadingRef`
- `sessionTerminateRef`
- `messageTerminateRef`

这些问题即使改成 `useReducer`，在某些异步流程里仍然可能需要 `ref` 辅助。

因此更准确的理解是：

> `useReducer` 负责收敛状态变化规则，`useEffect` 和 `ref` 仍然负责副作用与异步流程控制。

---

## 12. 何时选择 useReducer

可以用下面这条经验判断：

### 适合使用 useState 的情况
- 只有少量状态
- 每个状态独立变化
- 更新逻辑简单
- 组件体量较小

### 适合使用 useReducer 的情况
- 状态很多
- 多个字段经常联动修改
- 有明显的业务动作
- 重置逻辑比较多
- 希望统一管理状态更新规则
- 自定义 Hook 已经变得比较复杂

---

## 13. 对当前 useAiChat 的建议

对于当前项目里的 `app/hooks/useAiChat.ts`，可以这样理解：

### 13.1 现状特点
- 已经存在较多业务状态
- 已经存在分页、终止、加载、SSE 等复杂逻辑
- 已经出现了 `ref + useEffect` 同步的复杂度
- 代码职责已经比简单 Hook 更复杂

### 13.2 是否适合 useReducer

适合。

因为它已经不再是简单的“几个状态 + 几个事件处理函数”，而是一个小型业务状态编排层。

### 13.3 是否必须立刻改成 useReducer

不一定。

如果当前目标是：
- 少改现有结构
- 稳定现有功能
- 优先控制改动范围

那么继续沿用 `useState + useRef + useEffect` 也是合理的。

如果后续目标是：
- 继续扩展聊天功能
- 增加消息重试、状态回滚、错误分类
- 增加更复杂的会话切换逻辑
- 提高状态层的可维护性

那么再逐步迁移到 `useReducer` 会更合适。

---

## 14. 总结

`useReducer` 的本质是：

> 当状态更新不再只是“改一个字段”，而是“执行一个业务动作”时，用它会更合适。

在 AI 聊天这类场景中，状态之间往往互相关联，一个动作会影响多个字段，因此 `useReducer` 通常比大量分散的 `useState` 更容易维护。

但也需要注意：
- `useReducer` 不是替代一切的方案
- 它不能代替副作用处理
- 它也不能自动消除所有异步闭包问题

更合理的定位是：
- 用 `useReducer` 管理复杂状态变化
- 用 `useEffect` 管理副作用
- 用 `ref` 处理需要读取最新值的异步场景

三者结合，才是复杂前端业务中更稳妥的方案。
