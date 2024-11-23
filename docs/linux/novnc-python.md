---
sidebar_position: 6
---

# 通过noVNC远程连接Windows桌面（python版）

一、简介
====

二、环境部署
======

### 1、安装 python

```powershell
choco install anaconda3 -y
```

### 2、安装 UltraVNC

```powershell
scoop install UltraVNC
```

```log
Installing 'UltraVNC' (1.4.2.0) [64bit]
442-ultravnc-1-4-20-bin-zip.html (5.1 MB) [=======================================================================================] 100%
Checking hash of 442-ultravnc-1-4-20-bin-zip.html ... ok.
Extracting dl.zip ... done.
Linking ~\scoop\apps\UltraVNC\current => ~\scoop\apps\UltraVNC\1.4.2.0
Creating shim for 'vncviewer'.
Creating shim for 'winvnc'.
Creating shortcut for VNC Viewer (vncviewer.exe)
Creating shortcut for WinVNC (winvnc.exe)
'UltraVNC' (1.4.2.0) was installed successfully!
```

![](https://img-blog.csdnimg.cn/20200425112223169.png)
1[](https://img-blog.csdnimg.cn/20200425112340400.png)


### 3.安装 websockify
#### 3.1 cmd 执行下载

```powershell
cd 'C:\Program Files\'
git clone https://github.com/novnc/websockify.git
```

#### 3.2 安装python包

```powershell
python setup.py install
```

#### 3.3 删除git下载文件

```powershell
del 'C:\Program Files\websockify'
```

### 4.下载安装  noVNC

```powershell
cd 'C:\Program Files\'
git clone https://github.com/novnc/noVNC.git
```

### 5 下载  NSSM、使用 NSSM

#### 4.1 下载  NSSM

```powershell
choco install nssm -y
```

#### 4.2 新建bat

```powershell
cd D:\SHHOME\
notepad [name].txt
```

```powershell
title [自定义服务名称]
java -jar -Dfile.encoding=utf-8 -Xms1024M -Xmx1024M -XX:PermSize=256M -XX:MaxPermSize=256M thinvent-iot-boot.jar
```

#### 4.3 创建服务

```powershell
nssm install [自定义服务名称]
websockify --web D:\VNC\noVNC-master 9000 localhost:5900
```

#### 4.4 查看服务

打开服务窗口（按下Win+R，输入services.msc，然后回车），找到我们安装好的服务，右键设置为自动启动，然后启动服务
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201228151937147.png)

#### 4.5 Exception

NSSM工具可以适用于大部分简单的Windows服务的注册，但是仍有一些服务无法注册成功，比如RocketMQ，老是报错。

本文转自 [https://blog.csdn.net/m0\_46267097/article/details/111867025](https://blog.csdn.net/m0_46267097/article/details/111867025)，如有侵权，请联系删除。

### 6 结果

![](https://img-blog.csdnimg.cn/20200425120935824.gif)

本文转自 [https://blog.csdn.net/qq243348167/article/details/105745990](https://blog.csdn.net/qq243348167/article/details/105745990)，如有侵权，请联系删除。