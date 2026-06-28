#!/bin/sh

echo "开始部署..."

# 设置 Node.js 内存和超时
export NODE_OPTIONS="--max-old-space-size=4096 --timeout=600000"

# 安装依赖
echo "正在安装依赖..."
npm install

# 构建项目
echo "正在构建项目..."
npm run build

echo "构建完成！"

