---
title: Cesium系列(2)--绘制图片文字标注
date: 2020-07-21 17:53:50
tags: 
 - cesium 
 - webgis 
categories: Cesium
description: Cesium系列
top_img: 3.png
---

## <center>基于Cesium Billboard的图文标注<center/>

## 背景
  项目需求：在模型上方添加文字标注，背景是一张图片。   
  如果只是加文字的话，**Cesium** 直接加一个**label**就行了，或者只加一个图片，**Cesium** 直接加一个 **billboard** 也是可以的。如果是两者结合是需要另外处理的。
  
## 单独文字
  单独加文字可以直接用 **label**, 伪代码如下：   
  ```js
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.1641667, 39.9522222),
        label: {
          text: "Philadelphia",
          font: "24px Helvetica",
          fillColor: Cesium.Color.SKYBLUE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        },
      });
  ```
  效果： 
  ![](2.png)
  
## 单独加图片
  单独显示图片使用 **billboard**, 伪代码如下：   
   ```js
     viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: "../images/Cesium_Logo_overlay.png",
        },
      });
   ```
  效果：   
  ![](img.png)
  
## 图文结合
  1. 思路：根据原始添加图片的过程，再结合 **billboard** 文档的查看其中的 **image** 定义：  
  ```
  image : StringScene/Billboard.js 910
  Gets or sets the image to be used for this billboard. If a texture has already been created for the given image, the existing texture is used.
  This property can be set to a loaded Image, a URL which will be loaded as an Image automatically, a canvas, or another billboard's image property (from the same billboard collection).
  ```
  > This property can be set to **a loaded Image, a URL which will be loaded as an Image automatically, a canvas, or another billboard's image property (from the same billboard collection)**.   
  > 可以将此属性设置为已加载的图像，将自动作为图像加载的URL，画布或其他广告牌的图像属性（来自同一广告牌集合）。
  
  上述文字说明 **image** 可以是 **canvas**, 那我们就可以把图片和文字画到 **canvas** 中，最后把结果赋值给 **image** 就行了。
  2. 实现：
   + 绘制图文方法  
      ```js
         //根据图片和文字绘制canvas  ratio参数 是放大倍数
         function drawCanvas(img, text, ratio) {
           // width height
           var canvas = document.createElement('canvas'); //创建canvas标签
           var ctx = canvas.getContext('2d');
       
           var width = ctx.measureText(text).width + 8,
             height = 20; //高度我这里是定死的，可以作为参数参入
       
           canvas.style.opacity = 1;
           canvas.width = width * ratio;
           canvas.height = height * ratio;
           canvas.style.width = width + 'px';
           canvas.style.height = height + 'px';
       
           //然后将画布缩放，将图像放大ratio倍画到画布上 目的 使图片文字更加清晰
           ctx.scale(ratio, ratio);
           var image = new Image();
           image.src = img;
            // 图片创建是异步操作，需要在图片完成之后，再写入文字，能保证文字在图片上方。
            // 如果不在里面，会出现图片覆盖文字
           image.onload = function () {
             ctx.drawImage(image, 0, 0, width, height);
             // 名称文字
             ctx.fillStyle = '#ff0000';
             ctx.font = '8px 宋体';
             ctx.fillText(text, 8, height / 2 + 2);
           };
       
           return canvas;
         }
      ```  
   + 加载到Cesium中 
      ```js
         viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(
                109.05830792532525,
                37.44105749283626,
                16
              ),
              billboard: {
                image: drawCanvas('./source/images/bg.png', 'Hello World 你好 Cesium!', 3),
                sizeInMeters: true,
                scale: 0.1,
              },
            });
      ``` 
   + 效果：
   ![](3.png)
  
## 音乐小憩
{% aplayer "渡口" "蔡琴" "//freetyst.nf.migu.cn/public/product8th/product38/2020/03/1620/2018%E5%B9%B409%E6%9C%8814%E6%97%A515%E7%82%B953%E5%88%86%E7%B4%A7%E6%80%A5%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E5%8D%8E%E7%BA%B3999%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/6005751EW9N.mp3?key=e72e077e1e66d0f6&Tim=1597915021839&channelid=00&msisdn=f040f3f4e9c0474db35d5c03e22cc5dd&CI=6005751EW9N2600908000009874924&F=000009" "https://cdnmusic.migu.cn/picture/2019/0708/0828/ASad0c2272b87e4adda1785884fe48f6e7.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/xXlvmhpPI1HfmEEjeoVzjxdjuVky7fOc/%E6%B8%A1%E5%8F%A3%20-%20%E8%94%A1%E7%90%B4.lrc" %}
