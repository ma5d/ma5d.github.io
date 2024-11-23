# GIT 代码段

## 1. git 代理

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

## 2. git 不删除本地文件，删除。

```bash
git rm -r --cached .vscode  
git commit -m 'delete .vscode'
git push
```

## 3. 远程仓库没有，而本地文件有

这种情况，就是远程仓库中没有，是自己在本地配置的文件不想提交，这时候只要在该文件同级目录下配置.gitignore文件，.gitignore文件中加入配置文件的名字即可，.gitignore文件是git用来设置不需要提交远程仓库的文件的配置文件

## 4. 远程仓库有，本地文件也有但已修改

- 修改不想被跟踪提交 

    ```bash
    git update-index --assume-unchanged "/root/tem/java/web/application-dev.yml" //git关闭跟踪文件修改提交
    git update-index --no-assume-unchanged "/root/tem/java/web/application-dev.yml"//git打开跟踪文件修改提交
    git update-index --assume-unchanged "/app/*.xml";//关闭跟踪app目录下后缀为.xml的文件
    git update-index --assume-unchanged "/app/";//打开跟踪app目录下的所有文件
    ```

- 接收远程，不提交本地修改

    ```bash
    git update-index --skip-worktree "/app/tep/ap.txt"//关闭GIT跟踪本地文件修改
    git update-index --no-skip-worktree "/app/tep/ap.txt"//打开GIT跟踪本地文件修改
    ```

## 5. 鉴权失败

```log
ma-C92# git push
remote: Invalid username or password.
致命错误：'https://github.com/ma5d/ma5d.github.io/' 鉴权失败
```

```bash
# 这会将你的凭据（包括 PAT）保存在明文文件中
git config --global credential.helper store
echo "https://username:personal_access_token@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
```

直接push解决问题。

## 6. git 拉取指定分支

```shell
git clone --single-branch --branch <branch_name> <repository_url>
git clone --depth 1 --single-branch --branch Quartz https://gitee.com/ma5d/imgs.git
```