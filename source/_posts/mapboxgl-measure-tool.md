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
    <!--依赖-->
    <script src="https://api.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.js"></script>
    <script src="https://cdn.bootcss.com/Turf.js/5.1.6/turf.js"></script>
    <script src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js'></script>
    <!--引用-->
    <script src="https://cdn.jsdelivr.net/npm/mapboxgl-measure-tool@1.0.6/dist/index.js"></script>
   ```
    ``` js
    <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoiamVyY2t5IiwiYSI6ImNqYjI5dWp3dzI1Y2YzMnM3eG0xNnV3bWsifQ.eQp4goc9Ng8SuEZcdgNJ_g';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9'
        });
          // 为了使测量图层位于最高层，在添加其他业务图层之后，再引用控件
        map.addControl(new MapMeasureTool(), 'top-right')
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
      map.addControl(new MapMeasureTool(), 'top-right')

    ```
    
   - 注意： **避免出现测量图层被其他业务图层遮盖，需要在其他业务图层添加之后，再实例化测量控件**
   
   
## 截图
  - 测距:   
  ![](line.png)
  - 测面：   
  ![](area.png)

## 源码
  - github: <a href='https://github.com/JerckyLY/mapboxgl-measure-tools' target="_blank" >mapboxgl-measure-tool</a>  
 
## 音乐小憩
{% aplayer "多想在平庸的生活拥抱你" "隔壁老樊" "//freetyst.nf.migu.cn/public/product5th/product33/2019/05/2317/2019%E5%B9%B404%E6%9C%8809%E6%97%A513%E7%82%B938%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%88%90%E9%83%BD%E4%BA%91%E4%B9%8B%E7%91%B61%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/63364900301.mp3?key=1d2ced2b0053e5c9&Tim=1597926726720&channelid=00&msisdn=41604790a76444cab1a45930899ca62f&CI=633649003012600913000003421149&F=000009" "https://cdnmusic.migu.cn/picture/2020/0801/0249/ASf1b833147de26840e610c45b96643885.jpg"  %}
