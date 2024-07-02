# 云之家登录逻辑初探
> 目的：绕过摄像头扫码，直接云之家内部点击链接登录。
> 主要是偷懒，举不了手机。

## 1. 二维码解析
```http request

https://yunzhijia.com/opencloud/openthird/qrlogin?laid=xx&yf=xx&sourceAppName=xx&sourceAppLogo=xx&token=xx
```

直接发送到云之家登录不了

## 2. fiddler 抓包分析
### 2.1 bootloader-magisk-root-shamiko-安装用户证书-moveCertification-restart
### 2.2 发现js
### 2.3 抓取登录连接
```http request
https://yunzhijia.com/opencloud/openthird/qrlogin?laid=xx&yf=xx&sourceAppName=xx&sourceAppLogo=xx&token=xx&ticket=xx&client_id=xx&expire_time=xx&msgShowStyle=xx
```
### 2.4 总结：缺少参数
&ticket=xx&client_id=xx&expire_time=xx&msgShowStyle=xx

### 2.5 登录
发送二维码解析url拼上缺少的参数获得完整链接，发送完整链接到文件传输助手，点击即可登录，不用扫码。