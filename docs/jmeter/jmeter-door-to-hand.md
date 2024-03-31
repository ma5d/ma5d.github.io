---
sidebar_position: 1
---

# jmeter从入门到精通

## 一、jmeter 安装

看文章：

[jmeter 安装与配置\_墨瑶\_165的博客-CSDN博客](https://blog.csdn.net/Echo_165/article/details/124034171 "jmeter 安装与配置_墨瑶_165的博客-CSDN博客")

![](https://img-blog.csdnimg.cn/024a556b3bd34f238abc7e1ed0faf95c.png)

解释：不要使用GUI模式进行压力测试，GUI模式仅仅用于创建和调试压力测试脚本的。

## 二、jmeter 介绍
===========

### 1、jmeter是什么？
------------

jmeter：是Apche公司使用Java平台开发的一款测试工具。

### 2、jmeter 用来做什么？
---------------

*   **接口测试**
*   性能测试
*   **压力测试**（优势）
*   数据库测试
*   Java程序测试 （因为本身就是Java语言编写的）

### 3、优点
----

*   开源免费
*   支持多协议 （http，tcp...）
*   轻量级
*   功能强大

### 4、缺点
----

无法验证JS程序，也无法验证页面UI，所以必须要和 selenium 配合来完成web2.0应用的测试

### 5、jmeter 目录介绍
-------------

#### ①\_bin 目录介绍

| --- | --- |
|examples	       |  目录中有CSV样例 |
|jmeter.bat	       |  windows 的启动文件 |
|jmeter.sh	       |  Linux 的启动文件 |
|jmeter.log	       |  jmeter 运行日志文件 |
|jmeter.properties |	系统配置文件 |
|jmeter-server.bat |	windows 分布式测试要用到的服务器配置 |
|jmeter-serrver	   |  Linux 分布式测试要用到的服务器配置 |

##### **jmeter.properties** ：

*   打开：右击 --> ![](https://img-blog.csdnimg.cn/0834292f2d4141e58776ac7678dea850.png)
*   修改后需要重启 jmeter 使用

https=http+ssl

### ② docs 目录 — — 接口文档目录

例如：docs\\api\\index.html 可打开网页查看

### ③ extras目录 — — 扩展插件目录

提供了对 ant 的支持，可以使用 ant 实现自动化测试。例如批量脚本执行，产生html格式的报表

测试运行时，可以把测试数据记录下来，jmeter会自动生成一个 .jtl 文件，将该文件放在extras目录下，运行“ant-Dtest=文件名 report”,就可以生成测试统计报表。

### ④ lib 目录 — —  所用到的插件目录

![](https://img-blog.csdnimg.cn/57ee82c0acb44943acff8b7b9b2a234d.png)

### ⑤ licenses 目录 — — jmeter 证书目录

### ⑥ printable\_docs目录

![](https://img-blog.csdnimg.cn/33e4562df29a4faeaaa1ec69c680ef26.png)

![](https://img-blog.csdnimg.cn/1262fbf9792a4be48fede9bd40179d8e.png)

![](https://img-blog.csdnimg.cn/de3b9e4648cc4c25a01a732450efa42d.png)

![](https://img-blog.csdnimg.cn/f04ff1c155f24ee59463c078ed975321.png)

![](https://img-blog.csdnimg.cn/66502db6b1dc44a6819fa2842372e009.png)

（网页可以翻译看）

三、jmeter 基本使用&元件
================

1、jmeter 入门脚本
-------------

*   ①添加测试计划 （当打开jmeter默认有一个测试计划）
*   ②添加线程组 （右击测试计划-->添加-->线程-->线程组）
*   ③添加http请求 （右击线程组-->取样器-->http请求）
*   ④配置http请求

### jmeter测试计划要素：

*   测试计划（项目名称）
*   测试计划中至少有一个线程组
*   线程组中至少有一个取样器
*   测试计划中必须有监听器

![](https://img-blog.csdnimg.cn/166c180160964dcf9efbe3ad0bbfcc25.png)

*   ⑤ 添加查看结果树（右击线程组-->监听器-->查看结果树）#查看结果树不做任何配置

编辑好脚本后，可以发送请求

![](https://img-blog.csdnimg.cn/43b752f27a6f47f3b398e020571ad980.png)

 ![](https://img-blog.csdnimg.cn/89c8fee0fa5e4207aaa4a57e3217799a.png)save后默认发送请求

![](https://img-blog.csdnimg.cn/f2152e0121a54bdbb11b282e7c974164.png)

 2、测试计划元件
---------

![](https://img-blog.csdnimg.cn/e4c8190840e649d6b5ebb88e9636a337.png)

 **元件与组件的区别**

*   元件：多个类似功能组件的容器
*   组件：容器中实现单独的某个功能

**①线程组介绍（不属于元件哦！放在一起学习而已）**

![](https://img-blog.csdnimg.cn/7353783fe61f4bbfb81835b0e4fb3cf2.png)

**② 取样器（sample）**

取样器是性能测试中**向服务器发送请求，记录响应信息，记录响应时间**的最小单位。

jmeter支持不同取样器（即支持不同协议的请求）

**③ 逻辑控制器（logic controller）**

包括两类元件：

*   一类用于控制testplan中sampler节点发送请求的逻辑顺序的控制器，常用的有 if控制器，Switchcontroller、runtimecontroller、循环控制器等
*   另一类是用来组织可控制sampler节点的，如事务控制器、吞吐量控制器

**④ 配置元件（config element）**

用来提供对静态数据的支持

**⑤ 定时器（timer）**

在操作之前设置等待时间（例如取样器与取样器之间，设置一个等待时间）

**⑥ 前置处理器（per processors）**

用于实际请求之前对即将**发出的请求**进行特殊处理

**⑦ 后置处理器（post processors）**

用于对sampler发出请求后得到的**服务器响应**进行处理

**⑧ 断言（assertions）**

用于**检查测试中得到的响应数据等是否符合预期**，assertions一般用来设置检查点，用以保证性能测试过程中的数据交互与预期是否一致

**⑨ 监听器**

对测试结果进行处理和可视化展示的一系列组件

3、元件的作用域
--------

靠测试计划中元件树形结构的**父子关系**来确认

![](https://img-blog.csdnimg.cn/b2f89619e0f84784b18d87d4fb2bf79e.png)

### **（1）原则：**

**取样器**：以取样器为核心，取样器没有作用域

**逻辑控制器**：只对子节点的取样器和逻辑控制器起作用

**其他元件**：

*   如果父节点是取样器，则只对其父节点起作用
*   如果父节点不是取样器，则该作用域是其父节点下的其他所有后代节点（子节点，子节点的子节点）

### **（2）执行顺序**

**同一作用域下不同元件执行顺序**

*   配置元件 -- 前置处理器 -- 定时器 -- **取样器** -- 后置处理器 -- 断言 -- 监听器

**同一作用域下相同元件的执行顺序**

*   从上到下依次执行

**案例：执行顺序案例**

![](https://img-blog.csdnimg.cn/ff59e510a4704d238e79fcb988126882.png)

定时器1 -- 请求1 -- 定时器1 -- 定时器2 -- 请求2 -- 定时器1 -- 定时器3 -- 请求3

解析：定时器1 的父节点不是取样器，所以对父节点下的所有后代节点都起作用

4、jmeter 第一个案例
--------------

**需求**：使用 jmeter 访问百度接口，并查看请求和响应信息

**步骤：**

*   添加线程组
*   添加 HTTP 请求 并 配置
*   添加查看结果树

![](https://img-blog.csdnimg.cn/81091ef06a5e4e36880b765ad8aa69a9.png)

5、jmeter 运行原理
-------------

**1、在 jmeter 中是以线程的方式运行的**

> 问：为什么以线程方式运行而不是进程？  
>         因为 jmeter 是运行在jvm虚拟机上的，每个进程的开销比较大，如果以进程的方式来运行的话，每台负载机上的进程数量就不会允许太多，当我们需要大量并发时就需要大量的负载机，这显然是不经济的，再者Java也是支持多线程的，所以 jmeter 选择了以线程的方式来运行。

**2、jmeter通过线程组来驱动多个线程运行测试脚本，对被测服务器发起负载，每个负载机上都可以运行多个线程组。**

**jmeter运行场景：**

*   GUI模式（界面模式）（主要用来编写和调试jmeter测试脚本）
*   命令行模式（对负载机的资源消耗会更小）（用来实现高并发和压力测试）

在资源有限的情况下，都是用命令行模式来执行jmeter脚本的，而页面模式是用来前期创建脚本或者调试脚本的

负载机：执行jmeter脚本的电脑

6、jmeter配置文件修改
--------------

bin --> jmeter.properties -->右击打开

### （1）修改中文乱码问题

找下面这句话（查找快捷键：ctrl+f）

```
sampleresult.default.encoding=ISO-8859-1 
#ISO-8859-1是默认值
```

将参数修改为

```
sampleresult.default.encoding =utf-8
```

去掉这行代码前面的#号

![](https://img-blog.csdnimg.cn/9d058f4897b34dcaa4c89271994e89d3.png)

### （2）修改默认语言

![](https://img-blog.csdnimg.cn/90cae1aa453d4ed2bb05887bf802377c.png)

 修改保存完后，重启 jmeter 就生效了

四、jmeter核心知识
============

1、发送http请求
----------

（学习 jmeter取样器 以 http请求 为例）

作用：向服务器发送http/https请求

### 1）相关配置元件

**① HTTP管理器**

 http请求 与 配置元件配套使用

![](https://img-blog.csdnimg.cn/74b7515c722a4f96828c676c0161e01a.png)

**② http消息头管理器（http请求头）**

主要使用Content-Type参数（指请求参数的类型）

在jmeter中，发送HTTP的post请求时，需要添加http消息头管理器

 ！汉字是？？时，在内容编码中加 utf-8

**③ http请求默认值**

作用：将同一线程组下所有http请求的协议和服务器域名统一管理

（如果http请求中自己填写了http协议和服务器域名，当发送请求时使用本身的协议和域名）

### 2）http请求配置

> *   http协议默认端口号：80
> *   httpd默认端口号：443

请求地址：http://127.0.0.1:8000/api/departments/

![](https://img-blog.csdnimg.cn/e9df6e15694a4278b178663af08a6392.png)

练习：编写 jmeter 脚本，访问百度 （_URL=http://www.baidu.com/S  参数：wd=test(form表单)_ ）

*   案例1：GET请求，路径传递参数
*   案例2：GET请求，参数列表传递参数
*   案例3：POST请求，请求体数据传输参数
*   案例4：POST请求，参数列表传输参数

![](https://img-blog.csdnimg.cn/b44473611d8f4c3691ad0d25d808de70.png)

![](https://img-blog.csdnimg.cn/678a73be43a547668e8b97be7b7268e6.png)

![](https://img-blog.csdnimg.cn/86bb1b0feb134643aa62846d8c04696b.png)

![](https://img-blog.csdnimg.cn/87139ccea1f44ae1a6171ce03300486c.png)

2、jmeter 参数化\*\*\*
------------------

### 1）参数化的概念

什么是参数化？

*   根据需求动态获取数据并进行赋值的过程

jmeter中参数的定义？

*   jmeter中参数化的变量用 ${变量名} 表示

jmeter参数化常用方式？

*   CSV数据控件 （CSV Data Set Config）
*   用户定义的变量（User Defined Variables）
*   用户参数（User Variables）

**2）CSV Data Set Config**

一种从外部读取数据功能的组件

**适用范围**：需要大量测试数据

**实现步骤**：

*   创建测试计划
*   创建线程组
*   添加 CSV Data Set Config 组件并配置
*   添加http请求并配置
*   添加查看结果树

将表格xlsx格式转换为CSV --> CSV编码转为UTF-8（notepad）--> CSV数据文件设置 --> http请求设置 -->设置线程组线程数或循环次数

![](https://img-blog.csdnimg.cn/33fde89487464dcf805817acc9dc17b5.png)

配置http请求（引用定义的变量名，格式：${变量名}）

![](https://img-blog.csdnimg.cn/e8979986facf41c5b18cb7357f876973.png)

### **3）用户参数**

**适用于**：参数取值范围很小

**位置**：前置处理器 --> 用户参数

**使用方式**：

*   针对那个http请求使用就在哪个http请求下添加（http --> 添加 --> 前置处理器 --> 用户参数）

配置用户参数

*   添加变量 --> 添加变量名称
*   添加用户 --> 添加用户名称（一个用户就是一个测试数据）

使用用户参数

*   在http请求中引用变量（${变量名}）
*   在线程组中设置线程数；线程数的值和用户数一致

![](https://img-blog.csdnimg.cn/bec62995d6c04346b2b4f0f5426c2645.png)

**4）用户定义的变量**

适用于：定义全局变量

位置：

*   测试计划页面（一般情况下）
*   配置元件 --> 用户定义的变量

步骤：

*   添加线程组
*   添加用户定义的变量
*   添加http请求，引用变量${变量名}
*   添加查看结果树

### 5）总结参数化

①csv数据文化配置（配置元件中）

*   适用于大量的测试数据时的使用

②用户参数（前置处理器中）

*   适用于少量测试数据

③用户定义的变量（测试计划 / 配置元件中）

*   定义全局变量

![](https://img-blog.csdnimg.cn/7bbc60d0d38949959f6779b92aeb0067.png)

![](https://img-blog.csdnimg.cn/e228c9a37d844e168968a0cee5d4649c.png)

3、jmeter 断言
-----------

（让 程序自动判断预期结果和实际结果是否一致）

### 1）常用断言

*   响应断言
*   json断言
*   持续时间断言

### 2）响应断言

作用：对HTTP请求的任意格式响应结果进行断言

位置：右击http请求 --> 添加 --> 断言 --> 响应断言

参数：

![](https://img-blog.csdnimg.cn/5f651a0ac14c4ac2b86bb51b25bd1142.png)

案例1：  
        请求：https://www.baidu.com  
        检查：响应数据中是否包含“百度一下，你就知道”

![](https://img-blog.csdnimg.cn/4faba3f20bdb4fd98580560dcab366d9.png)

![](https://img-blog.csdnimg.cn/4819d02b81f8419b94f707c272b2a007.png)

 案例2：校验多个测试数据

![](https://img-blog.csdnimg.cn/135844033270457a9221d60be6a1a42a.png)

![](https://img-blog.csdnimg.cn/69600dee58b74c1fbcd2ef2bd23f79ce.png)

###  3）Json 断言

适用于：HTTP响应结果是 json 格式时，可以使用 json断言

参数：

![](https://img-blog.csdnimg.cn/397c30ad78604a50944fdbb7dc0a8600.png)

 案例：

![](https://img-blog.csdnimg.cn/1cd577888cee4ae3a0f101d7220c54bc.png)

![](https://img-blog.csdnimg.cn/10c3d8496f114324a0db607513cb2f59.png)

### ![](https://img-blog.csdnimg.cn/f542354545a64eae9f9df1344bba383d.png) 4）断言持续时间

作用：检查http请求的响应数据是否超出要求范围

参数：

*   响应时间（毫秒）：http请求允许的最大响应时间（1s = 1000ms）。

案例：

![](https://img-blog.csdnimg.cn/544f034603b3424c9bffae7a29826060.png)

![](https://img-blog.csdnimg.cn/43d3e3eed6fd4ac9a063e57cb51136cf.png)![](https://img-blog.csdnimg.cn/3946c20d5acc4ebfbe47cb08a8fe9cca.png)

![](https://img-blog.csdnimg.cn/00f30b8db2694f5597ff2781ca6a9e48.png)

 4、jmeter 关联
------------

当请求之间有依赖关系，比如一个请求的入参是另一个请求的返回数据，这时候就需要用到关联。

### 1）jmeter 常用的关联方法

*   正则表达式 提取法（针对任意格式）
*   Xpath 提取法（html格式）
*   JSON 提取法

![](https://img-blog.csdnimg.cn/0ce890573e6043399dcb3f19081fbe5f.png)

 ![](https://img-blog.csdnimg.cn/bd36115bb6ad4be0a62a979ed7a1bcf9.png)

[正则表达式在线测试](https://www.w3cschool.cn/tools/index?name=reg "正则表达式在线测试")

###  2)正则表达式提取器

位置：右击HTTP请求 --> 添加 --> 后置处理器 --> 正则表达式提取器

![](https://img-blog.csdnimg.cn/570bf2741bbd41eea90108454762d018.png)

http请求配置中，用 ${变量名} 引用 正则表达式提取器的引用名称

**案例1：获取传智播客首页的title，并作为参数传递**

*   请求：http://www.itcast.cn/，获取网页的title值
*   请求：http://www.baidu.com/，把获取到的title作为请求参数

![](https://img-blog.csdnimg.cn/c1fa116c12134ca1b5f70af488890015.png)

![](https://img-blog.csdnimg.cn/e1cd95c61ae44bc4966979cb2ecddff9.png)![](https://img-blog.csdnimg.cn/4cc9f971c0034a34b9cffd17a1e229ac.png)

 **案例2：获取传智播客首页的地址，把第5个校区地址作为参数传递（span为地址的校区）**

![](https://img-blog.csdnimg.cn/a74aa90fe77b4f3bb580781da80b6bdf.png)

方法1： （地址要先发送一次请求，在响应数据中查看）

![](https://img-blog.csdnimg.cn/fea96afd83a54cdcad35f17fae62bf79.png)

![](https://img-blog.csdnimg.cn/3042436516a84531a517d8f0429ecd94.png)

 方法2：

![](https://img-blog.csdnimg.cn/214ae223d30941599455871d3cf22dbb.png)

![](https://img-blog.csdnimg.cn/65972f50e3b74a3d8ec55fc8a9edd9ba.png)

 案例3：

获取传智播客首页的地址，把第5个校区地址作为参数传递（span为地址/后面带一、二、三）

![](https://img-blog.csdnimg.cn/844b6a82cdf24897b583b2c2d07657a1.png)![](https://img-blog.csdnimg.cn/4e1de912dbcd4326b8ca161f5b43c0c2.png)

![](https://img-blog.csdnimg.cn/df98c4fd097643049397c902a19409cf.png)

###  3）xpath 提取器

作用：根据HTML格式的响应结果数据进行提取

参数：

![](https://img-blog.csdnimg.cn/ca4ad05b08904738bd928f8ff8e34966.png)

![](https://img-blog.csdnimg.cn/1473e3d09b414d4a84bef36c4b51eb3c.png)

 案例1：获取传智播客首页的title，并作为参数传递

*   请求：http://www.itcast.cn/，获取网页的title值
*   请求：http://www.baidu.com/，把获取到的title作为请求参数

 ![](https://img-blog.csdnimg.cn/b905517c08f54887a49a5e0df8626539.png)

![](https://img-blog.csdnimg.cn/2d2d221ed3cd432d8cf5806ae3f21814.png)

###  4）JSON提取器

作用：针对JSON格式的响应结果数据进行提取

参数：

![](https://img-blog.csdnimg.cn/ef60e2d64c0d4d88b6b10b691d1cd63a.png)

案例：提取天气接口中的城市信息，作为参数在访问百度首页时传递

![](https://img-blog.csdnimg.cn/151684f3c0154c7d84caca879e3ceb9f.png)

![](https://img-blog.csdnimg.cn/78f19c89298e4d14987abf0dd5e12114.png)

### 5）jmeter 的属性 -- 全局变量

提问：当有关联关系的两个请求在不同线程组中，该如何进行消息传递呢？（定义全局变量）

**① jmeter属性的配置函数：**

*   \_setProperty函数：将值保存成 jmeter属性
*   \_Property函数：在其他线程组中读取 jmeter 属性

**② jmeter属性的执行：**

*   \_setProperty函数 执行（保存jmeter属性）：通过 BeanShell 取样器
*   \_Property函数 执行（读取属性）：在其他线程组中使用 property函数

**③ 案例**

![](https://img-blog.csdnimg.cn/1c5715424326406db8a454658e010bf2.png)

 操作步骤：

*   添加线程组1
*   添加http请求-天气
*   添加JSON提取器
*   添加BeanShell取样器（将JSON提取的值保存成jmeter属性）
*   添加线程组2
*   添加http请求-百度（读取jmeter属性）
*   添加查看结果树

![](https://img-blog.csdnimg.cn/039fda2e653e40a983342c04bf0e3741.png)

![](https://img-blog.csdnimg.cn/bbba05de4e2849d593174132db8d8507.png)

 配置setproperty函数（选项--函数助手对话框--生成代码）

![](https://img-blog.csdnimg.cn/216e936dc0eb4f9fb3bb747548c52d02.png)

![](https://img-blog.csdnimg.cn/2f68662e250b41eda6be33785644b901.png)

 ![](https://img-blog.csdnimg.cn/91eb3eb277c54011b62e3e6e96ed85f5.png)

![](https://img-blog.csdnimg.cn/1ef824c1ad4246d586dfbeffa2952a69.png)

![](https://img-blog.csdnimg.cn/69ed2657e0db4e72921a6988e43eff43.png)让线程组串行执行！

![](https://img-blog.csdnimg.cn/eb033e2bed8842d2845475846af88f58.png)

5、 jmeter录制脚本
-------------

### 1）使用badboy录制

[安装badboy](https://pan.baidu.com/s/1HXu4_3jaTmDnXMKZ98MoJw?pwd=drzb "安装badboy")（提取码：drzb）

![](https://img-blog.csdnimg.cn/80bbd63d62834bb581db41461b0e425e.png)

录制步骤：

*   打开badboy，默认记录状态
*   地址栏输入网址，回车 --> 页面操作 --> 停止记录
*   导出脚本：file --> export jmeter --> 选择路径保存

在jmeter中打开已有的文件

*   jmeter脚本文件后缀 .jmx
*   在jmeter中点击打开文件，选择文件路径，找到需要的文件打开就可以了

### 2）使用jmeter自身代理录制移动端

**① 配置jmeter**

*   打开jmeter添加新的测试计划
*   添加线程组
*   添加HTTP代理服务器（右击测试计划 --> 非测试元件 --> HTTP代理服务）
*   配置HTTP代理服务器（也可以在request filtering 上设置过滤条件）

![](https://img-blog.csdnimg.cn/b9be632ffc714379abf0f4ce148421a1.png)

**② 配置手机**

设置 --> wifi --> 配置代理（然后填电脑的IP地址，端口号）

然后就可以录制移动端操作了！

![](https://img-blog.csdnimg.cn/74eec026cb8a4528a095c572ffc6df68.png)

6、jmeter连接数据库 -- 以MySQL为例
-------------------------

需将mysql-connector-java-X.X.X-bin.jar放入到jmeter安装目录下的./lib目录，重启jmeter

### 1）使用数据库步骤

### ① 创建测试计划

### ② 创建线程组

*   添加 JDBC Connectionn Configuration （建立数据库连接）
*   添加 JDBC Request （发送数据库请求）
*   添加查看结果树

### ③ 引入数据库驱动jar 包

![](https://img-blog.csdnimg.cn/9699eb14cccc4e09a837a86645c6a2b2.png)

### ④ 配置 JDBC Connectionn Configuration 

![](https://img-blog.csdnimg.cn/6681b8d9ab5f46d58edba7ef31dc7e52.png)

*   **database url（数据库地址）:**如：jdbc:mysql://数据库IP地址:数据库端口/数据库名称

![](https://img-blog.csdnimg.cn/bc510060e3534951ba5c02bf8513f479.png)

### ⑤ 连接测试（JDBC Request）

![](https://img-blog.csdnimg.cn/da65ea28d01b4a0b92000bd13d734735.png)

*   Variable name of pool...：数据库连接池的名字（与JDBC Connection Configuration 名字保持一致）
*   Querys：查询数据库语句的SQL语句（末尾不要加；）
*   parameter values：数据的参数值
*   parameter types：数据的参数类型
*   variable name：变量名称，用于保持SQL语句返回结果（eg. 变量名称）
*   result variable name：创建一个对象变量，保存所有返回结果
*   query timeout：查询超时时间
*   handle result set：定义如何处理由 callable statements语句返回的结果

![](https://img-blog.csdnimg.cn/ff783a7f8a454cc5b58af56437771ab1.png)

[jmeter测试数据库服务--JDBC Request\_不进则退2020的博客-CSDN博客\_jmeter连接数据库![](https://csdnimg.cn/release/blog_editor_html/release2.0.8/ckeditor/plugins/CsdnLink/icons/icon-default.png)https://blog.csdn.net/qq\_32706349/article/details/97539270?ops\_request\_misc=%257B%2522request%255Fid%2522%253A%2522164955943716782094879408%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request\_id=164955943716782094879408&biz\_id=0&utm\_medium=distribute.pc\_search\_result.none-task-blog-2~all~baidu\_landing\_v2~default-4-97539270.142%5Ev7%5Epc\_search\_result\_control\_group,157%5Ev4%5Econtrol&utm\_term=jmeter%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93&spm=1018.2226.3001.4187](https://blog.csdn.net/qq_32706349/article/details/97539270?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522164955943716782094879408%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=164955943716782094879408&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~baidu_landing_v2~default-4-97539270.142%5Ev7%5Epc_search_result_control_group,157%5Ev4%5Econtrol&utm_term=jmeter%E8%BF%9E%E6%8E%A5%E6%95%B0%E6%8D%AE%E5%BA%93&spm=1018.2226.3001.4187 "jmeter测试数据库服务--JDBC Request_不进则退2020的博客-CSDN博客_jmeter连接数据库")

7、逻辑控制器
-------

### 1）如果（if）控制器

**作用：**用来控制它下面测试元素是否运行

**位置：**右击线程组 --> 添加 --> 逻辑控制器 --> 如果（if）控制器

**参数：**

![](https://img-blog.csdnimg.cn/1b6de3bf83504951943e335700b160f4.png)

![](https://img-blog.csdnimg.cn/0186f791144f4ae684f8c0d5a84a2bf9.png)

条件：

*   JS语法格式："${name}"=="itcast" #当name取值等于itcast
*   函数格式：${\_jexl3("${name}"=="itcast")}  #需要勾选下面的复选框

**案例：**![](https://img-blog.csdnimg.cn/cc092b42dd944dd0941c3dcb2fea4529.png)

![](https://img-blog.csdnimg.cn/95ceb1b5dd0b4121900e83ba8b996c24.png) 两个if控制器的条件如下：（其下对应的HTTP请求分别对应www.baidu.com和www.itcast.cn）

```
"${name}"=="baidu";
"${name}"=="itcast";
#如果勾选了复选框，则需使用函数格式：
${_jexl3("${name}"=="baidu")}
${_jexl3("${name}"=="itcast")}
```

### 2）循环控制器

**① 参数：**![](https://img-blog.csdnimg.cn/8d3c18bce6f24bb39e55299b690067f4.png)

**案例：循环访问百度10次**![](https://img-blog.csdnimg.cn/9f73fb6db9604f9bad8b1e69c5e4bfbf.png)

![](https://img-blog.csdnimg.cn/4fa64b1e975f438d97889f96c8d95c2c.png)

> **思考：线程组设置的循环次数和循环控制器循环次数有什么区别？**
> 
> 不同：
> 
> *   线程组设置的循环次数对线程组下所有HTTP请求都起作用
> *   循环控制器循环次数只对该控制器下的HTTP请求起作用
> 
> 当线程组循环次数为 M，循环控制器次数为N时：
> 
> *   循环控制器下的HTTP请求循环次数：M\*N次
> *   非循环控制器下的HTTP请求循环次数：M次

### 3）ForEach 控制器

**作用：**一般和**用户自定义变量或正则表达式提取器**一起使用，读取返回结果中一系列相关的变量

**参数：**![](https://img-blog.csdnimg.cn/5d9b76772a4d458e81de7ec166fccc62.png)

 **案例：**

1.   有一组关键字 \[hello,python,测试\]，使用用户定义的变量存储
2.   要依次取出关键字，并在百度搜索，例如：https://www.baidu.com/s?wd=hello

操作步骤：

![](https://img-blog.csdnimg.cn/b00a1b93f74c43768ac7bebee98acb8d.png)

![](https://img-blog.csdnimg.cn/b3f31e7cccec4adea7b77c690fdc6147.png)![](https://img-blog.csdnimg.cn/834031a7db874ff7a58b23f958e4b59a.png)

 **案例2：**![](https://img-blog.csdnimg.cn/85df254f1ad24697b2775c71bebae37e.png)

![](https://img-blog.csdnimg.cn/45be6da1aff943be9703269f5df4da7b.png)![](https://img-blog.csdnimg.cn/980babc9516d4704b5e2d75f75d80ba1.png)

![](https://img-blog.csdnimg.cn/19bcf4aefc5c4abf88f6b6caa1768faf.png)

![](https://img-blog.csdnimg.cn/64e092c2304641d4bcd5db82c5db6267.png)

8、定时器
-----

### 1）同步定时器

阻塞线程（累计一定的请求），在规定的时间内达到一定的线程数量，这些线程会在同一时间点一起释放，瞬间产生很大的压力。

**参数：**![](https://img-blog.csdnimg.cn/e905169f831a466b9c865eb6a9c0900f.png)

**案例1：模拟100个用户同时访问百度首页，统计各种高并发情况下运行情况**

**步骤：**

*   添加线程组
*   添加http请求
*   添加同步定时器（要设置时间且不能太小！）
*   添加查看结果树
*   添加监听器 --> 聚合报告

![](https://img-blog.csdnimg.cn/9212fecbc872450cb10a3394af667ecd.png)

![](https://img-blog.csdnimg.cn/8376ea47e59b4766bc2da0d9d4f08f89.png)

![](https://img-blog.csdnimg.cn/0f86798599be49aebbe5c3470e5c3281.png)

### 2）常数吞吐量定时器 constant throughput timer

稳定性测试时，需要模拟用户真实的业务场景。若真实业务场景QPS为20，如何精确模拟？

**作用：**让jmeter按指定的吞吐量（QPS）执行，以每分钟为单位。

**参数：**![](https://img-blog.csdnimg.cn/31ae51cd78b34b239b7e51d161495d8d.png)

![](https://img-blog.csdnimg.cn/a740a7e3223743ecb97ac135df7e728b.png)

**案例：服务器的QPS要求：20QPS (20 次/s)**

*   案例1 ：一个用户访问百度首页，持续一段时间，统计运行情况
*   案例2：两个用户访问百度首页，持续一段时间，统计运行情况。

![](https://img-blog.csdnimg.cn/ebeb432086db4502a9d169c85653604b.png)

![](https://img-blog.csdnimg.cn/7efe6ec682424f24b88c23d0ab0a474b.png)

![](https://img-blog.csdnimg.cn/a5823116f69c4b319e2a49c48decb50a.png)

![](https://img-blog.csdnimg.cn/17723a2282f449259eaa778b38a76c2b.png)

### 3）固定定时器\*\*\*最常用\*\*

**案例：IHRM系统登录错误3次后，锁定1分钟，1分钟后重新输入正确的用户名密码登录成功**

 **打开网页控制台，操作查看数据填写请求**

![](https://img-blog.csdnimg.cn/981cfd73de7040778a2d3473f86832fb.png)

 ![](https://img-blog.csdnimg.cn/7c6ba85ae4414466b66c1fdb2bd07ef2.png)

 配置http请求![](https://img-blog.csdnimg.cn/86f7beda4d994f61bcde10968481c993.png)

![](https://img-blog.csdnimg.cn/faf4c56dbfa14210bcf1435dffede669.png)

 在http请求4下面添加固定定时器，并配置等待时间![](https://img-blog.csdnimg.cn/f931385b1a564145852b347a4a9b9500.png)

执行后为什么出现下面结果呢？

请求的格式是json ，json 格式请求的请求头类型是application/json

![](https://img-blog.csdnimg.cn/53b737d07dd94e67be99e22e55139478.png)

![](https://img-blog.csdnimg.cn/4cca3308b2924ce68acda57d93b61631.png)

所以需要用**信息头管理器**修改头域

![](https://img-blog.csdnimg.cn/ed3233be14064b729fe22e46e9eebca2.png)

 成功！

![](https://img-blog.csdnimg.cn/7139db652eb64dcaa2a641347873fbe7.png)

![](https://img-blog.csdnimg.cn/4b3697e18ecf4b7aa0fe63e6c8ae1b19.png)

  

本文转自 [https://blog.csdn.net/Echo\_165/article/details/124033651](https://blog.csdn.net/Echo_165/article/details/124033651)，如有侵权，请联系删除。