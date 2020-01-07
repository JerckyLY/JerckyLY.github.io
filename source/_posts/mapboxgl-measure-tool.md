---
title: mapboxgl-measure-tool
date: 2020-01-07 10:26:35
tags: 
  - mapboxgl
  - measureIcontrol
  - gis
categories: GIS
description: mapboxgl的测量控件
top_img: line.png
---
## <center>mapboxgl-measure-tool<center/>
   <center>基于mapboxgl、mapboxgl-draw、turf测量控件<center/>

## 使用
 - CDN:
   ```js
    <script src="https://cdn.jsdelivr.net/npm/mapboxgl-measure-tool@1.0.1/dist/mapMeasureTool.js"></script>
   ```
    ``` js
    <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoiamVyY2t5IiwiYSI6ImNqYjI5dWp3dzI1Y2YzMnM3eG0xNnV3bWsifQ.eQp4goc9Ng8SuEZcdgNJ_g';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9'
        });
          // 为了使测量图层位于最高层，在添加其他业务图层之后，再引用控件
        map.addControl(new mapMeasureTool(), 'top-right')
    </script>
   ```
   
  - 模块化安装
    ```
      npm install mapboxgl-measure-tool
    ```
    ```js
      import MapMesure from 'mapboxgl-measure-tool'
      mapboxgl.accessToken = 'pk.eyJ1IjoiamVyY2t5IiwiYSI6ImNqYjI5dWp3dzI1Y2YzMnM3eG0xNnV3bWsifQ.eQp4goc9Ng8SuEZcdgNJ_g';
       var map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9'
      });
      // 为了使测量图层位于最高层，在添加其他业务图层之后，再引用控件
      map.addControl(new mapMeasureTool(), 'top-right')

    ```
    
   - 注意： **避免出现测量图层被其他业务图层遮盖，需要在其他业务图层添加之后，再实例化测量控件**
   
   
## 截图
  - 测距:   
  ![](line.png)
  - 测面：   
  ![](area.png)

## 源码
  - github: <a href='https://github.com/JerckyLY/mapboxgl-measure-tools' target="_blank" >mapboxgl-measure-tool</a>  
  