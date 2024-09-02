# node 使用代码块

## 1. Error: Cannot find module 'semver'

```text
Node.js v20.17.0

```

```shell
vfox use nodejs@18
```

## 2. nodejs 使用代理

```shell

export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

npm install @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest @docusaurus/types@latest
```