#!/bin/bash

# Game Tracker 部署脚本
set -e

echo "🎮 Game Tracker 部署脚本"
echo "=========================="
echo ""

# 检测操作系统
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo "检测到 Windows 系统"
    IS_WINDOWS=1
else
    echo "检测到 Linux/Mac 系统"
    IS_WINDOWS=0
fi

# 进入 docker 目录
cd "$(dirname "$0")/docker"

# 创建数据目录
mkdir -p data

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

echo "✅ Docker 环境检查通过"
echo ""

# 询问部署模式
echo "请选择部署模式："
echo "1) 开发模式 (Dev) - 包含热重载，适合开发调试"
echo "2) 生产模式 (Prod) - 优化构建，适合正式使用"
read -p "请输入选项 [1-2]: " DEPLOY_MODE

if [ "$DEPLOY_MODE" == "1" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "🛠️ 使用开发模式部署"
else
    COMPOSE_FILE="docker-compose.yml"
    echo "🚀 使用生产模式部署"
fi

# 检查是否存在 .env 文件
if [ ! -f ".env" ]; then
    echo "📝 创建环境配置文件..."
    cat > .env << 'EOF'
# 应用配置
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=false

# 数据库配置 (SQLite)
DATABASE_URL=sqlite+aiosqlite:///app/data/gametracker.db

# Steam API 配置（可选，用于同步Steam游戏）
# 获取地址: https://steamcommunity.com/dev/apikey
STEAM_API_KEY=
EOF
    echo "✅ 已创建 .env 文件，请编辑配置你的密钥"
fi

# 构建并启动
echo ""
echo "🔨 正在构建镜像..."
docker-compose -f "$COMPOSE_FILE" build

echo ""
echo "🚀 正在启动服务..."
docker-compose -f "$COMPOSE_FILE" up -d

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 3

# 检查服务状态
echo ""
echo "📊 服务状态："
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "=========================="
echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址:"
echo "   - 前端: http://localhost"
echo "   - 后端 API: http://localhost/api"
echo "   - API 文档: http://localhost/api/docs"
echo ""
echo "📝 常用命令："
echo "   - 查看日志: docker-compose -f $COMPOSE_FILE logs -f"
echo "   - 停止服务: docker-compose -f $COMPOSE_FILE down"
echo "   - 重启服务: docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "🔑 Demo 账号:"
echo "   用户名: demo"
echo "   密码: demo123"
echo "=========================="
