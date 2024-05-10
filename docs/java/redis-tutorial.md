# redis教程

##	1. Redis的五大数据类型
- string（字符串）
- hash（哈希，类似java里的Map）
- list（列表）
- set（集合）
- zset(sorted set：有序集合)


- 哪里去获得redis常见数据类型操作命令
  - 官网：https://redis.io/commands
  - 菜鸟教程：https://www.runoob.com/redis/redis-tutorial.html
  - Redis命令参考：https://www.runoob.com/redis/redis-commands.html

### 1.1 Redis 键(key)

常用案例
* `keys *`
* `exists key的名字`，判断某个key是否存在
* `move key db`   --->当前库就没有了，被移除了
* `expire key 秒钟`：为给定的key设置过期时间 

在 Redis 中，当键过期后，Redis 会返回-2作为过期状态，然后在需要释放内存时才会将这个过期键删除。它只是延迟删除过期键以节省资源。

* `ttl key` 查看还有多少秒过期，-1表示永不过期，-2表示已过期
* `type key` 查看你的key是什么类型

### 1.2 Redis字符串(String)
常用, 单值单value 案例
* `set`/`get`/`del`/`append`/`strlen`
* `Incr`/`decr`/`incrby`/`decrby`,一定要是数字才能进行加减
  * ```redis
    incrby number 2
    ```
* `getrange`/`setrange`
  * `setrange` 给起始地址覆盖写入
* `setex`(set with expire)键秒值/`setnx`(set if not exist)
* `mset`/`mget`/`msetnx`
  * `mset`:同时设置一个或多个 `key-value` 对。
  * `mget`:获取所有(一个或多个)给定 `key` 的值。
  * `msetnx`:同时设置一个或多个 `key-value` 对，当且仅当所有给定 key 都不存在。
* `getset`(先get再set)

### 1.3 Redis列表(List)
常用,单值多value,案例
* `lpush`/`rpush`/`lrange`
* `lpop`/`rpop`
* lindex，按照索引下标获得元素(从上到下)
* llen
* lrem key 删N个value
* ltrim key 开始index 结束index，截取指定范围的值后再赋值给key
* rpoplpush 源列表 目的列表
* lset key index value
* linsert key  before/after 值1 值2
* 性能总结


### 1.4 Redis集合(Set)

> 单值多value

案例
* `sadd/smembers/sismember`
* `scard`，获取集合里面的元素个数
* `srem key value` 删除集合中元素
* `srandmember key` 某个整数(随机出几个数)
* `spop key` 随机出栈
* `smove key1 key2` 在key1里某个值      作用是将key1里的某个值赋给key2

数学集合类
* 差集：sdiff
* 交集：sinter
* 并集：sunion

### 1.5 Redis哈希(Hash)

> 常用, KV模式不变，但V是一个键值对

案例
- `hset/hget/hmset/hmget/hgetall/hdel`
- `hlen`
- `hexists key` 在key里面的某个值的key
- `hkeys/hvals`
- `hincrby/hincrbyfloat`
- `hsetnx`

### 1.6 Redis有序集合Zset(sorted set)

> 多说一句 在set基础上，加一个score值。 之前set是k1 v1 v2 v3， 现在zset是k1 score1 v1 score2 v2

案例
- `zadd/zrange [withscores]`
- `zrangebyscore key 开始score 结束score [withscores]`
  - (   不包含 
  - limit 作用是返回限制 limit 开始下标步 多少步

- `zrem key` 某score下对应的value值，作用是删除元素
- `zcard/zcount key score区间/zrank key values值`，作用是获得下标值/zscore key 对应值,获得分数
- `zrevrank key values`值，作用是逆序获得下标值
- zrevrange
- zrevrangebyscore  key 结束score 开始score

## 2 解析配置文件 `redis.conf`
### 2.1 地址
```shell
docker run \
	--log-opt max-size=100m \
	--log-opt max-file=2 \
	--network mybridge \
	--ip 172.22.1.63 \
	-p 6379:6379 \
	--name redis \
	-v /home/docker/redis/redis.conf:/etc/redis/redis.conf \
	-v /home/docker/redis/data:/data \
	-d redis \
	redis-server /etc/redis/redis.conf  \
	--appendonly yes
```

### 2.2 Units 单位

* 配置大小单位,开头定义了一些基本的度量单位，只支持bytes，不支持bit
* 对大小写不敏感

### 2.3 Include 包含

* 和我们的`Struts2`配置文件类似，可以通过`includes`包含， r`edis.conf`可以作为总闸，包含其他`.conf`文件
* 类似于`nginx.conf`

### 2.4 GENERAL通用

* Daemonize
* Pidfile
* Port
* Tcp-backlog
  1. tcp-backlog 设置tcp的backlog，backlog其实是一个连接队列. 
  2. backlog队列总和=未完成三次握手队列 + 已经完成三次握手队列。 
  3. 在高并发环境下你需要一个高backlog值来避免慢客户端连接问题。 
  4. 注意Linux内核会将这个值减小到`/proc/sys/net/core/somaxconn`的值，所以需要确认增大`somaxconn`和`tcp_max_syn_backlog`两个值
      来达到想要的效果.

* Timeout
  * 单位为秒，如果设置为0，则不会进行Keepalive检测，建议设置成60

* Bind
* Tcp-keepalive
  * 单位为秒，如果设置为0，则不会进行Keepalive检测，建议设置成60

* Loglevel
* Logfile
* Syslog-enabled
  * 是否把日志信息记录到系统日志中，默认是no
* Syslog-ident
  * 设置系统日志`syslog`中的日志标志
* Syslog-facility
  * 指定syslog设备，值可以是USER或LOCAL0-LOCAL7
* Databases

### 2.5 SNAPSHOTTING快照

