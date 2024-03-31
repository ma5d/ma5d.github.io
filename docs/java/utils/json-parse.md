---
sidebar_position: 5
---

# 解析JSON以及时间处理

[TOC]


# 1. Jackson:
   Jackson 是另一个流行的 JSON 解析库，它在 Java 中提供了 JSON 数据的序列化和反序列化功能。

   你可以使用 `ObjectMapper` 类来解析 JSON 字符串为 Java 对象：
   
   ```java
   import com.fasterxml.jackson.databind.ObjectMapper;

   ObjectMapper objectMapper = new ObjectMapper();
   MyObject myObject = objectMapper.readValue(jsonString, MyObject.class);
   ```

# 2. Gson:
   除了解析 JSON 字符串为基本对象外，Gson 也支持解析 JSON 数组为 `List` 或者解析为泛型对象。

   ```java
   import com.google.gson.Gson;
   import com.google.gson.reflect.TypeToken;

   Gson gson = new Gson();
   MyObject myObject = gson.fromJson(jsonString, MyObject.class);

   List<MyObject> myObjectList = gson.fromJson(jsonArrayString, new TypeToken<List<MyObject>>(){}.getType());
   ```

# 3. JSON-B (Java API for JSON Binding):
   这是 Java 官方提供的 JSON 绑定库，从 Java EE 8 开始被引入，用于处理 JSON 数据的绑定操作。

   ```java
   import javax.json.bind.Jsonb;
   import javax.json.bind.JsonbBuilder;

   Jsonb jsonb = JsonbBuilder.create();
   MyObject myObject = jsonb.fromJson(jsonString, MyObject.class);
   ```

请注意，在使用这些库之前，你需要确保你的项目中已经添加了相应的库依赖。每个库的用法都有一些差异，你可以根据自己的项目需求和偏好选择适合的库。

# 4.Demo

```java
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;

import java.time.Duration;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

class Test{
   public static void main(String[] args) {
      List<Map<String, String>> str = JSONObject.parseObject("[{\"past_key\": \"智能采购\", \"past_num\": \"4\"}, {past_key: \"智能\", past_num: \"2\"}]", new TypeReference<List<Map<String, String>>>(){});
      System.out.println("str = " + str);

      LocalTime[][] localTimes = JSONObject.parseObject("[[\"00:27\", \"00:31\"], [\"00:40\", \"00:50\"]]", LocalTime[][].class);
      System.out.println("[[\"00:27\", \"00:31\"], [\"00:40\", \"00:50\"]]");
      System.out.println("localTimes = " + Arrays.deepToString(localTimes));

      for (LocalTime[] localTime : localTimes) {
         long second = Duration.between(localTime[0], localTime[1]).toMinutes();
         System.out.println("second = " + second);
      }

   }
}
```
