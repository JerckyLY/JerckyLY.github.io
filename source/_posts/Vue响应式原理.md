---
title: Vue响应式原理 Vue2--Vue3对比
date: 2020-12-15 10:55:43
tags:
 - Web前端
 - Vue
categories: Vue
description: Vue系列
---
## <center>Vue响应式原理 Vue2和Vue3<center/>

`Vue` 作为前端三大主流框架之一，它的数据驱动视图无疑是重大特点之一。9月18号尤大发布了 `Vue3`,它比上一版本运行更快，体积更小，也增加了 `Composition API` 组合式编程，支持 `typeScript`，优化了 `DOM Diff` 算法等一系列的优化。更加的趋向于 `函数式编程`。
`Vue` 的知识点不少，今天就主要介绍响应式原理，看看 `Vue2` 和 `Vue3` 在这方面的区别。

## Vue2
 
 响应式或者说数据驱动视图的关键点在于我们如何知道数据发生了变化，即数据什么时候被读取或者被修改了。而这些， `JavaScript` 提供了 <a href='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty' target="_blank" >Object.defineProperty</a>   方法，改方法能很轻松的达到观察数据变化的目的。
 
 ### Object.defineProperty
 -  让 `Object` 类型数据变得可观测    
    借助 `Object.defineProperty` 很容易实现，代码如下：
    ```js
       let apple = {}
       let val = 5
       Object.defineProperty(apple, 'price', {
         enumerable: true,
         configurable: true,
         get(){
           console.log('price属性被读取了')
           return val
         },
         set(newVal){
           console.log('price属性被修改了')
           val = newVal
           console.log('price属性修改后的值为',newVal)
         }
       })
       console.log(apple.price)  // get 获取
       apple.price = 8           // set 修改
    ```
    代码中定义了一个 `apple` 对象，通过 `Object.defineProperty` 定义了一个 `price` 属性，然后对该属性的 `get` , `set` 方法进行拦截。运行结果如下：
    ![](1.png)
    可以看到 `apple` 对象的读写操作都主动告知了我们，那这个 `apple` 对象就是可观测的。
   
    
 - 不足    
   由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的。   
    ```js
        var vm = new Vue({
          data:{
            a:1
          }
        })
        
        // `vm.a` 是响应式的
        
        vm.b = 2
        // `vm.b` 是非响应式的
     ```
    对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property。但是，可以使用 `Vue.set(object, propertyName, value)` 方法向嵌套对象添加响应式 property。例如：
    ```js
       Vue.set(vm.someObject, 'b', 2)
    ```



### Array数据变化监测
  由于 `Array` 类型是无法使用 `Object.defineProperty`, 因此对于 `Array` 数据类型，需要设计一套另外的变化检测机制。
 
  - getter    
    由于我们在平常的 `Vue` 项目开发中，都是在组件中的 `data` 中定义数组的：
    ```js
     data (){
       return {
         arr:[1,2,3]
       }
     }
    ```
    所以，对于 `getter` 我们想要获取 `arr` 必须是先在 `data` 这个 `Object`类型的数据获取，那就必定触发 `arr` 的 `getter` 。因此 `Array` 类型的数据读取操作还是从 `getter` 中发出。
    ```js
        let data = {
          arr: [1,2,3,4,5]
        }
        var vals = data['arr']
        Object.defineProperty(data, 'arr', {
          enumerable: true,
          configurable: true,
          get(){
            console.log('arr属性被读取了 data')
            return vals
          },
          set(newVal){
            console.log('arr属性被修改了 data')
            vals = newVal
          }
        })
        
        console.log(data.arr[0])
    ```
    结果如下：
    ![](3.png)
    
  - setter   
    对于 `Object` 数据类型，数据的操作可以从 `setter` 中得知，但是 `Array` 是没有的。不过 `Array` 提供了一些方法来操作 `Array`。 操作了 `Array` 那数据就一定是发生了变化的，那我们可以把数组的几个操作方法都重新写一遍，在不改变原有功能的基础上，增加一些其他的操作，不就可以达到目的了。这个操作可以称为数组拦截器。 
   ```js
    let arr = [1,2,3]
    arr.push(5)
    Array.prototype.newPush = function(val){
      console.log('arr被修改了')
      this.push(val)
    }
    arr.newPush(5)

   ```
   这是尤大在 `Vue` 中处理数组监听修改操作的方式，是不是很厉害。数组修改拦截器：
   ![](2.png)
   在 `Array` 原型中能改变数组内容的方法有7个，分别是 `pop` , `push`, `shift`, `unshift`, `splice`, `sort`, `reverse`。源码中的拦截器：
   ```js
    const arrayProto = Array.prototype
    const arrayMethods = Object.create(arrayProto)
    
    const methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ]
    
    /**
     * Intercept mutating methods and emit events
     */
    methodsToPatch.forEach(function (method) {
      // cache original method
      const original = arrayProto[method]
      Object.defineProperty(arrayMethods, method, {
        value: function mutator(...args){
          const result = original.apply(this, args)
          console.log('arr属性被修改了', method)
          return result
        },
        enumerable: false,
        configurable: true,
        writable: true,
      })
    })

   ```
   > 写好了操作拦截器之后，还需要在数组对象和 `Array.Prototype` 之间挂载，使拦截器生效。
   ```js
    function protoAugment (target, src) {
      target.__proto__ = src
    }
    
    /**
     * Augment a target Object or Array by defining
     * hidden properties.
     */
    /* istanbul ignore next */
    function copyAugment (target, src, keys) {
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        Object.defineProperty(target,key,{
          value:src[key],
          enumerable: false,
          configurable: true,
          writable: true,
        })
      }
    }
    
    let arr = [1,2,3,4,5]
    //拦截器挂载
    const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
    if('__proto__' in {}){  // 浏览器是否支持 __proto__
      protoAugment(arr, arrayMethods)
    }else{
      copyAugment(arr, arrayMethods, arrayKeys)
    }

    arr.push(0)
    arr.pop(0)
    arr.shift(-1)
    arr.unshift(-1)
    arr.splice(0,3)
    arr.sort()    
    arr.reverse()
    console.log(arr)
   ```
   代码中 `'__proto__' in {}` 这个是用来判断浏览器是否支持 `__proto__` 属性，如果支持就直接使用，不支持就循环定义几种操作方法。
   ![](4.png)
   
   这样我们就可以得知 `Array`数据在什么时候改变了。
   
  - 不足   
     当我们利用索引直接操作一个数组项 `vm.items[indexOfItem] = newValue` 或者 修改数组的长度时 `vm.items.length = newLength` 都是无法达到监测的。
     不过可以使用 `Vue.set` 和 `Array.splice` 实现监测功能。
     

## Vue3
  在 `Vue3`中，引入了ES6中的 <a href='https://es6.ruanyifeng.com/?search=Object&x=0&y=0#docs/proxy' target="_blank" >Proxy</a> 来实现对数据的监听。
  `Proxy` 可以理解为在目标对象之前架设了一层拦截，即拦截器，通过拦截器，来得知`getter` 和 `setter` 在何时触发。
  区别于 `Object.defineProperty`针对于对象的属性操作，`Proxy` 是直接操作对象的。因此，不必像 `Vue2` 那种需要分 `Object` 和 `Array` 两种类型分别处理。直接使用 `Proxy`就可以达到对两种数据的监听。
  
  - `Object` 类型
    ```js
         let data = {
           name: '小明',
           age: 20
         }
         let state = new Proxy(data,{
           get(obj,key){
            console.log('data '+key+'属性被获取了')
            return obj[key]
           },
           set(obj,key,newVal){
             console.log('data '+key+'属性被修改了')
             obj[key] = newVal
             return true
           }
         })
        
        console.log(state.name)
        state.age = 21 
    ```
    结果如下：
    ![](5.png)
    
  - `Array` 类型
    ```js
      let arr = [-1,-2,-3,-4,-5]
       let state = new Proxy(arr,{
         get(obj,key){
          console.log('arr '+key+'被获取了')
          return obj[key]
         },
         set(obj,key,newVal){
           console.log('arr '+key+'被修改了')
           obj[key] = newVal
           return true
         }
       })
      
      console.log(state[0])
      state.push(-6)
      state[7] = 0
      state.splice(-1,1)
      console.log(state)
    ```
    ![](6.png)
    使用 `state[7] = 0` 这种方式也能直接变成响应式了。是不是很强！
    
## 总结
内容稍微有点长，`Vue2`的响应式原理核心是用到了 `Objeck.defineProperty` 来对 `Object`类型数据监听。重写了数组中的7个操作数组本身内容的方法来监听。`Vue3` 是用 `Proxy` 来达到监听。这方面看来是 `Vue3` 是更加方便且更强大了。
   
## 音乐小憩
{% aplayer "暗里着迷" "吉他的天空" "https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/ee1dac131f1f1efe73c0.mp3/%E5%90%89%E4%BB%96%E7%9A%84%E5%A4%A9%E7%A9%BA-%E6%9A%97%E9%87%8C%E7%9D%80%E8%BF%B7.mp3" "https://imgessl.kugou.com/stdmusic/20200605/20200605154230691765.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/NPyafl6OHDUGaFGSJ10JvThN7JHRXTR9/%E6%9A%97%E9%87%8C%E7%9D%80%E8%BF%B7%20-%20%E5%90%89%E4%BB%96%E7%9A%84%E5%A4%A9%E7%A9%BA.lrc" %}
