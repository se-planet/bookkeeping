# 🤖 记账本

> Claude Code 全栈构建的个人财务管理应用 — React + Express + SQLite

## 功能

- **收支记录** — 添加/编辑/删除收入支出记录，支持分类、子分类、支付方式、备注
- **分类管理** — 自定义收入/支出类别，预设 14 个常用分类，支持图标和颜色
- **数据统计** — 月度/年度收支总览、分类占比饼图、月度趋势柱状图
- **数据导出** — 导出 CSV / Excel 报表
- **数据导入** — 从 CSV 文件导入历史记账数据

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 19, React Router v7, TanStack Query v5, Recharts, Tailwind CSS v4, Vite |
| 后端 | Node.js, Express.js, better-sqlite3 |
| 数据库 | SQLite (WAL 模式) |

## 项目结构

```
claude-bookkeeper/
├── server/                 # 后端
│   └── src/
│       ├── index.js        # 入口
│       ├── app.js          # Express 配置
│       ├── db/             # 数据库连接、建表、种子数据
│       ├── routes/         # 路由定义
│       ├── controllers/    # 请求处理
│       ├── models/         # 数据访问层
│       ├── middleware/      # 错误处理、请求校验
│       └── utils/          # CSV/Excel 导出
├── web-client/             # 前端
│   └── src/
│       ├── api/            # API 请求封装
│       ├── hooks/          # React Query hooks
│       ├── pages/          # 页面组件
│       └── index.css       # 全局样式
└── package.json
```

## 快速开始

### 1. 启动后端

```bash
cd server
npm install
npm run dev
# 运行在 http://localhost:3000
```

### 2. 启动前端

```bash
cd web-client
npm install
npm run dev
# 运行在 http://localhost:5173
```

浏览器打开 `http://localhost:5173` 即可使用。

### 3. 导入数据（可选）

```bash
curl -X POST http://localhost:3000/api/import/csv \
  -H "Content-Type: application/json" \
  -d "{\"filePath\":\"/path/to/data.csv\"}"
```

支持 CSV 格式：`时间,日期,类型,分类,子分类,金额,备注,标签,卡券`

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET/POST | `/api/categories` | 分类列表 / 创建 |
| PUT/DELETE | `/api/categories/:id` | 更新 / 删除分类 |
| GET/POST | `/api/transactions` | 记录列表 / 创建 |
| GET/PUT/DELETE | `/api/transactions/:id` | 单个记录 CRUD |
| GET | `/api/statistics/summary` | 收支总览 |
| GET | `/api/statistics/by-category` | 分类占比 |
| GET | `/api/statistics/monthly-trend` | 月度趋势 |
| GET | `/api/export/csv` | 导出 CSV |
| GET | `/api/export/excel` | 导出 Excel |
| POST | `/api/import/csv` | 导入 CSV |
| GET | `/api/health` | 健康检查 |
