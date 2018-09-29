# zoom
一个简易的图片放大查看插件

![Travis (.org)](https://img.shields.io/travis/miiiku/zoom.svg)
![License](https://img.shields.io/github/license/mashape/apistatus.svg)
![Language](https://img.shields.io/badge/language-JavaScript-orange.svg)

# 使用

## HTML

``` html
<div id="zoom">
    <img src="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2789.jpg">
    <img src="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2702.jpg">
    <img src="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2701.jpg">
    <img data-original="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2932.jpg">
    <img data-original="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2670.jpg">
    <img data-original="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2862.jpg">
    <img data-original="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2894.jpg">
    <img data-original="https://qiniu.miiiku.xyz/attach/5b7d2608738695267b4589ce/IMG_2861.jpg">
</div>

<script src="../dist/zoom.min.js"></script>
```

## JS

``` js
window.onload = funciton () {
    zoom("#root", {
        lazyLoad: true,
    })
}
```

# options

## **margin:**\<Number\>
默认值 15

查看大图下，图片容器距离屏幕的外边距

## **padding:**\<Number\>
默认值 15

查看大图下，图片容器内容区域的内边距

## **radius:**\<Number\>
默认值 5

查看大图下，图片容器的圆角值

## **specify:**\<String\>
默认值 null

设置指定属性值有效的图片使其生效

举个栗子：
``` html
<div id="zoom">
    <img src="1.jpg">               <!-- 无效 -->
    <img zoom src="2.jpg">          <!-- 生效 -->
    <img zoom="test" src="3.jpg">   <!-- 生效 -->
</div>
```

``` js
    zoom("#zoom", {
        specify: "zoom",
        // 后面不需要单/双引号
        // specify: "zoom=test",
    })
```

## **filter:**\<String\>
默认值 null

过滤指定属性值有效的图片使其无效 **如果同时存在specify和filter则filter无效**

举个栗子：
``` html
<div id="zoom">
    <img src="1.jpg">               <!-- 生效 -->
    <img zoom src="2.jpg">          <!-- 无效 -->
    <img zoom="test" src="3.jpg">   <!-- 无效 -->
</div>
```

``` js
    zoom("#zoom", {
        filter: "zoom",
        // 后面不需要单/双引号
        // filter: "zoom=test",
    })
```

## **lazyLoad:**\<Boolean\>
默认值 false

是否开启图片懒加载

## **original:**\<String\>
默认值 "data-original"

指定图片资源路径的属性值 **lazyLoad为false时无效**


# LICENSE

MIT ©️ [miiiku](https://github.com/miiiku)