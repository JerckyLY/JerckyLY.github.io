---
title: 评论系统的变更
date: 2022-08-07 19:25:11
tags: 
  - valine
  - waline
categories: 资源分享
---

## <center>valine更改为waline评论系统<center/>
在7月份的时候收到了一份邮件，是**LeanCloud**发来的，内容如下：
![](1.png)
而这个调整带来的后果就是 **Valine + LeanCloud** 搭建的评论系统以及相关的评论内容管理系统和邮件通知就无
法使用了。就像这样的：
![](2.png)
本来想着等着网上有大佬发相关的解决方案，可能是我的搜索姿势不对，搜索结果还是之前的**Valine + 
LeanCloud** 搭建的评论系统教程，针对最新的问题并没有解决，所幸昨天换了一个搜索姿势，然后就看到了这个： （<a href="https://github.com/walinejs/waline/discussions/1203?sort=old" >原文地址</a>）
![](3.png)
> **LeanCloud 国际版 IP 限制的这个事情，对 Waline 没有影像哈，Waline 是用 Vercel 访问的 LeanCloud，Vercel 是国外 IP 所以不受影响。**

嗯？嗯！！！！这不就是解决方案嘛！哈哈哈，我感觉我血条又满了。

## Waline
**一款基于 Valine 衍生的简洁、安全的评论系统。** 这是官网的原话介绍，具体的信息道友们去官网查看就行了。
<a href="https://waline.js.org/" >Waline官网地址</a>

使用**Waline**最最最最重要的一点是，之前**Valine**评论的内容会依然保留。不会出现换个评论系统，之前的评论记
录就没了的尴尬情况。毕竟之前从 `livere来比力` 切换到 `Valine`就经历过一次。

更换的教程我就不叙述了，官网的教程写的很清楚，根据教程来一遍就能成功了。<a href="https://waline.js.org/guide/get-started.html" >快速上手</a>

> 稍微说一下的是评论邮箱通知，如果之前**Valine**的时候使用过，那**Waline**简单配置一下也是可以的。具体看教程<a href="https://waline.js.org/guide/server/notification.html" >评论通知</a> 

## 主题引用 

在教程中有一个**HTML引入**部分，由于博客是基于**Hexo**搭建的，主题使用的是**Butterfly**。那么实际在博客中引
用，每个主题引入的方式的都应该不一样。

查看了最新的**Butterfly**主题文档，发现是支持**Waline**评论的。
![](4.png)
不过我本地使用的**Butterfly**版本有点低，不支持**Waline**配置，趁着机会就直接升级到最新版本了：
![](5.png)

## 结果
一顿操作操作之后，现在评论能正常使用了。邮箱也可以正常收到评论通知。评论管理系统也正常使用，之前的评论正常保留。哈哈哈，完美！在此，特别感谢**Waline**的开发者。
 - 评论测试一下
  ![](6.png)
 - 邮箱收到通知
  ![](7.png)
 - 看下评论后台管理
  ![](8.png)

## 音乐小憩
{% aplayer "灰色轨迹" "Beyond" "https://freetyst.nf.migu.cn/public/product9th/product45/2022/05/1014/2020%E5%B9%B410%E6%9C%8816%E6%97%A510%E7%82%B930%E5%88%86%E7%B4%A7%E6%80%A5%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%AD%A3%E4%B8%9C17%E9%A6%96743598/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/MP3_40_16_Stero/6005662UB4Z141429.mp3?Key=77051d53bfd02254&Tim=1659880446344&channelid=00&msisdn=4d4e45507bc14cbc99fb45a830a04b92&CI=6005662UB4Z2600919000001639921&F=000009" "https://cdnmusic.migu.cn/picture/2021/0429/0842/AS81c13bb15d01485d32032f3380a3e78e.jpg" "lrc:https://lc-gluttony.s3.amazonaws.com/LJltQYKflcAs/qQNskh2JIu3mbYVaaCbKnSRG32CAzc6O/%E7%81%B0%E8%89%B2%E8%BD%A8%E8%BF%B9%20-%20Beyond.lrc" %}
