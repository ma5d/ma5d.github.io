# win 11 右键返回 win10

## 1. 执行
弹出黑窗口，并把下面的语句复制进去：
```shell
reg add "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /f /ve
```

![](https://pic1.zhimg.com/v2-3b3fbffb3b671a7dea3c17f87b1be034_r.jpg)

## 2. 重启
在任务管理器中，重启一下“Windows资源管理器”。

![](https://pic3.zhimg.com/v2-e423e9e4e6077cd33ac942e6e3b0b6fa_r.jpg)

## 3. 恢复
如果想要恢复Win11的右键菜单，按照上面的步骤，执行下面的语句即可：
```shell
reg delete "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32" /va /f
```


本文转自 [https://zhuanlan.zhihu.com/p/524603591](https://zhuanlan.zhihu.com/p/524603591)，如有侵权，请联系删除。