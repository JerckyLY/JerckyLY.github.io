---
title: Cesium系列(7)--方位角测量
date: 2021-03-26 11:24:42
tags:
 - webgis
 - cesium 
categories: Cesium
description: Cesium系列
top_img: 1.png
---

## <center>Cesium方位角测量(仿火星科技)<center/>

接着之前的通用工具介绍来讲，今天主要介绍方位角测量。仿照火星科技的例子实现，可以连续测量。先上图：
![](1.png)

## 原理
首先明白什么是方位角，百度百科介绍：
> 方位角，又称地平经度(Azimuth angle，缩写为Az)，是在平面上量度物体之间的角度差的方法之一。是从某点的指北方向线起，依顺时针方向到目标方向线之间的水平夹角。

从定义中得到几个关键信息：
 - 两个点， 起点和目标点
 - 两点间顺时针的水平夹角

根据上面的信息，想到的方法就是，根据起点建立一个 x东方向，y为北方向的局部坐标系(或者y为东，x为北)，计算出目标点在这个坐标系的局部坐标值，然后利用三角函数 **arctan**计算出夹角(图中角A的值)。
![](2.png)

**Cesium** 中提供了建立局部坐标系的方法
 - 以x为北，y东的局部坐标系
   ![](3.png)
 - 以y为北，x东的局部坐标系
   ![](4.png)

## 实现
核心代码如下：
```js
        /**
         * 计算两个点的方位角度
         * @param lng_a
         * @param lat_a
         * @param lng_b
         * @param lat_b
         * @return {number}
         */
        courseAngle(lng_a, lat_a, lng_b, lat_b) {
    
            //以a点为原点建立局部坐标系（东方向为y轴,北方向为x轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
            // const localToWorld_Matrix = Cesium.Transforms.northEastDownToFixedFrame(
            //     new Cesium.Cartesian3.fromDegrees(lng_a, lat_a)
            // );
    
            //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
            const localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(
                new Cesium.Cartesian3.fromDegrees(lng_a, lat_a)
            );
            //求世界坐标到局部坐标的变换矩阵
            const worldToLocal_Matrix = Cesium.Matrix4.inverse(
                localToWorld_Matrix,
                new Cesium.Matrix4()
            );
            //a点在局部坐标的位置，其实就是局部坐标原点
            const localPosition_A = Cesium.Matrix4.multiplyByPoint(
                worldToLocal_Matrix,
                new Cesium.Cartesian3.fromDegrees(lng_a, lat_a),
                new Cesium.Cartesian3()
            );
            //B点在以A点为原点的局部的坐标位置
            const localPosition_B = Cesium.Matrix4.multiplyByPoint(
                worldToLocal_Matrix,
                new Cesium.Cartesian3.fromDegrees(lng_b, lat_b),
                new Cesium.Cartesian3()
            );
    
            //弧度
            // const angle = Math.atan2(
            //     localPosition_B.y - localPosition_A.y,
            //     localPosition_B.x - localPosition_A.x
            // );
            //弧度
            const angle = Math.atan2(
                localPosition_B.x - localPosition_A.x,
                localPosition_B.y - localPosition_A.y
            );
            //角度
            let theta = angle * (180 / Math.PI);
            if (theta < 0) {
                theta = theta + 360;
            }
            return theta;
        }
```

我是按照以x轴为东方向，y为北方向为局部坐标系建立的(另一种方向的计算也写了出来，请自行查看)。主要就是弧度计算的时候，是以 **△y** 为对边 还是以 **△x** 为对边求来结果。

**`天不生我李淳罡，剑道万古如长夜`**

## 代码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/cesium-demo-view' target="_blank" >Cesium-demo-view</a>  

## 音乐小憩
{% aplayer "一生所爱" "卢冠廷" "https://freetyst.nf.migu.cn/public/product9th/product42/2020/11/1212/2018%E5%B9%B411%E6%9C%8810%E6%97%A517%E7%82%B915%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AE%E6%AD%A3%E4%B8%9C96%E9%A6%96-14/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/6005661L4UR120847.mp3?key=630618d18d18efbe&Tim=1616756337808&channelid=00&msisdn=815357fdc13c49918109ab2a83bcbf1c&CI=6005661L4UR2600910000009386457&F=000009" "https://cdnmusic.migu.cn/picture/2020/0727/1400/AS281933668a3d761be7a02ce37b24e5a2.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/7lyw2De1lpFPxbEpl2DI512tOFocSNYs/%E4%B8%80%E7%94%9F%E6%89%80%E7%88%B1%20-%20%E5%8D%A2%E5%86%A0%E5%BB%B7.lrc" %}

