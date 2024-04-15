---
sidebar_position: 2
--- 

# idea svn 教程

[](https://blog.csdn.net/qq_39339588/article/details/127100508)svn拉取源码，创建分支，合并分支教程
----------------------------------------------------------------------------------

> 最近对svn的分支使用比较感兴趣了，花时间研究了一下，分享给大家：
> 
> 此文章记录了idea使用svn的过程：包括拉取源码、建立分支、切换分支、合并分支等常用操作。
> 
> 此文章，基于idea试用版演示，并且电脑端已经安装好svn了;
> 
> 2022-09-28

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)一、从svn仓库拉取源代码

拉取分支，以前端一个工程为例，假设svn源码仓库地址是：http://127.0.0.1/svn/trunk/vue-source；

具体需要切换成你自己的svn地址；

1.  点击Get from VCS

![在这里插入图片描述](https://img-blog.csdnimg.cn/2090a5253b114200afcc87c6f97723bd.png)

2.  选用Subversion,因为这里Subversion=svn

![在这里插入图片描述](https://img-blog.csdnimg.cn/e988925f7afc4cb19fd71bb8e201a48c.png)

3.  选择设置仓库地址  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/a87b3c84ee2e4ca9b18f5deabbb5c7ae.png)
    
4.  选择刚设置的仓库地址，之后检出  
    ![在这里插入图片描述](https://img-blog.csdnimg.cn/87461530f7c146f988e3b33e4aa6e10e.png)
    
5.  设置本地存放的位置
    

![在这里插入图片描述](https://img-blog.csdnimg.cn/2d96904e6fc94d4286f07b821549d7cb.png)

6.  选择是否带项目名称的路径，一般选择带项目名称的路径

![在这里插入图片描述](https://img-blog.csdnimg.cn/c4ed7736a35d423886fc883f5753ce02.png)

7.  默认使用1.8 format

![](https://img-blog.csdnimg.cn/31f34ed0792e4a02a1b3b0769c3b1777.png)

8.  点击OK后，开始拉取项目源码了

![在这里插入图片描述](https://img-blog.csdnimg.cn/945c9f34bfe345b9a656de19cbaed0bf.png)

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)二、 设置主分支 trunk

1.  点击拉取按钮，设置为trunk，注意URL还是刚拉下来的主分支地址。

![在这里插入图片描述](https://img-blog.csdnimg.cn/392407eeec454b7a837b151ab3bf9cf8.png)

2.  提交代码时，可以看到是trunk分支

![在这里插入图片描述](https://img-blog.csdnimg.cn/27b6285c9b6f4fc787e28ffc1d1ea28b.png)

3.  设置svn忽略 node\_modules文件夹，这里设置的忽略，会作用于svn服务端，团队其他小伙伴也就起作用。

![在这里插入图片描述](https://img-blog.csdnimg.cn/1c86310bf5d346bd93a757d93dd97437.png)

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)三、创建新svn分支

​ 一般开发的时候，都需求建立自己的开发分支。开发完成后，在合适的时机合并到主干即可。

1.  SVN -> Subversion -> Branch or Tag…

![在这里插入图片描述](https://img-blog.csdnimg.cn/398623f2a0554c0c84d3144b5f9269f7.png)

2.  选择使用Repository Location 网络位置路径；分支位置设置到 /branches目录下
    
    勾选上最下边的 Switch to newly created branch or tag，就可以在创建分支后，跳转到新分支；
    

![在这里插入图片描述](https://img-blog.csdnimg.cn/af7d968112c74c7eb71c777388ff949d.png)

3.  修改分支的源码后，提交时，可以看到是dev 分支

![在这里插入图片描述](https://img-blog.csdnimg.cn/885eee31507e4d919bd2d8fbc9541f24.png)

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)四、切换分支

1.  现在切换到主分支

![在这里插入图片描述](https://img-blog.csdnimg.cn/b2a8dbfbca324b4f92dc0c4ad3040a76.png)

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)五、 在主干合并分支

1.  可以看到主分支的仓库地址

![在这里插入图片描述](https://img-blog.csdnimg.cn/eeef1d0e38cd4f2493b526e75c274e63.png)

2.  点击Merge From … ，之后选择需求合并过来的分支

![在这里插入图片描述](https://img-blog.csdnimg.cn/5ac25b5a665b44f2809017db629b5036.png)

3.  一般直接选用“全部合并”

![在这里插入图片描述](https://img-blog.csdnimg.cn/71aebb2509e048328b4a3d6a8134cf11.png)

4.  合并分支后，可以看到分支的提交记录，合并分支数据后，再提交主干分支即可；

![在这里插入图片描述](https://img-blog.csdnimg.cn/5d82806b53ba466d9aabd31311d46710.png)

### [](https://blog.csdn.net/qq_39339588/article/details/127100508)六、 删除分支

右击已经存在的SVN项目->repo browser,弹出框的左边选择需要删除的分支右击->delete
![](http://www.showdoc.lookworld.com/server/index.php?s=/api/attachment/visitFile&sign=a90213bff48a013abf4e9fae6b861f9f)

​ 本次svn的使用就介绍到这里了，使用过程中，要多尝试，不要怕出错，多试几次，找到合适自己的方法就会是最好的方法。

 

  

本文转自 [https://blog.csdn.net/qq\_39339588/article/details/127100508](https://blog.csdn.net/qq_39339588/article/details/127100508)，如有侵权，请联系删除。