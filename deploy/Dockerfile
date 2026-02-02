# 第一阶段：构建
FROM node:24-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（利用 Docker 层缓存）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 第二阶段：运行
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制静态文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 nginx（使用前台运行方式）
CMD ["nginx", "-g", "daemon off;"]
