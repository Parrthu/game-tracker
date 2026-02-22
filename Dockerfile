FROM python:3.11-slim

WORKDIR /app

# 安装依赖
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ .

# 暴露端口
EXPOSE 8000

# 启动命令（Railway 会自动注入 $PORT 环境变量，但这里写死 8000 也可以）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]