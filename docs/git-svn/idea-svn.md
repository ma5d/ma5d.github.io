---
sidebar_position: 2
--- 

# idea svn 教程

### 一、从svn仓库拉取源代码

拉取分支，以前端一个工程为例，假设svn源码仓库地址是：http://127.0.0.1/svn/trunk/vue-source；具体需要切换成你自己的svn地址；

1.  点击Get from VCS
2.  选用Subversion,因为这里Subversion=svn
3.  选择设置仓库地址
4.  选择刚设置的仓库地址，之后检出
5.  设置本地存放的位置
6.  选择是否带项目名称的路径，一般选择带项目名称的路径
7.  默认使用1.8 format
8.  点击OK后，开始拉取项目源码了

## 二、 设置主分支 trunk

1.  点击拉取按钮，设置为trunk，注意URL还是刚拉下来的主分支地址。
2.  提交代码时，可以看到是trunk分支
3.  设置svn忽略 node\_modules文件夹，这里设置的忽略，会作用于svn服务端，团队其他小伙伴也就起作用。

## 三、创建新svn分支

​ 一般开发的时候，都需求建立自己的开发分支。开发完成后，在合适的时机合并到主干即可。

1.  SVN -> Subversion -> Branch or Tag…
2.  选择使用Repository Location 网络位置路径；分支位置设置到 /branches目录下,勾选上最下边的 Switch to newly created branch or tag，就可以在创建分支后，跳转到新分支；
3.  修改分支的源码后，提交时，可以看到是dev 分支

## 四、切换分支

1.  现在切换到主分支

## 五、 在主干合并分支

1.  可以看到主分支的仓库地址
2.  点击Merge From … ，之后选择需求合并过来的分支
3.  一般直接选用“全部合并”
4.  合并分支后，可以看到分支的提交记录，合并分支数据后，再提交主干分支即可；

## 六、 删除分支

右击已经存在的SVN项目->repo browser,弹出框的左边选择需要删除的分支右击->delete
