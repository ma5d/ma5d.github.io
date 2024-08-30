# map 排序

```java
// 分组top 20
pageAndCount.entrySet()
            .stream()
            .sorted(Comparator.comparingInt(Map.Entry::getValue).reversed())
            .limit(20)
            .collect(Collectors.toMap(
                Map.Entry::getKey, 
                Map.Entry::getValue, 
                (e1, e2) -> e1, 
                LinkedHashMap::new
            ));
```