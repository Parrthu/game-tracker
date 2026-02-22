FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码（直接复制到 /app，不需要子目录）
COPY backend/ .

# 暴露端口
EXPOSE 8000

# 启动命令（直接运行，不需要 cd backend）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

