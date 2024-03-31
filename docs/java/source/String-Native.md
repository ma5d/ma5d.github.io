---
sidebar_position: 3
---

# String 常量池

网上对于intern方法的讨论很多是不对或者不严谨的，于是我参考了大量官方资料总结了该知识点，希望可以讲清楚。这个面试考点主要考察JVM的内存模型、对String类理解的深度以及字符串常量池的了解。

一.字符串常量池介绍
----------

在JAVA语言中有8种基本类型和一种比较特殊的类型String，其实String是引用类型，把它们归为一类是因为这些类型在运行过程中为了速度更快，更节省内存，都提供了一种常量池的概念。常量池就类似一个JAVA系统级别提供的缓存。8种基本类型的常量池都是系统协调的，String类型的常量池(String类对应的叫作字符串常量池)比较特殊。jdk6中字符串常量池在永久代，从jdk7开始放到了堆空间中(是堆中又划分了一块区域，注意这个细节!)。

它的主要使用方法（或者说如何保证变量指向的是字符串常量池中的数据）有两种：

1.直接使用双引号声明出来的String对象会直接存储在常量池中。

`String s = "abc";`

2.如果不是用双引号声明的String对象，可以使用String提供的intern方法，这个下面会解释，先记住以下结论。

字符串常量池存的东西有两种情况：

1.字符串对象，比如上面的“abc”

2.堆对象的引用。

二.intern方法介绍
------------

前置知识：

1.字符串拼接的时候只要其中有一个是变量(非final修饰)，拼接出来的对象就在堆中，相当于在堆空间中new String("XXX")（不是在字符串常量池中）。变量拼接的原理是StringBuilder调用append方法然后再调用toString方法。

2.new String("ab")会创建几个对象？

两个对象，一个是在堆空间中，一个在字符串常量池中（字节码指令ldc）。有兴趣的小伙伴可以去看编译后的字节码文件。

3.new String("a")+new String("b")呢？

六个对象。有兴趣的小伙伴可以去看编译后的字节码文件。 通过看字节码文件可知：

![](https://pic1.zhimg.com/v2-00c04cfb9d5783d6c16a75e40bb52d60_r.jpg)

  

参考自官方文档：在jdk8中，intern方法的作用是如果字符串常量池已经包含一个等于(通过equals方法比较)此String对象的字符串，则返回字符串常量池中这个字符串的引用, 否则将当前String对象的引用地址（堆中对象的引用地址）添加（或者叫复制）到字符串常量池中并返回，这么做是为了节约堆空间，毕竟都在堆中。

例如： `String s = new String("s").intern();`

解读该行代码：new String("s")代表创建了两个对象，一个是在堆空间中，一个在字符串常量池中。new String("s").intern()则代表返回字符串常量池中的那个对象的引用赋给s变量。

三.面试题解析
-------

面试题如下，判断输出是true还是false。这里直接附上解析了，后面还有练习题。

```
String s = new String("1");
s.intern();//调用此方法之前，字符串常量池中已经存在了“1”
String s2 = "1";
System.out.println(s == s2);//jdk6:false jdk7/8:false

String s3 = new String("1") + new String("1");//s3变量记录的地址为：new String("11")，堆中。
//执行完上一行代码以后，字符串常量池中，不存在“11”！！！
s3.intern();//在字符串常量池中生成“11”。jdk6中，永久代中创建了一个新的对象“11”，也就有了新的地址。
                                   //jdk7/jdk8中，此时常量中并没有创建“11”，而是添加一个指向堆空间中new String("11")的地址  
String s4 = "11";//s4变量记录的地址：使用的是上一行代码执行时，在字符串常量池中生成的“11”的地址
System.out.println(s3 == s4);//jdk6:false jdk7/8:true
```

示意图：

![](https://pic3.zhimg.com/v2-62bbf5d922d66df0fa1113a5e1eea892_r.jpg)

  

四.String的intern方法总结  

----------------------

![](https://pic3.zhimg.com/v2-dc134981965e3023fc2f9fd20e892672_r.jpg)

五.巩固练习
------

1.

```
String s = new String("a") + new String("b");//new String("ab")
String s2 = s.intern();//jdk6中，在串池中创建一个字符串“ab”
                       //jdk7/8中，串池中没有创建字符串“ab”，而是创建一个引用，指向new String("ab")
System.out.println(s2=="ab");//jdk6:true  jdk8:true
System.out.println(s=="ab");//jdk6:false  jdk8:true
```

2.

```
String s1 = new String("ab");//会在字符串常量池中生成"ab"
s1.intern();
String s2 = "ab";
System.out.println(s1 == s2);//jdk8:false
```

  

  

参考资料：

B站《尚硅谷JVM教程》

美团技术：[https://tech.meituan.com/2014/03/06/in-depth-understanding-string-intern.html](https://link.zhihu.com/?target=https%3A//tech.meituan.com/2014/03/06/in-depth-understanding-string-intern.html)

  

本文转自 [https://zhuanlan.zhihu.com/p/340762000](https://zhuanlan.zhihu.com/p/340762000)，如有侵权，请联系删除。