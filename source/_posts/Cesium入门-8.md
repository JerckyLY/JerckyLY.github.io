---
title: Cesium系列(8)--自定义帧率显示
date: 2021-06-23 21:08:27
tags:
 - webgis
 - cesium 
categories: Cesium
description: Cesium系列
top_img: 2.png
---
## <center>Cesium自定义帧率显示<center/>

 **Cesium** 提供了不少用于调试的工具，特别方便在开发的时候使用。其中帧率显示特别方便我们对性能调试。因为帧率到了30以下就基
 本会开始卡顿了。如果想一直显示帧率，直接用 **Cesium** 默认的话，有时候会跟我们的界面的整体风格不搭配。那么就得自定义来实现
 了。
 
## 结果对比
  <div style="display: flex;justify-content: space-between;align-items: center" >
        <img src="1.png" >
        <img src="2.png">
  </div>
  
 看个动态的
  <video   controls width='100%' autoplay height='100%'>
    <source src="1.mp4" type="video/mp4">
  </video>
 
 因为用的是 **Cesium** 中的 **postRender** 监听事件，所以多少会跟自带的毫米值（ms）有点区别， 但是跟PFS值基本保持一致。而有参考价
 值的主要是 FPS值，在实际使用中，这一点点的差距不会影响判断。
 
## 实现
代码的实现很简单，我也是在源代码中查找的，然后改了一下。

 - 源代码 Source\Scene\PerformanceDisplay.js
  <img src="3.png"/>

 - 代码修改
  ```js
    class CesiumFPSUtil {
      constructor(containerId) {
        this.id = containerId || "fpsdiv";
        this._lastFpsSampleTime = getTimestamp();
        this._lastMsSampleTime = getTimestamp();
        this._fpsFrameCount = 0;
        this._msFrameCount = 0;
        this.createDiv();
      }
    
      createDiv() {
        const parent = document.getElementById(this.id);
        const fpsDiv = document.createElement("div");
        fpsDiv.className = "info-content";
    
        this._fpsText = document.createElement("span");
        this._msText = document.createElement("span");
        fpsDiv.append(this._fpsText);
        fpsDiv.append(this._msText);
        parent.append(fpsDiv);
      }
    
    
      update() {
        let time = getTimestamp();
        this._fpsFrameCount++;
        let updateDisplay = true;
        let fpsElapsedTime = time - this._lastFpsSampleTime;
        if (fpsElapsedTime > 1000) {
          var fps = "N/A";
          if (updateDisplay) {
            fps = ((this._fpsFrameCount * 1000) / fpsElapsedTime) | 0;
          }
    
          this._fpsText.innerText = fps + " FPS";
          this._lastFpsSampleTime = time;
          this._fpsFrameCount = 0;
        }
        this._msFrameCount++;
        let msElapsedTime = time - this._lastMsSampleTime;
        if (msElapsedTime > 200) {
          let ms = "N/A";
          if (updateDisplay) {
            ms = (msElapsedTime / this._msFrameCount).toFixed(2);
          }
    
          this._msText.innerText = ms + " MS";
          this._lastMsSampleTime = time;
          this._msFrameCount = 0;
        }
      }
    }
  ```
 - 相关函数getTimestamp
   ```js
      function getTimestamp() {
        var getTime;
      
        if (
          typeof performance !== "undefined" &&
          typeof performance.now === "function" &&
          isFinite(performance.now())
        ) {
          getTime = function () {
            return performance.now();
          };
        } else {
          getTime = function () {
            return Date.now();
          };
        }
        return getTime();
      }
   ```

 - 使用
   ```js
      //帧率显示
        const fpsInfo = new CesiumFPSUtil('fpsdiv')
        var fpsPostEvent = function (){
            fpsInfo.update()
        }
        viewer.scene.postRender.addEventListener(fpsPostEvent)
   ```

## 代码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/cesium-demo-view' target="_blank" >Cesium-demo-view</a>  

## 音乐小憩
{% aplayer "光明" "谭艳" "https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/8RbBFGccu3ci0lH0LqAl6O8WUBlLXNC8/%E8%B0%AD%E8%89%B3%20-%20%E5%85%89%E6%98%8E.mp3" "https://imgessl.kugou.com/stdmusic/20210113/20210113211448850090.jpg"  %}
