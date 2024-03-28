---
title: 快速上手
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

`L7` 可以通过在线 `CDN` 以及 `NPM` 包等形式快速接入。通过 `L7` 提供的能力，我们可以快速完成地图可视化的绘制。

## 安装引入

### 通过 npm 引入

```javascript
// 安装L7 依赖
npm install --save @antv/l7
// 安装第三方底图依赖
npm install --save @antv/l7-maps
```

### 通过 CDN 引入

```html
<head>
  <! --引入最新版的L7-->
  <script src="https://unpkg.com/@antv/l7"></script>

  <! --指定版本号引入L7-->
  <script src="https://unpkg.com/@antv/l7@2.0.11"></script>
</head>
```

CDN 引用 在使用时通过 L7 命名空间获取所有对象并初始化，如 L7.scene、L7.GaodeMap

<!--也可以使用国内镜像 -->
<script src = 'https://npm.elemecdn.com/@antv/l7'></script>

```javascript
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});
```

## 基础教程

### 地图组件使用

1. 初始化地图首先需要在页面中新增一个Dom 用于地图初始化。

```html
<div style="min-height: 500px; justify-content: center;position: relative" id="map" />
```

2. 初始化高德地图

```javascript
import { GaodeMap } from '@antv/l7-maps';
// 同样你也可以初始化一个 Mapbox 地图
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 35.210526315789465,
    style: 'dark',
    center: [104.288144, 31.239692],
    zoom: 4.4,
  }),
});
```

🌟 此时在页面上就会出现可交互的地图内容。

### 绘制填充图

地图初始化完成之后我们，那我们就可以往地图添加可视化数据了，这里我们以中国行政区区数据为例，如何可视化面数据。
数据源： 中国各省 [GeoJSON](https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json) 数据。

1. 我们使用面图层来绘制行政区划数据，得到覆盖在地图表面的几何平面。

```javascript
import { PolygonLayer } from '@antv/l7';
const chinaPolygonLayer = new PolygonLayer({})
  .source(data)
  .color('name', [
    'rgb(239,243,255)',
    'rgb(189,215,231)',
    'rgb(107,174,214)',
    'rgb(49,130,189)',
    'rgb(8,81,156)',
  ]);
```

2. 图层创建完成之后我们需要将它添加到 `Scene` 中进行显示。

```javascript
scene.addLayer(chinaPolygonLayer);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*iUZVSYBtKnMAAAAAAAAAAAAAARQnAQ)

3. 简单的填充可视化还是不够直观，我们可以使用 `LineLayer` 和 `PointLayer` 增加行政区划描边和行政区划文字标注。

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*Tf95Qp43Z6IAAAAAAAAAAAAAARQnAQ)

4. 添边界和文本标注之后可视化效果更加清晰。

[查看完整代码](https://codesandbox.io/s/l7-tianchongtujiaocheng-275ix?file=/index.js)

### 交互式填充图

单纯的数据展现出来，并不能满足我的需求，我们可能需要查看每个区块的相关信息，或者添加一些高亮效果。

#### 默认高亮

`L7` 图层添加默认的高亮效果，默认的高亮效果可以改变颜色。

```javascript
chinaPolygonLayer.active(true); //  开启默认高亮效果

chinaPolygonLayer.active({ color: red }); // 开启并设置高亮颜色为红色
```

| **![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*vik-Q7frCMMAAAAAAAAAAAAAARQnAQ)** | **![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*RJiaS498G4wAAAAAAAAAAAAAARQnAQ)** |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 默认蓝色高亮效果                                                                                        | 更改高亮颜色                                                                                            |

#### 自定义高亮效果

默认的高亮效果只能改变颜色，可能并不能满足我的需求，我们可能需要白色的描边，这能够实现吗，答案肯定是可以的。

1. 添加一个新的图层的作为高亮图层, 数据我们设置成空数据，形状设置成 `line`

```javascript
const hightLayer = new LineLayer({
  zIndex: 4, // 设置显示层级
  name: 'hightlight',
})
  .source({
    type: 'FeatureCollection',
    features: [],
  })
  .shape('line')
  .size(2)
  .color('red');
scene.addLayer(hightLayer);
```

2. 这样我们就可以监听需要高亮图层的鼠标事件，获取当前选中的数据，然后更新 `hightLayer` 既可实现描边高亮效果。

```javascript
chinaPolygonLayer.on('click', (feature) => {
  hightLayer.setData({
    type: 'FeatureCollection',
    features: [feature.feature],
  });
});
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*fr9DTY54rhUAAAAAAAAAAAAAARQnAQ)

3. 为图层添加点击高亮红色描边效果

到这里我们就学会了如何自定义高亮效果，这里提个小问题“如何实现双描边的高亮效果？”

[查看示例](https://codesandbox.io/s/zidingyigaoliang-7vkso?file=/index.js)

#### 添加信息 Popup 信息窗

鼠标交互时，我们除了高亮显示划过的区域我们还需要信息区域相关的信息，这里 `L7` 提供了 `Popup` 组件用于在地图显示相关信息。

引入对象

```javascript
import { Popup } from '@antv/l7';
```

我们可以通过对 Layer 监听鼠标事件，决定何时显示Popup,

```javascript
layer.on('mousemove', (e) => {
  const popup = new Popup({
    offsets: [0, 0],
    closeButton: false,
  })
    .setLnglat(e.lngLat)
    .setHTML(
      `<span>地区: ${e.feature.properties.name}</span><br><span>确诊数: ${e.feature.properties.case}</span>`,
    );
  scene.addPopup(popup);
});
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*2isvTq-s0OMAAAAAAAAAAAAAARQnAQ)

[查看示例](https://codesandbox.io/s/popup-x3j00?file=/index.js)

### 添加图例

上面我们已经学会了如何可视化数据，在地图我们将不同的区域可视为不同颜色，但是如何读懂不同的颜色表达的什么含义，我们需要添加一个图例。

`L7` 目前没有默认的图例组件，需要自己创建图例，这里我们介绍通过 `L7 Control` 基类创建图例组件，当然你也可以实现一个独立的图例 `DOM` 组件。

`L7` 提供了默认的 `Zoom`，`Scale`，`Logo` 等组件这些组件都基于同一个基类 `Control` 组件，今天我们基于 `Control` 实现自定义图例组件。

1. 引入 `Control` 基类

```javascript
import { Control } from '@antv/l7';
```

2. 初始化基类

```javascript
const legend = new Control({
  position: 'bottomright',
});
```

3. 设置 `Control` 展示内容

通过扩展 `Control` 的 `onAdd` 方法我们自由定制 `Control` 需要展示内容和交互。

```javascript
legend.onAdd = function () {
  var el = document.createElement('div');
  el.className = 'infolegend legend';
  var grades = [0, 10, 20, 50, 100, 200, 500];
  for (var i = 0; i < grades.length; i++) {
    el.innerHTML +=
      '<i style="background:' +
      color[i] +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
  }
  return el;
};
```

4. 添加到地图

```javascript
scene.addControl(legend);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*7VNfRodZ_8AAAAAAAAAAAAAAARQnAQ)

[查看示例](https://codesandbox.io/s/tuli-keov0?file=/index.js)

这里我们介绍了，如何通过自己定义 `Control` 的方式实现图例，通过自定义 `Control` 我们很多地图组件，如全屏组件，定位组件，很多业务上需要的组件，有幸运的同学们可以动手尝试一下了。

### 时序变化图

上面我们可视化的是一个静态数据，但是很多时候我们的数据是随时间变化的，如何进行时序数据的可视化，这里我们介绍两种时序数据可视化方法。

#### 准备数据

地理数据：[美国各州行政区划数据](https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json)
属性数据：[0908-1008近30天的美国各州新冠确诊数据](https://gw.alipayobjects.com/os/bmw-prod/bed5e504-04d5-4d96-a335-163e038dc65a.csv)。

#### 更新数据

随着时间的变化，数据肯定发生变化，因此最简单的方式我每个时间更新一下数据即可.

```javascript
chinaPolygonLayer.setData(newData);
```

[完整示例](https://codesandbox.io/s/shujugengxin-kgwy0?file=/index.js)

#### 更新颜色

时序数据的更新很大一部分场景是属性数据的更新，比如各省不同年份的 `GDP` 数据，空间数据本身没有发生变化（没有增加或者减少也没有更新边界）这种情况对面图层来说可能只需要根据新的数据更新一下就可以实现。当然通过 `setData` 也可以实现。`L7` 内部实现机制来看 更新 `color` 的效率要比 `setData` 效率高的多。

通过更新颜色映射字段，实现数据显示的更新。

```javascript
const setColor = (d) => {
  return d > 100000
    ? color[7]
    : d > 80000
      ? color[6]
      : d > 40000
        ? color[5]
        : d > 20000
          ? color[4]
          : d > 10000
            ? color[3]
            : d > 5000
              ? color[2]
              : d > 1000
                ? color[1]
                : color[0];
};

chinaPolygonLayer.color('2020-09-01', setColor);
chinaPolygonLayer.color('2020-09-02', setColor);
```

注意更新颜色生效，需要调用 `Scene.render();`。

[查看示例](https://codesandbox.io/s/shujugengxin-forked-0zul8?file=/index.js)

### 添加地图标注

`L7` 基础 `WebGL` 实现绘制简单的点、线、面，比较简单，如果要实现比较复杂的地图标注就比较困难，为了解决这个问题 `L7` 添加了 `Marker` 组件，你可以基于 `DOM` 实现各种复杂的标注。

```javascript
import { Marker } from '@antv/l7';
 const el = document.createElement('label');
 el.className = 'labelclass';
el.textContent = nodes[i].v + '℃';
el.style.background = 'red';
el.style.borderColor = '#fff;
const marker = new Marker({ element: el})
  .setLnglat({ lng: 112, lat: 30});
scene.addMarker(marker);
```

![image.png](https://gw.alipayobjects.com/mdn/rms_5e897d/afts/img/A*8X9uRZPI3-oAAAAAAAAAAAAAARQnAQ)

[查看完整代码](https://codesandbox.io/s/nifty-yonath-k6zor?file=/index.html)

### 添加地图组件

除了地图可视化层之外我们可能需要添加辅助性的地图工具 比如放大缩小，比例尺，图层列表等组件。

```javascript
import { Scale, Zoom } from '@antv/l7';
const zoomControl = new Zoom({ position: 'topright' });
const scaleControl = new Scale({ position: 'bottomright' });
// 添加到地图场景
scene.addControl(zoomControl);
scene.addControl(scaleControl);
```

#### 自定义组件

上面介绍的图例就是一个自定义组件，同样我们可以任意组件内容，也可以为组件添加地图交互。
更多使用方式我们参考 `L7` 提供默认组件的[源码](https://github.com/antvis/L7/tree/master/packages/component/src/control)

## 不同项目使用模板

不同项目模板在 `CodeSandbox` 你可以预览，也可以下载到本地。

### React

[地址](https://codesandbox.io/s/l720react-jfwyz)

### Vue

[地址](https://codesandbox.io/s/l720vue-uef1x)

### Angular

[地址](https://codesandbox.io/s/angulartest-chpff)

### HTML CDN

[地址](https://codesandbox.io/s/l7cdndemo-gfg9m)
