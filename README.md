# 会议室座位预定管理系统 - 管理端

## 项目简介

这是一个基于 Vue 3 + Element Plus 的会议室座位预定管理系统的后台管理端，提供用户管理、会议室管理、座位管理、预订管理和数据统计等功能。

## 技术栈

- **框架**: Vue 3.4
- **构建工具**: Vite 5.0
- **UI 组件库**: Element Plus 2.5
- **状态管理**: Pinia 2.1
- **路由管理**: Vue Router 4.2
- **HTTP 客户端**: Axios 1.6
- **图表库**: ECharts 5.6
- **日期处理**: Day.js 1.11
- **样式预处理**: Sass 1.69

## 功能模块

### 1. 用户管理
- 用户列表查看
- 用户信息编辑
- 用户状态管理
- 用户权限控制

### 2. 会议室管理
- 会议室列表
- 会议室新增/编辑/删除
- 会议室状态管理
- 会议室详情查看

### 3. 座位管理
- 座位布局配置
- 座位信息编辑
- 座位状态管理
- 座位可视化展示

### 4. 预订管理
- 预订列表查看
- 预订审核
- 预订状态管理
- 预订详情查看

### 5. 数据统计
- 预订数据统计
- 使用率分析
- 可视化图表展示

### 6. 个人中心
- 个人信息管理
- 密码修改
- 登录日志查看

## 项目结构

```
seat-booking-admin/
├── src/
│   ├── api/                 # API 接口
│   │   ├── admin.js        # 管理员接口
│   │   ├── booking.js      # 预订接口
│   │   ├── room.js         # 会议室接口
│   │   ├── seat.js         # 座位接口
│   │   └── user.js         # 用户接口
│   ├── layout/             # 布局组件
│   │   └── MainLayout.vue  # 主布局
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由定义
│   ├── stores/             # 状态管理
│   │   └── user.js         # 用户状态
│   ├── utils/              # 工具函数
│   │   └── request.js      # Axios 封装
│   ├── views/              # 页面组件
│   │   ├── booking/        # 预订管理页面
│   │   ├── room/           # 会议室管理页面
│   │   ├── user/           # 用户管理页面
│   │   ├── Dashboard.vue   # 仪表盘
│   │   ├── Login.vue       # 登录页
│   │   ├── Profile.vue     # 个人中心
│   │   └── Statistics.vue  # 数据统计
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
└── README.md               # 项目说明
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 生产环境构建

```bash
npm run build
```

构建产物将生成在 `dist` 目录

### 预览生产构建

```bash
npm run preview
```

## 配置说明

### API 代理配置

项目默认配置了 API 代理，将 `/api` 开头的请求代理到 `http://localhost:8080`

如需修改后端地址，请编辑 `vite.config.js`：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url',  // 修改为你的后端地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

### 路径别名

项目配置了 `@` 别名指向 `src` 目录，可以使用：

```javascript
import Component from '@/components/Component.vue'
```

## 核心功能说明

### 请求拦截

- 自动添加 token 到请求头
- GET 请求自动缓存（30秒）
- 统一错误处理
- 401 自动跳转登录

### 路由守卫

- 未登录自动跳转登录页
- 已登录访问登录页自动跳转首页
- 路由权限控制

### 状态管理

使用 Pinia 管理全局状态：
- 用户信息
- 登录状态
- Token 管理