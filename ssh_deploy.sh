#!/usr/bin/env bash

# 服务器别名映射
declare -A SERVERS
SERVERS=(
    ["daily"]="daily.m.sunmeta.top"
    ["prd"]="m.sunmeta.top"
)

REMOTE_USER="root"   # 远程服务器用户名
REMOTE_DIR="/root/code/nstop-engine"  # 代码所在目录

# 获取目标服务器
TARGET_ALIAS=${1:-"all"}  # 默认所有服务器

# 定义部署函数
deploy() {
    local ALIAS=$1
    local SERVER=${SERVERS[$ALIAS]}

    if [[ -z "$SERVER" ]]; then
        echo "Error: Unknown alias '$ALIAS'"
        echo "Available aliases: ${!SERVERS[*]}"
        exit 1
    fi

    echo "===================="
    echo "Deploying to $ALIAS ($SERVER)..."
    echo "===================="

    ssh $REMOTE_USER@$SERVER << EOF
set -x  # 开启命令执行回显

# 进入项目目录
cd $REMOTE_DIR

# 拉取最新代码
git pull

# 安装依赖 & 构建
npm install --production
npm run build

#mv 
    mv  build/*  /var/www/sun/build/


set +x  # 关闭命令执行回显
EOF
}

# 判断执行方式
if [[ "$TARGET_ALIAS" == "all" ]]; then
    for ALIAS in "${!SERVERS[@]}"; do
        deploy "$ALIAS"
    done
else
    deploy "$TARGET_ALIAS"
fi