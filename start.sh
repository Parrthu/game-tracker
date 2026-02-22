#!/bin/bash

echo "==================================="
echo "   Game Tracker - 启动脚本"
echo "==================================="
echo ""

# 检查Python
echo "[1/2] 检查Python环境..."
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到Python3，请先安装Python 3.11+"
    exit 1
fi
echo "[OK] Python已安装"

# 启动后端
echo ""
echo "[2/2] 启动后端服务..."
cd backend

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -q -r requirements.txt

# 复制环境变量
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "已创建.env文件，请根据需要修改配置"
fi

echo ""
echo "==================================="
echo "   后端服务启动中..."
echo "   访问: http://localhost:8000"
echo "   API文档: http://localhost:8000/docs"
echo "==================================="
echo ""

# 启动服务
python run.py
