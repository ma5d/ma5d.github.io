---
sidebar_position: 4
---

# linux 终端浏览器SSL

如何修复上述错误？
在安装Webmin后，我在尝试访问Webmin浏览器中的Webmin控制面板时看到了上述错误。错误显示您已访问 webmin 控制面板 URL，前面没有 https。Web 服务器在 SSL 模式下运行，因此您必须尝试使用 https 而不是 http。请尝试使用网址“https://serverhostname:10000”或“https://serverIP:10000”，并检查是否收到相同的错误。

使用以下任何 URL 在您的网络浏览器中访问 Webmin：


https://serverhostname:10000 或
https://serverIP:10000

“服务器主机名”应替换为服务器的实际主机名。“服务器IP”应替换为您的网络服务器 IP 地址。当您使用“https”访问 webmin 时，如果未为您的服务器主机名安装 SSL，浏览器将显示证书警告。接受服务器自签名证书并继续。最好使用 https 而不是 http 访问 webmin，因为 https 是安全的。如果要禁用Webmin控制面板的SSL，请执行以下步骤。

1. 以 root 用户身份通过 SSH 登录您的 Linux 服务器。

2. 备份文件 /etc/webmin/miniserv.conf

3. 使用 vi 编辑器编辑文件 /etc/webmin/miniserv.conf

4. 将行“ssl=1”更改为“ssl=0”（禁用）

5. 保存更改并退出。现在，SSL已禁用Webmin。

![Disable SSL for webmin control panel](http://globedrill.com/wp-content/uploads/2016/07/Disable-SSL-for-webmin-control-panel.png)

工作正常。但是在更改 SSL 后需要重新启动 webmin：

/etc/init.d/webmin stop
/etc/init.d/webmin start

然后它工作了