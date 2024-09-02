# 构建工具

## maven 换源

```shell
ls /etc/maven/settings.xml
```

```xml
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
```

```shell
mvn dependency:go-offline
```


```json
"java.configuration.maven.userSettings": "/etc/maven/settings.xml"
```






