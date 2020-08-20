---
title: mapboxgl-print-tool
date: 2020-01-08 11:37:11
tags:
  - mapboxgl
  - printTool
  - gis
categories: GIS
description: mapboxgl的打印控件
top_img: fullmap.png
---

##  <center>mapboxgl-print-tool</center>
<center>地图全图打印，框选打印导出图片</center>

## 使用
 -  CDN
     ```js
      // 依赖file-save下载图片
       <script src="https://cdn.bootcss.com/FileSaver.js/2014-11-29/FileSaver.min.js"></script>
      // 引用
       <script src="https://cdn.jsdelivr.net/npm/mapboxgl-print-tool@1.0.5/dist/index.js"></script>
         ```
     ```
     ```js
    <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoiamVyY2t5IiwiYSI6ImNqYjI5dWp3dzI1Y2YzMnM3eG0xNnV3bWsifQ.eQp4goc9Ng8SuEZcdgNJ_g';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            preserveDrawingBuffer:true //canvas toDataURL
        });
        const mapPrint  = new MapPrintTool({
            enableImg:true, //是否出图
            fileName:'mapDemo.png' // 文件名
        })
        map.addControl(mapPrint, 'top-right')
        // 监听打印 获取数据 
        mapPrint.on('success',function (res) {
            console.log(res)
        })
    </script>
     ```
     
 -  模块化
    ```
     npm install mapboxgl-print-tool
    ```
    ```js
     import MapPrintTool from 'mapboxgl-print-tool'
     mapboxgl.accessToken = 'pk.eyJ1IjoiamVyY2t5IiwiYSI6ImNqYjI5dWp3dzI1Y2YzMnM3eG0xNnV3bWsifQ.eQp4goc9Ng8SuEZcdgNJ_g';
     var map = new mapboxgl.Map({...})
     var mapPrintTool = new MapPrintTool({
         enableImg:true,
         fileName:'test.jpg'
     })
      map.addControl(mapPrintTool,'top-left')
     //监听获取图片数据
      mapPrintTool.on('success',(res) => {
         console.log(res)
      })
    ```
    
## 配置项 -- 两个绑定出现

  ` | 名称 | 类型 | 描述 | 默认值
  :---: |:---: | :---: | :---: | :---:
  1 | enableImg | Boolean | 是否导出图片 | true 
  2 | fileName| String | 导出的图片文件名 | 'map.jpg'
 
## 事件
  - 监听 **`success`**，获取 **`canvas`**转成的图片数据 **`base64`**   
    ```js
    const mapPrint = new MapPrintTool()
    mapPrint.on('success',(res) => {
        console.log(res)
    })
    ```

## 效果
  - 界面   
  ![](fullmap.png)
  
  - 全图打印  
  ![](fullprint.jpg)
  
  - 框选打印   
  ![](pariprint.jpg)
  
## 源码
  - github: <a href='https://github.com/JerckyLY/mapboxgl-print-tool' target="_blank" >mapboxgl-print-tool</a>  

## 音乐小憩
{% aplayer "别怕我伤心" "张信哲" "//freetyst.nf.migu.cn/public/product7th/productB16/2020/07/0219/2020%E5%B9%B406%E6%9C%8830%E6%97%A515%E7%82%B948%E5%88%86%E6%89%B9%E9%87%8F%E9%A1%B9%E7%9B%AE%E5%92%AA%E5%92%95Believe1238%E9%A6%96-1/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/6993169X14T194000.mp3?key=fe249bf145d568a1&Tim=1597926843131&channelid=00&msisdn=e2718a9072794ba2b5ea4020539d9337&CI=6993169X14T2600918000000654481&F=000009" "https://cdnmusic.migu.cn/picture/2019/0520/1828/AS1609221019195527.jpg"  %}
