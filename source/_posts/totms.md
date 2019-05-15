---
title: Python转geoserver以及arcgis的切片目录规则为TMS目录
date: 2019-05-12 22:26:23
tags: geoserver
categories: GIS
---

***

<center>祝愿所有的妈妈们，节日快乐！</center>
***
### 地图服务切片简介
&nbsp;&nbsp;&nbsp;&nbsp;关于切片网上有很多的介绍，在此不再多余赘述，想要了解可以看<a
href="https://segmentfault.com/a/1190000011276788"
target="_blank">这里</a> 目前我接触到主流的切片生成工具是：arcgis,geoserver。它们各自都有一套自己的切片目录规则。
<!--more-->
geoserver切片目录规则(图片是网上copy的):

![geoserver](geoservertile.png)

- 其中'EPSG_900913_05'中的05代表等级，'24_17.png'中的24代表列号即 x, 17代表的是行号 即 y

 arcgis切片目录规则(图片是网上copy的)：

![arcgis](arcgisTile.png)

 - 其中'L03'代表等级为3，"R00000002"中的'R'是行即 y,'00000002'为行号是16进制的数值。'C00000001'中的'C'是列即 x,'00000001'为列号，16进制数值

tms目录规则(图片是网上copy的)：
![tms](tma.png)

&nbsp;&nbsp;&nbsp;&nbsp;通过图片，能看到三种的目录规则是不一样的，那么当我们想要离线部署时就不方便了。因此,把geoserver或者arcgis的切片目录规则转成google--tms或者标准的tms(这两个区别主要是切片源点不一样，google--tms源点是在左上角，标准的tms源点是在左下角)
然后用<a href='http://nginx.org/en/' target="_blank"
\>Nginx</a>代理一下，就能很容易实现离线部署。

### 代码资源

&nbsp;&nbsp;&nbsp;&nbsp;关于这两种的转换，我已经写好了，放到了github中，其中geoserver是针对3857坐标系的.pbf文件，其他的目录结构请适当修改即可。

1、 <a href="https://github.com/JerckyLY/geoserverToTMS" target="_blank">geoserver</a> 

2、 <a href="https://github.com/JerckyLY/arcgisToTMS"
target="_blank">arcgis</a>



