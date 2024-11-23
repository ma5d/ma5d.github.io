---
sidebar_position: 1
---

# IDEA leetcode插件代码模板

 

### [](https://blog.csdn.net/withwindluo/article/details/114958536)1.创建一个项目

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210318003954431.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpdGh3aW5kbHVv,size_16,color_FFFFFF,t_70#pic_center)

### [](https://blog.csdn.net/withwindluo/article/details/114958536)2.配置leetcode插件的参数

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210318004236177.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpdGh3aW5kbHVv,size_16,color_FFFFFF,t_70)  
`CodeFileName`:

```
T${question.frontendQuestionId}_$!velocityTool.camelCaseName(${question.titleSlug})

```

`CodeTemplate`:

```
package leetcode.editor.cn;

${question.content}

public class T${question.frontendQuestionId}_$!velocityTool.camelCaseName(${question.titleSlug}){
    public static void main(String[] args) {
        System.out.println(new Solution());
        
    }
static
${question.code}
}
```

`TemplateConstant`:

```
${question.title}	题目标题	示例:两数之和
${question.titleSlug}	题目标记	示例:two-sum
${question.frontendQuestionId}	题目编号
${question.content}	题目描述
${question.code}	题目代码
$!velocityTool.camelCaseName(str)	转换字符为驼峰样式
$!velocityTool.snakeCaseName(str)	转换字符为蛇形样式
$!velocityTool.leftPadZeros(str,n)	pad sting with zero make str length at least n.
$!velocityTool.date()	获取当前时间

```

### [](https://blog.csdn.net/withwindluo/article/details/114958536)3.效果

![在这里插入图片描述](https://img-blog.csdnimg.cn/20210318004605456.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dpdGh3aW5kbHVv,size_16,color_FFFFFF,t_70)

 

  

本文转自 [https://blog.csdn.net/withwindluo/article/details/114958536](https://blog.csdn.net/withwindluo/article/details/114958536)，如有侵权，请联系删除。