# 梦织机·Novelist Studio

面向网络小说作者的长篇创作工作台

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这将同时启动：
- **前端**: http://localhost:5173 (React + Vite)
- **后端 API**: http://localhost:3001 (Express.js)

## ✨ 功能特性

### 🎯 核心功能

- **用户认证**: 注册、登录、JWT Token认证
- **项目管理**: 创建、编辑、删除小说项目
- **章节管理**: 章节的增删改查、拖拽排序
- **富文本编辑器**: 基于TipTap的沉浸式写作体验
- **自动保存**: 每30秒自动保存章节内容
- **设定管理**: 世界观、角色、物品等设定管理
- **字数统计**: 实时统计写作字数

### 🎨 设计特点

- **深色主题**: 沉浸式写作体验，减少视觉疲劳
- **暖金色强调**: `#d4af37` 暖金色点缀，营造文学氛围
- **思源字体**: 中文衬线字体，增强文学感
- **流畅动画**: 优雅的加载动画和过渡效果

## 🛠️ 技术栈

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **TailwindCSS** - 样式框架
- **Zustand** - 状态管理
- **React Router 7** - 路由管理
- **TipTap** - 富文本编辑器
- **Lucide React** - 图标库

### 后端
- **Express.js** - Web框架
- **TypeScript** - 类型安全
- **SQLite** - 数据库 (better-sqlite3)
- **JWT** - 身份认证
- **bcrypt** - 密码加密
- **zod** - 数据验证

## 📁 项目结构

```
novelist-studio/
├── src/                      # 前端源代码
│   ├── pages/               # 页面组件
│   ├── stores/              # Zustand状态管理
│   ├── services/            # API服务层
│   └── ...
├── api/                     # 后端源代码
│   ├── controllers/          # 控制器层
│   ├── services/            # 业务逻辑层
│   ├── repositories/        # 数据访问层
│   ├── middleware/          # 中间件
│   └── database.ts          # 数据库配置
├── shared/                  # 共享类型定义
│   └── types/
├── .trae/documents/         # 项目文档
│   ├── PRD.md               # 产品需求文档
│   └── Technical-Architecture.md  # 技术架构文档
└── data/                    # 数据库文件
    └── novelist.db
```

## 🔧 环境变量

创建 `.env` 文件（参考 `.env.example`）:

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/novelist.db
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=梦织机·Novelist Studio
```

## 📖 使用指南

### 1. 注册/登录
访问应用后，注册一个账号或登录已有账号。

### 2. 创建项目
在仪表盘页面，点击"新建项目"按钮，填写项目标题和简介。

### 3. 管理章节
进入项目后，可以创建、编辑、删除章节。

### 4. 开始写作
点击章节进入富文本编辑器，开始你的创作之旅。

### 5. 设定管理
在项目中创建和管理世界观、角色、物品等设定。

## 🔐 API接口

### 认证模块
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 项目模块
- `GET /api/projects` - 获取用户所有项目
- `POST /api/projects` - 创建新项目
- `GET /api/projects/:id` - 获取项目详情
- `PUT /api/projects/:id` - 更新项目
- `DELETE /api/projects/:id` - 删除项目

### 章节模块
- `GET /api/projects/:projectId/chapters` - 获取项目所有章节
- `POST /api/projects/:projectId/chapters` - 创建新章节
- `PUT /api/projects/:projectId/chapters/:id` - 更新章节
- `DELETE /api/projects/:projectId/chapters/:id` - 删除章节

### 设定模块
- `GET /api/projects/:projectId/elements` - 获取所有设定
- `POST /api/projects/:projectId/elements` - 创建新设定
- `PUT /api/projects/:projectId/elements/:id` - 更新设定
- `DELETE /api/projects/:projectId/elements/:id` - 删除设定

## 🎯 开发计划

### MVP版本（已完成）
- ✅ 用户注册与登录
- ✅ 项目CRUD
- ✅ 章节CRUD
- ✅ 富文本编辑器
- ✅ 自动保存
- ✅ 本地SQLite存储

### 第二期功能
- 🔄 AI续写集成
- 🔄 设定管理完整版
- 🔄 云端同步
- 🔄 历史版本记录

### 第三期功能
- 📋 多人协作
- 📋 数据导出
- 📋 社区分享
- 📋 高级AI功能

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
