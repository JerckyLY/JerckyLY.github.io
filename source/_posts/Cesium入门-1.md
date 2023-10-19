---
title: Cesium系列(1)--Vue-cli3 + Cesium 快速构建
date: 2020-07-01 21:06:13
tags: 
 - cesium 
 - webgis 
categories: Cesium
description: Cesium系列
top_img: view1.png
---

## <center>vue-cli3集成Cesium的vue.config.js配置<center/>

## 前言
  2020年给你讲个笑话，鹅厂被骗了。hhhhhhh。   
  很久没更新了。疫情影响，经历了在家办公，也经历了出门戴口罩的时期。不过，一切都会好的。   
  言归正传，新的一年，不管经历了什么都要继续。今年准备从二维转战三维了，开源免费的目前也就是Cesium了。之前一直都知道这个，只是从来没有真正的使用过，接触过。刚开始的时候，就看了一天的资料，也就是本地运行一下，大致看了一下代码和案例。然后就给我一个项目让我直接该需求了，头两天也是有点手忙脚乱，现在大概了解一点了，就记录一下最近遇到的问题。
 
## 步骤
  1. 有个vue-cli3的项目, 然后用 **npm** 命令去安装 **cesium**
    ```
       npm i cesium  或者 cnpm i cesium 
    ```
  2. 安装 **cesium** 之后 需求在 **vue.config.js** 文件中去配置，如果没有该文件就在根目录新建一个。
  3. 配置内容
      ```js
        const CopyWebpackPlugin = require('copy-webpack-plugin')
        const webpack = require('webpack')
        const path = require('path')
        
        const cesiumSource = './node_modules/cesium/Source'
        const cesiumWorkers = '../Build/Cesium/Workers'
        // 后续 import 引入 cesium 为改路径下的
        const cesiumBuild = './node_modules/cesium/Build/Cesium'
        
        module.exports = {
            // 基本路径
            publicPath: "./",
            // 输出文件目录
            outputDir: "dist",
            // eslint-loader 是否在保存的时候检查
            lintOnSave: false,
            // webpack-dev-server 相关配置
            devServer: {
                open: process.platform === "darwin",
                host: "0.0.0.0",
                port: 5000,
                https: false,
                hotOnly: false,
                disableHostCheck: true
        
            },
        
            configureWebpack: {
                output: {
                    sourcePrefix: ' '
                },
                amd: {
                    toUrlUndefined: true
                },
                node: {
                    // Resolve node module use of fs
                    fs: "empty"
                },
                resolve: {
                    alias: {
                        'vue$': 'vue/dist/vue.esm.js',
                        '@': path.resolve('src'),
                        'cesium': path.resolve(__dirname, cesiumBuild)
                    }
                },
                plugins: [
                    new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
                    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
                    new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
                    new CopyWebpackPlugin([{ from: path.join(cesiumSource, '../Build/Cesium/ThirdParty'), to: 'ThirdParty' }]),
                    new webpack.DefinePlugin({
                        CESIUM_BASE_URL: JSON.stringify('./')
                    })
        
                ],
                module: {
                    unknownContextCritical: false
                }
            }
        };
      ```
  4. 在文件中引用 **cesium**
     ```js
        import "cesium/Widgets/widgets.css";
        import * as Cesium from "cesium/Cesium";
     ```
  5. 实例化  
     ```js
         methods: {
                initCesium () {
                    console.log(Cesium.VERSION)
                    // viewer对象不能放入data中，由于vue会对data对象监听，会使内存暴增。
                    window.$CViewer =  new Cesium.Viewer('cesiumContainer', {
                        //Hide the base layer picker
                        baseLayerPicker: false,
                        // timeline: false,
                        animation: false,
                        shouldAnimate: true,
                        navigationHelpButton: true,
                        fullscreenButton: false,
                        geocoder: false,
                        scene3DOnly: true,
                        homeButton: true,
                        imageryProvider: new Cesium.UrlTemplateImageryProvider({
                            url: 'http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}',
                            credit: '',
                            tilingScheme: new Cesium.WebMercatorTilingScheme()
                        }),
                        mapProjection: new Cesium.WebMercatorProjection()
                    });
                    // 添加天地图标注图层
                    let tdt =  $CViewer.scene.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                        url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=f47269183506137375ed3a960cb675cd",
                        layer: "tdtAnnoLayer",
                        style: "default",
                        format: "image/jpeg",
                        tileMatrixSetID: "GoogleMapsCompatible"
                    }));
                    // 加载3dtiles
                    const tileset = new Cesium.Cesium3DTileset({
                        url: 'Cesium3DTiles/Tilesets/Tileset/tileset.json'
                    });
        
                    tileset.readyPromise.then(function(tileset) {
                        $CViewer.scene.primitives.add(tileset);
                        $CViewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0));
                    }).otherwise(function(error) {
                        console.log(error);
                    });
                }
            }
     ```
  6. 注意项
     {% note danger %} 
     
     > 实例化的viewer对象，不能放入vue的 **data** 中去，由于vue的机制，会监听data中的属性。如果放入data中，会内存容易爆掉。最好的方法是放入 **window** 对象中。
     
     {% endnote %} 
     
      ```js
         window.$CViewer = new Cesium.Viewer()
      ```   
     
     {% note info %} 
       
      > 对于本地模型文件我一般都是放入public文件夹引入
       
     {% endnote %} 
     
## 后续
  > 后面会写项目中遇到的各种问题，再之后就开始写源码关于Cesium3DTiles调度的一点点研究成果  

## 音乐小憩
{% aplayer "我曾" "隔壁老樊" "//freetyst.nf.migu.cn/public/productBe/productB01/2019/08/0717/2019%E5%B9%B403%E6%9C%8801%E6%97%A516%E7%82%B937%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E5%8D%8E%E5%A4%8F%E5%8A%A8%E5%A3%B01%E9%A6%96/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/63254103405.mp3?key=f5f6bf49ae541152&Tim=1597915519527&channelid=00&msisdn=7189f4cfa3ba4332ab8ddd058a1fb038&CI=632541034052600913000002629846&F=000009" "https://cdnmusic.migu.cn/picture/2020/0801/0249/ASf1b833147de26840e610c45b96643885.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/KN5MLl4Gc4ff5x9uqOk8xjvWTiERAN24/%E6%88%91%E6%9B%BE%20-%20%E9%9A%94%E5%A3%81%E8%80%81%E6%A8%8A.lrc" %}
