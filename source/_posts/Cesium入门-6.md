---
title: Cesium系列(6)--点线面缓冲区
date: 2021-03-23 20:46:53
tags: 
   - cesium 
   - webgis 
categories: Cesium
description: Cesium系列
---

## <center>Cesium点线面缓冲区实现<center/>

上篇文章主要展示了我最近封装的一些常用工具，接下来几篇文章主要介绍相关功能的实现。这篇文章就介绍一下关于三维缓冲区的实现原理。

## 原理

其实从事 Webgis 相关的道友都用过或者听过 **turf.js** 这个前端 **GIS** **javascript**分析库 (什么？没听过？ 道友，最近游戏红尘了吧，哈哈
~), <a href='https://turfjs.fenxianglu.cn/category/' target="_blank" >中文文档地址</a>。**turf.js**  提供了很多分析方法，具体我就不展开说了，一个是我了解的也不是很清楚，另一个就是人家写的很详细
了，就不班门弄斧了。
三维缓冲区和二维缓冲区实现方式是一样的，都是基于 **turf.js** 的 **buffer** 方法，传入相关的参数，然后将生成的 **Feature** 展示就行了。

 - buffer 方法
  ![](1.png)
 - buffer 使用示例
  ![](2.png)

## 实现
参数很简单，一个是要缓冲的基础几何对象，一个是缓冲半径，默认是千米。基本的绘制交互就不说了，核心的代码如下：

 - 点缓冲区
   ```js
       /**
        * 创建点缓冲区
        * 
        */
       CesiumBufferUtil.prototype.createPointBuffer = function () {
       
         //添加点
         this.addPoint()
       
         //添加点的缓冲区
         const coordinate = this.cartesianToLatlng(this.positions[0]).slice(0, 2);
         let pointF = turf.point(coordinate)
         let buffered = turf.buffer(pointF, this.radius)
         let coordinates = buffered.geometry.coordinates;
         let points = coordinates[0]
         let degreesArray = this.pointsToDegreesArray(points);
         this.createBuffer(Cesium.Cartesian3.fromDegreesArray(degreesArray))
       }
   ```
 - 线缓冲区
   ```js
       /**
        * 创建线缓冲区
        */
       CesiumBufferUtil.prototype.createLineBuffer = function () {
         var points = this.getLngLats(); // 坐标数组
         var polylineF = turf.lineString(points);
         var bufferd = turf.buffer(polylineF, this.radius);
         var coordinates = bufferd.geometry.coordinates;
         points = coordinates[0]
         var degreesArray = this.pointsToDegreesArray(points)
         this.createBuffer(Cesium.Cartesian3.fromDegreesArray(degreesArray))
       
       }
   ```
 - 面缓冲区
   ```js
       /**
        * 多边形缓冲区
        */
       CesiumBufferUtil.prototype.createPolygonBuffer = function () {
         var points = this.getLngLats(); // 坐标数组
         points.push(points[0])
         var polygonF = turf.polygon([points]);
         var bufferd = turf.buffer(polygonF, this.radius);
         var coordinates = bufferd.geometry.coordinates;
         points = coordinates[0]
         var degreesArray = this.pointsToDegreesArray(points)
         this.createBuffer(Cesium.Cartesian3.fromDegreesArray(degreesArray))
       }
   ```
 - 通用缓冲区生成函数
   ```js
       /**
        * 生成缓冲区
        * @param {Array} array  坐标数据
        */
       CesiumBufferUtil.prototype.createBuffer = function (array) {
         const bufferPolygon = this.viewer.entities.add({
           polygon: {
             hierarchy: new Cesium.PolygonHierarchy(array),
             material: Cesium.Color.RED.withAlpha(0.6),
             classificationType: Cesium.ClassificationType.BOTH
           },
         });
         this.bufferEntities.push(bufferPolygon)
       }
   ```
 - 相关方法
   ```js
       
        /**
         * 获取经纬度坐标数组
         */
        CesiumBufferUtil.prototype.getLngLats = function () {
          var arr = []
          for (var i = 0; i < this.positions.length; i++) {
            var item = this.cartesianToLatlng(this.positions[i]);
            arr.push(item.slice(0, 2));
          }
          return arr;
        }
        
        
        /**
         * 转经纬度
         * @param {*} cartesian 
         */
        CesiumBufferUtil.prototype.cartesianToLatlng = function (cartesian) {
          var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
            cartesian
          );
          var lat = Cesium.Math.toDegrees(latlng.latitude);
          var lng = Cesium.Math.toDegrees(latlng.longitude);
          var height = latlng.height
          return [lng, lat, height];
        };
        
        //二维数组转一维数组
        CesiumBufferUtil.prototype.pointsToDegreesArray = function (points) {
          let degreesArray = [];
          points.map(item => {
            degreesArray.push(item[0]);
            degreesArray.push(item[1]);
          });
          return degreesArray;
        }
   ```

## 示例
  ![](3.png)
  
## 代码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/cesium-demo-view' target="_blank" >Cesium-demo-view</a>  

## 总结
缓冲区实现的过程很简单，没什么可多说的，需要注意的是二维三维坐标的转换，二维面的坐标数组要闭合。其他的就是正常的实现就行了。

## 音乐小憩
{% aplayer "明天会更好" "群星" "https://freetyst.nf.migu.cn/public/product4th/product36/2019/09/1617/2019%E5%B9%B409%E6%9C%8802%E6%97%A516%E7%82%B940%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%BB%9A%E7%9F%B3%E5%94%B1%E7%89%87%E8%AF%8D%E6%9B%B2%E9%A2%84%E7%95%991%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/63480216478.mp3?key=ee020ad0d1687cc2&Tim=1616494755978&channelid=00&msisdn=37b679460fd043d3825ba69cf3f19009&CI=634802164782600913000006049674&F=000009" "https://cdnmusic.migu.cn/picture/2020/1017/1021/AS8c9ff20208cb76c25a4362d74bec3ec0.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/lo1oaxBYjc5xG2h4ag9L1wVIiJ8fwlux/%E6%98%8E%E5%A4%A9%E4%BC%9A%E6%9B%B4%E5%A5%BD%20-%20%E4%BD%99%E5%A4%A9%2C%E6%9D%8E%E5%BB%BA%E5%A4%8D%2C%E6%B4%AA%E8%8D%A3%E5%AE%8F%2C%E7%8E%8B%E6%A2%A6%E9%BA%9F%2C%E8%B4%B9%E7%8E%89%E6%B8%85%2C%E9%BD%90%E7%A7%A6%2C%E8%94%A1%E7%90%B4%2C%E8%8B%8F%E8%8A%AE%2C%E6%BD%98%E8%B6%8A%E4%BA%91%2C%E7%94%84%E5%A6%AE%2C%E6%9E%97%E6%85%A7%E8%90%8D%2C%E7%8E%8B%E8%8A%B7%E8%95%BE%2C%E9%BB%84%E8%8E%BA%E8%8E%BA%2C%E9%99%88%E6%B7%91%E6%A1%A6%2C%E5%A8%83%E5%A8%83%2C%E6%9D%8E%E7%8F%AE%E8%8F%81%2C%E9%BD%90%E8%B1%AB%2C%E9%83%91%E6%80%A1%2C%E6%B1%9F%E8%95%99%2C%E6%9D%A8%E6%9E%97.lrc" %}
