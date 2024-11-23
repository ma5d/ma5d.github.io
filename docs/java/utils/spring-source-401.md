---
sidebar_position: 3
---

# spring源码编译401问题

 

[](https://blog.csdn.net/tazuxianzai/article/details/118809722)问题
=================================================================

用gradlew install或者gradlew build下载spring源码依赖时，报not found与401错误。

[](https://blog.csdn.net/tazuxianzai/article/details/118809722)原因
=================================================================

**问题1：**  
not found 是使用的仓库里不存在该文件，比如说你要下gradle插件或者spring依赖，public仓库当然没有，你需要另外加上阿里云的gradle/spring仓库。

[–>去阿里云仓库官网](https://maven.aliyun.com/mvn/guide)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210716172050856.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3RhenV4aWFuemFp,size_16,color_FFFFFF,t_70#pic_center)  
你需要加上正确的阿里云仓库，幸运的是我们可以把所有的阿里云仓库地址都放进仓库地址。

**问题2：**  
401是权限不够，spring仓库部分文件现在需要登陆才能下载，所以报权限错误。

[](https://blog.csdn.net/tazuxianzai/article/details/118809722)两个问题的解决办法
========================================================================

把build.gradle里所有的仓库地址都换成阿里云仓库，记住可能有多处！！，除buildscript{}闭包内要改repositories{}外，configure(allprojects) {}闭包里的repositories{}仓库地址也要改。

```
repositories {
		//阿里云仓库全家桶
		maven{ url 'https://maven.aliyun.com/repository/central'}
		maven{ url 'https://maven.aliyun.com/repository/public' }
		maven{ url 'https://maven.aliyun.com/repository/google'}
		maven{ url 'https://maven.aliyun.com/repository/gradle-plugin'}
		maven{ url 'https://maven.aliyun.com/repository/spring'}
		maven{ url 'https://maven.aliyun.com/repository/spring-plugin'}
		maven{ url 'https://maven.aliyun.com/mvn/guide'}
		maven{ url 'https://maven.aliyun.com/repository/apache-snapshots'}
}

```

**温馨提示：**  
gradle不用自己下载，gradlew在运行时会自己下载适合的版本，下载的版本可以在spring-framework-4.2.x\\gradle\\wrapper\\gradle-wrapper.properties的下载地址配置中看到。

```
# gradle-wrapper.properties
# Thu Jul 09 16:54:55 EEST 2015
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
# 下载地址配置，可看到下载的gradle版本为2.5，复制该地址去除'https\://***'后的 '\'后也可以手动下载，不建议手动下载还要配置环境变量，麻烦
distributionUrl=https\://services.gradle.org/distributions/gradle-2.5-bin.zip

```

 

  

本文转自 [https://blog.csdn.net/tazuxianzai/article/details/118809722](https://blog.csdn.net/tazuxianzai/article/details/118809722)，如有侵权，请联系删除。