---
sidebar_position: 2
---

 # cantos 安装 Git

CentOS 7 的 yum 源、epel 源下的 git 版本均为 1.8，正常使用并不会有什么问题。 但是在 VS Code 下使用诸如 GitLens 这样的插件时，就会提示版本太低。

（ps: GitLens 是一款优秀的 Git 插件，可以让我们在 VS Code 中直接查看每一行代码是由谁提交的）

[](https://blog.csdn.net/qq_23845067/article/details/109727617)1、 卸载 Git 1.8.3 版本
---------------------------------------------------------------------------------

```
# 查看当前安装版本, 没有则省略
git --version
git version 1.8.3

yum remove git

```

[](https://blog.csdn.net/qq_23845067/article/details/109727617)2、下载
-------------------------------------------------------------------

截至2020年11月，[Git官网](https://git-scm.com/downloads) 上的最新版本为 2.29.2 版本，所以这里下载最新的 Git 源码版本。  
Git 的源码目前可以从两个地址找到

> [https://github.com/git/git/releases](https://github.com/git/git/releases)  
> [https://www.kernel.org/pub/software/scm/git/](https://www.kernel.org/pub/software/scm/git/)

PS: 使用腾讯云服务器下载很快，但是在自己的电脑上下载很慢，推荐使用 [Fast GitHub](https://github.com/fhefh2015/Fast-GitHub) Chrome 插件提高下载速度。

```
cd /usr/local/src
yum install wget
wget https://www.kernel.org/pub/software/scm/git/git-2.29.2.tar.gz
tar -xvzf git-2.29.2.tar.gz
cd git-2.29.2
# 解压命令用法
# x - 解压; v - 显示执行过程; z - gzip 压缩; f - 指定文件
# c - 打包
# t - 列出压缩文件内容
# 速记 -xvzf 解压 -cvzf 压缩 -tvzf 查看

```

[](https://blog.csdn.net/qq_23845067/article/details/109727617)3、安装
-------------------------------------------------------------------

```
# 确认当前目录
pwd
>> /usr/local/src/git-2.29.2

# make 前需要安装必要的依赖工具
yum install curl-devel expat-devel openssl-devel
yum install gcc-c++

# make 编译; all是 makefile 的编译目标, 一般是第一个编译目标
make prefix=/usr/local/git all

# make install
make prefix=/usr/local/git install


```

[](https://blog.csdn.net/qq_23845067/article/details/109727617)4、配置环境变量
-----------------------------------------------------------------------

```
# /etc/profile 最后一行的 export PATH... 为系统的环境变量，这里相当于 append 进去
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/profile

# 立即执行，刷新环境变量
source /etc/profile

git --version
>> git version 2.29.2

```

 

  

本文转自 [https://blog.csdn.net/qq\_23845067/article/details/109727617](https://blog.csdn.net/qq_23845067/article/details/109727617)，如有侵权，请联系删除。