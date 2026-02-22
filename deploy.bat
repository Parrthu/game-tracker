@echo off
chcp 65001 >nul
title Game Tracker 部署脚本
echo.
echo 🎮 Game Tracker 部署脚本
echo ==========================
echo.

:: 进入 docker 目录
cd /d "%~dp0docker"

:: 创建数据目录
if not exist "data" mkdir data

:: 检查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose 未安装
    pause
    exit /b 1
)

echo ✅ Docker 环境检查通过
echo.

:: 选择部署模式
echo 请选择部署模式：
echo 1) 开发模式 (Dev) - 包含热重载，适合开发调试
echo 2) 生产模式 (Prod) - 优化构建，适合正式使用
set /p DEPLOY_MODE="请输入选项 [1-2]: "

if "%DEPLOY_MODE%"=="1" (
    set COMPOSE_FILE=docker-compose.dev.yml
    echo 🛠️ 使用开发模式部署
) else (
    set COMPOSE_FILE=docker-compose.yml
    echo 🚀 使用生产模式部署
)

:: 检查 .env 文件
if not exist ".env" (
    echo 📝 创建环境配置文件...
    (
        echo # 应用配置
        echo SECRET_KEY=your-super-secret-key-change-this-in-production
        echo DEBUG=false
        echo.
        echo # 数据库配置 (SQLite)
        echo DATABASE_URL=sqlite+aiosqlite:///app/data/gametracker.db
        echo.
        echo # Steam API 配置（可选）
        echo STEAM_API_KEY=
    ) > .env
    echo ✅ 已创建 .env 文件，请编辑配置你的密钥
)

echo.
echo 🔨 正在构建镜像...
docker-compose -f %COMPOSE_FILE% build

echo.
echo 🚀 正在启动服务...
docker-compose -f %COMPOSE_FILE% up -d

echo.
echo ⏳ 等待服务启动...
timeout /t 3 /nobreak >nul

echo.
echo 📊 服务状态：
docker-compose -f %COMPOSE_FILE% ps

echo.
echo ==========================
echo ✅ 部署完成！
echo.
echo 🌐 访问地址:
echo    - 前端: http://localhost
echo    - 后端 API: http://localhost/api
echo    - API 文档: http://localhost/api/docs
echo.
echo 📝 常用命令：
echo    - 查看日志: docker-compose -f %COMPOSE_FILE% logs -f
echo    - 停止服务: docker-compose -f %COMPOSE_FILE% down
echo    - 重启服务: docker-compose -f %COMPOSE_FILE% restart
echo.
echo 🔑 Demo 账号:
echo    用户名: demo
echo    密码: demo123
echo ==========================
echo.
pause
