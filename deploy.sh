#!/bin/bash

# 构建项目
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "Build successful. Deploying to server..."
    
    # 将构建结果复制到远程服务器
    scp -r build/* root@m.sunmeta.top:/var/www/sun/build/
    scp -r build/* root@daily.m.sunmeta.top:/var/www/sun/build/

    if [ $? -eq 0 ]; then
        echo "Deployment successful."
    else
        echo "Deployment failed."
    fi
else
    echo "Build failed."
fi



