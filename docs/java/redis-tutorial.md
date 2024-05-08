# redis教程
## 1. Redis数据类型

###	1.1 Redis的五大数据类型
- string（字符串）
- hash（哈希，类似java里的Map）
- list（列表）
- set（集合）
- zset(sorted set：有序集合)


- 哪里去获得redis常见数据类型操作命令
  - 官网：https://redis.io/commands
  - 菜鸟教程：https://www.runoob.com/redis/redis-tutorial.html
  - Redis命令参考：https://www.runoob.com/redis/redis-commands.html


#### 1.1.1Redis 键(key)

常用案例
* `keys *`
* `exists key的名字`，判断某个key是否存在
* `move key db`   --->当前库就没有了，被移除了
* `expire key 秒钟`：为给定的key设置过期时间 

在 Redis 中，当键过期后，Redis 会返回-2作为过期状态，然后在需要释放内存时才会将这个过期键删除。它只是延迟删除过期键以节省资源。

* `ttl key` 查看还有多少秒过期，-1表示永不过期，-2表示已过期
* `type key` 查看你的key是什么类型

#### 1.1.2 Redis字符串(String)
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

#### 1.1.3 Redis列表(List)
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

```html
Redis集合(Set)
常用
单值多value
案例
sadd/smembers/sismember
scard，获取集合里面的元素个数
srem key value 删除集合中元素
srandmember key 某个整数(随机出几个数)
spop key 随机出栈
smove key1 key2 在key1里某个值      作用是将key1里的某个值赋给key2
数学集合类
差集：sdiff
交集：sinter
并集：sunion
Redis哈希(Hash)
常用
KV模式不变，但V是一个键值对
案例
hset/hget/hmset/hmget/hgetall/hdel
hlen
hexists key 在key里面的某个值的key
hkeys/hvals
hincrby/hincrbyfloat
hsetnx
Redis有序集合Zset(sorted set)
多说一句
在set基础上，加一个score值。
之前set是k1 v1 v2 v3，
现在zset是k1 score1 v1 score2 v2
常用
案例
zadd/zrange
withscores
zrangebyscore key 开始score 结束score
withscores
(   不包含
limit 作用是返回限制
limit 开始下标步 多少步
zrem key 某score下对应的value值，作用是删除元素
zcard/zcount key score区间/zrank key values值，作用是获得下标值/zscore key 对应值,获得分数
zrevrank key values值，作用是逆序获得下标值
zrevrange
zrevrangebyscore  key 结束score 开始score
```

