---
sidebar_position: 2
---

# docker 存储已满

 如果docker 突然不能build ，之前都是好好的，而且还是报出以下错误。说明你的docker容器的存储满了。手动清理下即可。
`
failed to register layer: Error processing tar file(exit status 1): write /usr/lib/x86\_64-linux-gnu/libx265.so.192: no space left on device
`
解决方法 ：

``` bash
[root@centma ~]# docker system prune -a
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all images without at least one container associated to them
  - all build cache
```

出现以下界面说明清理成功。只要重新build 即可。哈哈哈希望给到帮助的伙伴点点关注。 

![](https://img-blog.csdnimg.cn/5b77ae6018434798a8e5493e1d37fe30.png)
本文转自 [https://blog.csdn.net/jdj992101/article/details/126826307](https://blog.csdn.net/jdj992101/article/details/126826307)，如有侵权，请联系删除。