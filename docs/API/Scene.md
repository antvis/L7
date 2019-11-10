---
title: Scene
order: 1
---

## 简介
`Scene `基础的地图类,提供地图创建，图层创建，管理等功能

示例代码

```javascript
import {Scene} from '@l7/scene';
const scene =new L7.Scene({
    id:'map',
    mapStyle:'dark',
    center:[ 110.770672, 34.159869 ],
    pitch:45
})
```


### 构造函数

**Scene**<br />支持两种实例化方式

- 独立实例化 内部根据id自动穿件地图实例
- 传入地图实例





#### 独立实例化 Scene

```javascript
const scene = new L7.Scene({
  id: 'map',
  mapStyle: 'dark', 
  center: [ 120.19382669582967, 30.258134 ],
  pitch: 0,
  zoom: 12,
  maxZoom:20,
  minZoom:0,
});
```


#### 根据map 实例创建Sence

_L7 基于高德地图3D模式开发的，因此传入Map实例 __viewModes需要设置成3d_<br />_
```javascript
var mapinstance = new AMap.Map('map',{
    center: [ 120.19382669582967, 30.258134 ],
    viewMode: '3D',
    pitch: 0,
    zoom: 12,
    maxZoom:20,
    minZoom:0,
 });

const scene = new L7.Scene({
  mapStyle: 'dark',
  map:mapinstance
});
```


## map
L7 在scene 下保留了高德地图实例，可以通过scene.map 调用高德地图的map方法。<br />map 实例方法见[高德地图文档](https://lbs.amap.com/api/javascript-api/reference/map)

```javascript
scene.map
```


## 构造类

### PointLayer
新建点图层

### PolylineLayer
新建线图层

### PolygonLayer
新建面图层

### ImageLayer
新建图片图层


## 配置项

### id
需传入 dom 容器或者容器 id  {domObject || string} [必选]


### zoom
地图初始显示级别 {number}  （0-22）

### center
地图初始中心经纬度 {Lnglat}

### pitch
地图初始俯仰角度 {number}  default 0

### mapSyle
地图样式 {style} 目前仅支持高德地图。 default 'dark'<br />L7 内置三种种默认地图样式 dark | light|blank 空地图

设置地图的显示样式，目前支持两种地图样式：<br />第一种：自定义地图样式，如`"amap://styles/d6bf8c1d69cea9f5c696185ad4ac4c86"`<br />可前往[地图自定义平台](https://lbs.amap.com/dev/mapstyle/index)定制自己的个性地图样式；<br />第二种：官方样式模版,如`"amap://styles/grey"`。<br />其他模版样式及自定义地图的使用说明见[开发指南](https://lbs.amap.com/api/javascript-api/guide/create-map/mapstye/)


### minZoom
地图最小缩放等级 {number}  default 0  (0-22)

### maxZoom
地图最大缩放等级 {number}  default 22  (0-22)

### rotateEnable
地图是否可旋转 {Boolean} default true




## 方法

### getZoom
获取当前缩放等级

```javascript
scene.getZoom();
```

return  {float}  当前缩放等级

### getLayers()
获取所有的地图图层
```javascript
scene.getLayers();
```

return 图层数组  {Array}


### getCenter()
获取地图中心点
```javascript
scene.getCenter()
```

return {Lnglat} :地图中心点

### getSize()
获取地图容器大小
```javascript
scene.getSize()
```
return { Object } 地图容器的 width,height

### getPitch()
获取地图俯仰角
```javascript
scene.getPitch();
```

return {number} pitch

### setCenter()
设置地图中心点坐标

```javascript
scene.setCenter([lng,lat])
```

参数：`center`  {LngLat} 地图中心点


### setZoomAndCenter
设置地图等级和中心
```javascript
scene.setZoomAndCenter(zoom,center)
```

参数：zoom {number}<br />center {LngLat}


### setRotation
设置地图顺时针旋转角度，旋转原点为地图容器中心点，取值范围 [0-360]
```javascript
scene.setRotation(rotation)
```

参数： `rotation`   {number}

### zoomIn
地图放大一级
```javascript
scene.zoomIn()
```

### zoomOut
地图缩小一级
```javascript
scene.ZoomOUt()
```

### panTo
地图平移到指定的位置
```javascript
scene.panTo(LngLat)
```

参数：`center`  LngLat 中心位置坐标

### panBy
以像素为单位沿X方向和Y方向移动地图
```javascript
scene.panBy(x,y)
```
参数：<br />`x` {number} 水平方向移动像素 向右为正方向<br />      `y`  {number} 垂直方向移动像素 向下为正方向


### setPitch
设置地图仰俯角度
```javascript
scene.setPitch(pitch)
```

参数 :<br />   `pitch`  {number}

### 

### setStatus
设置当前地图显示状态，包括是否可鼠标拖拽移动地图、地图是否可缩放、地图是否可旋转（rotateEnable）、是否可双击放大地图、是否可以通过键盘控制地图旋转（keyboardEnable）等   

```javascript
    scene.setStatus({
      dragEnable: true,
      keyboardEnable: true,
      doubleClickZoom: true,
      zoomEnable: true,
      rotateEnable: true
    });
```


### fitBounds
地图缩放到某个范围内<br />参数 :<br />  `extent` { array} 经纬度范围 [minlng,minlat,maxlng,maxlat]

```javascript
scene.fitBounds([112,32,114,35]);
```



### removeLayer
移除layer

```javascript
scene.removeLayer(layer)
```

参数<br />`layer`  {Layer}

### getLayers
 获取所有的layer

```javascript
scene.getLayers()
```

return  layers  {array}

## 事件


### on
事件监听

#### 参数
`eventName`  {string} 事件名<br />`hander`  {function } 事件回调函数


### off
移除事件监听<br />`eventName`  {string} 事件名<br />`hander`  {function } 事件回调函数


### 地图事件
```javascript
scene.on('loaded',()=>{})  //地图加载完成触发
scene.on('mapmove',()=>{}) // 地图平移时触发事件
scene.on('movestart',()=>{}) // 地图平移开始时触发
scene.on('moveend',()=>{}) // 地图移动结束后触发，包括平移，以及中心点变化的缩放。如地图有拖拽缓动效果，则在缓动结束后触发
scene.on('zoomchange',()=>{}) // 地图缩放级别更改后触发
scene.on('zoomstart',()=>{}) // 缩放开始时触发
scene.on('zoomend',()=>{}) // 缩放停止时触发
```


### 鼠标事件

```javascript
scene.on('click', (ev)=>{});             // 鼠标左键点击事件
scene.on('dblclick', (ev)=>{});          // 鼠标左键双击事件
scene.on('mousemove', (ev)=>{});        // 鼠标在地图上移动时触发
scene.on('mousewheel', (ev)=>{});        // 鼠标滚轮开始缩放地图时触发
scene.on('mouseover', (ev)=>{});         // 鼠标移入地图容器内时触发
scene.on('mouseout', (ev)=>{});           // 鼠标移出地图容器时触发
scene.on('mouseup', (ev)=>{});         // 鼠标在地图上单击抬起时触发
scene.on('mousedown', (ev)=>{});         // 鼠标在地图上单击按下时触发
scene.on('rightclick', (ev)=>{});              // 鼠标右键单击事件
scene.on('dragstart', (ev)=>{});           //开始拖拽地图时触发
scene.on('dragging', (ev)=>{});         // 拖拽地图过程中触发
scene.on('dragend', (ev)=>{});         //停止拖拽地图时触发。如地图有拖拽缓动效果，则在拽停止，缓动开始前触发
```

### 其它事件
```javascript
scene.on('resize',()=>{}) // 地图容器大小改变事件
```


