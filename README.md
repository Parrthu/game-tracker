# Game Tracker - 游戏库管理

一个现代化的跨平台游戏库管理应用，支持Steam同步、游戏进度追踪和多平台管理。

## 功能特性

### 核心功能
- ✅ **账号系统** - JWT认证，支持注册/登录
- ✅ **Steam同步** - 自动同步Steam游戏库、游戏时间和成就
- ✅ **多平台支持** - Steam、PlayStation、Xbox、Switch、PC、Mobile
- ✅ **游戏状态** - 标记游戏状态：正在玩、已完成、弃坑、想玩、积压、未开始
- ✅ **大海报陈列** - 现代化游戏海报展示界面
- ✅ **统计分析** - 游戏时长、成就进度、完成率统计
- ✅ **Demo账号** - 预置测试账号，开箱即用

### 技术特点
- 🎨 **现代化UI** - Dark Mode设计，流畅动画效果
- 📱 **响应式设计** - 适配桌面和移动设备
- 🔒 **安全认证** - JWT Token + 密码加密
- 🗄️ **SQLite数据库** - 轻量级，易于部署
- 🐳 **Docker支持** - 一键部署
- 🚀 **前后端分离** - React + FastAPI架构

## 快速开始

### Demo账号
直接体验完整功能：
- **用户名**: `demo`
- **密码**: `demo123`

Demo账号包含12款示例游戏，涵盖各种状态和平台。

### 本地开发

#### 1. 克隆项目
```bash
cd game-tracker
```

#### 2. 启动后端
```bash
cd backend

# 创建虚拟环境
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境变量
cp .env.example .env

# 启动服务
python run.py
```

后端服务将在 `http://localhost:8000` 运行。

#### 3. 启动前端
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务将在 `http://localhost:5173` 运行。

### Docker部署

#### 方式一：使用 Docker Compose（推荐）

```bash
cd docker

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问 `http://localhost` 即可使用。

#### 方式二：手动构建

```bash
# 构建后端镜像
docker build -f docker/Dockerfile.backend -t gametracker-backend .

# 构建前端镜像
docker build -f docker/Dockerfile.frontend -t gametracker-frontend .

# 运行
mkdir -p data
docker run -d -v $(pwd)/data:/app/data -p 8000:8000 gametracker-backend
docker run -d -p 80:80 gametracker-frontend
```

## 配置说明

### 后端环境变量

创建 `backend/.env` 文件：

```env
# 应用配置
DEBUG=false
SECRET_KEY=your-super-secret-key-change-in-production

# 数据库配置
DATABASE_URL=sqlite+aiosqlite:///./gametracker.db
# 可选：PostgreSQL
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/gametracker

# Steam API配置（可选）
STEAM_API_KEY=your_steam_api_key_here

# CORS配置
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

### 获取Steam API Key

1. 访问 https://steamcommunity.com/dev/apikey
2. 登录Steam账号
3. 输入任意域名（如 `localhost`）
4. 复制生成的API Key

### 获取Steam ID

1. 访问 https://steamid.io
2. 输入你的Steam个人资料链接
3. 复制 `steamID64`（如：`76561197960434622`）

## 项目结构

```
game-tracker/
├── backend/                  # 后端服务
│   ├── app/
│   │   ├── core/            # 核心配置
│   │   ├── models/          # 数据库模型
│   │   ├── routers/         # API路由
│   │   ├── schemas/         # Pydantic模型
│   │   ├── services/        # 业务逻辑
│   │   └── main.py          # 应用入口
│   ├── requirements.txt
│   └── run.py
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # UI组件
│   │   ├── pages/           # 页面组件
│   │   ├── stores/          # Zustand状态管理
│   │   ├── types/           # TypeScript类型
│   │   └── services/        # API服务
│   ├── package.json
│   └── vite.config.ts
└── docker/                   # Docker配置
    ├── docker-compose.yml
    ├── Dockerfile.backend
    ├── Dockerfile.frontend
    └── nginx.conf
```

## API文档

启动后端后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 主要API端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/auth/register` | POST | 用户注册 |
| `/auth/login` | POST | 用户登录 |
| `/auth/me` | GET | 获取当前用户 |
| `/games/library` | GET | 获取游戏库列表 |
| `/games/library` | POST | 添加游戏到库 |
| `/games/library/{id}` | PUT | 更新游戏记录 |
| `/games/library/{id}` | DELETE | 从库中移除游戏 |
| `/games/sync/steam` | POST | 同步Steam游戏库 |

## 技术栈

### 后端
- **FastAPI** - 现代Python Web框架
- **SQLAlchemy** - ORM数据库工具
- **SQLite** - 轻量级数据库（支持PostgreSQL）
- **JWT** - 认证机制
- **Passlib** - 密码哈希

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 原子化CSS
- **Zustand** - 状态管理
- **Framer Motion** - 动画库

## 开发计划

### 已实现
- [x] 用户认证系统
- [x] Steam API集成
- [x] 游戏库管理
- [x] 多状态标记
- [x] 统计面板
- [x] Demo数据
- [x] Docker部署

### 未来功能
- [ ] PlayStation Network集成
- [ ] Xbox Live集成
- [ ] Nintendo Account集成
- [ ] 游戏推荐系统
- [ ] 好友功能
- [ ] 成就详情页
- [ ] 游戏时长图表

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
