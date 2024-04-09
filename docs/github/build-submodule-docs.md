# 使用webhook 出发 github actions，完成父子项目构建

## 获取github access token

<img referrerpolicy="no-referrer" alt="img" src="https://ask.qcloudimg.com/http-save/4932777/182a162407da37037c594e4e3ae503be.png"/>

## 构建子模块

### 增加

```sh
git submodule add <url> <path>
git submodule init
git submodule update
git submodule update --init --recursive
```

### 删除

```sh
# 逆初始化模块，其中{MOD_NAME}为模块目录，执行后可发现模块目录被清空
git submodule deinit {MOD_NAME} 
# 删除.gitmodules中记录的模块信息（--cached选项清除.git/modules中的缓存）
git rm --cached {MOD_NAME} 
# 提交更改到代码库，可观察到'.gitmodules'内容发生变更
git commit -am "Remove a submodule." 
```



## 更改.github/workflows/*.yml

```yml
on: 
    repository_dispatch:
        types:
            - webhook-1
            - webhook-2
```

## github 自定义参数



## ##  触发

```sh
curl -X POST https://api.github.com/repos/shaowenchen/wait-webhook-to-run/dispatches \
        -H "Accept: application/vnd.github.everest-preview+json" \
        -H "Authorization: token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxx" \
        --data '{"event_type": "webhook-1"}'
```





