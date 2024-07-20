---
title: Cesium系列(3)--全景漫游(室内漫游)第一视角跟随
date: 2020-08-19 22:05:10
tags: 
 - cesium 
 - webgis 
categories: Cesium
description: Cesium系列
top_img: top.png
---
## <center>Cesium的全景漫游(室内漫游)第一视角跟随<center/>

>Cesium的示例中是有漫游的示例。但是角度并不是第一视角。如下图：   

![](1.png)

在对于特殊的需求中，比如室内漫游。如果不是第一视角，漫游的过程中会被室内其他物体遮挡，效果不好，也不切实际。因此需要在此基础上进行修改，以达到好的效果。

## 实现
 1. 在实际应用中，漫游的路线是规划好的。也就是一系列的坐标点，然后根据坐标点插值计算，平滑运动。获取的方式很多种，看实际项目需求。我是事先选取好的点。
  ```js
    var myPositions = [
      [109.05832893717263, 37.441496598851096],
      [109.05855416786699, 37.44130123438769],
       //...       
      [109.0587449465546, 37.44119249116668],
      [109.05845600554856, 37.441396645980845],
    ];
  ```
  >  只有经纬度没有高度，因为我是把高度写死的，如果需要高度变化，是可以加上高度。

 2. 指定动画的起始时间，然后把 **timeline** 调整至起始时间，然后设置相关参数
   ```js
      var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
      var stop = Cesium.JulianDate.addSeconds(
        start,
        myPositions.length - 1,
        new Cesium.JulianDate()
      );
    
      //Make sure viewer is at the desired time.
      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      viewer.clock.multiplier = 0.3;

      //Set timeline to simulation bounds
      viewer.timeline.zoomTo(start, stop);
   ```
   开始时间是可以随意给定的，我这里给的是 **new Date(2015, 2, 25,16)**
   结束时间这一点需要注意的是，根据数组的长度来定的。结束时间必须大于开始时间。
   ```js
   var stop = Cesium.JulianDate.addSeconds(
       start,
       myPositions.length - 1,
       new Cesium.JulianDate()
     );
   ```
   设置动画的参数：**clockRange** 是播放模式 **Cesium.ClockRange.LOOP_STOP** 自动循环播放。**multiplier** 是播放的速度
  
 3. 根据坐标数组，计算插值点数据
   ```js
     function computeCirclularFlight() {
        var property = new Cesium.SampledPositionProperty();
        //设置插入选项
        property.setInterpolationOptions({
          // interpolationDegree: 1,
          // interpolationAlgorithm: Cesium.LinearApproximation,

          // interpolationDegree: 5,
          // interpolationAlgorithm:
          //   Cesium.LagrangePolynomialApproximation,

          interpolationDegree: 2,
          interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
        });
        for (var i = 0; i < myPositions.length; i++) {
          var time = Cesium.JulianDate.addSeconds(
            start,
            i,
            new Cesium.JulianDate()
          );
          var position = Cesium.Cartesian3.fromDegrees(
            myPositions[i][0],
            myPositions[i][1],
            5
          );
          property.addSample(time, position);
        }
        return property;
    }
   ```
   不同插值配置设置，得出来的结果是不同的，可以参照Cesium示例查看。
    
 4. 创建运动的物体，并把物体设置为镜头追踪的对象。
    ```js
      var position = computeCirclularFlight();
      //Actually create the entity
      var entity = viewer.entities.add({
        //Set the entity availability to the same interval as the simulation time.
        availability: new Cesium.TimeIntervalCollection([
          new Cesium.TimeInterval({
            start: start,
            stop: stop,
          }),
        ]),
        //Use our computed positions
        position: position,
        //Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(position),
        model: {
          uri: './SampleData/models/CesiumAir/Cesium_Air.glb',
          minimumPixelSize: 64,
        },
        //Show the path as a pink line sampled in 1 second increments.
        path: {
          resolution: 1,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.GREEN,
          }),
          width: 16,
        },
      });
      //追踪物体
       viewer.trackedEntity = entity;  
    
    ```
 5. 每一帧根据物体的坐标和走向，设置相机的角度
    ```js
     //视角变换
     var matrix3Scratch = new Cesium.Matrix3();
     function getModelMatrix(entity, time, result) {
      var position = Cesium.Property.getValueOrUndefined(
        entity.position,
        time,
        new Cesium.Cartesian3()
      );
      if (!Cesium.defined(position)) {
        return undefined;
      }
      var orientation = Cesium.Property.getValueOrUndefined(
        entity.orientation,
        time,
        new Cesium.Quaternion()
      );
      if (!Cesium.defined(orientation)) {
        result = Cesium.Transforms.eastNorthUpToFixedFrame(
          position,
          undefined,
          result
        );
      } else {
        result = Cesium.Matrix4.fromRotationTranslation(
          Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
          position,
          result
        );
      }
      return result;
    }
     var scratch = new Cesium.Matrix4();
     var renderListener = function (e) {
      //viewer.camera.positionCartographic.height = 2000 + $this.limitCamera(f_property);
      if (viewer.trackedEntity) {
        getModelMatrix(viewer.trackedEntity, viewer.clock.currentTime, scratch);

        var transformX = 90; //距离运动点的距离（后方）
        var transformZ = 55; //距离运动点的高度（上方）
        var transformY = 0; //距离运动点的高度（侧方）
        viewer.scene.camera.lookAtTransform(
          scratch,
          new Cesium.Cartesian3(-transformX, transformY, transformZ)
        );
      }
    };
     viewer.scene.preRender.addEventListener(renderListener);
    ```
    > 监听事件中，**transformX** 是相机距离运动点的正后方距离。**transformY** 是相机距离运动点的侧方距离。**transformZ** 是相机距离运动点的上方距离。
  
  
> 开始播放的时候 需要把 **shouldAnimate** 打开， viewer.clock.shouldAnimate = true; 
> 暂停播放 需要把 **shouldAnimate** 关闭， viewer.clock.shouldAnimate = false; 同时把镜头追踪对象去除 viewer.trackedEntity = undefined;

## 结果
 - 室外轨迹漫游
<video src='1.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>

 - 调整角度参数 室内漫游
 <video src='2.mp4' type='video/mp4' controls='controls'  width='100%' height='100%'></video>

## 代码
  完整代码都放到 **github** 上，需要的移步<a href='https://github.com/JerckyLY/cesium-demo-view' target="_blank" >Cesium-demo-view</a>  
  
## 音乐小憩
{% aplayer "等我先说" "夏天Alex" "//freetyst.nf.migu.cn/public/productBe/productB01/2019/08/0715/2013%E5%B9%B405%E6%9C%8814%E6%97%A5%E7%BE%8E%E5%8A%9B%E6%98%9F%E7%A9%BA%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A51%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/60066801295.mp3?key=1d5649e633106758&Tim=1603352822023&channelid=00&msisdn=6adb56a5e32741a08e14c0776ca4bf9f&CI=600668012952600902000007984502&F=000009" "https://p3fx.kgimg.com/stdmusic/20160907/20160907201949745191.jpg"      "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/9ko0PPFHUkbIABgM27KWdjzna2sH2xGq/%E7%AD%89%E6%88%91%E5%85%88%E8%AF%B4%20-%20%E5%A4%8F%E5%A4%A9Alex.lrc"%}
