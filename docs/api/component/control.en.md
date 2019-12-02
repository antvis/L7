---
title: Control
order: 1
---

# control

地图组件 用于控制地图的状态如果平移，缩放，或者展示地图一些的辅助信息如图例，比例尺

## 构造函数

```javascript
const baseControl = new L7.Control.Base(option);
```

#### option

position: `string` 控件位置支持是个方位 `bottomright, topright, bottomleft, topleft`

#### scene 内置地图组件

zoom 地图放大缩小   默认添加<br />Scale 地图比例尺     默认添加<br />attribution 地图数据属性    默认添加<br />layer 图层列表

**scene 配置项设置控件添加状态**

```javascript
scene = new L7.scene({
  zoomControl: true,
  scaleControl: true,
  attributionControl: true,
});
```

####

#### Zoom

放大缩小组件 默认 左上角

```javascript
new L7.Control.Zoom({
  position: 'topleft',
}).addTo(scene);
```

#### Scale

比例尺组件默认左下角

```javascript
new L7.Control.Scale({
  position: 'bottomleft',
}).addTo(scene);
```

#### attribution

默认右下角

```javascript
new L7.Control.Attribution({
  position: 'bottomleft',
}).addTo(scene);
```

#### layer

图层列表目前只支持可视化 overlayers 图层控制

```javascript
var overlayers = {
  围栏填充: layer,
  围栏边界: layer2,
};
new L7.Control.Layers({
  overlayers: overlayers,
}).addTo(scene);
```

## 方法

#### onAdd

组件添加到地图 Scene 时调用，自定义组件时需要实现此方法

#### addTo

添加到地图 scene

```javascript
control.addTo(scene);
```

#### setPosition

设置组件位置

```javascript
control.setPosition('bottomright');
```

#### remove

移除地图组件

```javascript
control.remove();
```

## 示例代码

#### 自定义图例控件

[源码](https://antv.alipay.com/zh-cn/l7/1.x/demo/component/extendControl.html)

```javascript
var legend = new L7.Control.Base({
  position: 'bottomright',
});
legend.onAdd = function() {
  var el = document.createElement('div');
  el.className = 'infolegend legend';
  var grades = [0, 8, 15, 30, 65, 120];
  for (var i = 0; i < grades.length; i++) {
    el.innerHTML +=
      '<i style="background:' +
      colors[i] +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
  }
  return el;
};
legend.addTo(scene);
```

##

## FAQ
