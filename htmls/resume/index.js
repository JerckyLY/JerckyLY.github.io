// 在 #app 标签下渲染一个按钮组件
// Vue.use(vant.Lazyload);
// const imgLists = {
//     hangdao:[
//         './resume/img/hangdao/1.png',
//         './resume/img/hangdao/2.png',
//         './resume/img/hangdao/3.png',
//     ],
//     wd:[
//         './resume/img/wd/1.png',
//         './resume/img/wd/2.png',
//         './resume/img/wd/3.png',
//         './resume/img/wd/4.png',
//     ]
// }
new Vue({
    el: '#app',
    data(){
        return{
            checked:true,
            awardChecked:false,
            isClick: true,
            currentIndex:0,
            scroll: '',
            navList:[],
            WorkConfig,
            SkillConfig,
            AwardConfig
        }
    },
    computed:{
        age(){
            const current = new Date().getFullYear()
            const old = new Date('1994').getFullYear()
            return current - old
        },
        work(){
            const current = new Date().getFullYear()
            const old = new Date('2017').getFullYear()
            return current - old
        }
    },

    methods:{
        //照片统一做水印处理
        handleImgList(){
            Object.keys(imgLists).forEach(key=>{
                this.imgList[key] = []
                imgLists[key].forEach(url=>{
                   this.getImgUrl({
                       url,
                       content:'Jercky 的简历展示',
                       cb:(base64)=>{
                           this.imgList[key].push(base64)
                       }
                   })
                })
            })
        },
        //图片添加水印
        getImgUrl ({
                       url = '',
                       textAlign = 'left',
                       textBaseline = 'top',
                       font = '18px Microsoft Yahei',
                       fillStyle = 'rgba(255, 255, 255, 0.5)',
                       content = '我是默认的水印参数',
                       cb = null,
                       textX = 100,
                       textY = 30
                   } = {}) {
            // 创建所需要添加水印的img图片
            const img = new Image()
            img.src = url
            img.crossOrigin = 'anonymous'
            img.onload = function () {
                // 创建canvas，并将创建的img绘制成canvas
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')

                ctx.drawImage(img, 0, 0)
                ctx.textAlign = textAlign
                ctx.textBaseline = textBaseline
                ctx.font = font
                ctx.fillStyle = fillStyle
                ctx.rotate((Math.PI / 180) * 15)
                // 循环绘制水印
                // ctx.fillText(content, img.width - textX, img.height - textY)
                for (let i = 0; i < img.height / 120; i++) {
                    for (let j = 0; j < img.width / 50; j++) {
                        ctx.fillText(content, i * 200, j * 100, img.width)
                    }
                }
                // 将绘制完成的canvas转换为base64的地址
                const base64Url = canvas.toDataURL()
                cb && cb(base64Url)
            }
        },
        mousedown() {
            this.isClick = true;
        },
        mousemove() {
            this.isClick = false;
        },
        //预览图片
        previewImg(images,index){
            vant.ImagePreview({
                images,
                showIndex:true,
                loop:true,
                startPosition:index,
                showIndicators:true,
                closeable: true,
            })
        },
        getNav(){
            const navs = document.getElementsByTagName('h2');
            const list = []
            for (let i = 0; i < navs.length; i++) {
                let item = {}
                item.name = navs[i].innerText
                list.push(item)
            }
            this.navList = list
        },
        jump(index){
           this.currentIndex = index
            let jump = document.getElementsByClassName('main-view');
            // 获取需要滚动的距离
            let total = jump[index].offsetTop - 90;
            // // Chrome
            // document.body.scrollTop = total;
            // // Firefox
            // document.documentElement.scrollTop = total;
            // // Safari
            // window.pageYOffset = total;
            //滚动动画
            window.scrollTo({top:total,behavior:'smooth'})
        },
        dataScroll(){
            this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
        },
        loadScroll(){
            const sections = document.getElementsByClassName('main-view');
            for (let i = sections.length - 1; i >= 0; i--) {
                if (this.scroll >= sections[i].offsetTop - 90) {
                    //我在上面规定了每个el-tab-pane标签的name属性值为tab+该标签的index值
                    this.currentIndex = i
                    break;
                }
            }
        }
    },
    watch:{
        scroll(){
            this.loadScroll()
        }
    },
    mounted(){
        window.addEventListener('scroll', this.dataScroll);
        //获取导航列表
        this.getNav()
        // 水印
        // this.handleImgList()

    }
});

// 调用函数组件，弹出一个 Toast
// 通过 CDN 引入时不会自动注册 Lazyload 组件
// 可以通过下面的方式手动注册
