## Jenkins

### 如何完成持续集成CI

- 代码要统一起来，放到同一个代码仓库里
- 构建代码，吧ES，TS转成JS，需要有一台独立的服务器，把所有代码集中构建，属于CPU密集型，服务器性能不能太差，他消耗CPU和内存
- 测试，测试环境和生产服务器的环境要一致，工具：Jest。必须生产一个报告，要大家都能看到，用来保证质量
- 通过测试后前端代码上传到生产服务器上去

### Jenkins 下载

https://www.jenkins.io/zh/download/

下载 LTS 版本，以 阿里云 centos为例，列表里选择 CentOS

https://pkg.jenkins.io/redhat-stable/

在这个链接里根据命令下载 Jenkins 和 Java JDK，

下载完成后执行

```
systemctl status jenkins
```

阿里云服务器要打开防火墙，然后访问 ip：8080 端口就可以进入到 Jenkins初始化页面了。

### Jenkins使用

解锁 Jenkins 在 Linux 的 Jenkins 下的 initialAdminPassword 有解锁密码

安装推荐插件

创建管理员用户，用户名密码要记住

进入系统管理 -> 插件管理 

安装 NodeJs 和 Publish Over SSH 目前用到的就这两个插件， github 的插件会默认安装

进入系统配置

Jenkins Location 是你的Jenkins地址

找到 Publish over SSH 在下面的 SSH Servers 配置你的远端服务器

Name 随便起

Hostname 服务器IP

Username root

RemoteDirectory  你带吗部署的地址

可以点击右下的   Test Configuration 进行测试看看是否 success

新建任务

选择第一个 构建自由风格

源码管理选择 git ，URL 你git 仓库的地址， 国内服务器访问 github 有问题可以选择使用 GitHub 国内反代地址.  https://hub.fastgit.org

构建环境选择 Provid Node & nom ...

构建，增加构建步骤

选择执行 shell

命令部分填写. Npm install nom run build 等等

再添加一个构建步骤，选择 SSH

Transfers

Source files 是你项目打包后的相对路径比如： dist/*

Remote directory  是放在服务器上的目录

Exec command 传输文件后在远程服务器上执行的命令

然后就可以构建啦

