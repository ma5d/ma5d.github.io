---
sidebar_position: 3
---

# 502报错

### 1.错误出现

域名访问出现 502 bad gateway.

access.log

```lua
192.168.137.1 [28/May/2023:20:57:33 +0800] "GET / HTTP/1.1" 502 www.rabbitmq.lookworld.com "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50" 
192.168.137.1 [28/May/2023:20:57:33 +0800] "GET /favicon.ico HTTP/1.1" 502 www.rabbitmq.lookworld.com "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.50" 

```

error.log

```lua
2023/05/28 20:57:33 [crit] 8332#8332: *589 connect() to 172.22.1.56:15672 failed (13: Permission denied) while connecting to upstream, client: 192.168.137.1, server: www.rabbitmq.lookworld.com, request: "GET / HTTP/1.1", upstream: "http://172.22.1.56:15672/", host: "www.rabbitmq.lookworld.com"
2023/05/28 20:57:33 [crit] 8332#8332: *589 connect() to 172.22.1.56:15672 failed (13: Permission denied) while connecting to upstream, client: 192.168.137.1, server: www.rabbitmq.lookworld.com, request: "GET /favicon.ico HTTP/1.1", upstream: "http://172.22.1.56:15672/favicon.ico", host: "www.rabbitmq.lookworld.com", referrer: "http://www.rabbitmq.lookworld.com/"
```

### 2.错误排查

#### 2.1 chatgpt(2,4条指明原因，但不具体比较空泛，没有细问)

```
nginx 报错 2023/05/28 20:57:33 [crit] 8332#8332: *589 connect() to 172.22.1.56:15672 failed (13: Permission denied) while connecting to upstream, client: 192.168.137.1, server: www.rabbitmq.lookworld.com, request: "GET / HTTP/1.1", upstream: "http://172.22.1.56:15672/", host: "www.rabbitmq.lookworld.com"
这个错误提示表明 nginx 无法连接到指定的 upstream 地址，具体原因为连接被拒绝，很可能是由于权限问题引起的。可能的解决方法包括：

1. 确保 upstream 地址正确，并且对应的服务已经启动。
2. 确认 nginx 用户或进程有访问权限。例如，可以将 nginx 启动用户加入对应的用户组，或者修改文件或目录的权限等。
3. 确认防火墙配置不会阻止连接。
4. 确认 selinux 配置不会阻止连接。
需要根据实际情况进行排查并解决问题。
```

#### 2.2 csdn

##### 一、由于启动用户和nginx工作用户不一致所致

1.1查看nginx的启动用户，发现是nginx，而不是用root启动的

nginx.conf

```nginx
user  nginx;
```

##### 二、缺少index.html或者index.php文件，就是配置文件中index index.html index.htm这行中的指定的文件。
```nginx
server {
listen       80;
server_name  localhost;
index  index.php index.html;
root  /data/www/;
}
```
如果在/data/www/下面没有index.php,index.html的时候，直接文件，会报403 forbidden。


#### 三、权限问题，如果nginx没有web目录的操作权限，也会出现403错误。

解决办法：修改web目录的读写权限，或者是把nginx的启动用户改成目录的所属用户，重启Nginx即可解决

1.    chmod \-R 777 /data

2.    chmod \-R 777 /data/www/


#### 四、SELinux设置为开启状态（enabled）的原因。

4.1、查看当前selinux的状态。

1.    /usr/sbin/sestatus

4.2、将SELINUX=enforcing 修改为 SELINUX=disabled 状态。

1. vi /etc/selinux/config

2. SELINUX=enforcing

3. SELINUX\=disabled

4.3、重启生效。reboot。

1.    reboot

本文转自 [https://blog.csdn.net/onlysunnyboy/article/details/75270533](https://blog.csdn.net/onlysunnyboy/article/details/75270533)，如有侵权，请联系删除。