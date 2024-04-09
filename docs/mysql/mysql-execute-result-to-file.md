# MySQL 将执行结果保存到文件

## 1. 使用mysql的`tee`命令记录对`mysql`的操作过程

(1)第一种情况是在连接数据库的时候使用tee
```sh
\>mysql  -u root  -p  --tee=C:/log.txt          //注意这里路径不需要加上引号
```
这时我们对数据库的所有操作都会记录在log.txt上；

(2) 第二种方式是在连接上数据库后使用
```sh
mysql>  use  mydb ;
mysql >  tee  C:/log.txt         //这个命令后面的操作都会记录在log中
mysql>  select * from my_table ;
mysql >  notee;                 //关闭记录功能
```
## 2. 将结果导出到文件分析

(1) 直接使用控制台的重定向功能。

```sh
mysql -u root -p -e "use mysql; show tables;" > C:/log.txt
```

(2)   使用tee命令；

```sh
mysql >  tee  C:/log.txt;
mysql >  use  mydb;
mysql >  show tables;
mysql >  notee;         //关闭记录功能
```

(3)  有时候还可以使用select * from tableName into outfile 'fineNane'；

## 3. 执行外部文件中的sql语句

方法一使用cmd命令执行(windows下，unix或linux在的其控制台下)

【Mysql的bin目录】/mysql –u用户名 –p密码 –D数据库

D:/mysql/bin/mysql –uroot –p123456 -Dtest

注意：

A、如果在sql脚本文件中使用了use 数据库，则-D数据库选项可以忽略

B、如果【Mysql的bin目录】中包含空格，则需要使用“”包含，如：“C:/Program Files/mysql/bin/mysql” –u用户名 –p密码 –D数据库

**方法二进入mysql的控制台后，使用source命令执行。**

Mysql>source 【sql脚本文件的路径全名】 或 Mysql>/. 【sql脚本文件的路径全名】

示例：source d:/test/ss.sql 或者 /. d:/test/ss.sql

  

本文转自 [https://www.cnblogs.com/yeyuzhuanjia/p/15611906.html](https://www.cnblogs.com/yeyuzhuanjia/p/15611906.html)，如有侵权，请联系删除。