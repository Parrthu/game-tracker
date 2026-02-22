# 🚀 部署指南

本文档详细介绍 Game Tracker 的各种部署方式。

## 📋 目录

1. [Docker部署（推荐）](#docker部署推荐)
2. [本地开发部署](#本地开发部署)
3. [手动部署](#手动部署)
4. [生产环境配置](#生产环境配置)
5. [常见问题](#常见问题)

---

## Docker部署（推荐）

Docker部署是最简单、最稳定的方式，适合大多数用户。

### 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

### 快速部署（自动脚本）

**Windows:**
```bash
双击运行 deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### 手动部署

```bash
cd docker

# 创建数据目录
mkdir -p data

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端页面 | http://localhost |
| 后端API | http://localhost/api |
| API文档 | http://localhost/api/docs |
| ReDoc文档 | http://localhost/api/redoc |

### 部署模式说明

#### 生产模式 (`docker-compose.yml`)
- 前端使用 Nginx 服务静态文件
- 后端使用 Uvicorn 运行
- 适合正式使用

#### 开发模式 (`docker-compose.dev.yml`)
- 前端支持热重载 (HMR)
- 后端支持代码修改自动重启
- 适合开发调试

切换开发模式：
```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## 本地开发部署

适合想要修改代码或贡献代码的开发者。

### 1. 克隆项目

```bash
git clone <repository-url>
cd game-tracker
```

### 2. 启动后端

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python run.py
```

后端将在 http://localhost:8000 运行

### 3. 启动前端（新终端）

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:5173 运行

### 4. 访问应用

打开浏览器访问 http://localhost:5173

---

## 手动部署

适合想要自定义部署环境的用户。

### 后端部署

#### 1. 环境要求
- Python 3.11+
- SQLite（已内置）或 PostgreSQL

#### 2. 安装依赖

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

#### 3. 配置环境变量

创建 `.env` 文件：

```env
# 必填项
SECRET_KEY=your-super-secret-key-min-32-characters-long

# 数据库（二选一）
# SQLite（简单，适合个人使用）
DATABASE_URL=sqlite+aiosqlite:///./gametracker.db
# PostgreSQL（高性能，适合多用户）
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/gametracker

# Steam API（可选，用于同步Steam游戏）
STEAM_API_KEY=your_steam_api_key

# CORS（前端地址）
CORS_ORIGINS=["http://localhost:5173","http://your-domain.com"]
```

#### 4. 启动服务

```bash
# 开发模式（热重载）
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 生产模式
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### 前端部署

#### 1. 环境要求
- Node.js 18+
- npm 或 yarn

#### 2. 安装依赖

```bash
cd frontend
npm install
```

#### 3. 配置 API 地址

编辑 `frontend/.env.local`：

```env
VITE_API_URL=http://your-backend-address:8000
```

#### 4. 构建

```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

生产构建产物在 `dist/` 目录，可以用任何静态文件服务器托管。

#### 5. 使用 Nginx 托管（推荐）

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 生产环境配置

### 1. 安全配置

#### 修改 SECRET_KEY

```bash
# 生成随机密钥
openssl rand -hex 32
```

将生成的密钥写入 `.env` 文件。

#### 使用 HTTPS

**使用 Nginx + Certbot（免费SSL）**

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 2. 数据库选择

#### SQLite（适合个人/小团队）
- ✅ 零配置
- ✅ 单文件存储
- ❌ 并发性能有限

#### PostgreSQL（适合生产环境）

```bash
# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 创建数据库
sudo -u postgres createdb gametracker

# 创建用户
sudo -u postgres createuser -P gametracker_user

# 修改 .env
DATABASE_URL=postgresql+asyncpg://gametracker_user:password@localhost/gametracker
```

### 3. 使用 systemd 管理服务

创建 `/etc/systemd/system/gametracker.service`：

```ini
[Unit]
Description=Game Tracker Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/game-tracker/backend
Environment=PATH=/path/to/game-tracker/backend/venv/bin
Environment=DATABASE_URL=sqlite+aiosqlite:///app/data/gametracker.db
Environment=SECRET_KEY=your-secret-key
ExecStart=/path/to/game-tracker/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

启动服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable gametracker
sudo systemctl start gametracker
sudo systemctl status gametracker
```

### 4. 数据备份

#### 备份 SQLite 数据库

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
cp /path/to/gametracker.db /backup/gametracker_${DATE}.db
# 保留最近30天备份
find /backup -name "gametracker_*.db" -mtime +30 -delete
```

添加到 crontab：
```bash
0 2 * * * /path/to/backup.sh
```

---

## 常见问题

### Q: Docker部署后无法访问？

**检查步骤：**
```bash
cd docker

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs backend
docker-compose logs frontend

# 检查端口占用
netstat -tlnp | grep 80
```

### Q: 如何更新到最新版本？

**Docker方式：**
```bash
cd docker
docker-compose down
docker-compose pull  # 如果有远程镜像
docker-compose up -d --build
```

**手动方式：**
```bash
# 拉取最新代码
git pull

# 更新后端
cd backend
source venv/bin/activate
pip install -r requirements.txt

# 更新前端
cd frontend
npm install
npm run build
```

### Q: 如何修改端口？

编辑 `docker/docker-compose.yml`：

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 修改为 8080 端口
```

### Q: 数据存储在哪里？

**Docker:**
- 数据卷挂载在 `./docker/data/`
- SQLite数据库: `./docker/data/gametracker.db`

**手动部署:**
- 根据 `.env` 中的 `DATABASE_URL` 配置

### Q: 如何重置 Demo 数据？

删除数据库文件后重启服务：

```bash
# Docker
cd docker
rm -f data/gametracker.db
docker-compose restart backend

# 手动
cd backend
rm -f gametracker.db
python run.py
```

---

## 📞 需要帮助？

遇到问题请：
1. 查看日志：`docker-compose logs` 或 `tail -f backend/app.log`
2. 检查配置：确认 `.env` 文件配置正确
3. 检查端口：确认端口未被占用

## 🔗 相关文档

- [README.md](./README.md) - 项目介绍
- [后端API文档](http://localhost:8000/docs) - 启动后访问
