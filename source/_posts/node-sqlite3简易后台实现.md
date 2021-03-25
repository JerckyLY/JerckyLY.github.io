---
title: node-sqlite3简易后台搭建
date: 2021-03-24 14:46:11
tags: 
  - Node
  - Sqlite3
categories: Node
---

## <center>node-sqlite3简易后台搭建<center/>

最近项目需要写一个演示用的三维Demo，其中要有用户管理界面，能对用户进行增删改查操作。当然这都是小需求，随便就写了，也
没啥。但是给我说没人给我写接口（内心：嗯，嗯???)。虽然做过一段时间的全栈开发，突然让我写后台，我还是有点不适应。但是没
办法，任务来了，干吧！
之前写的是 **Java** + **Mysql** + **SpringBoot** 后台，但是一个简单的用户管理，再加一个登录的接口，我是真心不想用（其实忘了不少，不
会了 哈哈）。作为一个 **WebGIS** 码农，最熟悉的还是 **JavaScript** 。那能用 **Js** 写后台的莫过于 **Node**了，再结合 **express** 库，很轻便的
就可以搭建一个后台。接下来就是数据库了。目前，开源免费，又小巧轻便的 **sqlite** 多合适啊。 同时 **Node** 也有 **sqlite3** JS库可以操作
它。OK，技术选型定了，接下来就开始实现吧。

## 安装
对应**Node**的安装和配置，各位道友了解的比我都清楚，我就不多说了。主要讲一下 **sqlite3**的安装

- sqlite3 (windows)数据库安装
   下载地址 https://www.sqlite.org/download.html    
   需要下载 **sqlite-dll-win32-86-xx.zip** 或者 **sqlite-dll-win64-xx.zip** 以及 **sqlite-tools-win32-x86-xx.zip**
   ![](1.png)
   把这两个解压之后，里面的文件放到一个文件夹下
   ![](2.png)
   然后在系统的环境变量中，在 **Path** 变量里面把存放 **sqlit3** 的文件夹路径添加进去 
   ![](3.png)
   最后检查一下是否安装成功 在cmd 命令行中输入 **sqlit3** 回车。如果安装成功出现会入下图所示：
   ![](4.png)

- SQLiteStudio 可视化工具
   数据库用命令行操作还是不方便，**SQLiteStudio** 是开源，且支持多平台的一个 **sqlite** 可视化软件。
   下载地址： https://sqlitestudio.pl/
   解压文件，找到 **SQLiteStudio.exe** 双击打开，初次加载，需要选择语言，找到中文即可：
   ![](5.png)


## 使用
  
  - 建库
    利用 **SQLiteStudio** 新建一个数据库。 Database --> Add a database :
    ![](6.png)
    1 是新建，2是打开。 新建的时候，选好文件夹，然后输入数据库的名称就行了。因为我之前建立了，就直接选择打开。
    ![](7.png)
    点击测试连接，出现绿色对号。说明连接正常。然后点击 OK。
    ![](8.png)
  - 建表
    在 **test.db** 里面，我已经建好了一个 **user** 表格，有 **id** 、**name** 、 **password** 还有 **create_time** 四个字段。你可以用工具创建，也
    可以手动创建。表的SQL语句：
    ```
        CREATE TABLE user (
            id          STRING (256) PRIMARY KEY
                                     UNIQUE
                                     NOT NULL,
            name        STRING (64)  NOT NULL,
            password    STRING (128) NOT NULL,
            create_time DATETIME     NOT NULL
                                     DEFAULT (datetime('now', 'localtime') ) 
        );

    ```
## 实现

  - 创建项目
    建立一个文件夹，然后 cmd 命令 初始化:
    ```js
        npm init -y
    ```
    
  - 安装依赖
    用的基础的 **express** 创建 Server, 然后用 **sqlite3**库来操作数据库。用 **uuid** 来生成随机的id。
    
    ```
       npm i express sqlite3 uuid --save
    ```
    package.json内容如下：
    ![](9.png) 
  
  - 代码使用 sqlite3 
    api 简介：
    ![](10.png)
    
    1. 代码打开数据库
    
        ```js
            const sqlite3 = require("sqlite3").verbose()
            // sqlites数据库地址
            let sqliteDbPath = "D:\\01_Software\\Program File\\sqlite3\\DB\\test.db"
            // 打开sqlites数据库
            const db = new sqlite3.Database(sqliteDbPath)
        ```
    
    2. 新增用户
    
        > post的请求时，从 **request.body** 中获取请求数据，需要配置一下
        ```js
            const express = require('express')
            // 创建 express 应用
            const app = express()
            app.use(express.urlencoded({extended:false}));//添加通用的JSON和URL编码的解析器作为顶级中间件，该中间件将解析所有传入请求的主体。
            app.use(express.json());
        ```
        > 如果你的express的版本不是4.x及以上 那么需要用到 **body-parser** 库来代替 **express**。
        
        ```js
            const express = require('express')
            const bodyParse = require('body-parser')
            // 创建 express 应用
            const app = express()
            app.use(bodyParse.urlencoded({extended:false}));//添加通用的JSON和URL编码的解析器作为顶级中间件，该中间件将解析所有传入请求的主体。
            app.use(bodyParse.json());
        ```
        新增用户的代码
        ```js
           //新增接口
           const addUser = function(req,res){
               const param =  req.body;
               const name = param.name;
               const password = param.password;
           
               const uid = uuid()
           
               const add_sql = `insert into user (id , name ,password ) values(?,?,?)`
               db.run(add_sql,[uid,name,password],function (err) {
                   if(err){
                       res.send({
                           msg:'插入失败',
                           ret:false
                       })
                   }
           
                   res.send({
                       code:200,
                       msg:'插入成功',
                       ret:true
                   })
               })
           } 
        ```
        上述代码是从 **request.body** 获取提交的用户名 **name** 和密码 **password**，然后利用 **uuid** 生成一个 **id**，之后写了一个插入的sql
        语句 **add_sql**。 然后用到了 **sqlite3** 的 **run** 方法来执行sql语句。代码很简单都是基本的插入语句。
        启动应用，利用**postman** 测试一下：
        ![](11.png)
        结果返回插入成功，同时刷新数据库，能看到插入的最新的一条数据。
    
    3. 修改用户
        修改的逻辑是根据用户的 **id** 对用户名和密码进行修改。
        ```js
            //更新
            const updateUser = function(req,res){
                const param =  req.body;
                const password = param.password;
                const name = param.name;
                const id = param.id;
            
                const update_sql = `update user set name=?, password = ? where id = ?`;
                db.run(update_sql,[name,password,id],function (err) {
                    if(err){
                        res.send({
                            msg:'更新失败',
                            ret:false
                        })
                    }
            
                    const  data = {
                        code:200,
                        ret:true,
                        msg:'更新成功'
                    } ;
            
                    res.send(data)
            
                })
            }
        ```
        测试结果如下：
        ![](12.png)
    
    4. 查询用户
       查询全部数据
       ```js
           //查询全部数据
           const getAll = function(res){
               db.all(`select * from user order by create_time desc  `,function (err,row) {
                   if(err){
                       res.send({
                           msg:'查询失败',
                           ret:false
                       })
                   }
           
                   const data = {
                           code:200,
                           data:row,
                           ret:true,
                           msg:'查询成功'
                       }
           
                   // console.log(data)
                   res.send(data)
               })
           }
       ``` 
       结果如下：
       ![](13.png)
    
    5. 删除用户
       根据用户 **id** 删除用户。
       ```js
           //删除
           const delUser = function(req,res){
               const param = req.query || req.params ;
               const id = param.id;
               const del_sql =    `delete from user where id = ?`;
               db.run(del_sql,[id],function (err) {
                   if(err){
                       res.send({
                           msg:'删除失败',
                           ret:false
                       })
                   }
           
                   res.send({
                       code:200,
                       ret:true,
                       msg:'删除成功'
                   })
               })
           }
       ```  
       结果如下：
       ![](14.png) 

## 代码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/node-sqlite3-server-demo' target="_blank" >node-sqlite3-server-demo</a>  

## 总结
  总体实现还是挺简单的，也没什么复杂的 SQL 语句。部署的时候，可以把 **Node** 安装为 window服务，就不用担心客户那边服务器关机了。
  
## 音乐小憩
{% aplayer "大鱼" "周深/郭沁" "https://freetyst.nf.migu.cn/public/product5th/product27/2018/12/21/2018%E5%B9%B410%E6%9C%8819%E6%97%A516%E7%82%B923%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%A2%A6%E5%93%8D%E5%BC%BA%E9%9F%B3186%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/6404689Z0HE.mp3?key=b74e16bf79b5983a&Tim=1616640844447&channelid=00&msisdn=b30efb370c4f44fdb04710eaad359cd9&CI=6404689Z0HE2600913000000634056&F=000009" "https://cdnmusic.migu.cn/picture/2020/0216/1135/AM9e357dde4ae7a59634b1ea6ba2c077ab.jpg"  %}


