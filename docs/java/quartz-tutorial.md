# Quartz 教程

## 1 Quartz简介
### 1.1 什么是Quartz

我们在项目中经常会需要执行一些定时任务，例如定时进行数据备份和清理；定时检查创建的订单有没有支付，没有支付超过30分钟就将其取消，这些都会用到定时任务。

Quartz 就是一个开源的、用于 Java 编程语言的任务调度框架。它的主要作用是允许开发者根据预定的时间执行特定的任务。这些任务可以是一次性的，也可以是周期性的，Quartz 可以有效地管理这些任务的执行。

### 1.2 Quartz中的核心组件

在动手编码之前，先了解一下 Quartz 中的核心组件。

- 任务 Job。也就是任务，需要被定时执行的任务
- 触发器 Trigger。定义了 Job 的执行时间规则。它确定了 Job 何时被执行。Quartz 提供了不同类型的 Trigger，允许根据不同的时间规则安排 Job 的执行。
- 调度器 Scheduler。Scheduler 是 Quartz 的核心，负责管理 Job 和 Trigger，控制它们的执行。它可以启动、暂停、停止和重新启动任务的执行，并管理它们的生命周期。
- 任务存储 JobStore。JobStore 负责存储 Quartz 的状态信息，包括 Job、Trigger、调度信息等。它存储了所有被调度的任务和相关的配置信息，确保即使在重启后也能恢复调度器的状态。

架构图如下：

![架构图](https://gitee.com/ma5d/imgs/raw/Quartz/架构图.png)

## 2. HelloWorld
下面先来实现一个简单的定时任务，让大家了解一下。

1. 新建项目

在 IDEA 中先创建一个项目

- 在使用的时候，通过 JobBuilder 构建 JobDetail，JobDetail 对 Job 进行了包装，添加了更多的信息描述。
- 通过 TriggerBuilder 创建 Trigger，触发器一般有4种，最常用的就是 CronTrigger 了。多个触发器是可以执行同一个任务的。
- 通过 SchedulerFactory 创建 Scheduler，使用 Scheduler 来管理任务信息和触发器；
- 监听器有三大类，可以分别用来监听任务信息、触发器和调度器的执行情况、生命周期等信息。
- JobStore 部分负责 Quartz 信息的存储，默认是使用 RAMJobStore 存储在内存中的，重启后，信息会丢失；JDBCJobStore 是数据库存储，在集群的时候，就需要用到数据库存储，各个节点共享数据库的信息。

如果不引入 slf4j-simple，quartz 的日志是打印不出来的，但是要注意版本问题，因为 quartz 中的 slf4j-api 的版本是 1.7.x 的，这里我使用 2.x.x 版本的 slf4j-simple 因为版本不兼容，也无法打印。

如果使用 logback，引入 logback-classic，也存在版本兼容问题，使用1.4.x 和 1.3.x都不行，需要使用 1.2.x 的 logback-classic 。

当然也可以排除 quartz 中的 slf4j-api ，重新引入新版本的 slf4j-api 。  

### 1. 创建 Job 类
创建一个 Job 类，名称自定义，需要实现 Job 接口，并实现 execute 方法。

[MyJob.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/MyJob.java)

### 2. 编写定时任务
需要创建任务详情（JobDetail）、触发器（Trigger）、调度器（Scheduler）。

任务详情就是 JobDetail，这个 JobDetail 其实是对 Job 的包装和描述，每次执行任务，调度器就会根据 JobDetail 的描述信息通过反射创建一个新的 Job 实例，这样可以规避并发访问的问题。而且这样设计，可以让 Job 更加专注于业务逻辑。


我们创建一个测试类，在测试类中编写：

[TestClass.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/TestClass.java)

JobDetail 通过 JobBuilder 创建。Trigger 通过 TriggerBuilder 创建。在触发器上设置触发的时机，例如频率和次数等，然后将触发器和任务交给调度器来管理。


## 3. 传递参数
如果我们想在创建任务和触发器的时候，给任务传递一些参数，在执行任务的时候，可以读取到这些参数，那么该如何处理呢？这里就需要用到 JobDataMap 。

### 3.1 传递参数
我们可以在创建 Job 或 Trigger 的时候，设置参数。

举个栗子：

[TestClassParam.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/TestClassParam.java)

在创建 Job 或 Trigger 的时候，都可以通过 JobDataMap 以 key-value 的形式设置参数，这是因为 JobDataMap 实现了 JDK 中的 Map 接口。下面就可以来获取上面传递的参数了。

### 3.2 接收参数

接收参数有两种方式，一种是在 Job 中获取到 JobDataMap 对象，通过 JobDataMap 获取参数。一种是通过 Job 中的属性来接收参数。

1. 通过 JobDataMap 获取参数
在 Job 类中的 execute 方法中，通过 JobExecutionContext 对象可以获取到 JobDetail 和 Trigger，然后获取到 JobDataMap。JobExecutionContext 对象是任务执行的上下文对象，可以获取到全局的信息。可以通过 JobExecutionContext 对象获取到 JobDetail 和 Trigger 的信息，然后获取到 JobDataMap 的信息。通过 getMergedJobDataMap() 可以获取 JobDetail 和 Trigger 传递的参数合并后的结果，如果传递参数的时候 JobDetail 和 Trigger 传递了相同的 key 值，那么 <mark>Trigger 中传递的参数会覆盖 JobDetail 中的参数</mark>。

[MyJobParam.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/MyJobParam.java)

2. 通过属性获取参数

首先在 Job 中定义与传递数据的时候 key 相同属性和 set 方法。这样在创建 job 的时候，会通过 setter 将参数设置进来。

[TestClassSetter.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/TestClassSetter.java)













