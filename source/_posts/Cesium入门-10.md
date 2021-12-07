---
title: Cesium系列(10)--三维双屏对比
date: 2021-12-07 20:37:42
tags:
 - webgis
 - cesium 
categories: Cesium
description: Cesium系列
top_img: 1.png
---

<div align="center"> <div style="margin: 1rem 0 0.7rem;font-size: 1.5em;color:#1f2d3d;font-weight: bold">Cesium双屏对比</div> </div> 

距离上个博客更新已经过去两三个月了，期间前期一直忙着做项目，后面又是两三个项目一起改bug，改需求......。终于忙碌的日子里，今天能偷得半日闲，那继续开始修炼吧。


## 背景

上个博客介绍了怎么用 **OpenLayers** 跟 **Cesium** 结合来现在二三维联动展示，在近期的项目中，有个需求是地下管网模型，跟倾斜模型
同时展示效果图如下：
 <img src='2.png' />
那用二三维联动就没法满足需求了。得是两个三维 **Viewer** 联动才行。

## 思路
相比二三维根据获取当前屏幕范围来实现联动，双屏联动就相对简单些。可以利用 **Viewer.camera.changed** 事件来监听变换，然后获
取当前的 **Viewer.camera** 的值，去更新另一个 **Viewer** 相机的位置。

>  **Viewer.camera.setView({...})**

{% note danger %} 
     
 > 监听变化的时候，需要调整一下 **viewer.camera.percentageChanged**的值，取值范围是 0~1，默认是 0.5。 越小，联动的越丝滑。
 > 我用的是 0.001，看起来相对丝滑些。
     
{% endnote %} 

## 核心实现
 1. 给创建的两个**Viewer.camera.changed** 添加监听事件。
 ```js
     initViewerEvent(){
        this.viewer.camera.changed.addEventListener(this.vieweExtentChange);
        this.viewer.camera.percentageChanged = 0.001;
        // this.viewer.camera.percentageChanged = 0.8;

        this.cmViewer.camera.changed.addEventListener(this.vieweEXExtentChange);
        this.cmViewer.camera.percentageChanged = 0.001;
        // this.cmViewer.camera.percentageChanged = 0.8;

        this.vieweExtentChange()
        this.viewerDiv.style.visibility = 'visible'
     }
     vieweExtentChange(){
    
        this.cmViewer.camera.changed.removeEventListener(this.vieweEXExtentChange);
        this.updateView(this.viewer, this.cmViewer);

        this.cmViewer.camera.changed.addEventListener(this.vieweEXExtentChange);
     }
    
     vieweEXExtentChange(){

        this.viewer.camera.changed.removeEventListener(this.vieweExtentChange);
        this.updateView(this.cmViewer, this.viewer);

        this.viewer.camera.changed.addEventListener(this.vieweExtentChange);
     }
    
 ```
 2. 更新相机视角
 ```js
    updateView(viewerChange,viewerUpdate){
        const camera = viewerChange.camera
        viewerUpdate.camera.setView({
            destination:camera.position,
            orientation: {
                heading: camera.heading,
                pitch: camera.pitch,
                roll: camera.roll
            }
        })
    }
 ```


## 效果
看一下 **viewer.camera.percentageChanged** 不同值的联动效果
 
 - 赋值0.8
  <video   controls width='100%' autoplay height='100%'>
    <source src="1.mp4" type="video/mp4">
  </video>
  
 - 赋值0.001
  <video   controls width='100%' autoplay height='100%'>
     <source src="2.mp4" type="video/mp4">
  </video> 

最后加上卷帘的效果
  <video   controls width='100%' autoplay height='100%'>
      <source src="3.mp4" type="video/mp4">
  </video> 

## 总结
上面的功能基本是能满足项目的需求，这里只是介绍基本实现，具体 **Viewer** 里面展示的内容，根据项目实际需求来丰富内容即可。根
据核心代码基本就能自己完成功能了，就不再上传源码啦。


## 题外分享
之前看了一个有趣的小工具 **RunCat** , 在 Windows 任务栏，随 CPU 越跑越快的猫 <a href='https://www.appinn.com/runcat-for-windows/' target="_blank" >介绍</a>。自己就下载安装了一下，还挺好玩。
  <img src='1.gif' />
请忽略录制效果￣□￣｜｜

## 音乐小憩
{% aplayer "你的眼神" "蔡琴" "https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/yatJ97AitORttQkDK1pi9UcpOWmCItYQ/%E8%94%A1%E7%90%B4-%E4%BD%A0%E7%9A%84%E7%9C%BC%E7%A5%9E.mp3" "https://imgessl.kugou.com/stdmusic/20191224/20191224110806951564.jpg"  %}
