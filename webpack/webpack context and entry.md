## webpack context and entry

### context (webpack 上下文)

----

#### 什么是context？

context是webpack entry的上下文，他是入口文件所处目录的绝对路径，默认情况下是当前项目的根目录。

![image-20200303204653657](/Users/wyy/Documents/wyy/study/markdown/webpack/image-20200303204653657.png)

以my-blog的项目目录来举例，context的默认值就是my-blog的根目录。

#### 如何使用？

context的参数类型是string类型，传递的值为一个绝对路径，用于从配置中解析entry和loader，可以让我们的配置独立于当前的执行路径。

举个例子：

![](/Users/wyy/Documents/wyy/study/markdown/webpack/image-20200303203810934.png)

设置好context后我们的entry便会根据context设置的路径相应的找到index.tsx入口了。

在html-webpack-plugin中，模板文件的路径也是相对于context的，比如：

``` javascript
new HtmlWebpackPlugin({
  title: 'context for templage',
  template: './index.html'
})
// webpack会在path.resolve(context, './index.html')中查找index.html模板文件
```



### entry（入口）

----

#### 什么是entry？

entry是应用程序的起点入口，他可以有单个或多个入口，一般来说SPA：一个入口，MPA：多个入口。

entry的设置规则分为以下几种：

``` javascript
entry: './index.js'
entry: ['./index.js']
entry: {
  index: './index.js'
}
entry: {
  index: ['./index.js']
}
```

entry的命名规则：

当entry的值为string或array时，chunk会被命名为main，也就是说打包后的文件名会为main，如果entry的值为obj，那么每个key就是chunk的名称。

#### 动态入口

``` javascript
entry: () => './index.js'
```







