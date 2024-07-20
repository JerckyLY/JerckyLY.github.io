---
title: Cesium系列(9)--二三维联动
date: 2021-09-10 21:58:18
tags:
 - webgis
 - cesium 
categories: Cesium
description: Cesium系列
top_img: 1.png
---

---

<div align="center"> <span style="color: #4ea7f9;font-size: 24px">千言万语，道不尽那年那月。万水千山，隔不断缕缕师恩。</span> </div> 
<div align="center"> <span style="color: #4ea7f9;font-size: 18px">祝老师们节日快乐！您辛苦了！</span> </div>

---


<div align="center"> <div style="margin: 1rem 0 0.7rem;font-size: 1.5em;color:#1f2d3d;font-weight: bold">Cesium + Openlayers 二三维联动</div> </div> 


## 为何不用 Cesium 二维模式

 **Cesium** 虽然支持二维模式，但它毕竟的专注方向还是在三维方面。在二维模式下，跟专注于做二维的 **OpenLayers** 或者 **Leaflet**，以及
 二维起步，现在开始支持三维的 **MapboxGL** 相比。Cesium的二维模式，总感觉差了那么点意思。我在实际项目的使用中，用 **Cesium** 
 二维模式加载自己的切片服务，由于 **Cesium** 层级的概念，跟二维的层级概念有些区别。因此同样的服务，统一的比例尺下，看的效果
  **Cesium** 总是有点差强人意。 看下对比效果：
 <img src='2.png' />
 <div align="center">Cesium加载展示</div>
 <img src='3.png' />
  <div align="center">Openlayers加载展示</div>

所以项目中期，二维部分的功能用 **Openlayers**  代替了，说多了都是泪 o(╥﹏╥)o。   

废话不多说，先看结果：
## 上菜

  <video   controls width='100%' autoplay height='100%'>
    <source src="1.mp4" type="video/mp4">
  </video>
 
 想体验的道友们，可以访问 <a href='http://jerckly.gitee.io/cesium-view/#/' target='_blank'>这里</a>。左侧工具条第三个。

## 原理
 
1. js动态创建二维地图容器。在三维界面左侧。调整宽度样式，整体呈两侧布局。
2. 由于 **Cesium** 不能直接获取当前层级，因此根据当前视图范围来同步二维界面。 利用 **Cesium** 中的 **preRender** 渲染事件，实时获取三维当前视窗，同时设置二维的视图范围。
3. 同样二维中监听中心点 **change:center** 事件，实时设置三维的视窗
4. 根据当前鼠标在二维或者三维的视口判断，来防止无限循环同步设置。
 
## 实现

1. 初始化二维地图容器，创建地图视图
```js
    
      /**
      * 初始化地图容器，插入三维容器的左侧
      */
     init2DDiv(){
         this.mapDiv = document.createElement('div');
         this.mapDiv.setAttribute('id', this.mapId)
 
         this.mapDiv.style.width = '0%';
         this.mapDiv.style.height = '100%';
         this.mapDiv.style.position = 'relative';
         this.mapDiv.style.visibility = 'hidden'
         // insertBefor
         const viewerContainer = this.viewer.cesiumWidget.container.parentElement.parentElement
         viewerContainer.parentNode.insertBefore(this.mapDiv, viewerContainer)
     }

     /**
     * 初始化地图视图
     */
     init2DMap(){
        // const originView = GlobeView.Map2DViewer.getView()
        //
        const layer = new ol.layer.Tile({
            source:new ol.source.XYZ({
                url:'https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
            })
        })
        this.olMap = new ol.Map({
            layers:[layer],
            target: this.mapId,
            view: new ol.View({
                center: [13818313.960985335, 6519709.935426011],
                zoom: 8,
                projection: 'EPSG:3857',
                maxZoom:22
            })
        });

        this.olMap.updateSize()

     }

```

  {% note danger %} 
 
   > 注意样式调整两侧布局，我用的是弹性盒子布局。即： **display: flex**
 
   {% endnote %} 

  <img src="4.png" />

2. 三维监听事件处理
```js
        /**
         * 三维监听事件处理
         */
        getViewCameraRectrange(){
            const rectangle = this.viewer.camera.computeViewRectangle();
            // 弧度转为经纬度
    
            const west = (rectangle.west / Math.PI) * 180;
    
            const north = (rectangle.north / Math.PI) * 180;
    
            const east = (rectangle.east / Math.PI) * 180;
    
            const south = (rectangle.south / Math.PI) * 180;
            //三维联动二维界面
            if (!this.isIn2DMapFlag) {
                if (north > 87 && south < -87) {
                    const center = this.getCenterPosition(this.viewer);
                    this.olMap.getView().setZoom(0);
                    this.olMap.getView().setCenter(ol.proj.transform([center.lon,center.lat],'EPSG:4326','EPSG:3857'));
                } else {
                    // console.log(west, south, east, north);
                    // this.olMap.getView().fit([transform(west,'EPSG:4326','EPSG:3857'), transform(south,'EPSG:4326','EPSG:3857'), transform(east,'EPSG:4326','EPSG:3857'), transform(north,'EPSG:4326','EPSG:3857')]);
                    this.olMap.getView().fit(ol.proj.transformExtent([west,south, east, north],'EPSG:4326','EPSG:3857'));
    
                }
    
            }
        }
```

3. 二维监听事件处理
```js
    /**
     * 二维监听事件处理
     */
    changeCenterListener(){
        if (this.isIn2DMapFlag) {
            const bounds = this.olMap.getView().calculateExtent();
            const boundsTansform = ol.proj.transformExtent(bounds,'EPSG:3857','EPSG:4326')
            this.viewer.camera.setView({
                destination: Cesium.Rectangle.fromDegrees(
                    boundsTansform[0],
                    boundsTansform[1],
                    boundsTansform[2],
                    boundsTansform[3],
                )
            });
        }
    }
```
4. 判断当前鼠标是否在二维视图中
```js
    /**
     * 判断鼠标是否在二维地图
     * @param x
     * @param y
     * @return {boolean}
     */
    isMouseIn2DMap(x, y){
        let y1 = this.mapDiv.offsetTop; //div上面两个的点的y值
        let y2 = y1 + this.mapDiv.clientHeight; //div下面两个点的y值
        let x1 = this.mapDiv.offsetLeft; //div左边两个的点的x值
        let x2 = x1 + this.mapDiv.clientWidth; //div右边两个点的x的值
        if (x < x1 || x > x2 || y < y1 || y > y2) {
            return false;
        } else {
            return true;
        }
    }
```

5. 使用
```js
    //初始化
    const util = new Cesium2DLinkage3DUtil()
    //启动联动
    linkUtil.active(viewer)
    //关闭联动
    linkUtil.deactive()

```

## 源码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/cesium-demo-view' target="_blank" >Cesium-demo-view</a>  

## 音乐小憩
{% aplayer "道道道" "国语" "https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/UuHgt2XXkgrCo2MuTJ3Jamu0yKVEOqQp/%E5%9B%BD%E8%AF%AD-%E9%81%93%E9%81%93%E9%81%93.mp3" "https://imgessl.kugou.com/stdmusic/20150718/20150718141335609634.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/by7ValYqDDRwL0CWncWwRPtackvFIEEE/%E9%81%93%E9%81%93%E9%81%93%28%E5%9B%BD%E8%AF%AD%E7%89%88%29%20-%20%E9%BB%84%E9%9C%91.lrc" %}
