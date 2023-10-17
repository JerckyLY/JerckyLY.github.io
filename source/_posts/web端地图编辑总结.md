---
title: Web端地图在线编辑总结
date: 2023-10-16 16:12:58
tags:
 - OpenLayers
 - Potree
categories: mapEdit
description: GIS
---
## <center>Web端地图在线编辑总结<center/>
最近一年多一直在做高精地图在线编辑工具相关功能开发，较之前的地图数据应用展示方向，对我来说也算是一个新的开始。之前也只
是知道编辑流程，但是没有真正实操过。加上博客也很久很久没更新了，趁着新版本提测后的空档期，总结一下在地图数据编辑方面所用的技术和一些注意点。

## 相关技术
### 二维编辑
在线二维地图编辑的主要技术，各位道友也都了解，主要是：
> 1. `PostgreSql + PostGIS` 空间数据库
> 2. `Geoserver` 地图服务系统
> 3. `WFS` 服务类型
> 4. `OpenLayers` 前端地图渲染框架
> 5. `Turf` 前端空间分析库

- **空间数据库**
  空间数据库比关系数据库多了**空间数据类型**，**空间查询**，**空间索引**三个主要特征，除了`PostgreSql`， `Mysql`和`Oracle`也都有
  对应的空间扩展，具体使用哪个数据库，没有强制。还是根据自己的业务需求和相关技术储备为前提。当然`Geoserver`默认就自带可以连接`PostgreSql`数据库，不想麻烦直接使用`PostgreSql`就好。
- **地图服务系统**
  能够发布 `OGC Web`标准服务的系统都可以作为地图服务端，比如 开源免费的`Geoserver`、中地的`MapServer`、ESRI的
  `ArcGISServer`、超图的`IServer`等，如果不想自己造轮子，那开源免费的`Geoserver`无疑是最好的选择。
- **服务类型**
  `Web`端常用的地图服务主要有 `WMTS`、`WMS`、`WFS`、`TMS`以及`矢量切片`服务，不同的服务满足不同的需求场景。
  1. 需要快速的渲染，首先 `WMTS` 或者 `TMS`
  2. 需要实现图形编辑，只能是 `WFS`
  3. 需要快速渲染，并且可以自定义样式，选 `矢量切片`
  4. 需要实时渲染，选 `WMS`
- **前端地图渲染框架**
  当前主流的开源地图渲染框架主要有：`OpenLayers`、`MapboxGL`、`Leaflet`等，当然也有`Cesium`这种三维GIS渲染框架。框架
  的选取还是根据业务需求为前提，由于地图数据编辑涉及到各种交互：绘制，捕捉，框选，单选，拖拽等。那么着重渲染的
  `MapboxGL`就不太合适，`Leaflet`虽然也有各种插件库还支撑它完成可以交互，但是毕竟是插件库，难以保障及时维护。
  `OpenLayers`虽然较为重，但是它内置了各种交互，完全不用自己再去造轮子。
- **空间分析库**
  `OpenLayers`本质还是一个注重可视化的GIS库，基本不具备空间分析运算能力。比如：
  1. 判断是否相交
  2. 判断是否自相交
  3. 点是否在线上
  等一些空间分析。目前 `jsts`、`turf`这两个是常用的空间分析库，我常用的还是`turf`库。也有道友做过两个库的对比<a href='https://blog.csdn.net/u012413551/article/details/116233450' target="_blank" >原文</a>，仅供参考：
  ![](1.png)
  按照那位道友的代码我也自己也试了一下，结果如下：
  | 库    | 1000次 | 1000000次 | 10000000次 |
  |:------:|:-------:|:----------:|:-----------:|
  | jsts |    7   |     112     |      3456     |
  | turf |     2  |    63      |       689    |
  
  具体时间不一样，但是整体还是 `turf` 效率较快些。代码如下，有兴趣的道友可以自己试一下：
  ```html 
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://unpkg.com/jsts/dist/jsts.min.js"></script>
        <script src="https://unpkg.com/@turf/turf/turf.min.js"></script>
      </head>
      
      <body>
        <script>
          let count = 10000000
          function testJsts(count) {
            const reader = new jsts.io.WKTReader()
            const jstsPolygon = reader.read('POLYGON ((1 1, 35 1, 35 84, 1 84, 1 1))')
            let jstsPoints = []
      
            let i = 0
            while (i < count) {
              let x = Math.random() * 100
              let y = Math.random() * 100
              var jstsPoint = reader.read(`POINT (${x} ${y})`)
              jstsPoints.push(jstsPoint)
              i++
            }
      
            const time1 = new Date().getTime()
            jstsPoints.forEach((p) => {
              var r = jsts.operation.relate.RelateOp.contains(jstsPolygon, p)
            })
            const time2 = new Date().getTime()
            console.log(`jsts test done, ${time2 - time1}ms`)
          }
      
          testJsts(count)
          function testTurf(count) {
            const turfPoints = []
            const polygon = turf.polygon([[
              [1, 1],
              [35, 1],
              [35, 84],
              [1, 84],
              [1, 1]
            ]])
      
            let i = 0
            while (i < count) {
              let x = Math.random() * 100
              let y = Math.random() * 100
              turfPoints.push(turf.point([x, y]))
              i++
            }
            const time1 = new Date().getTime()
            turfPoints.forEach((p) => {
              turf.booleanContains(polygon, p)
            })
            const time2 = new Date().getTime()
            console.log(`turf test done, ${time2 - time1}ms`)
          }
          testTurf(count)
      
        </script>
      </body>
      
      </html>
  ```

### 三维编辑
对于三维编辑，我最开始的想法是用 `Cesium` 来做（主要是我熟悉些），在我来公司之前，同事已经初步定过方案使用 `Potree`。后面
实际开发，感觉`Potree`更合适些。因为矿区无人驾驶，需要的是三维小场景的快速地图制作和更新，而且数据类型是车辆通过雷达采
集生成的点云数据。`Cesium`更适合大场景的GIS数据渲染，而`Potree`是专门做点云数据渲染。
`Potree` 主要是两部分组成，一个是数据加载 `Potree`，一个是数据处理 `PotreeConvert`
- **`Potree` 简介**
Potree 是基于 WebGL（threejs） 的开源大规模点云渲染器。其由维也纳工业大学计算机图形与算法研究中心开发。根据相关论文
以及展示的介绍，其支持 Billion （10亿）级别点云数据的渲染。
github地址：
https://github.com/potree/potree/
官网示例：
https://potree.org/potree/examples/page.html
![](2.png)

- **`PotreeConvert` 简介**
PotreeConverter 将点云数据整理和转换生成八叉树 LOD 结构，用于大规模点云的流式传输和实时渲染。支持点云格式：.las .laz .ply .xyz .pts 等
github地址：
https://github.com/potree/PotreeConverter
转换命令：
```cmd
PotreeConverter.exe <input> -o <outputDir>
 ```

> `Potree`不支持Npm 安装，如需集成到现有vue项目中，需要在index.html中引入相关js和css文件

看一下成果：
![](3.png)
## 注意点
在实际开发中，遇到了不少坑，这里总结整理一下：

1. 数据库的空间字段类型需要设置支持高程
   - 点：pointz
   - 线：linestringz
   - 面：polygonz
2. 在线上点击点时，可能拾取的点不在线上，可以使用 `turf.nearestPointOnLine`来保证点击的坐标，一定在线上。
3. 在使用 `turf.lineSplit` 切割线段时，切割处两条线的端点高程会丢失，需要处理一下
4. 在使用 `turf.simplify` 抽稀时，高程会丢失，三维数组直接变成二维数组。我是直接把源码拿出来改造了一下。很简单，就是返回值加个`Z`值。
5. 使用 `OpenLayers`的拖拽功能时，如果拖拽新增点，新增的点高程值都为0，也需要处理。
6. `Potree`本身是基于`Threejs`写的，在判断是否选中物体时，默认是判断物体的中心是否在框内部。但是业务需要框选边的时候就
要判定为选中，我也是把那部分代码给拿出来单独改造。
7. 三维里面的打断，延伸，合并线段功能，本质我还是使用turf处理，只是要着重关注高程值。

还有很多小细节就不再多叙述，总的来说，注意一下高程的情况。

## 总结
相较于之前的做项目，最近一直做产品感觉差别还是挺大的。之前项目开发，了解一下任务，看看UI图就直接开干了。中间有问题再来
回改。做产品，有更多的流程规范。产品出完需求，有需求评审。开发之前，需要完成概要设计编写和评审。然后才进行代码开发，然
后有调测报告，测试用例评审，测试分Alpha,Bate两轮。
这两种模式，不能说谁比谁好，一个是为了快速完成交付，一个是为了高质量使用。都体验一下，感觉还不错。哈哈哈

## 音乐小憩
{% aplayer "人生态度" "王七七" "https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/vlDdpvNO4pAfLCh3DjIQ6lgs1HS7Jnxe/%E4%BA%BA%E7%94%9F%E6%80%81%E5%BA%A6-%E7%8E%8B%E4%B8%83%E4%B8%83.mp3" "https://cdnmusic.migu.cn/picture/2023/0816/0249/AM154e63fe6318c9e243fda53acfdab593.jpg"  %}
