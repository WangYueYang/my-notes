## webpack配置

### 基本配置

``` javascript
const path = require('path')

module.export = { // 导出webpack模块
  mode: 'production', // "production" | "development" | "none" webpack 模式，选择生产模式或开发模式，可以从 CLI参数中传递： webpack --mode=production
  entry: './dist/main.js', // 入口
  output: { // 出口
    path: path.resolve(__dirname, 'dist'), // 出口路径
    filename: '[name].[hash:5].js', // 用于输出的文件名， [entry chunk]的文件名模板
    publicPath: './assets/', // 静态资源路径
    library: 'MYLibrary', // 导出库的名称
    libraryTarget: 'umd', // 通用模块定义， 导出库的类型
  },
  module: { // webpack模块
    rules: [  // 模块规则
      {
        test: /\.jsx?$/, // 正则匹配
        include: [	// string | [] Rule匹配条件之一，Rule.resource.include的简写，提供了Rule.include选项就不能再使用Rule.resource。具体查看Rule条件
          path.resolve(__dirname, 'app')
        ],
        exclude: [ // string | [] 排除特定条件，不匹配 exclude的内容
          path.resolve(__dirname, './node_modules')
        ],
        issuer: { test, include, exclude }, // Rule.issuer 后面再具体了解
        // Rule.enforce 值为：'pre' | 'post'， 指定loader种类
        enforce: 'pre',
        enforce: 'post',
        loader: 'babel-loader', // webpack loader
        options: { // loader的选项,这一块在loader中具体了解
          presets: ['es2015']
        }
      },
      {
        test: /\.html$/,
        use: [	// 应用多个loader
          'htmllint-loader',
          {
            loader: 'html-loader',
            options: { /* ... */ }
          }
        ]
      },
      { oneOf: [ /* rules*/ ] }, // 只使用这些嵌套规则之一
      { // 使用所有这些嵌套规则，合并可用条件
      	rules: []
      },
      { // 仅当所有条件都匹配时才匹配
        resource: {
          and: []
        }
      },
      // 任意条件匹配时匹配， resource参数默认为数组
      { 
        resource: {
          or: []
        }
      },
      {
        resource: []
      },
      { // 条件不匹配时匹配
        resoruce: {
          not: '' /* 条件 */
        }
      }
    ],
  },
  resolve: { // webpack 解析，不适用于对loader解析
    
    modules: [ // 告诉webpack解析模块时应该搜索的目录，绝对路径和相对路径都能使用，但是他们之间有一点差异。具体查看resolve.modules
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.js', '.jsx', '.tsx'], // 使用文件拓展名， import的时候就可以不用加拓展名了。
    alias: { // 模块别名, 'comp' --> 'src /components' 
      comp: path.resolve(__dirname, 'src/components')
    }
  },
  
  performance: { // webpack 性能,后面深入了解
    hints: 'warning', // performance.hints 参数：false | 'error' | 'warning', 打开/关闭提示，此外，当找到提示时，告诉webpack跑出一个错误或警告，此属性默认设置为'warning'
    maxAssetSize: 200000, // 整数类型,
    maxEntrypointSize: 400000,
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWidth('.css') || assetFilename.endsWith('.js')
    }
  },
  // 通过在浏览器调试工具中添加元信息（meta info）增强调试，牺牲了构建速度的'source-map' 是最详细的, 说白了就是调试用的
  devtool: 'source-map',
  context: __dirname, // string（绝对路径）基础目录，用于从配置中解析入口起点和loader
  target: 'web', // 告知webpack为目标制定一个运行环境。
  externals: ['react', /^@angular\//], // webpack外部扩展部分，不打包这些东西，而是在运行时从外部请求这些依赖
  stats: 'errors-only', // webpack 统计信息
  
  devServer: { // webpack developmentServer
    proxy: {
      '/api': 'http://localhost:3000', // 代理
    },
    contentBase: path.join(__dirname, 'dist'), //告诉服务器从哪里提供内容，只有在你想要提供静态文件时才需要
    compress: true, // 一切服务都启用gzip压缩
    historyApiFallBack: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过传入以下启用：
    hot: true, // 启用webpack模块热更新
    https: false, // 默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务
    noInfo: true, // 启用后那些现实的webpack包信息将被隐藏
    // ...
  },
  
  plugins: [
    // ...
  ]
  
}

```

以上为 webpack 官网中的基本配置，后面会分模块进行具体了解。



