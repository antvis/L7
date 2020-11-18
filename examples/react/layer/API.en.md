---
title: API
---
`markdown:docs/common/style.md`
## Layer 类型

React 各个组件名称和 L7 名称保持一致

- PointLayer
- PolygonLayer
- LineLayer
- HeatmapLayer
- RasterLayer
- ImageLayer
- CityBuildingLayer

### 使用方式

```jsx
import { PointLayer } '@antv/l7-react';

```

## Layer Props

| prop name     | Type                           | Default                                                   | Description                             |
| ------------- | ------------------------------ | --------------------------------------------------------- | --------------------------------------- |
| options       | `layer options`                |                                                           | layer 配置项                            |
| source        | `sourceOption`                 |                                                           | 数据源配置项                            |
| color         | `attributeOption`              |                                                           | 颜色通道                                |
| shape         | `attributeOption`              |                                                           | 图层形状属性                            |
| size          | `attributeOption`              |                                                           | 图层大小属性                            |
| style         | `Object`                       |                                                           | 图层样式                                |
| scale         | `scale Option`                 | 默认会数值类设定 scale，数值类型 linear，字符串类型为 cat | 图层度量                                |
| filter        | `Function`                     |                                                           | 图层数据过滤方法                        |
| select        | `boolean` `interaction option` |                                                           | 图层选中高亮                            |
| active        | `boolean` `interaction option` | `false`                                                   | 图层 hover 高亮                         |
| animate       | `animate Option`               | `null`                                                    | 图层动画配置                            |
| onLayerLoaded | `Function`                     |                                                           | 图层添加完成后回调，用于获取 layer 对象 |

### layer options

| prop name | Type      | Default                 | Description                                      |
| --------- | --------- | ----------------------- | ------------------------------------------------ |
| name      | `string`  |                         | 图层名字，可根据名称获取 layer                   |
| visible   | `boolean` | `true`                  | 图层是否可见                                     |
| zIndex    | `number`  | 0                       | 图层绘制顺序，                                   |
| minZoom   | `number`  | 0                       | 设置 layer 最小可见等级，小于则不显示            |
| maxZoom   | `number`  | 与 map 最大缩放等级一致 | 设置 layerd 的最大可见等级，大于则不显示         |
| aotoFit   | `boolean` | `false`                 | 是否缩放到图层范围                               |
| blend     | 'string'  | 'normal'                | 图层元素混合效果 [详情]('../layer/layer/#blend') |

### attribute Option

color, size, shape 等图形映射通道，通过下面参数配置

- field 映射字段，如果是常量设置为 null
- values 映射值 支持 常量，数组，回调函数，如果 values 为数组或回调需要设置 field 字段

详细[配置项](../layer/layer/#size)

### source Option

数据源配置项

- data 支持 geojson、csv、json
- parser 数据解析配置项
- transforms 数据处理配置项

详细[配置项](../source/source/#parser-1)

### scale Option

度量配置项

- values scaleCfg

**scaleCfg**

- key 为字段名 fieldname | attributeName
- value scale 配置项

```javascript
const scales = {
  values: {
    name: {
      type: 'cat',
    },
  },
};
```

### interaction option

active，select 配置项

**option**

- color 设置交互的颜色，指滑过或者选中的

```jsx
<>
```

### 获取 layer 对象

#### onLayerLoaded

回调函数获取 layer, scene 对象

```javascript
onLayerLoaded = (layer, scene) => {};
```

#### Context API

```jsx
import { LayerContext } from '@antv/l7-react';
<LayerContext.Consumer>
  {(layer, scene) => {
    // use `scene` here
  }}
</LayerContext.Consumer>;
```

### Layer 示例

```jsx
import { PolygonLayer } from '@antv/l7-react';
<PolygonLayer
  key={'2'}
  source={{
    data,
  }}
  color={{
    field: 'name',
    values: ['#2E8AE6', '#69D1AB', '#DAF291', '#FFD591', '#FF7A45', '#CF1D49'],
  }}
  shape={{
    values: 'fill',
  }}
  style={{
    opacity: 1,
  }}
  active={{
    option: {
      color: 'red',
    },
  }}
/>;
```

## 子组件

### 事件组件

| prop name | Type       | Default | Description                               |
| --------- | ---------- | ------- | ----------------------------------------- |
| type      | `string`   | `null`  | 事件类型 [详情](../layer/layer/#鼠标事件) |
| handler   | `Function` | `null`  | layer 回调函数                            |

### 示例

```jsx
import { LayerEvent, PolygonLayer } from 'l7-react';
<PolygonLayer>
  <LayerEvent type="click" handler={() => {}} />
  <LayerEvent type="mousemove" handler={() => {}} />
</PolygonLayer>;
```
