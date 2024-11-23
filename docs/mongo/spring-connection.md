# Springboot配置MongoDB 密码的坑

 

[](https://blog.csdn.net/qq_45186545/article/details/107553692)**问题引出**：springboot整合mongo，配置密码连接，就报错。
=====================================================================================================

[](https://blog.csdn.net/qq_45186545/article/details/107553692)报错信息
-------------------------------------------------------------------

（一些关键信息做了处理）本地没有密码，springboot连接mongo毫无问题。但是线上mongo有密码，一配置连接就报错。

```
Caused by: org.springframework.data.mongodb.UncategorizedMongoDbException: Exception authenticating MongoCredential{mechanism=SCRAM-SHA-1, userName='mongo', source='mini', password=<hidden>, mechanismProperties=<hidden>}; nested exception is com.mongodb.MongoSecurityException: Exception authenticating MongoCredential{mechanism=SCRAM-SHA-1, userName='mongo', source='mini', password=<hidden>, mechanismProperties=<hidden>}
	at org.springframework.data.mongodb.core.MongoExceptionTranslator.translateExceptionIfPossible(MongoExceptionTranslator.java:138)
	at org.springframework.data.mongodb.core.MongoTemplate.potentiallyConvertRuntimeException(MongoTemplate.java:2902)
	at org.springframework.data.mongodb.core.MongoTemplate.executeFindOneInternal(MongoTemplate.java:2760)
	at org.springframework.data.mongodb.core.MongoTemplate.doFindOne(MongoTemplate.java:2481)
	at org.springframework.data.mongodb.core.MongoTemplate.findOne(MongoTemplate.java:820)
	at com.mini.manager.MongoManager.selectBindInfo(MongoManager.java:65)
	... 67 common frames omitted
Caused by: com.mongodb.MongoSecurityException: Exception authenticating MongoCredential{mechanism=SCRAM-SHA-1, userName='mongo', source='mini', password=<hidden>, mechanismProperties=<hidden>}
	at com.mongodb.internal.connection.SaslAuthenticator.wrapException(SaslAuthenticator.java:173)
	at com.mongodb.internal.connection.SaslAuthenticator.access$300(SaslAuthenticator.java:40)
	at com.mongodb.internal.connection.SaslAuthenticator$1.run(SaslAuthenticator.java:70)
	at com.mongodb.internal.connection.SaslAuthenticator$1.run(SaslAuthenticator.java:47)
	at com.mongodb.internal.connection.SaslAuthenticator.doAsSubject(SaslAuthenticator.java:179)
	at com.mongodb.internal.connection.SaslAuthenticator.authenticate(SaslAuthenticator.java:47)
	at com.mongodb.internal.connection.InternalStreamConnectionInitializer.authenticateAll(InternalStreamConnectionInitializer.java:156)
	at com.mongodb.internal.connection.InternalStreamConnectionInitializer.initialize(InternalStreamConnectionInitializer.java:63)
	at com.mongodb.internal.connection.InternalStreamConnection.open(InternalStreamConnection.java:129)
	at com.mongodb.internal.connection.UsageTrackingInternalConnection.open(UsageTrackingInternalConnection.java:50)
	at com.mongodb.internal.connection.DefaultConnectionPool$PooledConnection.open(DefaultConnectionPool.java:398)
	at com.mongodb.internal.connection.DefaultConnectionPool.get(DefaultConnectionPool.java:115)
	at com.mongodb.internal.connection.DefaultConnectionPool.get(DefaultConnectionPool.java:101)
	at com.mongodb.internal.connection.DefaultServer.getConnection(DefaultServer.java:92)
	at com.mongodb.binding.ClusterBinding$ClusterBindingConnectionSource.getConnection(ClusterBinding.java:126)
	at com.mongodb.operation.FindOperation$1.call(FindOperation.java:728)
	at com.mongodb.operation.FindOperation$1.call(FindOperation.java:725)
	at com.mongodb.operation.OperationHelper.withReadConnectionSource(OperationHelper.java:463)
	at com.mongodb.operation.FindOperation.execute(FindOperation.java:725)
	at com.mongodb.operation.FindOperation.execute(FindOperation.java:89)
	at com.mongodb.client.internal.MongoClientDelegate$DelegateOperationExecutor.execute(MongoClientDelegate.java:189)
	at com.mongodb.client.internal.FindIterableImpl.first(FindIterableImpl.java:205)
	at org.springframework.data.mongodb.core.MongoTemplate$FindOneCallback.doInCollection(MongoTemplate.java:2945)
	at org.springframework.data.mongodb.core.MongoTemplate$FindOneCallback.doInCollection(MongoTemplate.java:2916)
	at org.springframework.data.mongodb.core.MongoTemplate.executeFindOneInternal(MongoTemplate.java:2757)
	... 70 common frames omitted
Caused by: com.mongodb.MongoCommandException: Command failed with error 18: 'Authentication failed.' on server xx.xx.xx.xx:27017. The full response is {"ok": 0.0, "code": 18, "errmsg": "Authentication failed."}
	at com.mongodb.internal.connection.ProtocolHelper.getCommandFailureException(ProtocolHelper.java:175)
	at com.mongodb.internal.connection.InternalStreamConnection.receiveCommandMessageResponse(InternalStreamConnection.java:303)
	at com.mongodb.internal.connection.InternalStreamConnection.sendAndReceive(InternalStreamConnection.java:259)
	at com.mongodb.internal.connection.CommandHelper.sendAndReceive(CommandHelper.java:83)
	at com.mongodb.internal.connection.CommandHelper.executeCommand(CommandHelper.java:33)
	at com.mongodb.internal.connection.SaslAuthenticator.sendSaslStart(SaslAuthenticator.java:130)
	at com.mongodb.internal.connection.SaslAuthenticator.access$100(SaslAuthenticator.java:40)
	at com.mongodb.internal.connection.

```

[](https://blog.csdn.net/qq_45186545/article/details/107553692)连接配置
-------------------------------------------------------------------

```
spring:
  data:
    mongodb:
      host: 127.0.0.1
      port: 27017
      database: mini
      option:
        max-connection-idle-time: 1500
        max-connection-per-host: 200
        max-wait-time: 60000
        max-connection-life-time: 0
        connect-timeout: 10000
        socket-timeout: 60000
      password: '*sxasasda'
      username: user

```

**password：** 密码第一位是\*，yml文件不支持。所以需要加单引号。同时如下，password是用char\[\]接收的，如果你的密码是纯数字也需要加单引号。  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200724094238172.png)

#### [](https://blog.csdn.net/qq_45186545/article/details/107553692)看似没有问题的配置，一连接还是报错。我也试了网上说的Url配置连接的方式

```
spring:
  data:
    mongodb:
      uri: mongodb://user:x123456@127.0.0.1:27017/mini

```

（这样配置如果你的密码中含有特殊字符，你需要自行查询下特殊字符url的编码。否则编译不通过。）  
同样报错。

[](https://blog.csdn.net/qq_45186545/article/details/107553692)问题解决
-------------------------------------------------------------------

两种配置都少一步关键配置 ，需要配置去认证的库 authenticationDatabase  
也就是需要加（因为我的账号密码信息在admin库里）

```
authentication-database: admin

```

完整配置如下

```
spring:
  data:
    mongodb:
      host: 127.0.0.1
      port: 27017
      database: mini
      option:
        max-connection-idle-time: 1500
        max-connection-per-host: 200
        max-wait-time: 60000
        max-connection-life-time: 0
        connect-timeout: 10000
        socket-timeout: 60000
      password: '*sxasasda'
      username: user
      authentication-database: admin

```

您的点赞，是我更新的动力！  
如有错误，望指正

 

  

本文转自 [https://blog.csdn.net/qq\_45186545/article/details/107553692](https://blog.csdn.net/qq_45186545/article/details/107553692)，如有侵权，请联系删除。