# flex

#### 参考自： 阮一峰——Flex布局教程：语法篇

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

设为 Flex 布局以后，子元素的`float`、`clear`和`vertical-align`属性将失效。

## 基本概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称"项目"。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

## 容器的属性

以下6个属性设置在容器上

> ​	flex-direction   — 决定主轴的排列方向
>
> ​	flex-wrap  — 项目在一条线上时决定是否换行，和如何换行
>
> ​	flex-flow  — 是flex-driection 和 flex-wrap的结合体，默认值为 row now rap
>
> ​	justify-content  —  决定主轴上的对齐方式
>
> ​	align-items  — 决定交叉轴也就是Y轴上的对齐方式
>
> ​	align-content  — 决定交叉轴上多根轴线的对齐方式，如果只有一根轴线也就是一行，这个属性就不起作用

> ### flex-direction
>
> row(默认值): 主轴为水平方向，起点在左端
>
> row-reverse: 主轴为水平方向，起点在右端。和row相反，因为有一个reverse
>
> column: 主轴为垂直方向，起点在上端
>
> column-reverse: 和column的主轴方向相同，起点相反在下端，同样是因为reverse

> ### flex-wrap
>
> nowrap(默认值): 不换行
>
> wrap: 换行，第一行在上方
>
> wrap-reverse: 换行，第一行在下方和wrap相反， -reverse

> ### flex-flow
>
> flex-flow: <flex-derection> || <flex-wrap>

> ### justify-content
>
> flex-start(默认值): 左对齐
>
> flex-end: 右对齐
>
> center: 居中
>
> space-between: 两端对齐，项目之间的间隔都相等。项目两段贴合左右两边
>
> space-around: 每个项目两侧的间隔相等。所以项目之间的间隔比项目与边框的间隔大一倍

> ### align-items
>
> flex-start: 交叉轴（Y轴）的起点对齐
>
> flex-end: Y轴的终点对齐
>
> center: Y轴中间点对齐
>
> baseline: 项目的第一行文字的极限对齐
>
> stretch（默认值）：如果项目未设置高度或者高度为auto，默认沾满整个容器的高度

> ### align-content （注意如果项目只有一根轴线改属性不生效，类似于Y轴版的justify-content）
>
> flex-start: Y轴起点对齐
>
> flex-end: Y轴终点对齐
>
> center：Y轴中间点对齐
>
> space-between：Y轴两端对齐，中间间隔平分
>
> space-around：没跟轴线两侧间隔都相等
>
> stretch（默认值）：轴线沾满整个交叉轴

以下6个属性设置在项目上

>order：<integer> 定义项目的排列顺序，越小越往前，越大越往后，默认为0
>
>flex-grow：<number> 定义项目按比例放大，默认为0。为0的话即使有剩余空间也不会放大。如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。
>
>flex-shrink：<number> 定义项目按比例缩小，默认为1，如果空间不足这个项目会缩小。如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。
>
>负值对该属性无效。
>
>flex-basis：<length> | auto 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。它可以设为跟`width`或`height`属性一样的值（比如350px），则项目将占据固定空间。
>
>flex：none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ] 属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。
>
>align-self：auto | flex-start | flex-end | center | baseline | stretch   `align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

### 最后再写个demo吧，仿写一下京东的移动端首页

GitHub: 