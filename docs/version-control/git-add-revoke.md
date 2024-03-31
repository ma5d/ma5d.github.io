---
sidebar_position: 1
---

项目开发的时候，有些公共的配置文件修改后不需要提交，这时候需要怎么做呢？这根据不同情况使用不同的命令

[](https://blog.csdn.net/yzpbright/article/details/124847386)1.远程仓库没有，而本地文件有
==========================================================================

这种情况，就是远程仓库中没有，是自己在本地配置的文件不想提交，这时候只要在该文件同级目录下配置.gitignore文件，.gitignore文件中加入配置文件的名字即可，.gitignore文件是git用来设置不需要提交远程仓库的文件的配置文件

[](https://blog.csdn.net/yzpbright/article/details/124847386)2.远程仓库有，本地文件也有但已修改
=============================================================================

这种情况，就是从远程仓库拉取下来到本地的配置文件被修改了，但修改不想被跟踪提交，这时候可以使用两个命令：  
## 1、`git update-index --assume-unchanged ${文件路径}`  
让git不再跟踪`${文件路径}`的更新了；当项目开发完成后又想将该配置文件的修改更新提交至远程仓库，就解除不跟踪设置，使用命令：`git update-index --no-assume-unchanged ${文件路径}`，即可使git再次跟踪`${文件路径}`。如下：

```bash
git update-index --assume-unchanged "/root/tem/java/web/application-dev.yml" //git关闭跟踪文件修改提交
git update-index --no-assume-unchanged "/root/tem/java/web/application-dev.yml"//git打开跟踪文件修改提交

```

同理，设置符合特定命名的文件、特殊后缀的文件、特定目录下的所有文件都是命令：`git update-index --assume-unchanged`

```
git update-index --assume-unchanged "/app/*.xml";//关闭跟踪app目录下后缀为.xml的文件
git update-index --assume-unchanged "/app/";//打开跟踪app目录下的所有文件

```

`assume-unchanged`：我的理解是关闭本地文件与远程仓库跟踪，不再影响或被影响远程仓库，因此一旦使用`assume-unchanged`，文件将不再从远程仓库pull更新，也不再push推送远程仓库了。

## 2、所有如果即想要远程仓库对应文件的更新，又不想要将自己本地的修改提交，这可以使用命令：`git update-index --skip-worktree`  
`skip-worktree`：不会关闭本地文件对远程仓库的跟踪，只是告诉Git不要跟踪对本地文件的更改，pull时会拉取最新的更新，但要更新则需要`no-skip-worktree`再pull拉取合并最新更新。

```
git update-index --skip-worktree "/app/tep/ap.txt"//关闭GIT跟踪本地文件修改
git update-index --no-skip-worktree "/app/tep/ap.txt"//打开GIT跟踪本地文件修改

```

参考：  
[GIT实现本地配置文件修改后不提交远程仓库](http://t.zoukankan.com/lovelyli-p-13359421.html)

本文转自 [https://blog.csdn.net/yzpbright/article/details/124847386](https://blog.csdn.net/yzpbright/article/details/124847386)，如有侵权，请联系删除。
