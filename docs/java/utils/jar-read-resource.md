---
sidebar_position: 2
---

# SpringBoot打成jar运行后无法读取resources里的文件

### 方法一：使用绝对路径

### 方法二：使用反射（我猜）

```java
URL pathPrefix = Objects.requireNonNull(this.getClass().getResource("/static/"));
readFromInputStream(new URLReader(new URL(pathPrefix + jsonName + ".json")));

private String readFromInputStream(URLReader ur) throws IOException {
    StringBuilder resultStringBuilder = new StringBuilder();
    try (BufferedReader br = new BufferedReader(ur)) {
        String line;
        while ((line = br.readLine()) != null) {
            resultStringBuilder.append(line).append("\n");
        }
    }
    return resultStringBuilder.toString();
}
```

> 使用`URLReader`读文件
>
> 因为`this.getClass().getResource("/static/")`在idea运行的时候获取到的是/C:开头的文件路径；而在java -jar运行时则会出现file://开头的URL读本地文件的前缀。
>
> 为了统一及debug方便，则必须使用URLReader读取文件。