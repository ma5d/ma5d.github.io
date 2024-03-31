---
sidebar_position: 4
---

# Javadoc （Java API 文档生成器）详解

[Java] 支持 3 种注释，分别是单行注释、多行注释和文档注释。文档注释以/\*\*开头，并以\*/结束，可以通过 Javadoc 生成 API 帮助文档，Java 帮助文档主要用来说明类、接口、方法、成员变量、构造器和内部类。

Javadoc 是 Sun 公司提供的一种工具，它只处理文档源文件在类、接口、方法、成员变量、构造器和内部类之前的注释，忽略其他地方的文档注释，然后形成一个和源代码配套的 API 帮助文档。也就是说，只要在编写程序时在文档注释中以一套特定的标签注释，在程序编写完成后，通过 Javadoc 就形成了程序的 API 帮助文档。

API 帮助文档相当于产品说明书，而说明书只需要介绍那些供用户使用的部分，所以 Javadoc 默认只提取 public、protected 修饰的部分。如果要提取 private 修饰的部分，需要使用 -private。  

  

**javadoc标签**
-------------

Javadoc 工具可以识别文档注释中的一些特殊标签，这些标签一般以@开头，后跟一个指定的名字，有的也以{@开头，以}结束。**这些 doc 标签使您能够从源代码自动生成完整的、格式良好的 API。标签以@开头，并且区分大小写——它们必须使用大写和小写字母输入。标签必须在行首开始，否则将被视为普通文本。按照惯例，具有相同名称的标签被组合在一起。例如，将所有 @see标签放在一起。**

对两种标签格式的说明：

*   @tag 格式的标签（不被{ }包围的标签）为块标签，只能在主要描述（类注释中对该类的详细说明为主要描述）后面的标签部分（如果块标签放在主要描述的前面，则生成 API 帮助文档时会检测不到主要描述）。
*   {@tag} 格式的标签（由{ }包围的标签）为内联标签，可以放在主要描述中的任何位置或块标签的注释中。

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>标签</td><td>描述</td><td>示例</td></tr><tr><td>@author</td><td>标识一个类的作者，一般用于类注释</td><td>@author description</td></tr><tr><td>@deprecated</td><td>指名一个过期的类或成员，表明该类或方法不建议使用</td><td>@deprecated description</td></tr><tr><td>{@docRoot}</td><td>指明当前文档根目录的路径</td><td>Directory Path</td></tr><tr><td>@exception</td><td>可能抛出异常的说明，一般用于方法注释</td><td>@exception exception-name explanation</td></tr><tr><td>{@inheritDoc}</td><td>从直接父类继承的注释</td><td>Inherits a comment from the immediate surperclass.</td></tr><tr><td>{@link}</td><td>插入一个到另一个主题的链接</td><td>{@link name text}</td></tr><tr><td>{@linkplain}</td><td>插入一个到另一个主题的链接，但是该链接显示纯文本字体</td><td>Inserts an in-line link to another topic.</td></tr><tr><td>@param</td><td>说明一个方法的参数，一般用于方法注释</td><td>@param parameter-name explanation</td></tr><tr><td>@return</td><td>说明返回值类型，一般用于方法注释，不能出现再构造方法中</td><td>@return explanation</td></tr><tr><td>@see</td><td>指定一个到另一个主题的链接</td><td>@see anchor</td></tr><tr><td>@serial</td><td>说明一个序列化属性</td><td>@serial description</td></tr><tr><td>@serialData</td><td>说明通过 writeObject() 和 writeExternal() 方法写的数据</td><td>@serialData description</td></tr><tr><td>@serialField</td><td>说明一个 ObjectStreamField 组件</td><td>@serialField name type description</td></tr><tr><td>@since</td><td>说明从哪个版本起开始有了这个函数</td><td>@since release</td></tr><tr><td>@throws</td><td>和 @exception 标签一样.</td><td>The @throws tag has the same meaning as the @exception tag.</td></tr><tr><td>{@value}</td><td>显示常量的值，该常量必须是 static 属性。</td><td>Displays the value of a constant, which must be a static field.</td></tr><tr><td>@version</td><td>指定类的版本，一般用于类注释</td><td>@version info</td></tr></tbody></table>

**javadoc命令**
-------------

javadoc 命令语法格式如下：

```
javadoc [options] [packagenames] [sourcefilenames] [-subpackages pkg1:pkg2:...] [@argfiles]
```

对格式的说明：

*   options 表示 Javadoc 命令的选项。
*   packagenames 表示包名。
*   sourcefiles 表示源文件名。
*   \-subpackages pkg1:pkg2:…：从指定包中的源文件并在其子包中递归生成文档。
*   @argfiles：一个或多个文件，其中包含以任何顺序排列的 Javadoc 选项、包名和源文件名列表。

在 cmd（命令提示符）中输入

javadoc -help就可以看到 Javadoc 的用法和选项，下面列举 Javadoc 命令的常用选项：

<table data-draft-node="block" data-draft-type="table" data-size="normal" data-row-style="normal"><tbody><tr><td>名称</td><td>说明</td></tr><tr><td>-public</td><td>仅显示 public 类和成员</td></tr><tr><td>-protected</td><td>显示 protected/public 类和成员（默认值）</td></tr><tr><td>-package</td><td>显示 package/protected/public 类和成员</td></tr><tr><td>-private</td><td>显示所有类和成员</td></tr><tr><td>-d</td><td>输出文件的目标目录</td></tr><tr><td>-version</td><td>包含 @version 段</td></tr><tr><td>-author</td><td>包含 @author 段</td></tr><tr><td>-splitindex</td><td>将索引分为每个字母对应一个文件</td></tr><tr><td>-windowtitle</td><td>文档的浏览器窗口标题</td></tr></tbody></table>

使用javadoc DOS命令生成API文档
----------------------

### 首先新建一个名java类，输入以下代码:

```
/**
 * @author Penguin
 * @version jdk1.8.0
 */
public class javadoc {
    /**
     * 求输入两个参数范围以内整数的和
     * @param n 接收的第一个参数，范围起点
     * @param m 接收的第二个参数，范围终点
     * @return 两个参数范围以内整数的和
     */
    public int add(int n, int m) {
        int sum = 0;
        for (int i = n; i <= m; i++) {
            sum = sum + i;
        }
        return sum;
    }
}
```

### 在cmd窗口找到代码目录，输入命令:

*   javadoc -author -version Test.java命令，此命令没有考虑编码格式问题，注释中有汉字可能会乱码。

![](https://pic3.zhimg.com/v2-33e89ab1e34845a92fa07694bc1f994a_r.jpg)

### javadoc -encoding UTF-8 -charset UTF-8 Test.java会解决编码问题

![](https://pic4.zhimg.com/v2-a1f82ea4b33658d738fccc62d2e418bb_r.jpg)

### 代码所在的目录中将会生成.html文档文件，打开如下图所示：

![](https://pic4.zhimg.com/v2-de73a099ca2bf356ee021633aa152ce7_r.jpg)

![](https://pic1.zhimg.com/v2-8ad5b5764f804ac7995fb016ea7cd750_r.jpg)

  

本文转自 [https://zhuanlan.zhihu.com/p/599276419](https://zhuanlan.zhihu.com/p/599276419)，如有侵权，请联系删除。