@echo off
chcp 65001 >nul
echo ===================================
echo   Game Tracker - 启动脚本
echo ===================================
echo.

:: 检查Python
echo [1/2] 检查Python环境...
python --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Python，请先安装Python 3.11+
    pause
    exit /b 1
)
echo [OK] Python已安装

:: 启动后端
echo.
echo [2/2] 启动后端服务...
cd backend

:: 检查虚拟环境
if not exist "venv" (
    echo 创建虚拟环境...
    python -m venv venv
)

:: 激活虚拟环境
call venv\Scripts\activate

:: 安装依赖
pip install -q -r requirements.txt

:: 复制环境变量
if not exist ".env" (
    copy .env.example .env >nul
    echo 已创建.env文件，请根据需要修改配置
)

echo.
echo ===================================
echo   后端服务启动中...
echo   访问: http://localhost:8000
echo   API文档: http://localhost:8000/docs
echo ===================================
echo.

:: 启动服务
python run.py
pause
