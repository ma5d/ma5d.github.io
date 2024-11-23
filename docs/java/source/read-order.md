---
sidebar_position: 1
---

# 源码阅读顺序

api sdk 
[Java Platform SE 8 ](https://www.apiref.com/zh/java8/index.html)

很多java开发的小伙伴都会阅读jdk源码，然而确不知道应该从哪读起。 以下为小编整理的通常所需阅读的源码范围。 标题为包名，后面序号为优先级1-4，优先级递减

### 1、java.lang

```
 Object 1
 String 1
 AbstractStringBuilder 1
 StringBuffer 1
 StringBuilder 1
 Boolean 2
 Byte 2
 Double 2
 Float 2
 Integer 2
 Long 2
 Short 2
 Thread 2
 ThreadLocal 2
 Enum 3
 Throwable 3
 Error 3
 Exception 3
 Class 4
 ClassLoader 4
 Compiler 4
 System 4
 Package 4
 Void 4

```

### 2、java.util

```
 AbstractList 1
 AbstractMap 1
 AbstractSet 1
 ArrayList 1
 LinkedList 1
 HashMap 1
 Hashtable 1
 HashSet 1
 LinkedHashMap 1
 LinkedHashSet 1
 TreeMap 1
 TreeSet 1
 Vector 2
 Queue 2
 Stack 2
 SortedMap 2
 SortedSet 2
 Collections 3
 Arrays 3
 Comparator 3
 Iterator 3
 Base64 4
 Date 4
 EventListener 4
 Random 4
 SubList 4
 Timer 4
 UUID 4
 WeakHashMap 4

```

### 3、java.util.concurrent

```
 ConcurrentHashMap 1
 Executor 2
 AbstractExecutorService 2
 ExecutorService 2
 ThreadPoolExecutor 2
 BlockingQueue 2
 AbstractQueuedSynchronizer 2
 CountDownLatch 2
 FutureTask 2
 Semaphore 2
 CyclicBarrier 2
 CopyOnWriteArrayList 3
 SynchronousQueue 3
 BlockingDeque 3
 Callable 4

```

### 4、java.util.concurrent.atomic

```
 AtomicBoolean 2
 AtomicInteger 2
 AtomicLong 2
 AtomicReference 3

```

### 5、java.lang.reflect

```
 Field 2
 Method 2

```

### 6、java.lang.annotation

```
 Annotation 3
 Target 3
 Inherited 3
 Retention 3
 Documented 4
 ElementType 4
 Native 4
 Repeatable 4

```

### 7、java.util.concurrent.locks

```
 Lock 2
 Condition 2
 ReentrantLock 2
 ReentrantReadWriteLock 2

```

### 8、java.io

```
 File 3
 InputStream   3
 OutputStream  3
 Reader  4
 Writer  4

```

### 9、java.nio

```
 Buffer 3
 ByteBuffer 4
 CharBuffer 4
 DoubleBuffer 4
 FloatBuffer 4
 IntBuffer 4
 LongBuffer 4
 ShortBuffer 4

```

### 10、java.sql

```
 Connection 3
 Driver 3
 DriverManager 3
 JDBCType 3
 ResultSet 4
 Statement 4

```

### 11、java.net

```
 Socket 3
 ServerSocket 3
 URI 4
 URL 4
 URLEncoder 4

```

  

本文转自 [https://juejin.cn/post/6844904007639498766](https://juejin.cn/post/6844904007639498766)，如有侵权，请联系删除。