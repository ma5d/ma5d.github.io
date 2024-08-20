# rabbit 教程

## 1. 消息队列

### 1.1 MQ 的相关概念
#### 1.1.1. 什么是 MQ

MQ(message queue)，从字面意思上看，本质是个队列，FIFO 先入先出，只不过队列中存放的内容是 message 而已，还是一种跨进程的通信机制，用于上下游传递消息。在互联网架构中，MQ 是一种非常常见的上下游“逻辑解耦+物理解耦”的消息通信服务。使用了 MQ 之后，消息发送上游只需要依赖 MQ，不用依赖其他服务。

#### 1.1.2. 为什么要用 MQ

1. 流量消峰
举个例子，如果订单系统最多能处理一万次订单，这个处理能力应付正常时段的下单时绰绰有余，正常时段我们下单一秒后就能返回结果。但是在高峰期，如果有两万次下单操作系统是处理不了的，只能限制订单超过一万后不允许用户下单。使用消息队列做缓冲，我们可以取消这个限制，把一秒内下的订单分散成一段时间来处理，这时有些用户可能在下单十几秒后才能收到下单成功的操作，但是比不能下单的体
验要好。

2.应用解耦

以电商应用为例，应用中有订单系统、库存系统、物流系统、支付系统。用户创建订单后，如果耦合调用库存系统、物流系统、支付系统，任何一个子系统出了故障，都会造成下单操作异常。当转变成基于消息队列的方式后，系统间调用的问题会减少很多，比如物流系统因为发生故障，需要几分钟来修复。在这几分钟的时间里，物流系统要处理的内存被缓存在消息队列中，用户的下单操作可以正常完成。当物流系统恢复后，继续处理订单信息即可，中单用户感受不到物流系统的故障，提升系统的可用性。

![应用解耦.png](https://gitee.com/ma5d/imgs/raw/rabbit/应用解耦.png)

3.异步处理

有些服务间调用是异步的，例如 A 调用 B，B 需要花费很长时间执行，但是 A 需要知道 B 什么时候可以执行完，以前一般有两种方式，A 过一段时间去调用 B 的查询 api 查询。或者 A 提供一个 callback api，B 执行完之后调用 api 通知 A 服务。这两种方式都不是很优雅，使用消息总线，可以很方便解决这个问题，A 调用 B 服务后，只需要监听 B 处理完成的消息，当 B 处理完成后，会发送一条消息给 MQ，MQ 会将此消息转发给 A 服务。这样 A 服务既不用循环调用 B 的查询 api，也不用提供 callback api。同样 B 服务也不用做这些操作。A 服务还能及时的得到异步处理成功的消息。

![异步处理.png](https://gitee.com/ma5d/imgs/raw/rabbit/异步处理.png)

#### 1.1.3. MQ 的分类
1. ActiveMQ
    - 优点：单机吞吐量万级，时效性 ms 级，可用性高，基于主从架构实现高可用性，消可靠性较低的概率丢失数据
    - 缺点:官方社区现在对 ActiveMQ 5.x 维护越来越少，高吞吐量场景较少使用。
    - 尚硅谷官网视频: http://www.gulixueyuan.com/course/322
2. Kafka
    - 大数据的杀手锏，谈到大数据领域内的消息传输，则绕不开 Kafka，这款为大数据而生的消息中间件，以其百万级 TPS 的吞吐量名声大噪，迅速成为大数据领域的宠儿，在数据采集、传输、存储的过程中发挥着举足轻重的作用。目前已经被 LinkedIn，Uber, Twitter, Netflix 等大公司所采纳。
    - 优点: 性能卓越，单机写入 TPS 约在百万条/秒，最大的优点，就是吞吐量高。时效性 ms 级可用性非常高，kafka 是分布式的，一个数据多个副本，少数机器宕机，不会丢失数据，不会导致不可用,消费者采用 Pull 方式获取消息, 消息有序, 通过控制能够保证所有消息被消费且仅被消费一次;有优秀的第三方 Kafka Web 管理界面 Kafka-Manager；在日志领域比较成熟，被多家公司和多个开源项目使用；
    - 功能支持：
    功能较为简单，主要支持简单的 MQ 功能，在大数据领域的实时计算以及日志采集被大规模使用
   - 缺点：Kafka 单机超过 64 个队列/分区，Load 会发生明显的飙高现象，队列越多，load 越高，发送消息响应时间变长，使用短轮询方式，实时性取决于轮询间隔时间，消费失败不支持重试；支持消息顺序，但是一台代理宕机后，就会产生消息乱序，社区更新较慢；
3. RocketMQ
   > RocketMQ 出自阿里巴巴的开源产品，用 Java 语言实现，在设计时参考了 Kafka，并做出了自己的一些改进。被阿里巴巴广泛应用在订单，交易，充值，流计算，消息推送，日志流式处理，binglog 分发等场景。
   - 优点:单机吞吐量十万级,可用性非常高，分布式架构,消息可以做到 0 丢失,MQ 功能较为完善，还是分布式的，扩展性好,支持 10 亿级别的消息堆积，不会因为堆积导致性能下降,源码是 java 我们可以自己阅读源码，定制自己公司的 MQ
   - 缺点：支持的客户端语言不多，目前是 java 及 c++，其中 c++不成熟；社区活跃度一般,没有在 MQ核心中去实现 JMS 等接口,有些系统要迁移需要修改大量代码
4. RabbitMQ
   > 2007 年发布，是一个在 AMQP(高级消息队列协议)基础上完成的，可复用的企业消息系统，是当前最主流的消息中间件之一。
   - 优点:由于 erlang 语言的高并发特性，性能较好；吞吐量到万级，MQ 功能比较完备,健壮、稳定、易用、跨平台、支持多种语言 如：Python、Ruby、.NET、Java、JMS、C、PHP、ActionScript、XMPP、STOMP等，支持 AJAX 文档齐全；开源提供的管理界面非常棒，用起来很好用,社区活跃度高；更新频率相当高https://www.rabbitmq.com/news.html
   - 缺点：商业版需要收费,学习成本较高

#### 1.1.4. MQ 的选择
1. Kafka
   > Kafka 主要特点是基于 Pull 的模式来处理消息消费，追求高吞吐量，一开始的目的就是用于日志收集和传输，适合产生大量数据的互联网服务的数据收集业务。大型公司建议可以选用，如果有日志采集功能，肯定是首选 kafka 了。尚硅谷官网 kafka 视频连接 http://www.gulixueyuan.com/course/330/tasks
2. RocketMQ
   > 天生为金融互联网领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削峰，在大量交易涌入时，后端可能无法及时处理的情况。RoketMQ 在稳定性上可能更值得信赖，这些业务场景在阿里双 11 已经经历了多次考验，如果你的业务有上述并发场景，建议可以选择 RocketMQ。
3. RabbitMQ
   > 结合 erlang 语言本身的并发优势，性能好时效性微秒级，社区活跃度也比较高，管理界面用起来十分方便，如果你的数据量没有那么大，中小型公司优先选择功能比较完备的 RabbitMQ。

### 1.2. RabbitMQ
#### 1.2.1. RabbitMQ 的概念
RabbitMQ 是一个消息中间件：它接受并转发消息。你可以把它当做一个快递站点，当你要发送一个包裹时，你把你的包裹放到快递站，快递员最终会把你的快递送到收件人那里，按照这种逻辑 RabbitMQ 是一个快递站，一个快递员帮你传递快件。RabbitMQ 与快递站的主要区别在于，它不处理快件而是接收，存储和转发消息数据。

#### 1.2.2. 四大核心概念
- 生产者: 产生数据发送消息的程序是生产者
- 交换机: 交换机是 RabbitMQ 非常重要的一个部件，一方面它接收来自生产者的消息，另一方面它将消息 推送到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推送到多个队列，亦或者是把消息丢弃，这个得有交换机类型决定.
- 队列: 队列是 RabbitMQ 内部使用的一种数据结构，尽管消息流经 RabbitMQ 和应用程序，但它们只能存储在队列中。队列仅受主机的内存和磁盘限制的约束，本质上是一个大的消息缓冲区。<mark>许多生产者可以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。这就是我们使用队列的方式.</mark>
- 消费者: 消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。请注意生产者，消费者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。

#### 1.2.3. RabbitMQ 核心部分

![核心部分.png](https://gitee.com/ma5d/imgs/raw/rabbit/核心部分.png)

#### 1.2.4. 各个名词介绍

![工作原理.png](https://gitee.com/ma5d/imgs/raw/rabbit/工作原理.png)

- Broker：接收和分发消息的应用，RabbitMQ Server 就是 Message Broker
- Virtual host：出于多租户和安全因素设计的，把 AMQP 的基本组件划分到一个虚拟的分组中，类似 于网络中的 namespace 概念。当多个不同的用户使用同一个 RabbitMQ server 提供的服务时，可以划分出多个 vhost，每个用户在自己的 vhost 创建 exchange／queue 等。
- Connection：publisher／consumer 和 broker 之间的 TCP 连接。
- Channel：如果每一次访问 RabbitMQ 都建立一个 Connection，在消息量大的时候建立 TCP Connection 的开销将是巨大的，效率也较低。Channel 是在 connection 内部建立的逻辑连接，如果应用程序支持多线程，通常每个 thread 创建单独的 channel 进行通讯，AMQP method 包含了 channel id 帮助客户端和 message broker 识别 channel，所以 channel 之间是完全隔离的。Channel 作为轻量级的 Connection 极大减少了操作系统建立 TCP connection 的开销。
- Exchange：message 到达 broker 的第一站，根据分发规则，匹配查询表中的 routing key，分发消息到 queue 中去。常用的类型有：direct (point-to-point), topic (publish-subscribe) and fanout (multicast)。
- Queue：消息最终被送到这里等待 consumer 取走。
- Binding：exchange 和 queue 之间的虚拟连接，binding 中可以包含 routing key。Binding 信息被保存到 exchange 中的查询表中，用于 message 的分发依据。

#### 1.2.5. 安装

1. 官网地址
   https://www.rabbitmq.com/download.html
2. 文件上传
   上传到/usr/local/software 目录下(如果没有 software 需要自己创建)
3. 安装文件(分别按照以下顺序安装)
   ```shell
   rpm -ivh erlang-21.3-1.el7.x86_64.rpm
   yum install socat -y
   rpm -ivh rabbitmq-server-3.8.8-1.el7.noarch.rpm
   ```
4. 常用命令(按照以下顺序执行)
   - 添加开机启动 RabbitMQ 服务
   ```shell
   chkconfig rabbitmq-server on
   ```
   - 启动服务
   ```shell
   /sbin/service rabbitmq-server start
   ```
   - 查看服务状态
   ```shell
   /sbin/service rabbitmq-server status
   ```
   - 停止服务(选择执行)
   ```shell
   /sbin/service rabbitmq-server stop
   ```
   开启 web 管理插件
   ```shell
   rabbitmq-plugins enable rabbitmq_management
   ```
   用默认账号密码(guest)访问地址 http://47.115.185.244:15672/ 出现权限问题
   ```text
   User can only log in from localhost
   ```
5. 添加一个新的用户
   创建账号
   ```shell
   rabbitmqctl add_user admin 123
   ```
   设置用户角色
   ```shell
   rabbitmqctl set_user_tags admin administrator
   ```
   设置用户权限
   ```shell
   set_permissions [-p <vhostpath>] <user> <conf> <write> <read>
   rabbitmqctl set_permissions -p "/" admin ".*" ".*" ".*"
   ```
   用户 user_admin 具有/vhost1 这个 virtual host 中所有资源的配置、写、读权限.
      
   当前用户和角色
   ```shell
      rabbitmqctl list_users
   ```
6. 再次利用 admin 用户登录
   ![登录.png](https://gitee.com/ma5d/imgs/raw/rabbit/登录.png)
7. 重置命令
   关闭应用的命令为
   ```shell
   rabbitmqctl stop_app
   ```
   清除的命令为
   ```shell
   rabbitmqctl reset
   ```
   重新启动命令为
   ```shell
   rabbitmqctl start_app
   ```
## 2. Hello World
> 在本教程的这一部分中，我们将用 Java 编写两个程序。发送单个消息的生产者和接收消息并打印出来的消费者。我们将介绍 Java API 中的一些细节。

在下图中，“ P”是我们的生产者，“ C”是我们的消费者。中间的框是一个队列-RabbitMQ 代
表使用者保留的消息缓冲区.

![hello_world.png](https://gitee.com/ma5d/imgs/raw/rabbit/hello_world.png)

### 2.1. 依赖
[pom.xml](https://gitee.com/ma5d/rabbit-tutorial/blob/master/HelloWorld/pom.xml)

### 2.2. 消息生产者
[Producer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/HelloWorld/src/main/java/org/ma5d/Producer.java)
### 2.3. 消息消费者
[Consumer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/HelloWorld/src/main/java/org/ma5d/Consumer.java)

## 3. Work Queues
> 工作队列(又称任务队列)的主要思想是避免立即执行资源密集型任务，而不得不等待它完成。 相反我们安排任务在之后执行。我们把任务封装为消息并将其发送到队列。在后台运行的工作进程将弹出任务并最终执行作业。当有多个工作线程时，这些工作线程将一起处理这些任务。

### 3.1. 轮询分发消息

在这个案例中我们会启动两个工作线程，一个消息发送线程，我们来看看他们两个工作线程
是如何工作的。

#### 3.1.1. 抽取工具类
[RabbitMqUtils.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/order/RabbitMqUtils.java)

#### 3.1.2. 启动两个工作线程

[Worker.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/order/Worker.java)

#### 3.1.3. 启动一个发送线程

[Task.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/order/Task.java)

#### 3.1.4. 结果展示

通过程序执行发现生产者总共发送 4 个消息，消费者 1 和消费者 2 分别分得两个消息，并且是按照有序的一个接收一次消息.

```log
23:05:37.062 [main] DEBUG com.rabbitmq.client.impl.ConsumerWorkService - Creating executor service with 12 thread(s) for consumer work service
aa
发送消息完成:aa
bb
发送消息完成:bb
cc
发送消息完成:cc
dd
发送消息完成:dd
```

```log
worker01接收到消息:aa
worker02接收到消息:bb
worker01接收到消息:cc
worker02接收到消息:dd
```

### 3.2. 消息应答

#### 3.2.1. 概念

消费者完成一个任务可能需要一段时间，如果其中一个消费者处理一个长的任务并仅只完成
了部分突然它挂掉了，会发生什么情况。RabbitMQ 一旦向消费者传递了一条消息，便立即将该消息标记为删除。在这种情况下，突然有个消费者挂掉了，我们将丢失正在处理的消息。以及后续发送给该消费这的消息，因为它无法接收到。

为了保证消息在发送过程中不丢失，rabbitmq 引入消息应答机制，消息应答就是:消费者在接收到消息并且处理该消息之后，告诉 rabbitmq 它已经处理了，rabbitmq 可以把该消息删除了。

#### 3.2.2. 自动应答

消息发送后立即被认为已经传送成功，这种模式需要在高吞吐量和数据传输安全性方面做权
衡,因为这种模式如果消息在接收到之前，消费者那边出现连接或者 channel 关闭，那么消息就丢失了,当然另一方面这种模式消费者那边可以传递过载的消息，没有对传递的消息数量进行限制，当然这样有可能使得消费者这边由于接收太多还来不及处理的消息，导致这些消息的积压，最终使得内存耗尽，最终这些消费者线程被操作系统杀死，所以这种模式仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用。

#### 3.2.3. 消息应答的方法

- Channel.basicAck(用于肯定确认)。RabbitMQ 已知道该消息并且成功的处理消息，可以将其丢弃了。
- Channel.basicNack(用于否定确认)
- Channel.basicReject(用于否定确认)。 与 Channel.basicNack 相比少一个参数不处理该消息了直接拒绝，可以将其丢弃了。

```java
// positively acknowledge all deliveries up to this delivery tag.
channel.basicAck(deliveryTag, true);
```

> multiple 的 true 和 false 代表不同意思:
- true 代表批量应答 channel 上未应答的消息. 
  - 比如说 channel 上有传送 tag 的消息 5,6,7,8 当前 tag 是 8 那么此时 5-8 的这些还未应答的消息都会被确认收到消息应答.
- false 同上面相比, 只会应答 tag=8 的消息. 
  - 5,6,7 这三个消息依然不会被确认收到消息应答.

![批量应答.png](https://gitee.com/ma5d/imgs/raw/rabbit/批量应答.png)

#### 3.2.5. 消息自动重新入队
如果消费者由于某些原因失去连接(其通道已关闭，连接已关闭或 TCP 连接丢失)，导致消息未发送 ACK 确认，RabbitMQ 将了解到消息未完全处理，并将对其重新排队。如果此时其他消费者可以处理，它将很快将其重新分发给另一个消费者。这样，即使某个消费者偶尔死亡，也可以确保不会丢失任何消息。

![重新入队.png](https://gitee.com/ma5d/imgs/raw/rabbit/重新入队.png)

#### 3.2.6. 消息手动应答代码

默认消息采用的是自动应答，所以我们要想实现消息消费过程中不丢失，需要把自动应答改为手动应答，消费者在上面代码的基础上增加下面画红色部分代码。

[Worker.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/ack/Worker.java)

消息生产者

[Task.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/ack/Task.java)


#### 3.2.7. 手动应答效果演示

正常情况下消息发送方发送两个消息 C1 和 C2 分别接收到消息并进行处理

```log
1 2 3 4
发送消息完成:1
发送消息完成:2
发送消息完成:3
发送消息完成:4

worker01接收到消息:1
worker01接收到消息:3
worker02接收到消息:2
worker02接收到消息:4
```

在发送者发送消息 dd，发出消息之后的把 C2 消费者停掉，按理说该 C2 来处理该消息，但是由于它处理时间较长，在还未处理完，也就是说 C2 还没有执行 ack 代码的时候，C2 被停掉了，此时会看到消息被 C1 接收到了，说明消息 dd 被重新入队，然后分配给能处理消息的 C1 处理了.

![手动应答1.png](https://gitee.com/ma5d/imgs/raw/rabbit/手动应答1.png)

![手动应答2.png](https://gitee.com/ma5d/imgs/raw/rabbit/手动应答2.png)


### 3.3. RabbitMQ 持久化

#### 3.3.1. 概念

刚刚我们已经看到了如何处理任务不丢失的情况，但是如何保障当 RabbitMQ 服务停掉以后消息生产者发送过来的消息不丢失。默认情况下 RabbitMQ 退出或由于某种原因崩溃时，它忽视队列和消息，除非告知它不要这样做。确保消息不会丢失需要做两件事：我们需要将队列和消息都标记为持久化。

#### 3.3.2. 队列如何实现持久化

```java
// 队列持久化
channel.queueDeclare(ACK_QUEUE_NAME, durable: true, exclusive: false, autoDelete:false, arguments:null);
```

但是需要注意的就是如果之前声明的队列不是持久化的，需要把原先队列先删除，或者重新创建一个持久化的队列，不然就会出现错误.

```log
Caused by: com.rabbitmq.client.ShutdownSignalException: channel error; protocol method: #method<channel.close>(reply-code=406, reply-text=PRECONDITION_FAILED - inequivalent arg 'durable' for queue 'ack_queue' in vhost '/': received 'true' but current is 'false', class-id=50, method-id=10)
```

以下为控制台中持久化与非持久化队列的 UI 显示区、

![持久化队列.png](https://gitee.com/ma5d/imgs/raw/rabbit/持久化队列.png)

这个时候即使重启 rabbitmq 队列也依然存在

#### 3.3.3. 消息实现持久化

> 消息持久化的前提通常是队列持久化。在RabbitMQ中，只有当队列被声明为持久化（durable=True）时，标记为持久化的消息（delivery_mode=2）才能发挥其应有的作用。

> 队列持久化确保了即使RabbitMQ服务重启，队列本身及其内部的消息状态能够被保留。如果队列是非持久化的，那么在RabbitMQ重启后，这个队列将不会自动重新创建，队列中的所有消息也会丢失

> 已经入队的不会持久化存储。

要想让消息实现持久化需要在消息生产者修改代码，MessageProperties.PERSISTENT_TEXT_PLAIN 添加这个属性。

```java
channel.basicPublish(exchange: "", TASK_QUEUE_NAME, props: null, message.getBytes(charsetName: "UTF-8"));

// 当durable为true的时候
channel.basicPublish(exchange: "", TASK_QUEUE_NAME, props: MessageProperties.PERSISTENT_TEXT_PLAIN, message.getBytes(charsetName: "UTF-8"));
```

将消息标记为持久化并不能完全保证不会丢失消息。尽管它告诉 RabbitMQ 将消息保存到磁盘，但是这里依然存在当消息刚准备存储在磁盘的时候 但是还没有存储完，消息还在缓存的一个间隔点。此时并没有真正写入磁盘。持久性保证并不强，但是对于我们的简单任务队列而言，这已经绰绰有余了。如果需要更强有力的持久化策略，参考后边课件发布确认章节。

#### 3.3.4. 不公平分发

在最开始的时候我们学习到 RabbitMQ 分发消息采用的轮训分发，但是在某种场景下这种策略并不是很好，比方说有两个消费者在处理任务，其中有个消费者 1 处理任务的速度非常快，而另外一个消费者 2 处理速度却很慢，这个时候我们还是采用轮训分发的化就会到这处理速度快的这个消费者很大一部分时间处于空闲状态，而处理慢的那个消费者一直在干活，这种分配方式在这种情况下其实就不太好，但是RabbitMQ 并不知道这种情况它依然很公平的进行分发。

为了避免这种情况，我们可以设置参数 `channel.basicQos(1);`
```java
int prefetchCount = 1;
channel.basicQos(prefetchCount);
```

> prefetchCount() 是在使用 RabbitMQ 这类消息队列中间件时，与消费者（Consumer）设置相关的一个参数。它用于控制在消费者处理消息时，可以预取多少条消息到本地进行处理。这个参数对消息处理的性能和资源使用有重要影响。

![不公平分发1.png](https://gitee.com/ma5d/imgs/raw/rabbit/不公平分发1.png)

![不公平分发2.png](https://gitee.com/ma5d/imgs/raw/rabbit/不公平分发2.png)

意思就是如果这个任务我还没有处理完或者我还没有应答你，你先别分配给我，我目前只能处理一个任务，然后 rabbitmq 就会把该任务分配给没有那么忙的那个空闲消费者，当然如果所有的消费者都没有完成手上任务，队列还在不停的添加新任务，队列有可能就会遇到队列被撑满的情况，这个时候就只能添加新的 worker 或者改变其他存储任务的策略.

#### 3.3.5. 预取值
1. 消息发送原因
   - 本身消息的发送就是异步发送的，所以在任何时候，<mark>channel</mark> 上肯定不止只有一个消息。
   - 另外来自消费者的手动确认本质上也是异步的。
   
   因此这里就存在一个未确认的消息缓冲区，因此希望开发人员能限制此缓冲区的大小，以避免缓冲区里面无限制的未确认消息问题。

2. 解决方式
   - 这个时候就可以通过使用 basic.qos 方法设置“预取计数”值来完成的。
   - 该值定义<mark>通道</mark>上允许的未确认消息的最大数量。一旦数量达到配置的数量，RabbitMQ 将停止在通道上传递更多消息，除非至少有一个未处理的消息被确认，例如，假设在通道上有未确认的消息 5、6、7，8，并且通道的预取计数设置为 4，此时 RabbitMQ 将不会在该通道上再传递任何消息，除非至少有一个未应答的消息被 ack。比方说 tag=6 这个消息刚刚被确认 ACK，RabbitMQ 将会感知这个情况到并再发送一条消息。

3. 消息应答原因
   - 消息应答和 QoS 预取值对用户吞吐量有重大影响。通常，增加预取将提高向消费者传递消息的速度。虽然自动应答传输消息速率是最佳的，但是，在这种情况下已传递但尚未处理的消息的数量也会增加，从而增加了消费者的 RAM 消耗(随机存取存储器)应该小心使用具有无限预处理的自动确认模式或手动确认模式，消费者消费了大量的消息如果没有确认的话，会导致消费者连接节点的内存消耗变大，所以找到合适的预取值是一个反复试验的过程，不同的负载该值取值也不同。
   - 100 到 300 范围内的值通常可提供最佳的吞吐量，并且不会给消费者带来太大的风险。
   - 预取值为 1 是最保守的。当然这将使吞吐量变得很低，特别是消费者连接延迟很严重的情况下，特别是在消费者连接等待时间较长的环境中。
   - 对于大多数应用来说，稍微高一点的值将是最佳的。

![预取值.png](https://gitee.com/ma5d/imgs/raw/rabbit/预取值.png)

## 4. 发布确认

### 4.1. 发布确认原理

- 生产者将信道设置成 confirm 模式，一旦信道进入 confirm 模式，所有在该信道上面发布的消息都将会被指派一个唯一的 ID(从 1 开始)。
- 一旦消息被投递到所有匹配的队列之后，broker就会发送一个确认给生产者(包含消息的唯一 ID)，这就使得生产者知道消息已经正确到达目的队列了，如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出，broker 回传给生产者的确认消息中 delivery-tag 域包含了确认消息的序列号，此外 broker 也可以设置 basic.ack 的 multiple 域，表示到这个序列号之前的所有消息都已经得到了处理。
- confirm 模式最大的好处在于他是异步的，一旦发布一条消息，生产者应用程序就可以在等信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者应用便可以通过回调方法来处理该确认消息，如果  RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 nack 消息，生产者应用程序同样可以在回调方法中处理该 nack 消息。

### 4.2. 发布确认的策略
#### 4.2.1. 开启发布确认的方法

发布确认默认是没有开启的，如果要开启需要调用方法 confirmSelect，每当你要想使用发布确认，都需要在 channel 上调用该方法。

```java
Channel channel = connection.createChannel();
channel.confirmSelect();
```

> 当你调用waitForConfirms()方法时，它会阻塞当前线程直到以下情况之一发生：
> 1. 所有在调用waitForConfirms()之前发布的消息都得到了确认。
> 2. 调用waitForConfirms()之后发布的消息不会被等待确认。
> 3. 如果在等待过程中发生超时（默认情况下没有超时，即无限等待），则会抛出java.util.concurrent.TimeoutException。

#### 4.2.2. 单个确认发布

这是一种简单的确认方式，它是一种同步确认发布的方式，也就是发布一个消息之后只有它被确认发布，后续的消息才能继续发布,waitForConfirmsOrDie(long)这个方法只有在消息被确认的时候才返回，如果在指定时间范围内这个消息没有被确认那么它将抛出异常。这种确认方式有一个最大的缺点就是:发布速度特别的慢，因为如果没有确认发布的消息就会阻塞所有后续消息的发布，这种方式最多提供每秒不超过数百条发布消息的吞吐量。当然对于某些应用程序来说这可能已经足够了.

[Individual.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/confirm/Individual.java)

#### 4.2.3. 批量确认发布

上面那种方式非常慢，与单个等待确认消息相比，先发布一批消息然后一起确认可以极大地提高吞吐量，当然这种方式的缺点就是:当发生故障导致发布出现问题时，不知道是哪个消息出现问题了，我们必须将整个批处理保存在内存中，以记录重要的信息而后重新发布消息。当然这种方案仍然是同步的，也一样阻塞消息的发布。

[Batch.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/confirm/Batch.java)


#### 4.2.4. 异步确认发布

异步确认虽然编程逻辑比上两个要复杂，但是性价比最高，无论是可靠性还是效率都没得说，他是利用回调函数来达到消息可靠性传递的，这个中间件也是通过函数回调来保证是否投递成功，下面就让我们来详细讲解异步确认是怎么实现的。

![异步处理.png](https://gitee.com/ma5d/imgs/raw/rabbit/异步处理.png)

[Async.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/confirm/Async.java)


#### 4.2.5. 如何处理异步未确认消息

最好的解决的解决方案就是把未确认的消息放到一个基于内存的能被发布线程访问的队列，比如说用 ConcurrentLinkedQueue 这个队列在 confirm callbacks 与发布线程之间进行消息的传递。

#### 4.2.6. 以上 3 种发布确认速度对比
- 单独发布消息：同步等待确认，简单，但吞吐量非常有限。
- 批量发布消息： 批量同步等待确认，简单，合理的吞吐量，一旦出现问题但很难推断出是那条
消息出现了问题。
- 异步处理：最佳性能和资源使用，在出现错误的情况下可以很好地控制，但是实现起来稍微难些

```java
public static void main(String[] args) throws Exception {
//这个消息数量设置为 1000 好些 不然花费时间太长
publishMessagesIndividually();
publishMessagesInBatch();
handlePublishConfirmsAsynchronously();
}
//运行结果
发布 1,000 个单独确认消息耗时 50,278 ms
发布 1,000 个批量确认消息耗时 635 ms
发布 1,000 个异步确认消息耗时 92 ms
```

## 5. 交换机

在上一节中，我们创建了一个工作队列。我们假设的是工作队列背后，每个任务都恰好交付给一个消
费者(工作进程)。在这一部分中，我们将做一些完全不同的事情-我们将消息传达给多个消费者。这种模式称为 ”发布/订阅”。

为了说明这种模式，我们将构建一个简单的日志系统。它将由两个程序组成:第一个程序将发出日志消息，第二个程序是消费者。其中我们会启动两个消费者，其中一个消费者接收到消息后把日志存储在磁盘，另外一个消费者接收到消息后把消息打印在屏幕上，事实上第一个程序发出的日志消息将广播给所有消费者者。

### 5.1. Exchanges

#### 5.1.1. Exchanges 概念

RabbitMQ 消息传递模型的核心思想是: 生产者生产的消息从不会直接发送到队列。实际上，通常生产
者甚至都不知道这些消息传递传递到了哪些队列中。

相反，生产者只能将消息发送到交换机(exchange)，交换机工作的内容非常简单，一方面它接收来自生产者的消息，另一方面将它们推入队列。

交换机必须确切知道如何处理收到的消息。是应该把这些消息放到特定队列还是说把他们到许多队列中还是说应该丢弃它们。这就的由交换机的类型来决定。

![交换机概念.png](https://gitee.com/ma5d/imgs/raw/rabbit/交换机概念.png)

#### 5.1.2. Exchanges 的类型
总共有以下类型：直接(direct), 主题(topic) ,标题(headers) , 扇出(fanout)

#### 5.1.3. 无名 exchange

在本教程的前面部分我们对 exchange 一无所知，但仍然能够将消息发送到队列。之前能实现的
原因是因为我们使用的是默认交换，我们通过空字符串(“”)进行标识。

```java
channel.basicPublish("", "hello", null, messgae.getBytes());
```

第一个参数是交换机的名称。空字符串表示默认或无名称交换机：消息能路由发送到队列中其实
是由 routingKey(bindingkey)绑定 key 指定的，如果它存在的话。

### 5.2. 临时队列

之前的章节我们使用的是具有特定名称的队列(还记得 hello 和 ack_queue 吗？)。队列的名称我们
来说至关重要-我们需要指定我们的消费者去消费哪个队列的消息。

每当我们连接到 Rabbit 时，我们都需要一个全新的空队列，为此我们可以创建一个具有随机名称
的队列，或者能让服务器为我们选择一个随机队列名称那就更好了。其次一旦我们断开了消费者的连
接，队列将被自动删除。
创建临时队列的方式如下:
```java
String queueName = channel.queueDeclare().getQueue();
```
创建出来之后长成这样:

![临时队列.png](https://gitee.com/ma5d/imgs/raw/rabbit/临时队列.png)

### 5.3. 绑定(bindings)

什么是 bingding 呢，binding 其实是 exchange 和 queue 之间的桥梁，它告诉我们 exchange 和那个队列进行了绑定关系。比如说下面这张图告诉我们的就是 X 与 Q1 和 Q2 进行了绑定。

![绑定.png](https://gitee.com/ma5d/imgs/raw/rabbit/绑定.png)

### 5.4. Fanout

#### 5.4.1. Fanout 介绍
Fanout 这种类型非常简单。正如从名称中猜到的那样，它是将接收到的所有消息广播到它知道的所有队列中。系统中默认有些 exchange 类型。

![扇出.png](https://gitee.com/ma5d/imgs/raw/rabbit/扇出.png)

#### 5.4.2. Fanout 实战

![扇出实战.png](https://gitee.com/ma5d/imgs/raw/rabbit/扇出实战.png)

Logs 和临时队列的绑定关系如下图

![扇出UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/扇出UI.png)

ReceiveLogs01 将接收到的消息打印在控制台

[ReceiveLogs01.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/ReceiveLogs01.java)

ReceiveLogs02 将接收到的消息存储在磁盘

[ReceiveLogs02.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/ReceiveLogs02.java)

EmitLog 发送消息给两个消费者接收

[EmitLog.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/EmitLog.java)

### 5.5. Direct exchange

#### 5.5.1. 回顾
在上一节中，我们构建了一个简单的日志记录系统。我们能够向许多接收者广播日志消息。在本节我们将向其中添加一些特别的功能-比方说我们只让某个消费者订阅发布的部分消息。例如我们只把严重错误消息定向存储到日志文件(以节省磁盘空间)，同时仍然能够在控制台上打印所有日志消息。

我们再次来回顾一下什么是 bindings，绑定是交换机和队列之间的桥梁关系。也可以这么理解：队列只对它绑定的交换机的消息感兴趣。绑定用参数：routingKey 来表示也可称该参数为 binding key，创建绑定我们用代码:`channel.queueBind(queueName, EXCHANGE_NAME, "routingKey");`<mark>绑定之后的
意义由其交换类型决定。</mark>

#### 5.5.2. Direct exchange 介绍
上一节中的我们的日志系统将所有消息广播给所有消费者，对此我们想做一些改变，例如我们希望将日志消息写入磁盘的程序仅接收严重错误(errros)，而不存储哪些警告(warning)或信息(info)日志.

消息避免浪费磁盘空间。Fanout 这种交换类型并不能给我们带来很大的灵活性-它只能进行无意识的广播，在这里我们将使用 direct 这种类型来进行替换，这种类型的工作方式是，消息只去到它绑定的routingKey 队列中去。

![直连.png](https://gitee.com/ma5d/imgs/raw/rabbit/直连.png)

在上面这张图中，我们可以看到 X 绑定了两个队列，绑定类型是 direct。队列 Q1 绑定键为 orange，队列 Q2 绑定键有两个:一个绑定键为 black，另一个绑定键为 green.在这种绑定情况下，生产者发布消息到 exchange 上，绑定键为 orange 的消息会被发布到队列Q1。绑定键为 black，green 和的消息会被发布到队列 Q2，其他消息类型的消息将被丢弃。

#### 5.5.3. 多重绑定

![多重绑定.png](https://gitee.com/ma5d/imgs/raw/rabbit/多重绑定.png)

当然如果 exchange 的绑定类型是 direct，但是它绑定的多个队列的 key 如果都相同，在这种情况下虽然绑定类型是 direct 但是它表现的就和 fanout 有点类似了，就跟广播差不多，如上图所示。

#### 5.5.4. 实战

![直连实战.png](https://gitee.com/ma5d/imgs/raw/rabbit/直连实战.png)

![直连UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/直连UI.png)


[EmitLogDirect.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/direct/EmitLogDirect.java)

[ReceiveLogsDirect01.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/direct/ReceiveLogsDirect01.java)

[ReceiveLogsDirect02.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/direct/ReceiveLogsDirect02.java)

### 5.6. Topics

#### 5.6.1. 之前类型的问题

在上一个小节中，我们改进了日志记录系统。我们没有使用只能进行随意广播的 fanout 交换机，而是使用了 direct 交换机，从而有能实现有选择性地接收日志。

尽管使用 direct 交换机改进了我们的系统，但是它仍然存在局限性-比方说我们想接收的日志类型有 info.base 和 info.advantage，某个队列只想 info.base 的消息，那这个时候 direct 就办不到了。这个时候就只能使用 topic 类型.

#### 5.6.2. Topic 的要求
发送到类型是 topic 交换机的消息的 routing_key 不能随意写，必须满足一定的要求，它必须是一个单词列表，以点号分隔开。这些单词可以是任意单词，比如说："stock.usd.nyse", "nyse.vmw","quick.orange.rabbit".这种类型的。当然这个单词列表最多不能超过 <mark>255 个字节</mark>。
在这个规则列表中，其中有两个替换符是大家需要注意的: *(星号)可以代替一个<mark>单词</mark>, #(井号)可以替代零个或多个单词

#### 5.6.3. Topic 匹配案例
下图绑定关系如下

- Q1-->绑定的是: 中间带 orange 带 3 个单词的字符串(*.orange.*)
- Q2-->绑定的是: 最后一个单词是 rabbit 的 3 个单词(*.*.rabbit)、第一个单词是 lazy 的多个单词(lazy.#)

![主题.png](https://gitee.com/ma5d/imgs/raw/rabbit/主题.png)

上图是一个队列绑定关系图，我们来看看他们之间数据接收情况是怎么样的

| routing key | 接收到的队列 |
|---|---|
| quick.orange.rabbit | Q1, Q2 |
| lazy.orange.elephant | Q1, Q2 |
| quick.orange.fox | Q1 |
| lazy.brown.fox | Q2 |
| lazy.pink.rabbit | 虽然满足两个绑定但只被队列 Q2 接收一次 |
| quick.brown.fox | 不匹配任何绑定不会被任何队列接收到会被丢弃 |
| quick.orange.male.rabbit | 是四个单词不匹配任何绑定会被丢弃 |
| lazy.orange.male.rabbit | 是四个单词但匹配 Q2 |

当队列绑定关系是下列这种情况时需要引起注意
- 当一个队列绑定键是#,那么这个队列将接收所有数据，就有点<mark>像</mark> fanout 了
- 如果队列绑定键当中没有#和*出现，那么该队列绑定类型就是 direct 了

#### 5.6.4. 实战

![主题UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/主题UI.png)

[EmitLogTopic.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/topic/EmitLogTopic.java)

[ReceiveLogsTopic01.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/topic/ReceiveLogsTopic01.java)

[ReceiveLogsTopic02.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/exchange/topic/ReceiveLogsTopic02.java)


## 6. 死信队列
### 6.1. 死信的概念
先从概念解释上搞清楚这个定义，死信，顾名思义就是无法被消费的消息，字面意思可以这样理解，一般来说，producer 将消息投递到 broker 或者直接到 queue 里了，consumer 从 queue 取出消息进行消费，但某些时候由于特定的原因导致 queue 中的某些消息无法被消费，这样的消息如果没有
后续的处理，就变成了死信，有死信自然就有了死信队列。

应用场景:为了保证订单业务的消息数据不丢失，需要使用到 RabbitMQ 的死信队列机制，当消息消费发生异常时，将消息投入死信队列中.还有比如说: 用户在商城下单成功并点击去支付后在指定时间未支付时自动失效。

### 6.2. 死信的来源

- 消息 TTL 过期：队列达到最大长度(队列满了，无法再添加数据到 mq 中)
- 消息被拒绝(basic.reject 或 basic.nack)并且 requeue=false.

### 6.3. 死信实战
#### 6.3.1. 代码架构图

![死信队列.png](https://gitee.com/ma5d/imgs/raw/rabbit/死信队列.png)

#### 6.3.2. 消息 TTL 过期

生产者代码

[Producer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/Producer.java)

消费者 C1 代码(启动之后关闭该消费者 模拟其接收不到消息)

[Consumer01.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/Consumer01.java)

![死信UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/死信UI.png)

消费者 C2 代码(以上步骤完成后 启动 C2 消费者 它消费死信队列里面的消息)

[Consumer02.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/Consumer02.java)

![死信消费.png](https://gitee.com/ma5d/imgs/raw/rabbit/死信消费.png)

#### 6.3.3. 队列达到最大长度

1. 消息生产者代码去掉 TTL 属性

#### 6.3.3. 队列达到最大长度

1. 消息生产者代码去掉 TTL 属性

[Producer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/ttl/Producer.java)

2. C1 消费者修改以下代码(启动之后关闭该消费者 模拟其接收不到消息)

[Consumer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/ttl/Consumer.java)

注意此时需要把原先队列删除 因为参数改变了.

> 多的才会发送到死信队列。

3. C2 消费者代码不变(启动 C2 消费者)

![死信ttlUI.png](https://gitee.com/ma5d/imgs/raw/rabbit/死信ttlUI.png)

#### 6.3.4. 消息被拒

1. 消息生产者代码同上生产者一致
2. C1 消费者代码(启动之后关闭该消费者 模拟其接收不到消息)

[Consumer01.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/WorkQueues/src/main/java/org/ma5d/dead/ttl/Consumer01.java)

3. C2 消费者代码不变

启动消费者 1 然后再启动消费者 2

![消息被拒UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/消息被拒UI.png)

## 7. 延迟队列
### 7.1. 延迟队列概念

延时队列,队列内部是有序的，最重要的特性就体现在它的延时属性上，延时队列中的元素是希望在指定时间到了以后或之前取出和处理，简单来说，延时队列就是用来存放需要在指定时间被处理的元素的队列。

### 7.2. 延迟队列使用场景

1. 订单在十分钟之内未支付则自动取消
2. 新创建的店铺，如果在十天内都没有上传过商品，则自动发送消息提醒。
3. 用户注册成功后，如果三天内没有登陆则进行短信提醒。
4. 用户发起退款，如果三天内没有得到处理则通知相关运营人员。
5. 预定会议后，需要在预定的时间点前十分钟通知各个与会人员参加会议

这些场景都有一个特点，需要在某个事件发生之后或者之前的指定时间点完成某一项任务，如：
发生订单生成事件，在十分钟之后检查该订单支付状态，然后将未支付的订单进行关闭；看起来似乎使用定时任务，一直轮询数据，每秒查一次，取出需要被处理的数据，然后处理不就完事了吗？如果数据量比较少，确实可以这样做，比如：对于“如果账单一周内未支付则进行自动结算”这样的需求，


如果对于时间不是严格限制，而是宽松意义上的一周，那么每天晚上跑个定时任务检查一下所有未支付的账单，确实也是一个可行的方案。但对于数据量比较大，并且时效性较强的场景，如：“订单十分钟内未支付则关闭“，短期内未支付的订单数据可能会有很多，活动期间甚至会达到百万甚至千万级别，对这么庞大的数据量仍旧使用轮询的方式显然是不可取的，很可能在一秒内无法完成所有订单的检查，同时会给数据库带来很大压力，无法满足业务要求而且性能低下。

![延时队列.png](https://gitee.com/ma5d/imgs/raw/rabbit/延时队列.png)

### 7.3. RabbitMQ 中的 TTL

TTL 是什么呢？TTL 是 RabbitMQ 中一个消息或者队列的属性，表明一条消息或者该队列中的所有消息的最大存活时间，单位是毫秒。换句话说，如果一条消息设置了 TTL 属性或者进入了设置 TTL 属性的队列，那么这条消息如果在 TTL 设置的时间内没有被消费，则会成为"死信"。如果同时配置了队列的 TTL 和消息的TTL，那么较小的那个值将会被使用，有两种方式设置 TTL。

#### 7.3.1. 消息设置 TTL

一种方式便是针对每条消息设置 TTL
```java
rabbitTemplate.convertAndSend(exchange:"x", routingKey:"XC", message, correlationDate -> {
   correlationData.getMessageProperties().setExpiration(ttlTime);
   return correlationData;
})
```

#### 7.3.2. 队列设置 TTL
一种是在创建队列的时候设置队列的"x-message-ttl"属性

```java
// 生命队列的TTL
args.put("x-message-ttl", 5000);
return QueueBuilder.durable(QUEUE_A).withArguments(args).build();
```

#### 7.3.3. 两者的区别

- 如果设置了队列的 TTL 属性，那么一旦消息过期，就会被队列丢弃(如果配置了死信队列被丢到死信队列中)，而第二种方式，消息即使过期，也不一定会被马上丢弃，因为消息是否过期是在即将投递到消费者之前判定的，如果当前队列有严重的消息积压情况，则已过期的消息也许还能存活较长时间；

- 另外，还需要注意的一点是，如果不设置 TTL，表示消息永远不会过期，如果将 TTL 设置为 0，则表示除非此时可以直接投递该消息到消费者，否则该消息将会被丢弃。

- 前一小节我们介绍了死信队列，刚刚又介绍了 TTL，至此利用 RabbitMQ 实现延时队列的两大要素已经集齐，接下来只需要将它们进行融合，再加入一点点调味料，延时队列就可以新鲜出炉了。想想看，延时队列，不就是想要消息延迟多久被处理吗，TTL 则刚好能让消息在延迟多久之后成为死信，另一方面，成为死信的消息都会被投递到死信队列里，这样只需要消费者一直消费死信队列里的消息就完事了，因为
里面的消息都是希望被立即处理的消息。

### 7.4. 整合 springboot
#### 7.4.1. 创建项目
#### 7.4.2. 添加依赖

[pom.xml](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/pom.xml)

#### 7.4.3. 修改配置文件

[application.properties](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/resources/application.properties)

#### 7.4.4. 添加 Swagger 配置类

[application.properties](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/resources/application.properties)

### 7.5. 队列 TTL
#### 7.5.1.代码架构图

创建两个队列 QA 和 QB，两者队列 TTL 分别设置为 10S 和 40S，然后在创建一个交换机 X 和死信交换机 Y，它们的类型都是 direct，创建一个死信队列 QD，它们的绑定关系如下：

![延时队列ttl.png](https://gitee.com/ma5d/imgs/raw/rabbit/延时队列ttl.png)

#### 7.5.2. 配置文件类代码

[TtlQueueConfig.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/config/TtlQueueConfig.java)

#### 7.5.3. 消息生产者代码

[SendMsgController.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/controller/SendMsgController.java)

#### 7.5.4. 消息消费者代码

[DeadLetterQueueConsumer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/DeadLetterQueueConsumer.java)

发起一个请求 `http://127.0.0.1:8080/ttl/sendMsg/嘻嘻嘻`

```log
2024-08-18T22:10:40.587+08:00  INFO 175952 --- [SpringRabbit] [nio-8080-exec-1] o.m.s.controller.SendMsgController       : 当前时间：Sun Aug 18 22:10:40 CST 2024,发送一条信息给两个 TTL 队列:嘻嘻嘻
2024-08-18T22:10:50.625+08:00  INFO 175952 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Sun Aug 18 22:10:50 CST 2024,收到死信队列信息消息来自 ttl 为 10S 的队列: 嘻嘻嘻
2024-08-18T22:11:20.612+08:00  INFO 175952 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Sun Aug 18 22:11:20 CST 2024,收到死信队列信息消息来自 ttl 为 40S 的队列: 嘻嘻嘻
```

第一条消息在 10S 后变成了死信消息，然后被消费者消费掉，第二条消息在 40S 之后变成了死信消息，然后被消费掉，这样一个延时队列就打造完成了。

不过，如果这样使用的话，岂不是每增加一个新的时间需求，就要新增一个队列，这里只有 10S 和 40S两个时间选项，如果需要一个小时后处理，那么就需要增加 TTL 为一个小时的队列，如果是预定会议室然后提前通知这样的场景，岂不是要增加无数个队列才能满足需求？

### 7.6. 延时队列优化

#### 7.6.1. 代码架构图

在这里新增了一个队列 QC,绑定关系如下,该队列不设置 TTL 时间

![延时队列优化.png](https://gitee.com/ma5d/imgs/raw/rabbit/延时队列优化.png)

#### 7.6.2. 配置文件类代码

[MsgTtlQueueConfig.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/config/MsgTtlQueueConfig.java)

#### 7.6.3. 消息生产者代码

[SendMsgController.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/controller/SendMsgController.java)

发起请求
- `http://localhost:8080/ttl/sendExpirationMsg/你好 1/20000`
- `http://localhost:8080/ttl/sendExpirationMsg/你好 2/2000`

```log
2024-08-18T22:28:27.814+08:00  INFO 173796 --- [SpringRabbit] [nio-8080-exec-1] o.m.s.controller.SendMsgController       : 当前时间：Sun Aug 18 22:28:27 CST 2024,发送一条时长20000毫秒 TTL 信息给队列 C:你好 1
2024-08-18T22:28:39.059+08:00  INFO 173796 --- [SpringRabbit] [nio-8080-exec-2] o.m.s.controller.SendMsgController       : 当前时间：Sun Aug 18 22:28:39 CST 2024,发送一条时长2000毫秒 TTL 信息给队列 C:你好 2
2024-08-18T22:28:47.829+08:00  INFO 173796 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Sun Aug 18 22:28:47 CST 2024,收到死信队列信息你好 1
2024-08-18T22:28:47.830+08:00  INFO 173796 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Sun Aug 18 22:28:47 CST 2024,收到死信队列信息你好 2
```

看起来似乎没什么问题，但是在最开始的时候，就介绍过如果使用在消息属性上设置 TTL 的方式，消息可能并不会按时“死亡“，因为<mark> RabbitMQ 只会检查第一个消息是否过期</mark>，如果过期则丢到死信队列，如果第一个消息的延时时长很长，而第二个消息的延时时长很短，第二个消息并不会优先得到执行。

### 7.7. Rabbitmq 插件实现延迟队列

上文中提到的问题，确实是一个问题，如果不能实现在消息粒度上的 TTL，并使其在设置的 TTL 时间及时死亡，就无法设计成一个通用的延时队列。那如何解决呢，接下来我们就去解决该问题。

#### 7.7.1. 安装延时队列插件
在官网上下载 https://www.rabbitmq.com/community-plugins.html，下载 rabbitmq_delayed_message_exchange 插件，然后解压放置到 RabbitMQ 的插件目录。

进入 RabbitMQ 的安装目录下的 plgins 目录，执行下面命令让该插件生效，然后重启 RabbitMQ 
```shell
/usr/lib/rabbitmq/lib/rabbitmq_server-3.8.8/plugins
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```
```log
ma@ma-C92:~$ docker exec -it rabbit /bin/bash
root@rabbit:/# rabbitmq-plugins enable rabbitmq_delayed_message_exchange
Enabling plugins on node rabbit@rabbit:
rabbitmq_delayed_message_exchange
The following plugins have been configured:
  rabbitmq_delayed_message_exchange
  rabbitmq_federation
  rabbitmq_management
  rabbitmq_management_agent
  rabbitmq_prometheus
  rabbitmq_web_dispatch
Applying plugin configuration to rabbit@rabbit...
The following plugins have been enabled:
  rabbitmq_delayed_message_exchange

started 1 plugins.
```

![延时插件.png](https://gitee.com/ma5d/imgs/raw/rabbit/延时插件.png)

#### 7.7.2. 代码架构图
在这里新增了一个队列 delayed.queue,一个自定义交换机 delayed.exchange，绑定关系如下:

#### 7.7.3. 配置文件类代码
在我们自定义的交换机中，这是一种新的交换类型，该类型消息支持延迟投递机制 消息传递后并
不会立即投递到目标队列中，而是存储在 mnesia(一个分布式数据系统)表中，当达到投递时间时，才
投递到目标队列中。

![延时UI.png](https://gitee.com/ma5d/imgs/raw/rabbit/延时UI.png)

#### 7.7.3. 配置文件类代码

在我们自定义的交换机中，这是一种新的交换类型，该类型消息支持延迟投递机制 消息传递后并不会立即投递到目标队列中，而是存储在 mnesia(一个分布式数据系统)表中，当达到投递时间时，才投递到目标队列中。



#### 7.7.4. 消息生产者代码

[SendMsgController.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/controller/SendMsgController.java)

### 7.7.5. 消息消费者代码

[DeadLetterQueueConsumer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/DeadLetterQueueConsumer.java)


发起请求：

`http://localhost:8080/ttl/sendDelayMsg/come on baby1/20000`
`http://localhost:8080/ttl/sendDelayMsg/come on baby2/2000`


```log
2024-08-20T20:41:21.330+08:00  INFO 39368 --- [SpringRabbit] [nio-8080-exec-2] o.m.s.controller.SendMsgController       :  当前时间：Tue Aug 20 20:41:21 CST 2024,发送一条延迟20000毫秒的信息给队列delayed.queue:come on baby1
2024-08-20T20:41:33.029+08:00  INFO 39368 --- [SpringRabbit] [nio-8080-exec-3] o.m.s.controller.SendMsgController       :  当前时间：Tue Aug 20 20:41:33 CST 2024,发送一条延迟2000毫秒的信息给队列delayed.queue:come on baby2
2024-08-20T20:41:35.047+08:00  INFO 39368 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Tue Aug 20 20:41:35 CST 2024,收到延时队列的消息：come on baby2
2024-08-20T20:41:41.334+08:00  INFO 39368 --- [SpringRabbit] [ntContainer#0-1] o.m.s.DeadLetterQueueConsumer            : 当前时间：Tue Aug 20 20:41:41 CST 2024,收到延时队列的消息：come on baby1
```

### 7.8. 总结

延时队列在需要延时处理的场景下非常有用，使用 RabbitMQ 来实现延时队列可以很好的利用 RabbitMQ 的特性，如：消息可靠发送、消息可靠投递、死信队列来保障消息至少被消费一次以及未被正确处理的消息不会被丢弃。另外，通过 RabbitMQ 集群的特性，可以很好的解决单点故障问题，不会因为单个节点挂掉导致延时队列不可用或者消息丢失。当然，延时队列还有很多其它选择，比如利用 Java 的 DelayQueue，利用 Redis 的 zset，利用 Quartz或者利用 kafka 的时间轮，这些方式各有特点,看需要适用的场景.

## 8. 发布确认高级

在生产环境中由于一些不明原因，导致 rabbitmq 重启，在 RabbitMQ 重启期间生产者消息投递失败，导致消息丢失，需要手动处理和恢复。于是，我们开始思考，如何才能进行 RabbitMQ 的消息可靠投递呢？特别是在这样比较极端的情况，RabbitMQ 集群不可用的时候，无法投递的消息该如何处理呢:

应用[xxx]在[08-1516:36:04]发生[错误日志异常]，alertId=[xxx]。
由[org.springframework.amqp.rabbit.listener.BlockingQueueConsumer:start:620]触发。
应用 xxx 可能原因如下服务名为：异常为：org.springframework.amqp.rabbit.listener.BlockingQueueConsumer:start:620,
产生原因如下:
1.org.springframework.amqp.rabbit.listener.QueuesNotAvailableException:Cannot prepare queue for listener. Either the queue doesn't exist or the broker will notallow us to use it.||Consumer received fatal=false exception on startup:


### 8.1. 发布确认 springboot 版本
#### 8.1.1. 确认机制方案

![确认机制方案.png](https://gitee.com/ma5d/imgs/raw/rabbit/确认机制方案.png)

#### 8.1.2. 代码架构图

![发布确认架构图.png](https://gitee.com/ma5d/imgs/raw/rabbit/发布确认架构图.png)

#### 8.1.3. 配置文件

在配置文件当中需要添加 `spring.rabbitmq.publisher-confirm-type=correlated`

- NONE: 禁用发布确认模式，是默认值
- CORRELATED: 发布消息成功到交换器后会触发回调方法
- SIMPLE: 经测试有两种效果.
   - 其一效果和 CORRELATED 值一样会触发回调方法.
   - 其二在发布消息成功后使用 rabbitTemplate 调用 waitForConfirms 或 waitForConfirmsOrDie 方法等待 broker 节点返回发送结果，根据返回结果来判定下一步的逻辑，要注意的点是 waitForConfirmsOrDie 方法如果返回 false 则会关闭 channel，则接下来无法发送消息到 broker

#### 8.1.4. 添加配置类

[ConfirmConfig.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/config/ConfirmConfig.java)

#### 8.1.5. 消息生产者
#### 8.1.6. 回调接口

[Producer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/controller/Producer.java)

#### 8.1.7. 消息消费者

[DeadLetterQueueConsumer.java](https://gitee.com/ma5d/rabbit-tutorial/blob/master/SpringRabbit/src/main/java/org/ma5d/springrabbit/DeadLetterQueueConsumer.java)

#### 8.1.8. 结果分析

```log
2024-08-20T23:28:06.965+08:00  INFO 183176 --- [SpringRabbit] [nio-8080-exec-1] o.ma5d.springrabbit.controller.Producer  : 发送消息内容:xx1
2024-08-20T23:28:06.971+08:00  INFO 183176 --- [SpringRabbit] [nectionFactory3] o.m.springrabbit.controller.MyCallBack   : 交换机已经收到 id 为:2的消息
2024-08-20T23:28:06.971+08:00  INFO 183176 --- [SpringRabbit] [nectionFactory4] o.m.springrabbit.controller.MyCallBack   : 交换机已经收到 id 为:1的消息
2024-08-20T23:28:06.974+08:00  INFO 183176 --- [SpringRabbit] [ntContainer#1-1] o.m.s.DeadLetterQueueConsumer            : 接受到队列 confirm.queue 消息:xx1key1
```

可以看到，发送了两条消息，第一条消息的 RoutingKey 为 "key1"，第二条消息的 RoutingKey 为"key2"，两条消息都成功被交换机接收，也收到了交换机的确认回调，但消费者只收到了一条消息，因为第二条消息的 RoutingKey 与队列的 BindingKey 不一致，也没有其它队列能接收这个消息，所有第二条消息被直接丢弃了。

### 8.2. 回退消息

### 8.3. 备份交换机


## 9. RabbitMQ 其他知识点

## 10. RabbitMQ 集群



