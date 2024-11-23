---
sidebar_position: 1
---

# 路由器基本组成

一、路由里首先需要了解的是CPU、Flash和内存(RAM)，他们分别类似对应电脑的CPU、硬盘和内存。

二、Flash中存储的内容大致可以分为三部分，分别是bootloader、固件和EEPROM。

三、bootloader：类似电脑中的BIOS功能，当路由开机启动时首先运行的就是bootloader，由它分配内存地址，并将固件加载到内存中运行，bootloader有很多种，uboot和breed都属于bootloader。

四、固件：类似于电脑的系统，和电脑系统一样，固件也分许多种，openwrt、dd等等都是固件。厂商的许多固件也可能包含bootloader，如果包含，在刷机时就会覆盖掉原来的bootloader，除非在bootloader下刷机，例如在breed下刷机，breed就会忽略掉固件包含的bootloader。

五、EEPROM：路由信号校验数据，每个路由唯一，各路由间不通用，非常重要，一旦丢失，影响路由无线信号质量，其中Atheros的ART就属于EEPROM的一种，貌似Atheros同种芯片的ART可以通用。

六、编程器：整个路由器之外的东西，当路由器刷坏变砖的时候，用来烧录路由器的Flash，说白了就是用来重新往路由器中写入bootloader、固件和EEPROM的硬件设备。

七、编程器固件：我个人的理解就是包含bootloader、固件和EEPROM的固件，一般是利用编程器往Flash烧录时使用。

八、GPIO：可以理解为bootloader或者固件识别的路由器按键代号，路由器一般只有reset按键和wps按键，有的是分开的，有的是二合一的。如果设置错误，会导致按键在bootloader中或者固件中不起作用，或者说按键达不到预期的功能。例如：如果你的路由器的reset按键的GPIO值在breed中为2，你却刷入了breed-mt7620-reset1.bin这个breed，那么你的路由器想要通过reset按键方式就可能进入不了breed，必须重新刷入正确的breed（breed-mt7620-reset2.bin）才可以。