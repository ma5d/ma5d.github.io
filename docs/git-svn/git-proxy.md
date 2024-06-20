---
sidebar_position: 3
---

# git 代理

```shell
# 查看全局配置用户名
git config --global user.name ma

#查看全局配置的邮件
git config --global user.email ma@

git config --global --get http.proxy
git config --global --get https.proxy

git config --global --unset http.proxy
git config --global --unset https.proxy

git config --global http.proxy http://master:7890
git config --global https.proxy https://master:7890

```