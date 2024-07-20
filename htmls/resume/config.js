//工作经历配置
const WorkConfig = [

    {
        companyName:'北京踏歌智行',
        jobName:'Webgis开发工程师',
        workDate:'2022.03 -- 至今',
        list:[
            {
                title:'高精地图在线编辑工具系统',
                des:'基于vue，Openlayers，geoserver，postgis，turf.js实现对露天矿区的高精地图数据的编辑，管理和发布的webgis系统。实现矿区\n' +
                    '点线面的基础渲染展示，车辆实时位置展示，车道限速，车道坡度专题图等专题图展示，对线和面的绘制，打断，合并，位置拖拽，平移旋转和\n' +
                    '删除等空间数据编辑操作，控制采集车辆的开关，对采集的点云数据和自动提取的边界数据进行编辑用于更新地图数据。',
                part:'负责整个高精地图系统版本前端迭代开发，相关文档输出以及版本维护，完成地图工具新功能开发，优化现有地图工具交互逻辑，提升\n' +
                    '工具的易用性操作，提升地图渲染性能。',
                img:[
                    './resume/img/gjdt/1.png',
                    './resume/img/gjdt/2.png',
                    './resume/img/gjdt/3.png',

                ]
            },
            {
                title:'感知建图点云数据展示和边界操作',
                des:'用使用Potree和threejs，实现对感知提取的点云数据，边界线数据，和相机数据渲染展示，编写边界线绘制，延伸，打断合并等空间\n' +
                    '操作工具，为后续地图更新提供数据基础',
                part:'负责项目的前端开发，potree框架研究使用，和后续地图产品的集成。使用threejs展示和处理边界数据。',
                img:[
                    './resume/img/gzjt/1.png',
                    './resume/img/gzjt/2.png',

                ]
            },
            {
                title:'高精地图数据和感知采集数据集成显示预研',
                des:'基于Foxglove自动驾驶显示开源框架研究，实现高精地图数据，感知采集数据和车辆实时位置集成显示。',
                part:'负责研究foxglove前端渲染框架源码研究，了解ROS消息发送规则，研究本地模型文件加载，使用node解析高精地图数据db文件，实\n' +
                    '现车辆位置，点云数据和地图数据叠加集成显示。',
                img:[
                    './resume/img/foxglove/1.png',
                    './resume/img/foxglove/2.png',
                ]
            },
            {
                title:'直播平台系统',
                des:'基于Vue2，Cesium实现矿区实时车辆位置和信息的三维展示系统。',
                part:'负责项目三维地图展示部分前端开发，对接基于车辆实时推送坐标，进行平滑插值处理，实现车辆位置平滑移动和角度平滑变换。',
                img:[
                    './resume/img/zhibo/1.png',

                ]
            },
            {
                title:'WebSDK 1.0版本封装',
                des:'基于Vite，Openlayers 封装二维的地图SDK，用于给其他平台地图相关信息的展示，和二次开发。',
                part:'负责研究Vite库模式的使用，搭建整体项目框架，打包剔除ol，turf等三方库，减少打包体积。基于现有的高精地图系统，封装了根据\n' +
                    '地图版本查询和展示功能，专题图展示功能，影像加载功能，自定义配置图层和加载功能，基础的测量测距，坐标拾取，坐标定位等其他基本功能。',
                img:[]
            },
            {
                title:'数据回放系统',
                des:'基于Vue2，Openlayers，WebSDK实现调度平台数据的回放查看，根据回放时间查询展示当前时间段使用的地图数据，规划的路径\n' +
                    '数据，告警数据等，方便问题排查。',
                part:'负责项目中地图部分功能开发，完成了车辆信息，路权信息，轨迹信息，规划数据，和排土线排土块数据等其他数据信息展示。',
                img:[
                    './resume/img/huifang/1.png',
                ]
            },
            {
                title:'仿真Web工具系统',
                des:'基于Vue2，Openlayers，WebSDK开发Web端仿真系统，脱离Anylogic，提升系统的稳定性和易用性，和多功能性。',
                part:'负责项目中地图部分功能开发，实现车辆指点上下线，电铲指点上下线，批量上下线等功能。',
                img:[
                    './resume/img/fangzhen/1.png',

                ]
            }
        ]
    },
    {
        companyName:'河南国测信息',
        jobName:'GIS研发工程师',
        workDate:'2018.05 -- 2022.03',
        list:[
            {
                title:'智慧卫东一张图',
                des:'实现对加格达奇区卫东街道的相关空间信息展示。基于Cesium + Openlayers 对卫东数据的倾斜摄影数据，分层分户数据，地下管线数据以及相关空间业务数据，在二三维一张图中进行展示，分析，统计等。',
                part:'负责项目的前端架构搭建，以及二三维地图界面编写。同时处理相关三维数据，用于系统展示。',
                img:[
                    './resume/img/wd/1.png',
                    './resume/img/wd/2.png',
                    './resume/img/wd/3.png',
                    './resume/img/wd/4.png',

                ]
            },
            {
                title:'智慧三维矿山监管信息系统',
                des:'实现矿山三维模型的加载展示，提供测量等分析功能，进行矿山进行监控管理。',
                part:'负责项目的前端架构搭建，三维模式数据处理，界面编写和调整。系统部署。',
                img:[
                    './resume/img/ks/1.png',
                    './resume/img/ks/2.png',
                    './resume/img/ks/3.png',
                    './resume/img/ks/4.png',
                    './resume/img/ks/5.png',
                    './resume/img/ks/6.png',
                ]
            },
            {
                title:'鹤壁市淇滨区创新区园区三维管理平台',
                des:'对园区的模型加载显示，与摄像头数据，停车道闸，路灯数据对接展示。',
                part:'模型数据处理，界面编写和系统部署。',
                img:[
                    './resume/img/hb/1.png',
                    './resume/img/hb/2.png',
                    './resume/img/hb/3.png',
                ]
            },
            {
                title:'勘探公司地理信息系统',
                des:'基于 mapboxgl，ant-design-vue 前端展示框架，postgis 矢量切片服务支持，对石油管道及相关数据展示，查询分析。',
                part:'主要项目二维地图部分，三维部分展示',
                img:[
                    './resume/img/yc/1.png',
                    './resume/img/yc/2.png',
                    './resume/img/yc/3.png',
                    './resume/img/yc/4.png',
                    './resume/img/yc/5.png',
                    './resume/img/yc/6.png',
                    './resume/img/yc/7.png',
                    './resume/img/yc/8.png',
                ]
            },
            {
                title:'上海农业遥感监测系统',
                des:'对上海农科院提供的实验田的空间数据展示，对接监测设备，展示设备数据',
                part:'负责项目的前端开发，和系统部署。',
                img:[
                    './resume/img/shnky/1.png',
                    './resume/img/shnky/2.png',
                    './resume/img/shnky/3.png',
                    './resume/img/shnky/4.png',
                ]
            },
            {
                title:'广州航道局控制点桌面管理系统',
                des:'用于管理广州航道分布的 GPS 控制点和水准点，基于 openlayers 展示控制点分布，空间查询和统计，控制点信息导出文档,点的编辑等。',
                part:'负责项目的前后端开发，和系统部署。',
                img:[
                    './resume/img/hangdao/1.png',
                    './resume/img/hangdao/2.png',
                    './resume/img/hangdao/3.png',
                ]
            },
            {
                title:'大地坐标转换软件',
                des:'基于 Qt、 QGIS 针对国家统一使用 2000 大地坐标系政策，用于 wgs84 ,西安 80,北京 54 转换成 2000 国家大地坐标系。',
                part:'负责软件的坐标数据文件读取和计算七参数和四参数，导出成txt格式。',
                img:[
                ]
            }
        ]
    },
    {
        companyName:'河南汉威电子',
        jobName:'GIS研发工程师',
        workDate:'2017.07-2018.05',
        list: [
            {
                title:'鹤壁浚县管网监测',
                des:'基于 arcgis api for js ，一张图展示浚县管网分布，水表压力检测和报警。',
                part:'负责地图中的空间查询和属性查询，测量，数据详情展示。',
                img:[
                ]
            },
            {
                title:'智慧社区',
                des:'基于 arcgis api for js ，对正弘数码港小区试点楼层分布展示。',
                part:'负责地图中的空间查询和属性查询，图层控制，数据详情展示。',
                img:[
                ]
            }
        ]
    }

]

//技能
const SkillConfig = [
    {
        title:  'html、 js、css、jquery、Vue'
    },
    {
        title:  '了解 webpack 打包、ES6 语法、less 语法'
    },
    {
        title: 'Arcgis api for js （3.x）、openlayers、mapboxgl 、Cesium 前端 GIS 渲染框架',
    },
    {
        title: 'ElementUI、ant-design-vue 前端 vue 展示框架',
    },
    {
        title:  'postgis 入库 postgresql、postgis 函数返回矢量切片',
    },
    {
        title:   'ArcMap 基本数据处理，ArcServer 服务发布 , geoserver 发布服务, CesiumLab 三维数据处理',
    },
    {
        title:    '熟悉 OGC 服务标准，WFS,WMS,WTMS,TMS,WCS',
    },
    {
        title:    '了解 linux 基础操作命令，Nginx 资源代理和跨域配置',
    },
    {
        title:    '个人博客地址：',
        url: 'https://jercky.top/'
    },
    {
        title:   'Npm 个人上传库 mapboxgl-measure-tool、mapboxgl-print-tool'
    },
    {
        title:   '三维功能整理展示：',
        url: 'http://jerckly.gitee.io/cesium-view/#/'
    },

]

//获奖
const AwardConfig = [
    {
        title:'2014国家励志奖学金。',
        img:[
            './resume/img/award/1.png',
        ]
    },
    {
        title:'2015个人奖学金。',
        img:[
            './resume/img/award/2.png',
        ]
    },
    {
        title:'2016国家励志奖学金，2016学习进步奖学金。',
        img:[
            './resume/img/award/3.png',
            './resume/img/award/4.png',
        ]
    },
    {
        title:'2020年国土资源（广东）科学技术二等奖。',
        img:[
            './resume/img/award/5.png',
            './resume/img/award/6.png',
        ]
    },
]
