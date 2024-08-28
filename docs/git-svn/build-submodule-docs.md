# curl 触发 github actions

## 步骤前瞻
- 不建议使用父子项目，没啥作用
- 使用这个curl触发action: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28

## 获取github access token
<img referrerpolicy="no-referrer" alt="img" src="https://ask.qcloudimg.com/http-save/4932777/182a162407da37037c594e4e3ae503be.png"/>

## 更改*.github.io/.github/workflows/*.yml

```yaml
on: 
    repository_dispatch:
        types:
            - webhook-1
            - webhook-2
```

## 新建客户端仓库yml
```yaml
name: Trigger Website Build

on:
    push:
        branches:
            - main

jobs:
    trigger-website-action:
        runs-on: ubuntu-latest

        steps:
            - name: Trigger Website Build
                run: |
                    curl -L \
                    -X POST \
                    -H "Accept: application/vnd.github+json" \
                    -H "Authorization: Bearer ${{ secrets.ACCESS_TOKEN }}" \
                    -H "X-GitHub-Api-Version: 2022-11-28" \
                    -H "Content-Type: application/json" \
                    https://api.github.com/repos/{{owner}}/{{repo}}/dispatches \
                    -d '{"event_type":"webhook-1","client_payload":{"unit":false,"integration":true}}'
```
## 配置action需要的密码
仓库页->settings->security->secrets and variables -> actions -> Secrets -> new repository secret