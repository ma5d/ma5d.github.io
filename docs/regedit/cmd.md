---
sidebar_position: 1
---

# win10 添加右键 cmd（管理员）

 

注册表reg文件，将下面保存为ANSI编码 的 a.reg，双击执行

```
Windows Registry Editor Version 5.00
[HKEY_CLASSES_ROOT\Directory\Background\shell\runas]
@="在此处打开命令行窗口(管理员)"
"ShowBasedOnVelocityId"=dword:00639bc8

[HKEY_CLASSES_ROOT\Directory\Background\shell\runas\command]
@="cmd.exe /s /k pushd \"%V\""
```

### 无法导入reg:指定的文件不是注册脚本——兼了解文本格式问题  

问题：双击reg文件想导入注册表内容，提示“无法导入XX.reg:指定的文件不是注册脚本。您在注册表编辑器中只能导入二进位注册文件。”

网上能查到的一般如下：

对reg注册文件右键编辑 ，在开头加上 ，Windows Registry Editor Version 5.00，实际是“脚本的语法”有错；

还有就是文件的编码不对，用记事本打开文件，选择文件->另存为，将编码改成ANSI。
简单了解了一下，文本是用于Windows系统中的扩展名为.txt的文件。 Notepad（记事本）只支持四种格式：

- ANSI（注册表文件使用的格式，无格式定义）
- Unicode（字体字符集通用标准）
- Unicode big endian（Unicode BE）
- UFT-8（网页常用编码）

经过我测试主要的步骤如下：

1）必须包含头“Windows Registry Editor Version 5.00"
2）使用记事本打开后，保存为unicode格式。
3）如果卸载注册表键值，只在记事本中的\[HKEY\_CLASSES\_xxx\]的前面加“-”号即可。
\[HKEY\_CLASSES\_ROOT\\XXXActiveControl\]修改为
\[-HKEY\_CLASSES\_ROOT\\XXXActiveControl\]


本文转自 [https://blog.csdn.net/qq\_18453581/article/details/93848282](https://blog.csdn.net/qq_18453581/article/details/93848282)，如有侵权，请联系删除。