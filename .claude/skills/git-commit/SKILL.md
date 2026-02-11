# Git Commit Skill / Git 提交技能

当用户要求提交代码或写 commit message 时，使用此技能。

## Commit Message 规范

### 格式

<type>(<scope>): <subject>

<body>

<footer>

### Type 类型

| 类型 | 说明 | Emoji |
|------|------|-------|
| `feat` | 新功能 | ✨ |
| `fix` | Bug 修复 | 🐛 |
| `docs` | 文档更新 | 📝 |
| `style` | 代码格式 | 💄 |
| `refactor` | 重构 | ♻️ |
| `perf` | 性能优化 | ⚡ |
| `test` | 测试 | ✅ |
| `chore` | 其他修改 | 🔧 |

### Subject 标题

- **默认使用简体中文**
- 不超过 50 个字符
- 使用祈使句（动词开头）
- Type 和 Scope 保留英文，描述用中文

## 示例

### 简单提交
feat(auth): 添加用户登录功能

### 带正文的提交
fix(api): 修复支付服务超时问题

支付 API 由于同步数据库调用导致 30 秒后超时。
已改为异步操作并将超时时间增加到 60 秒。

Fixes #234

### Breaking Change
refactor(api)!: 修改用户接口返回格式

BREAKING CHANGE: 用户接口现在返回嵌套对象而非扁平结构。
