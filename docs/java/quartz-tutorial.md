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

[TestClass.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/TestClass.java)

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

## 4. Job

Quartz 每次在执行任务的时候，都会创建新的 Job 对象和 JobDetail 对象。修改 Job 对象，添加打印 job 和 jobDetail 对象信息，如下：

> ```log
> [DefaultQuartzScheduler_QuartzSchedulerThread] ERROR org.quartz.core.ErrorLogger - An error occured instantiating job to be executed. > job= 'jGroup1.job1'
> org.quartz.SchedulerException: Problem instantiating class 'org.ma5d.job.QuartzJUCJob$MyJobJUC' [See nested exception: java.lang.? InstantiationException: org.ma5d.job.QuartzJUCJob$MyJobJUC]
> Caused by: java.lang.InstantiationException: org.ma5d.job.QuartzJUCJob$MyJobJUC
> Caused by: java.lang.NoSuchMethodException: org.ma5d.job.QuartzJUCJob$MyJobJUC.<init>()
> ```

> 非静态内部类确实会隐式地包含对其外部类的引用，这是因为非静态内部类的实例需要与其外部类的实例关联。因此，当你创建一个非静态内部类的对象时，需要提供一个外部类的实例，以确保内部类能够访问外部类的成员。

> Caused by: java.lang.IllegalAccessException: class org.quartz.simpl.SimpleJobFactory cannot access a member of class org.ma5d.job.QuartzJUCJob$MyJobJUC with modifiers ""

> 修改为 public 即可

[InstanceJob.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/job/InstanceJob.java)

每次打印日志的 Job 和 JobDetail 对象都是不一样的，也就是每次执行任务都会创建新的 Job 和 JobDetail 对象。

为什么要每次创建一个新的对象呢，因为可能任务执行比较久，<mark>一次任务没执行完，下一次任务就开始执行的问题</mark>，如果使用的是同一个对象，就可能存在并发问题。


### 4.1 禁止并发

但是如果不想要并发执行，而是想要上一次任务执行完成才可以执行下一次的任务，变成串行执行，该如何处理呢？可以为 Job 类添加 @DisallowConcurrentExecution 注解来禁止并发执行同一个 Job定义（JobDetail定义的）的多个实例。

举个栗子：给 Job 类添加 @DisallowConcurrentExecution 注解，我们使用的还是之前使用的触发器，每1秒执行一次，但是我们的任务每次执行需要花费3秒执行。

[ThreeJob.java](https://gitee.com/ma5d/hello-quartz/blob/main/src/main/java/org/ma5d/job/ThreeJob.java)

如果没有 @DisallowConcurrentExecution 注解，虽然任务没有执行完成，但是每过1秒都会执行一次新的任务，导致任务会一直累积。而添加了 @DisallowConcurrentExecution 注解，上一次执行完成，才会执行下一次任务。可以看到每隔三秒执行一次，不会并发执行，而是变成了串行执行。

### 4.2 Job的状态

每次执行任务都是新的 JobDetail 和 Job 实例，那么在传递数据的时候，每次的 JobDataMap 都是相同的数据。这个就是无状态的 Job。即使我们在 Job 类中，修改了 JobDataMap 中的数据，也不会对下一次的执行产生影响。如果想要用一个计数器记录执行的次数，即我们想要 JobDataMap 的数据能一直保存下来应该如何设置呢？这个就需要有状态的 Job 了。

> 这个使用static field 不就行了。

举个栗子：使用 count 记录任务执行的次数，首先在 JobDetail 中初始化 count 的值。

```java
// 1.定义jobDetail
@PersistJobDataAfterExecution

JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
jobDataMap.put("count", count);
```

## 5. 触发器

触发器（Triggers）用于定义何时和如何执行与 Job 关联的任务。它们决定了任务的调度规则，比如何时执行、执行频率以及在何种条件下触发执行。我们在前面使用的触发器是SimpleTrigger， SimpleTrigger 只能定义按照指定频率执行的任务，如果要定义复杂的执行规则，SimpleTrigger 是无法支持的，一般我们用的最多的就是 CronTrigger 。

### 5.1 CronTrigger

CronTrigger 是 Quartz 中用于基于 Cron 表达式定义任务执行时间表的触发器类型。它允许用户按照日历时间来定义任务的执行规则，非常灵活且支持各种复杂的调度需求。

1. CronTrigger演示

先举个栗子：任务还是之前的任务类：