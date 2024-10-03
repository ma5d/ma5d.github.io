# jvm 与 mysql交互

## resultset.next()

实际上，ResultSet 的 next() 方法不会每调用一次就向 MySQL 发送一次请求。JVM 不会为每一行数据单独发起请求，而是依赖 JDBC 驱动 和数据库服务器进行批量传输和游标管理。具体工作机制如下：

初始化查询：当你执行查询时，JDBC 驱动会向 MySQL 发送一次 SQL 查询，数据库会在服务器端生成一个结果集并为该结果集创建一个游标。

数据分块读取：JDBC 驱动会一次性从 MySQL 服务器获取多个结果集中的数据行（即一个数据块），而不是每次调用 next() 都发起一次网络请求。具体分块的大小由 JDBC 驱动和数据库的设置决定，称为 Fetch Size。

客户端处理：JDBC 驱动将这个数据块加载到本地内存中，next() 逐行从本地内存中读取数据。只有当本地缓存的数据行消耗完时，才会发起下一次请求，继续从服务器获取更多的数据。

Fetch Size 设置
JDBC 提供了设置 Fetch Size 的方法，决定一次性从数据库拉取多少行数据。例如：

```java
Statement stmt = connection.createStatement();
stmt.setFetchSize(50);  // 一次从数据库获取 50 行数据
ResultSet rs = stmt.executeQuery("SELECT * FROM table");

while (rs.next()) {
    // 处理结果集中的每一行
}
```
通过设置 Fetch Size，你可以控制每次从数据库获取的行数，减少网络通信的频率。默认情况下，JDBC 驱动有一个默认的 Fetch Size，比如 MySQL 通常为 0，表示它会使用数据库端的默认行为（<mark>通常一次性获取所有数据</mark>）。

