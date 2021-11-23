---
title: L7Mini 小程序模块教程
order: 3
---

`markdown:docs/common/style.md`

## 简介

通过引入 L7Mini 模块，能让用户在小程序环境中使用 L7 地图可视化的能力，增强原生地图组件的可视化能力。

✨ 目前 L7Mini 兼容支付宝小程序，尚不支持微信小程序。  
✨ 目前 L7Mini 只支持无底图模式，即只展示可视化层。  
✨ L7Mini 模块的使用，除了画布获取和和事件注册因为小程序环境的原因需要用户额外处理，其余部分和普通 L7 的使用保持一致。

下面将介绍如何在支付宝小程序中使用 L7Mini 模块。

## 安装

目前 L7 在小程序开发中使用的能力全部来自 L7Mini 模块，用户只需要执行一次安装即可。

```javascript
npm install @antv/l7-mini --save
```

## 地图引用

在小程序环境中，用户无法引用高德地图和 Mapbox 地图， 只能引用小程序版本的地图类型。  
在 .ts/.js 页面脚本文件中引用

```javascript
import {
  Map, // 其他地图类型不兼容小程序环境
  Scene,
  PointLayer,
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
} from '@antv/l7-mini';
```

地图小程序环境的使用和普通 H5 环境的使用保持一致。

```javascript
const miniMap = new Map({
  center: [0, 0],
  zoom: -0.5,
  pitch: 0,
});
```

## 节点注册

由于小程序限制，我们无法动态创建新的节点，因此我们需要事先在 .axml 文件中创建 canvas 画布节点

```javascript
<canvas onReady="onCanvasReady" type="webgl" id="canvas" />
```

注册完的节点会在脚本文件中获取使用。

✨ 我们需要完成 onCanvasReady 事件的注册，以便明确获取节点的时机。

## 事件注册

由于小程序环境的限制，我们无法动态注册事件，所以需要用户自己完成事件代理，下面将会说明如何完成事件的代理。

✨ 如果不进行事件的注册和转发，用户将无法对地图进行操作。

1. 在 .axml 文件中绑定基础事件

✨ 事件需要绑定在 canvas 节点上或是 canvas 的父节点上

```javascript
<view id="box" class="wrap"
  onTouchStart="onTouchStart"  // 绑定基础事件
  onTouchMove="onTouchMove"
  onTouchEnd="onTouchEnd"
  >
  <canvas onReady="onCanvasReady" type="webgl" id="canvas" />
  <view class="populationWrap">
    <view class="populationIcons">
      人口/千万:
    </view>
    <view class="populationIcons" a:for="{{population}}">
      <view> {{item.count}}  </view>
      <view class="colorLine" style="background:{{item.color}}"></view>
    </view>
  </view>
</view>
```

2. .ts/.js 文件中完成事件的代理转发

引入代理方法

```javascript
import {
  Map,
  Scene,
  PointLayer,
  dispatchTouchStart, // L7Mini 封装的代理方法
  dispatchTouchMove,
  dispatchTouchEnd,
} from '@antv/l7-mini';
```

在 page 对象中注册方法

```javascript
page({
  ...
  onTouchStart(e) {
    dispatchTouchStart(e);
  },
  onTouchMove(e) {
    dispatchTouchMove(e);
  },
  onTouchEnd(e) {
    dispatchTouchEnd(e);
  },
  ...
})

```

我们只需要完成基础方法的注册（touchstart/touchmove/touchend），L7Mini 会完成复合方法、手势的判断。

## 画布的获取与使用

在小程序中，我们需要使用小程序提供的方法来获取页面节点。

我们通过在 .axml 在 canvas 画布组件上注册的 onCanvasReady 方法来判断获取画布的时机。

```javascript
page({
  ...
  onCanvasReady() {
    handleCanvas(my, canvas => {
      ...
      // 正常开发 L7 代码
      ...
    })
  }
  ...
})
```

下面提供了获取画布节点通用方法，同时对画布进行一些处理方便后续使用。

```javascript
function handleCanvas(my, callback) {
  const selector = my.createSelectorQuery();
  const domSelector = selector.select('#canvas');
  domSelector
    .fields(
      {
        node: true,
        context: false,
        rect: true,
        computedStyle: ['height', 'width'],
      },
      function(res) {
        // 内部计算使用 （必须设置）
        res.node.left = res.left;
        res.node.top = res.top;

        // 设置画布的 DPR （必须设置）
        const DPR = my.getSystemInfoSync().pixelRatio;
        res.node.width *= DPR;
        res.node.height *= DPR;

        // 返回 canvas 画布节点
        callback(res.node);
      },
    )
    .exec();
}
```

我们在获取到画布对象后需要传递给 scene 使用。

```javascript
const miniScene = new Scene({
  id: 'canvas',
  canvas, // canvas 是我们从小程序页面上获取到的实际节点
  map: miniMap,
});
```

## 销毁

为了保证小程序的良好体验，在页面关闭时记得及时将 L7 内容进行销毁。

```javascript
  page({
    ...
    onHide() {
      miniScene.destroy();
    },
    onUnload() {
      miniScene.destroy();
    },
    ...
  })
```

## 限制

目前 L7Mini 尚不支持 marker/popup 等需要动态创建页面节点的能力，用户若是需要可以自己单独创建。
