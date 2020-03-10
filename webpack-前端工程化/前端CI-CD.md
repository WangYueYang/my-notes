## Jenkins

### 如何完成持续集成CI

- 代码要统一起来，放到同一个代码仓库里
- 构建代码，吧ES，TS转成JS，需要有一台独立的服务器，把所有代码集中构建，属于CPU密集型，服务器性能不能太差，他消耗CPU和内存
- 测试，测试环境和生产服务器的环境要一致，工具：Jest。必须生产一个报告，要大家都能看到，用来保证质量
- 通过测试后前端代码上传到生产服务器上去

### Jenkins 如何安装

- 下载LTS长期支持版， Docker最方便，尽量装Linux
- .war是独立的发布包（如果会Java的话）
- 还需要自己安装Java环境，Java环境版本需要Java8 rpm版（Oracle 甲骨文官网，开发人员下载面向开发人员的JDK，下载JavaSE，查看Jenkins版本号对应的Java环境）或者安装openjdk  yum -y install java-1.8.0-openjdk
- 不建议在mac上装，会强行起一个服务占8080端口，还会占内存
- Systemctl status jenkins 检查服务是否跑起来并检查日志，装好后端口是8080

### Jenkins使用



