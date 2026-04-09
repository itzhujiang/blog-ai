# AG-UI 中 tools 工具传递说明

## 1. 文档目的

本文档用于说明在 AG-UI 中，前端如何定义并传递 `tools` 给 Agent，以及这些工具在协议中的作用与推荐用法。

本文基于 Context7 查询的 AG-UI 官方文档整理，适用于当前项目在接入 `@ag-ui/client` / `@ag-ui/core` 时参考。

---

## 2. 结论概览

AG-UI 中的 `tools` 不是在后端硬编码后再通知前端，而是**由前端定义工具描述，并在调用 `runAgent()` 时通过 `tools` 字段传给 Agent**。

官方推荐模式如下：

1. 前端定义工具
2. 工具使用 JSON Schema 描述参数
3. 调用 `agent.runAgent()` 时通过 `tools: [...]` 传入
4. Agent 根据工具描述决定是否发起工具调用
5. 前后端再基于 AG-UI 的事件和消息机制处理工具调用结果

---

## 3. tools 的基本定义方式

根据官方文档，单个工具的结构大致如下：

```ts
interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
  };
}
```

字段说明：

- `name`
  - 工具唯一名称
  - Agent 在发起工具调用时会使用这个名称
- `description`
  - 工具用途说明
  - 帮助模型理解什么时候该调用该工具
- `parameters`
  - 使用 JSON Schema 描述参数结构
  - 告诉模型这个工具需要哪些字段、字段类型是什么

---

## 4. 官方示例：前端定义 tools 并传递

### 4.1 定义一个工具

```ts
const confirmActionTool = {
  name: 'confirmAction',
  description: 'Ask the user to confirm a specific action before proceeding',
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description: 'The action that needs user confirmation',
      },
      importance: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        description: 'The importance level of the action',
      },
    },
    required: ['action'],
  },
};
```

### 4.2 在运行 Agent 时传入 tools

```ts
agent.runAgent({
  tools: [confirmActionTool],
  // other parameters...
});
```

这就是官方文档给出的核心传递方式：**在 `runAgent()` 的入参中传 `tools` 数组**。

---

## 5. 更完整的 TypeScript 示例

```ts
import { HttpAgent } from '@ag-ui/client';
import type { Tool } from '@ag-ui/core';

const agent = new HttpAgent({
  url: '/api/agent',
});

const getWeatherTool: Tool = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'City name or coordinates',
      },
      units: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'Temperature units',
      },
    },
    required: ['location'],
  },
};

await agent.runAgent({
  threadId: 'thread-123',
  runId: 'run-456',
  messages: [
    {
      id: 'msg-1',
      role: 'user',
      content: '帮我查询北京天气',
    },
  ],
  tools: [getWeatherTool],
});
```

这里可以看到：

- `tools` 与 `messages` 一样，都是 `runAgent()` 的输入
- `tools` 是本轮运行上下文的一部分
- 同一个 Agent，不同场景下可以传不同的工具列表

---

## 6. RunAgentInput 中的 tools 字段

官方文档示例里，`RunAgentInput` 的完整结构中就包含 `tools`：

```ts
const runInput = {
  threadId: 'thread-123',
  runId: 'run-456',
  messages: [systemMessage, userMessage],
  tools: [weatherTool],
  context,
  state: { preferences: { units: 'fahrenheit' } },
  forwardedProps: { temperature: 0.7 },
};
```

说明 AG-UI 从协议层面就支持把 `tools` 作为一次运行的标准输入传给 Agent。

---

## 7. AG-UI 中 tools 的设计含义

AG-UI 官方文档强调：**tools 是由前端定义并传给 Agent 的**。

这种设计有几个明显特点：

### 7.1 前端控制可用能力

前端可以决定当前页面、当前用户、当前业务场景下到底开放哪些工具。

例如：

- 管理员页面可以传更多后台操作工具
- 普通用户页面只传查询类工具
- 未登录用户不传敏感工具

### 7.2 tools 可以动态变化

不是所有会话都必须传固定工具集。

例如：

```ts
const tools = isLogin ? [searchTool, createOrderTool] : [searchTool];

await agent.runAgent({
  messages,
  tools,
});
```

### 7.3 前后端职责更清晰

- 前端：声明当前允许 Agent 调用哪些能力
- Agent：根据这些能力进行规划和调用
- 业务系统：真正执行工具背后的逻辑

### 7.4 更安全

敏感能力不会默认暴露给 Agent，而是由应用层显式传入。

---

## 8. 在当前项目中的推荐写法

如果你当前项目正在做 AI 聊天场景，推荐把 tools 定义抽离成单独模块，例如：

```ts
// app/utils/tools.ts
import type { Tool } from '@ag-ui/core';

export const categorySearchTool: Tool = {
  name: 'category_search',
  description: 'Search available article categories',
  parameters: {
    type: 'object',
    properties: {
      keyword: {
        type: 'string',
        description: 'Category keyword',
      },
    },
    required: ['keyword'],
  },
};

export const chatTools: Tool[] = [categorySearchTool];
```
```

然后在聊天请求里传入：

```ts
import { HttpAgent } from '@ag-ui/client';
import { chatTools } from '@/app/utils/tools';

const agent = new HttpAgent({
  url: '/api/agent',
});

await agent.runAgent({
  messages: [
    {
      id: crypto.randomUUID(),
      role: 'user',
      content: '帮我查一下前端分类',
    },
  ],
  tools: chatTools,
});
```

---

## 9. 推荐实践

### 9.1 工具定义应足够清晰

`description` 不要写得太泛，应该明确告诉模型：

- 这个工具做什么
- 什么时候该调用
- 参数分别表示什么

### 9.2 parameters 必须准确

`parameters` 本质上是给模型看的调用约束。

如果 schema 写得不清楚，容易导致：

- 参数名不匹配
- 类型错误
- 工具调用意图偏差

### 9.3 按场景传 tools，不要一次性全量暴露

推荐按页面、用户权限、会话目标动态构建工具列表，而不是把所有工具一次性传给 Agent。

### 9.4 前端只负责声明，执行逻辑要有边界

前端传入 `tools` 表示“允许 Agent 知道这些能力”，但真正执行时仍应在后端或业务层做好：

- 权限校验
- 参数校验
- 异常处理
- 审计记录

---

## 10. 常见问题

### 10.1 tools 是传给 HttpAgent 构造函数，还是传给 runAgent()？

根据官方示例，**是传给 `runAgent()`**，不是主要放在构造函数里。

推荐写法：

```ts
await agent.runAgent({
  messages,
  tools: [myTool],
});
```

### 10.2 tools 一定要前端定义吗？

从 AG-UI 官方文档的推荐模式来看，**是前端定义并传递**。

这样做的意义在于：由界面层决定当前暴露给 Agent 的能力集合。

### 10.3 tools 的参数格式是什么？

使用 **JSON Schema** 描述，至少应包含：

- `type: 'object'`
- `properties`
- `required`

---

## 11. 适合当前项目的总结

对于当前项目的 AI Chat 场景，可以直接按下面的思路理解：

1. 在前端定义 `Tool[]`
2. 把业务允许的工具放入 `tools`
3. 在 `agent.runAgent({ messages, tools })` 时传入
4. Agent 根据工具描述发起工具调用
5. 前端和后端再基于 AG-UI 的消息/事件机制处理调用过程与结果

最关键的一句是：

> AG-UI 中传递 tools 的标准方式，就是在调用 `runAgent()` 时，通过 `tools` 字段把前端定义的工具列表传给 Agent。

---

## 12. 参考来源

本文整理自 Context7 中的 AG-UI 官方文档，核心来源包括：

- `docs/concepts/tools.mdx`
- `docs/concepts/agents.mdx`
- `llms.txt` 中的 `RunAgentInput` / `Tool` 类型说明
