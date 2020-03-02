# webpack

---

#### webpack 优化

---

##### spa-webpack

-----开发阶段-----

1. 开启多核压缩，<font size=2>文件少的时候开启多核压缩是浪费，反而会更慢</font>

   - uglifyjs-webpack-plugin （不支持ES6,需要webpack4以上手动设置 --mode development）
   - terser-webpack-plugin （支持ES6）
   - webpack-parallel-uglify-plugin (老)

2. 监控面板

   - speed-measure-webpack-plugin (必备)

3. 开启通知面板

   - webpack-build-notifier (此插件跟系统有关)

4. 开启打包进度

   - progress-bar-webpack-plugin

5. 优化打包面板,让开发面板更清晰

   - webpack-dashboard (不太好用)

   - ```
     "script": {
     	"dev": "webpack-dashboard -- webpack --mode development",
     }
     ```

6. iTerm 修改标题

   - Node-bash-title

-----上线阶段-----

1. es6不需要编译

   - cdn.polyfill.io

2. 前端缓存负载

   - webpack-manifest-plugin (性能优化)

3. 真正的loading

   ```javascript
   const loading = {
       html: '加载中...'
   }
   new HtmlWebpackPlugin({
       ilename: "index.html",
      	template: "src/index.html",
       oading
    }),
   ```

4. 单页的问题——多页转单页 webapp 性能，直出，请求的数量， runtime
5. 分析打包结果
   - 监控文件大小 CI & CD
   - bundlesize



















































