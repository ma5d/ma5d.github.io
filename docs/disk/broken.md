# 磁盘损坏

[TOC]

# 文件夹大小突然变为0KB,打不开
检查输入过程
```bat
chkdsk /f D:
```
好了可以打开

# 重启主机，进不去系统
某些情况下，开机后会在自检状态看到如下报错信息，提示：

GPT Header corruption has been detected……

这个时候只能按照提示按F1进BIOS，然后在BIOS里直接保存退出才可以进系统。

![](https://pic3.zhimg.com/v2-8523785a7116a20771aebc919b476c7e_r.jpg)

  

我们可以通过BIOS设置来避免出现这个报错。在BIOS----Boot----Boot configuration菜单下，将最下面的Boot Sector (MBR/GPT) Recovery Policy的设置，选择为Auto recovery，然后F10保存退出。再次开机后就不会出现GPT Header的报错信息了。

![](https://pic4.zhimg.com/v2-f61b163ec8670ad53b5d1b0169634a2b_r.jpg)

  

本文转自 [https://zhuanlan.zhihu.com/p/515543427?utm\_id=0](https://zhuanlan.zhihu.com/p/515543427?utm_id=0)，如有侵权，请联系删除。


# 提示“D:\ 上的回收站已损坏 是否清空该驱动器上的回收站”的解决办法
1、点击电脑左下角的“开始”菜单键，输入“CMD”。
2、在打开的命令提示符窗口中，输入以下命令: rd /s /q D:\$Recycle.bin
3、回车执行，等待命令完成。
4、重启。
