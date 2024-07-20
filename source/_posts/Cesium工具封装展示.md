---
title: Cesium工具封装展示
date: 2021-03-18 19:51:55
 - cesium
 - webgis
categories: Cesium
description: Cesium系列
---
## <center>Cesium基本工具封装展示<center/>
很久没更新博客了，最近一段时间主要是忙着整理之前项目中实现的 Cesium 相关功能，结合 Vue 对这些工具进行封装，提供一个管理的工具条组件。能按照配置文件加载需要显示的工具，以及工具间的激活互斥。同时创建 **Viewer** 的时候，添加了一些辅助和美化。说了再多都没用，直接上链接 <a href='http://jerckly.gitee.io/cesium-view/#/' target="_blank" >演示地址</a>

 {% note danger %} 
     
 > 演示中的模型是在群文件里面下载的，如有侵权请联系我，及时修改！
     
 {% endnote %} 

## 功能总览

 {% note info %} 
     
 > 先说一哈，视频很多，道友的流量记得备足！(视频的比gif还小，我用视频了)
     
 {% endnote %} 

  - 整体界面
    ![](1.png)
    界面上能到到，近地天空图我换成了蓝天白云（照片也是网上找的，很粗糙 O.o）。右下角添加了经纬度坐标以及当前的帧率显示。同时美化了鼠标操作以及修改了默认的操作按键顺序（右键《==》中键）。
    <video src='1.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 雪效果
    <video src='2.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 雨效果
   <video src='3.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 空间测距
     <video src='4.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 贴地测距
     <video src='5.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 空间测面
     <video src='6.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 贴地测面
     <video src='7.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 高程测量
     <video src='8.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 方位角测量
     <video src='9.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 土方量测量
       <video src='10.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 可视域分析
       <video src='11.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 通视分析
       <video src='12.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 缓冲区分析
       <video src='13.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 日照分析
       <video src='14.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 多边形视频融合  
      <video src='15.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>
  - 第一人称路径漫游
      <video src='16.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>


## 总结
上面的功能很多都是按照 火星科技 里面的案例为原型来实现。还有一部分功能没有加上去，后续会添加。比如标绘，二三维联动等等。在封装的过程中，因为是结合 Vue 来实现的，由于Vue 的监听机制原因，所以三维里面很多定义的变量是不能放到 **data** 里面去的， 切记 **props** 也不行。当然知道和去真正实现还是有差距的，前面就是因为吃过这个亏，所以每次激活功能的时候，帧率就会下降。也是调了半天才发现的。在这里当作反面教材给大家提醒一下，切记！！！
 {% note danger %} 
     
 > 实例化的 Cesium.Viewer() 不能放到 Vue 中的 **data** 和 **props**中。不然会很卡顿！！！
     
 {% endnote %} 

## 音乐小憩
{% aplayer "你应该很快乐" "虎二" "https://freetyst.nf.migu.cn/public/product5th/product35/2019/11/1310/2019%E5%B9%B411%E6%9C%8811%E6%97%A514%E7%82%B915%E5%88%86%E7%B4%A7%E6%80%A5%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E5%8D%8E%E5%A4%8F%E5%8A%A8%E5%A3%B01%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/63254103486.mp3?key=179ebe1b401a1026&Tim=1616140847963&channelid=00&msisdn=b2a5086abb09405c82b502bc446b1e97&CI=632541034862600913000007296966&F=000009" "https://cdnmusic.migu.cn/picture/2020/0802/0246/AS6e9ed85020aa374dbc96a3125eabf4f2.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/mGrvnW8ABaJdBtQ3qDXG0GmYNHdkajPj/%E4%BD%A0%E5%BA%94%E8%AF%A5%E5%BE%88%E5%BF%AB%E4%B9%90%20-%20%E8%99%8E%E4%BA%8C.lrc" %}
