# 系统引导
> 硬盘启动方式分为uefi, mbr, 以下探讨的是uefi启动方式

## 1. windows boot manager
## 1.1 ESP 分区
ESP 分区是 `windows` 安装过程中自动生成的分区，其中 `\EFI\Microsoft` 是 `windows boot manager` 存储位置.
`\EFI\Microsoft\Boot\bootmgfw.efi` 是 `windows boot manager` 的启动文件.

`\EFI\Microsoft\Boot\BCD` 文件是 `windows boot manager` 的配置文件.放置`windows boot loader` 的配置信息.
通过修改这个文件可以实现通过 `wba` 启动多个windows系统 实现双系统。
```shell
PS C:\Users\lookworld> bcdedit

Windows 启动管理器
--------------------
标识符                  {bootmgr}
device                  partition=\Device\HarddiskVolume2
path                    \EFI\Microsoft\Boot\bootmgfw.efi
description             Windows Boot Manager
locale                  zh-CN
inherit                 {globalsettings}
default                 {current}
resumeobject            {9db0fb46-acfe-11ee-aac6-836c1d538ad2}
displayorder            {4ec338ba-0933-11ef-b6e9-995076db1188}
                        {current}
toolsdisplayorder       {memdiag}
timeout                 30

Windows 启动加载器
-------------------
标识符                  {4ec338ba-0933-11ef-b6e9-995076db1188}
device                  partition=E:
path                    \Windows\system32\winload.efi
description             Windows 10
locale                  zh-cn
inherit                 {bootloadersettings}
isolatedcontext         Yes
allowedinmemorysettings 0x15000075
osdevice                partition=E:
systemroot              \Windows
resumeobject            {4ec338b9-0933-11ef-b6e9-995076db1188}
nx                      OptIn
bootmenupolicy          Standard

Windows 启动加载器
-------------------
标识符                  {current}
device                  partition=C:
path                    \Windows\system32\winload.efi
description             Windows 11
locale                  zh-CN
inherit                 {bootloadersettings}
recoverysequence        {9db0fb48-acfe-11ee-aac6-836c1d538ad2}
displaymessageoverride  Recovery
recoveryenabled         Yes
isolatedcontext         Yes
allowedinmemorysettings 0x15000075
osdevice                partition=C:
systemroot              \Windows
resumeobject            {9db0fb46-acfe-11ee-aac6-836c1d538ad2}
nx                      OptIn
bootmenupolicy          Standard
hypervisorlaunchtype    Off
PS C:\Users\lookworld>
```

## 1.2 系统盘
C盘

# 2. linux boot manager（grub）
## 2.1 ESP 分区
`\EFI\ubuntu\grub.cfg` 为引导配置文件，

## 2.2 系统盘
`/boot/grub/grub.cfg` 为最终结果文件 即 `sudo update-grub` 通过 
`/etc/default/grub`(配置文件) 与 `/etc/grub.d/*` 文件生成的结果文件。

需要修改的是 `/etc/grub.d/40_custom` 
```shell
#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.

# 添加自定义启动项
menuentry "Arch Linux" {
    set root='(hd0,gpt1)'
    linux /vmlinuz-linux
    initrd /initramfs-linux.img
}

menuentry "Arch Linux (lts)" {
    set root='(hd0,gpt1)'
    linux /vmlinuz-linux-lts
    initrd /initramfs-linux-lts.img
}

menuentry "Arch Linux (lts, fallback initramfs)" {
    set root='(hd0,gpt1)
    linux /vmlinuz-linux-lts
    initrd /intramfs-linux-lts-fallback.img
}
```

# 2.3 grub theme
`/boot/grub/themes/` 目录下存放着 `grub` 主题文件，

## 2.3.1 修改主题

[Grub2 theme reference](http://wiki.rosalab.ru/en/index.php/Grub2_theme_/_reference)

[Grub2 theme tutorial](http://wiki.rosalab.ru/en/index.php/Grub2_theme_tutorial)

`sudo ./install.sh`
