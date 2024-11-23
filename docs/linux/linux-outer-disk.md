---
sidebar_position: 3
---

# linux 扩容教程

 

在使用VMware进行linux学习过程中有时会出现磁盘空间不足的情况，但是之前一直是只要磁盘空间不足就直接重装系统，持续一段时间后感觉计算机科班出生的人这样做有点侮辱，所以就静心学习了扩充磁盘的过程，这是我实践过程中做的笔记。

##### [](https://blog.csdn.net/qq_44297579/article/details/107318096)1.关闭linux，在VMware上进行磁盘扩容

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713153413711.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)  
如果扩展这里不能点，应该是因为之前拍过快照，删了快照就好了。  
这里我来的磁盘空间为55G，扩展成60G大小的容量。  
启动之后，执行`df -h`，现在可用为21G  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713154005959.png)  
现在最大的分区为sda3，所以管理磁盘sda后添加的分区应该为sda4  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713154127151.png)

##### [](https://blog.csdn.net/qq_44297579/article/details/107318096)2.管理sda磁盘

输入【fdisk /dev/sda】

命令行提示下输入【m】

输入命令【n】添加新分区。

输入命令【p】创建主分区。

输入【回车】，选择默认大小，这样不浪费空间

输入【回车】，选择默认的start cylinder。

输入【w】，保持修改  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713155100794.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)  
接着进行重启，必须进行重启，否则无法格式化分区sda4。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713162408213.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)

##### [](https://blog.csdn.net/qq_44297579/article/details/107318096)3.添加新LVM到已有的LVM组，实现卷扩容

```
lvm　　　　　　　　　　　　           #进入lvm管理

lvm>pvcreate /dev/sda4　　           #这是初始化刚才的分区4

lvm>vgextend centos /dev/sda4     #将初始化过的分区加入到虚拟卷组centos (卷和卷组的命令可以通过 vgdisplay )

lvm>vgdisplay -v或者vgdisplay查看free PE /Site

lvm>lvextend -l+1279 /dev/mapper/centos-root　　#扩展已有卷的容量（1279 是通过vgdisplay查看free PE /Site的大小）

lvm>pvdisplay #查看卷容量，这时你会看到一个很大的卷了

lvm>quit 　#退出

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713163106419.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)  
如果在这里执行出现`pvcreate /dev/sda4`或`vgextend centos /dev/sda4`时报了错`Device /dev/sda excluded by a filter.`  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713165019725.png)  
出现这个错误的原因是添加的磁盘已经有了分区表，现在的虚拟机并不能识别磁盘的分区表，运行parted命令重做分区表，中途需要输入三次命令。先ctrl+c结束了lvm的进程然后执行

```
parted /dev/sda		#parted是一个强大的硬盘分区工具，这里表示管理sda盘

mklabel msdos       #定义分区表格式为msdos

quit				#退出

```

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713163223349.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)  
扩展已有卷的容量  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713163331511.png)  
查看卷容量  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713163440511.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)

##### [](https://blog.csdn.net/qq_44297579/article/details/107318096)4.文件系统的扩容

以上只是做成了卷扩容，接下来做文件系统的真正扩容  
**centos7**执行  
`xfs_growfs /dev/mapper/centos-root`  
**centos6**执行  
`resize2fs /dev/mapper/centos-root`  
`/dev/mapper/centos-root`是执行`df -h`时根目录的挂载点。  
然后`df -h`查看磁盘空间  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200713165905480.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0Mjk3NTc5,size_16,color_FFFFFF,t_70)  
可以看见根目录下的磁盘空间已经扩展为26G了。  
参考：https://www.cnblogs.com/Sungeek/p/9084510.html  
https://blog.csdn.net/lhl3620/article/details/104792408/

 

  

本文转自 [https://blog.csdn.net/qq\_44297579/article/details/107318096](https://blog.csdn.net/qq_44297579/article/details/107318096)，如有侵权，请联系删除。