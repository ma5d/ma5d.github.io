# 通过Nexus搭建Npm私库


## 1.简介

通过Nexus搭建Npm私库，可以减少远程服务器的请求，开发和服务器连接Npm私库，从而减少了每次新增人员或布置新环境自定义jar的安装。

## 2.安装Nexus

参照文章《[Nexus简介与安装](https://blog.csdn.net/qq_31635851/article/details/109288533)》

## 3.配置远程Npm源

### 3.1.安装

#### 3.1.1.首先打开我们安装好的Nexus地址，点击`Sign in`进行登录，首次登录默认账户`admin`，密码`admin123`
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102619365194.png)

#### 3.1.2.登录完成后，点击左上角设置图标，进入管理页面
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201026194004819.png)

#### 3.1.3.点击左侧菜单栏`Repositories`,我们可以看到很多已经配置好的仓库，一般只使用开源jar就够用了，如果需要建立自定义仓库，点击`Create repository`创建新的仓库。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201026194112572.png)

#### 3.1.4.首先我们要创建几个常用的代理源，用于常用开源npm模块的拉取。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028151145420.png)


#### 3.1.5.添加代理（Cache统一设置为200天 288000）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028151348511.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102620011192.png)

#### 3.1.6.按照3.5步骤依次添加以下代理源
`taobao`

```
https://registry.npm.taobao.org/

```

`npm-npmjs`

```
https://registry.npmjs.org

```

#### 3.1.7.设置`maven-public` ,将这些代理加入`Group`，最好将默认的maven库放到最底下
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201026200551602.png)

#### 3.1.8.创建`npm-hosted` ,用于发布个人开发的npm组件。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028152834802.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028152856359.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028153006353.png)

#### 3.1.9.创建`npm-public` ,用于把几个仓库组组合在一起公开连接使用。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028153055432.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028153141184.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028153324597.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028153514500.png)

### 3.2.说明

#### 3.2.1.默认仓库说明
`npm-proxy`：可以代理npmjs和淘宝镜像
`npm-hosted`：用于上传、自定义和个人开发的npm组件
`npm-public`：仓库分组，把几个仓库组组合在一起使用。

#### 3.2.1.仓库类型
`Group`：这是一个仓库聚合的概念，用户仓库地址选择Group的地址，即可访问Group中配置的，用于方便开发人员自己设定的仓库。maven-public就是一个Group类型的仓库，内部设置了多个仓库，访问顺序取决于配置顺序，3.x默认Releases，Snapshots， Central，当然你也可以自己设置。
`Hosted`：私有仓库，内部项目的发布仓库，专门用来存储我们自己生成的jar文件
`3rd party`：未发布到公网的第三方jar (3.x去除了)
`Snapshots`：本地项目的快照仓库
`Releases`： 本地项目发布的正式版本
`Proxy`：代理类型，从远程中央仓库中寻找数据的仓库（可以点击对应的仓库的Configuration页签下Remote Storage属性的值即被代理的远程仓库的路径），如可配置阿里云maven仓库
`Central`：中央仓库
`Apache Snapshots`：Apache专用快照仓库(3.x去除了)

## 4.修改本地Npm连接源

> 注：`http://172.16.92.74:9998`为博主搭建Nexus私服地址，请大家以实际情况进行更改，

打开`Repositories`，找到创建的分组npm-public，点击Copy，复制连接源地址。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201028152329883.png)
在本地运行以下命令，修改npm仓库源

```
npm config set registry http://172.16.92.74:9998/nexus/repository/npm-public/

```

## 5.发布自己的npm组件到私服

### 5.1.登录私服

在本地命令控制台，输入以下命令，登录私服

```
npm login –registry=http://172.16.92.74:9998/nexus/repository/npm-hosted

```

输入账号密码和邮箱
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020102815430299.png#pic_center)

### 5.2.发布npm组件

要发布的模块，必须保证在根目录下有package.json文件，否则会报错。

```
npm publish –registry=http://172.16.92.74:9998/nexus/repository/npm-hosted/

```
## 6. npm仓库
```sh
    // 查询源
    npm config get registry

    // 更换国内源
    npm config set registry https://registry.npmmirror.com

    // 恢复官方源
    npm config set registry https://registry.npmjs.org

    // 删除注册表
    npm config delete registry
```
本文转自 https://blog.csdn.net/qq_31635851/article/details/109333231，如有侵权，请联系删除。