---
skill_id: controls
skill_name: 地图控件
category: interaction
difficulty: intermediate
tags: [control, zoom, scale, fullscreen, layer-switch]
dependencies: [scene-initialization]
version: 2.x
---

# 地图控件

## 技能描述

掌握 L7 地图控件的使用，通过各种控件实现地图缩放、比例尺显示、全屏、图层切换等交互功能。控件是悬浮在地图四周，对地图和图层进行信息呈现或交互的组件。

## 何时使用

- ✅ 需要地图缩放控制按钮
- ✅ 需要显示地图比例尺
- ✅ 需要全屏显示地图
- ✅ 需要切换不同图层的显示
- ✅ 需要显示鼠标位置的经纬度
- ✅ 需要添加自定义 Logo

## 前置条件

- 已完成[场景初始化](../core/scene.md)

## 核心概念

### 控件位置

L7 支持将控件插入到地图的 **8 个位置** 或自定义 DOM：

- `topleft` - 左上角
- `topright` - 右上角
- `bottomleft` - 左下角
- `bottomright` - 右下角
- `topcenter` - 顶部中心
- `bottomcenter` - 底部中心
- `leftcenter` - 左侧中心
- `rightcenter` - 右侧中心

![控件位置](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

### 控件排列

同一位置的多个控件支持横向和纵向排列，通过 `layout` 配置：

```javascript
const control = new Zoom({
  position: 'topleft',
  layout: 'horizontal', // 'horizontal' | 'vertical'
});
```

## 基础用法

### 1. 添加控件

```javascript
import { Scene, Zoom } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  // 实例化控件
  const zoom = new Zoom({
    position: 'topleft',
  });

  // 添加控件
  scene.addControl(zoom);
});
```

### 2. 移除控件

```javascript
// 移除指定控件
scene.removeControl(zoom);

// 移除所有控件
scene.removeAllControl();
```

### 3. 更新控件配置

```javascript
const zoom = new Zoom({
  position: 'topleft',
});

scene.addControl(zoom);

// 更新配置
zoom.setOptions({
  position: 'topright',
  className: 'custom-class',
});
```

## 内置控件

### Zoom - 缩放控件

用于地图放大和缩小操作。

![Zoom](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CJx3Tby-XlEAAAAAAAAAAAAAARQnAQ)

```javascript
import { Zoom } from '@antv/l7';

const zoom = new Zoom({
  position: 'topleft',
  zoomInText: '+', // 放大按钮内容
  zoomInTitle: '放大', // 放大按钮 title
  zoomOutText: '-', // 缩小按钮内容
  zoomOutTitle: '缩小', // 缩小按钮 title
  showZoom: true, // 显示当前缩放级别数值
});

scene.addControl(zoom);

// 方法
zoom.zoomIn(); // 放大
zoom.zoomOut(); // 缩小
```

**配置项**：

| 参数         | 类型                | 说明                             |
| ------------ | ------------------- | -------------------------------- |
| zoomInText   | `Element \| string` | 放大按钮的展示内容               |
| zoomInTitle  | `string`            | 放大按钮的 title 属性            |
| zoomOutText  | `Element \| string` | 缩小按钮的展示内容               |
| zoomOutTitle | `string`            | 缩小按钮的 title 属性            |
| showZoom     | `boolean`           | 是否展示当前缩放级别（向下取整） |

### Scale - 比例尺控件

显示地图比例尺，支持公制和英制。

![Scale](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*r3iSQI4SekYAAAAAAAAAAAAAARQnAQ)

```javascript
import { Scale } from '@antv/l7';

const scale = new Scale({
  position: 'bottomleft',
  lockWidth: false, // 是否固定容器宽度
  maxWidth: 100, // 容器最大宽度（像素）
  metric: true, // 显示公制（千米）
  imperial: false, // 显示英制（英里）
  updateWhenIdle: false, // 是否只在拖拽/缩放结束后更新
});

scene.addControl(scale);
```

**配置项**：

| 参数           | 类型      | 默认值  | 说明                   |
| -------------- | --------- | ------- | ---------------------- |
| lockWidth      | `boolean` | `true`  | 是否固定容器宽度       |
| maxWidth       | `number`  | `100`   | 组件容器最大宽度       |
| metric         | `boolean` | `true`  | 展示千米格式的比例尺   |
| imperial       | `boolean` | `false` | 展示英里格式的比例尺   |
| updateWhenIdle | `boolean` | `false` | 是否只在交互结束后更新 |

### Fullscreen - 全屏控件

控制地图区域的全屏显示。

![Fullscreen](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CcOXRqK5ARgAAAAAAAAAAAAAARQnAQ)

```javascript
import { Fullscreen } from '@antv/l7';

const fullscreen = new Fullscreen({
  position: 'topright',
  btnText: '全屏', // 按钮文本
  btnTitle: '全屏', // 按钮 title
  exitBtnText: '退出', // 退出按钮文本
  exitTitle: '退出全屏', // 退出按钮 title
});

scene.addControl(fullscreen);

// 方法
fullscreen.toggleFullscreen(); // 切换全屏状态

// 事件
fullscreen.on('fullscreenChange', (isFullscreen) => {
  console.log('全屏状态:', isFullscreen);
});
```

**配置项**：

| 参数        | 类型                        | 说明                    |
| ----------- | --------------------------- | ----------------------- |
| btnIcon     | `HTMLElement \| SVGElement` | 全屏按钮图标            |
| btnText     | `string`                    | 全屏按钮文本            |
| btnTitle    | `string`                    | 全屏按钮 title 属性     |
| exitBtnIcon | `HTMLElement \| SVGElement` | 退出全屏按钮图标        |
| exitBtnText | `string`                    | 退出全屏按钮文本        |
| exitTitle   | `string`                    | 退出全屏按钮 title 属性 |

### Logo - 标志控件

在地图上展示 Logo 图片，支持超链接跳转。

![Logo](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*CbdSRLizMLIAAAAAAAAAAAAAARQnAQ)

```javascript
import { Logo } from '@antv/l7';

// 隐藏默认 Logo
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    /* ... */
  }),
  logoVisible: false, // 关闭默认 L7 Logo
});

// 添加自定义 Logo
const logo = new Logo({
  position: 'bottomleft',
  img: 'https://example.com/logo.png', // Logo 图片 URL
  href: 'https://example.com', // 点击跳转的链接
});

scene.addControl(logo);
```

**配置项**：

| 参数 | 类型     | 说明                     |
| ---- | -------- | ------------------------ |
| img  | `string` | Logo 图片 URL            |
| href | `string` | 点击跳转的超链接（可选） |

### LayerSwitch - 图层切换控件

控制图层的显示和隐藏，支持单选和多选模式。

![LayerSwitch](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SiQWT5RnMDYAAAAAAAAAAAAAARQnAQ)

```javascript
import { LayerSwitch } from '@antv/l7';

// 创建图层时指定名称
const layer1 = new PointLayer({
  name: 'POI图层',
})
  .source(data1)
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

const layer2 = new LineLayer({
  name: '道路图层',
})
  .source(data2)
  .shape('line')
  .size(2)
  .color('#5AD8A6');

scene.addLayer(layer1);
scene.addLayer(layer2);

// 添加图层切换控件
const layerSwitch = new LayerSwitch({
  position: 'topright',
  layers: [layer1, layer2], // 可传入图层实例或图层 ID
  multiple: true, // 是否多选模式（false 为单选）
});

scene.addControl(layerSwitch);
```

**高级配置**：

```javascript
const layerSwitch = new LayerSwitch({
  position: 'topright',
  layers: [
    {
      layer: layer1,
      name: '自定义图层名称', // 覆盖图层默认名称
      img: 'https://example.com/icon.png', // 图层缩略图
    },
    {
      layer: layer2,
      name: '道路网络',
    },
  ],
  multiple: true,
});

scene.addControl(layerSwitch);
```

**配置项**：

| 参数     | 类型                                         | 说明                                     |
| -------- | -------------------------------------------- | ---------------------------------------- |
| layers   | `Array<ILayer \| string \| LayerSwitchItem>` | 需要控制的图层数组                       |
| multiple | `boolean`                                    | 是否多选模式（单选时默认显示第一个图层） |

### MouseLocation - 鼠标位置控件

实时显示鼠标在地图上的经纬度坐标。

![MouseLocation](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i4F5QZ4K650AAAAAAAAAAAAAARQnAQ)

```javascript
import { MouseLocation } from '@antv/l7';

const mouseLocation = new MouseLocation({
  position: 'bottomright',
  transform: (position) => {
    // 可以对坐标进行转换处理
    const [lng, lat] = position;
    return [lng.toFixed(6), lat.toFixed(6)];
  },
});

scene.addControl(mouseLocation);

// 事件
mouseLocation.on('locationChange', (position) => {
  console.log('当前位置:', position);
});
```

**配置项**：

| 参数      | 类型                                               | 说明               |
| --------- | -------------------------------------------------- | ------------------ |
| transform | `(position: [number, number]) => [number, number]` | 转换坐标的回调函数 |

## 通用配置

所有控件都支持以下通用配置：

| 参数      | 类型                         | 默认值       | 说明            |
| --------- | ---------------------------- | ------------ | --------------- |
| position  | `string`                     | `'topright'` | 控件位置        |
| name      | `string`                     | -            | 控件名称        |
| className | `string`                     | -            | 自定义 CSS 类名 |
| layout    | `'horizontal' \| 'vertical'` | -            | 排列方向        |

## 通用方法

所有控件都支持以下方法：

```javascript
// 显示控件
control.show();

// 隐藏控件
control.hide();

// 更新配置
control.setOptions({ position: 'topleft' });

// 移除控件
scene.removeControl(control);
```

## 实际应用场景

### 1. 完整地图控件组合

```javascript
import { Scene, Zoom, Scale, Fullscreen, Logo } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    /* ... */
  }),
  logoVisible: false,
});

scene.on('loaded', () => {
  // 左上角：缩放控件
  const zoom = new Zoom({
    position: 'topleft',
    showZoom: true,
  });

  // 右上角：全屏控件
  const fullscreen = new Fullscreen({
    position: 'topright',
  });

  // 左下角：自定义 Logo
  const logo = new Logo({
    position: 'bottomleft',
    img: 'https://example.com/logo.png',
    href: 'https://example.com',
  });

  // 右下角：比例尺
  const scale = new Scale({
    position: 'bottomright',
    metric: true,
  });

  scene.addControl(zoom);
  scene.addControl(fullscreen);
  scene.addControl(logo);
  scene.addControl(scale);
});
```

### 2. 图层组管理

```javascript
// 创建不同类型的图层
const baseLayer = new PolygonLayer({
  name: '行政区划',
})
  .source(adminData)
  .color('#f0f0f0');

const heatLayer = new HeatmapLayer({
  name: '人口热力图',
})
  .source(populationData)
  .size('value', [0, 1]);

const poiLayer = new PointLayer({
  name: 'POI点',
})
  .source(poiData)
  .shape('circle')
  .size(8);

scene.addLayer(baseLayer);
scene.addLayer(heatLayer);
scene.addLayer(poiLayer);

// 添加图层切换控件
const layerSwitch = new LayerSwitch({
  position: 'topright',
  layers: [
    {
      layer: baseLayer,
      name: '底图',
      img: 'base.png',
    },
    {
      layer: heatLayer,
      name: '热力',
      img: 'heat.png',
    },
    {
      layer: poiLayer,
      name: '标注',
      img: 'poi.png',
    },
  ],
  multiple: true,
});

scene.addControl(layerSwitch);
```

### 3. 自定义样式控件

```javascript
const zoom = new Zoom({
  position: 'topleft',
  className: 'custom-zoom',
  zoomInText: '➕',
  zoomOutText: '➖',
});

scene.addControl(zoom);

// CSS 样式
/*
.custom-zoom {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 8px;
}

.custom-zoom button {
  color: white;
  font-size: 20px;
}
*/
```

### 4. 响应式控件位置

```javascript
const zoom = new Zoom({
  position: window.innerWidth < 768 ? 'bottomleft' : 'topleft',
});

scene.addControl(zoom);

// 监听窗口大小变化
window.addEventListener('resize', () => {
  const newPosition = window.innerWidth < 768 ? 'bottomleft' : 'topleft';
  zoom.setOptions({ position: newPosition });
});
```

### 5. 控件事件监听

```javascript
const layerSwitch = new LayerSwitch({
  layers: [layer1, layer2],
  multiple: false,
});

// 监听图层切换
layerSwitch.on('selectChange', (selectedLayers) => {
  console.log('当前选中的图层:', selectedLayers);

  // 根据选中图层更新其他UI
  updateLegend(selectedLayers[0]);
});

const fullscreen = new Fullscreen();

fullscreen.on('fullscreenChange', (isFullscreen) => {
  if (isFullscreen) {
    console.log('进入全屏');
    // 隐藏其他UI元素
  } else {
    console.log('退出全屏');
    // 恢复UI元素
  }
});

scene.addControl(layerSwitch);
scene.addControl(fullscreen);
```

## 常见问题

### Q: 如何自定义控件位置？

A: 除了使用预设的 8 个位置，还可以通过 CSS 自定义：

```javascript
const zoom = new Zoom({
  position: 'topleft',
  className: 'custom-position',
});

scene.addControl(zoom);

// CSS
/*
.custom-position {
  position: absolute;
  top: 100px !important;
  left: 20px !important;
}
*/
```

### Q: 如何移除默认 Logo？

A: 在 Scene 初始化时配置：

```javascript
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    /* ... */
  }),
  logoVisible: false, // 关闭默认 Logo
});
```

### Q: LayerSwitch 如何指定默认显示的图层？

A: 单选模式下默认显示第一个图层，多选模式下根据图层初始状态：

```javascript
// 单选模式：默认显示 layer1
const layerSwitch = new LayerSwitch({
  layers: [layer1, layer2, layer3],
  multiple: false,
});

// 多选模式：控制图层初始可见性
layer1.show();
layer2.hide();
layer3.show();

const layerSwitch = new LayerSwitch({
  layers: [layer1, layer2, layer3],
  multiple: true,
});
```

### Q: 如何获取控件实例？

A: 保存实例引用或通过 Scene 获取：

```javascript
// 方式1：保存引用
const zoom = new Zoom();
scene.addControl(zoom);

// 方式2：通过名称获取
const zoom = new Zoom({ name: 'zoom-control' });
scene.addControl(zoom);

const control = scene.getControlByName('zoom-control');
```

### Q: 控件如何实现国际化？

A: 通过配置项传入不同语言文本：

```javascript
const lang = 'zh-CN'; // 或 'en-US'

const zoom = new Zoom({
  zoomInTitle: lang === 'zh-CN' ? '放大' : 'Zoom In',
  zoomOutTitle: lang === 'zh-CN' ? '缩小' : 'Zoom Out',
});

const fullscreen = new Fullscreen({
  btnText: lang === 'zh-CN' ? '全屏' : 'Fullscreen',
  exitBtnText: lang === 'zh-CN' ? '退出' : 'Exit',
});
```

## 注意事项

⚠️ **控件顺序**：同一位置的控件按添加顺序排列

⚠️ **图层名称**：LayerSwitch 依赖图层的 `name` 属性，务必在创建图层时指定

⚠️ **移动端适配**：移动端建议将控件放在不遮挡重要内容的位置

⚠️ **控件样式**：可通过 `className` 自定义样式，但需注意不要影响控件功能

⚠️ **性能考虑**：MouseLocation 控件会高频更新，注意 `transform` 回调的性能

⚠️ **全屏 API**：Fullscreen 控件依赖浏览器的 Fullscreen API，部分浏览器可能不支持

## 相关技能

- [场景初始化](../core/scene.md)
- [场景方法](../core/scene-methods.md)
- [图层管理](../layers/base-layer.md)
- [事件处理](./events.md)

## 在线示例

查看更多示例：[L7 控件示例](https://l7.antv.antgroup.com/examples/component/control)
