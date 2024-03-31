---
sidebar_position: 1
---

# Docker安装Clickhouse

####  1.拉取clickhouse-server镜像
```bash
docker pull yandex/clickhouse-server
```
#### 2.启动临时容器，目的：拷贝容器内配置文件
```bash
docker run -d --rm --name=temp yandex/clickhouse-server \
-d # 后台运行 \
--rm # 启动临时容器，当容器停掉后，容器自动删除 \
--name 容器名称
```
#### 3.宿主机创建目录，用于存放配置文件、数据、日志（我是放在/usr/local/clickhouse下）
```bash
sudo mkdir -p /usr/local/clickhouse/conf /usr/local/clickhouse/data /usr/local/clickhouse/log
```
#### 4.将容器内配置文件拷贝到宿主机
```bash
docker cp temp:/etc/clickhouse-server/users.xml /usr/local/clickhouse/conf/users.xml
docker cp temp:/etc/clickhouse-server/config.xml /usr/local/clickhouse/conf/config.xml
```
#### 5.修改连接用户名、密码（users.xml）

##### 1.执行命令，生成SHA256密码,返回结果
```bash
[root@centma ~]# PASSWORD=$(base64 < /dev/urandom | head -c8); echo "123456"; echo -n "123456" | sha256sum | tr -d '-'
123456 #密码明文
8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92 #密文
```

##### 2.修改users.xml配置文件(*追加*)

```xml
<users>
	<root>          
		<password_sha256_hex>2c297a5ee6d922c0472dee50d3067ea1ce99dd54e765247e287f9ca262525a63</password_sha256_hex>
		<networks>
			<ip>::/0</ip>
		</networks>
		<profile>default</profile>
		<quota>default</quota>
	</root>
</users>
```

#### 启动clickhouse容器
```sh
docker run -d --name clickhouse-server \
	--log-opt max-size=100m \
	--log-opt max-file=2 \
	--network mybridge \
	--ip 172.22.1.86 \
	-uroot \
	-p 8123:8123 \
	-p 9009:9009 \
	-p 9090:9000 \
	--ulimit nofile=262144:262144 \
	--volume=/home/clickhouse/data:/var/lib/clickhouse \
	--volume=/home/clickhouse/log:/var/log/clickhouse-server \
	--volume=/home/clickhouse/conf/config.xml:/etc/clickhouse-server/config.xml \
	--volume=/home/clickhouse/conf/users.xml:/etc/clickhouse-server/users.xml \
	yandex/clickhouse-server

```

到这里就安装成功了，可以用dbeaver连接使用了

本文转自 [https://www.jianshu.com/p/146187593a1a](https://www.jianshu.com/p/146187593a1a)，如有侵权，请联系删除。