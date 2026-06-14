# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

个人财务管理 Web 应用（记账本），支持收支记录、分类管理、统计图表、数据导入导出。

## 常用命令

```bash
# 后端 (Express.js + SQLite, 端口 3000)
cd server && npm run dev          # 开发模式 (node --watch, 支持热重载)
cd server && npm start            # 生产模式

# 前端 (Vite + React, 端口 5173)
cd web-client && npm run dev      # 开发模式 (Vite 代理 /api → localhost:3000)
cd web-client && npm run build    # 生产构建
cd web-client && npm run lint     # ESLint 代码检查
```

## 项目结构

```
├── package.json            # 根 monorepo，workspaces: ["server"]
├── server/                 # 后端 (Express.js + better-sqlite3)
│   └── src/
│       ├── index.js        # 入口：初始化数据库、播种数据、启动服务
│       ├── app.js          # Express 配置，挂载路由和中间件
│       ├── config.js       # PORT (默认 3000)、DB_PATH
│       ├── db/
│       │   ├── connection.js   # 单例数据库连接 (WAL 模式 + 外键开启)
│       │   ├── schema.js       # 建表 + 列级别迁移 (try/catch ALTER TABLE)
│       │   └── seed.js         # 预置 14 个分类 + 默认设置
│       ├── routes/             # 路由定义，只做路径映射
│       ├── controllers/        # 请求处理：参数提取、校验、调用 model
│       ├── models/             # 数据访问层，直接用 better-sqlite3 操作
│       ├── middleware/
│       │   ├── errorHandler.js     # 统一错误处理
│       │   └── validateRequest.js  # 声明式请求体校验 (validate(schema))
│       └── utils/             # CSV/Excel 导出工具
└── web-client/              # 前端 (React 19, Vite, TanStack Query v5)
    └── src/
        ├── main.jsx          # 入口：QueryClient + BrowserRouter + App
        ├── App.jsx           # 侧边栏导航 + 路由定义
        ├── api/              # axios 请求封装 (client.js 配置 baseURL: '/api')
        ├── hooks/            # TanStack Query hooks (query/mutation)
        ├── pages/            # 页面组件
        └── index.css         # Tailwind CSS v4 全局样式
```

## 架构约定

### 后端分层

**Routes → Controllers → Models → DB**，每一层有明确边界：
- Routes 只定义 HTTP 方法和路径，不包含业务逻辑
- Controllers 处理 req/res，提取参数，调用 Model，返回响应
- Models 是纯数据访问对象（非类实例），每个 Model 导出带静态方法的对象（如 `Transaction.findAll()`、`Transaction.create()`）
- 数据库文件位于 `server/data/bookkeeping.db`（已加入 .gitignore）

### 请求校验

使用声明式 schema 中间件：[middleware/validateRequest.js](server/src/middleware/validateRequest.js)

```js
const { validate } = require('../middleware/validateRequest');
router.post('/', validate({
  type: { required: true, oneOf: ['income', 'expense'] },
  amount: { required: true, type: 'number', min: 0.01 },
  category_id: { required: true, type: 'number' },
}), controller.create);
```

支持规则：`required`、`type` ('number'|'string')、`min`、`max`、`maxLength`、`oneOf`。

### 数据库迁移

采用轻量列级迁移：[schema.js](server/src/db/schema.js) 中通过 `try/catch` 执行 `ALTER TABLE ADD COLUMN`，忽略 "duplicate column" 错误。这是唯一支持的迁移方式。不要新增迁移框架。

### 前端数据流

```
Pages → Hooks (TanStack Query) → API (axios) → Vite Proxy → Express
```

- 每个 API 模块对应一个 `hooks/use*.js` 文件
- Query key 约定：列表用 `['transactions', params]`，单条用 `['transactions', id]`
- Mutation 成功后自动 invalidate 相关 query（transactions + statistics）

### 预置分类

种子数据（14 个预设分类）只在 categories 表为空时插入。包含 9 个支出分类和 5 个收入分类，均标记 `is_default = 1`。用户新增的分类不标记为默认，因此可被删除。

### 跨域配置

后端 CORS 允许 `http://localhost:5173` 和 `http://localhost:3000`。Vite 开发服务器通过 proxy 将 `/api` 请求转发到 `http://localhost:3000`。

## 编码行为准则 (Karpathy Guidelines)

以下准则用于减少 LLM 编码常见错误。**权衡：** 这些准则偏向谨慎而非速度。对简单任务可酌情处理。

### 1. 先思考再编码

**不要假设。不要隐藏困惑。明确指出权衡。**

实施前：
- 明确陈述你的假设。如果不确定，就问。
- 如果存在多种解读，呈现出来 — 不要悄悄选择一种。
- 如果有更简单的方法，说出来。必要时提出反对。
- 如果有不清楚的地方，停下来。指出困惑的点，然后问。

### 2. 简洁优先

**最少代码解决问题。不写推测性代码。**

- 不实现未要求的功能。
- 不为一次性使用的代码创建抽象。
- 不添加未被要求的"灵活性"或"可配置性"。
- 不为不可能发生的场景添加错误处理。
- 如果写了 200 行但 50 行就能解决，重写。

问自己："资深工程师会觉得这过于复杂吗？" 如果是，简化。

### 3. 精准修改

**只改必须改的。只清理自己造成的混乱。**

编辑现有代码时：
- 不要"改进"相邻的代码、注释或格式。
- 不要重构没坏的东西。
- 匹配现有风格，即使你会用不同写法。
- 如果你注意到无关的死代码，提出来 — 不要删除。

当你的改动产生孤立代码时：
- 移除因你的改动而不再使用的 imports/变量/函数。
- 不要删除已有的死代码，除非被明确要求。

测试标准：每一行改动都应该能追溯到用户的需求。

### 4. 目标驱动执行

**定义成功标准。循环直到验证通过。**

将任务转化为可验证的目标：
- "添加验证" → "为无效输入写测试，然后让测试通过"
- "修复 bug" → "写一个能复现的测试，然后让它通过"
- "重构 X" → "确保测试在重构前后都通过"

多步骤任务先陈述简要计划：
```
1. [步骤] → 验证: [检查点]
2. [步骤] → 验证: [检查点]
3. [步骤] → 验证: [检查点]
```

强的成功标准让你能独立循环。弱的标准（"让它能工作"）则需要不断澄清。
