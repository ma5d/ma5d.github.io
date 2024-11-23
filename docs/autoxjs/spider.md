---
sidebar_position: 2
---

# 朋友圈爬虫实现

### 需求出现
1. 我需要租房子，中介都在朋友圈发房子信息，贝壳是有的，但是不多，大部分还是本地中介多。
2. 微信自带的朋友圈搜索不满足个性化的搜索需求

![spider](https://www.minio.lookworld.com/001/spider/%E5%8A%A8%E7%94%BB.gif)

```python

for(let index = 1; index < 10; index++) {
    while(id("hg4").findOnce(index) == null){
        swipe(250, 3000, 250, 600, 1000)
        sleep(2000)
        index = 1;
    }
    let card = id("hg4").findOnce(index).parent().parent().children();
    // console.log(card);
    if(card[1].children().size() <= 0){
        continue;
    };

    let personName = card[0].children()[0].text()
    let detail = card[1].children()[0].desc() == null ? card[1].children()[0].text() : card[1].children()[0].desc();
    console.log(personName + ":" + detail)
}

```


### 打印在控制台，等后续处理