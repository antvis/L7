---
title: Layer 组件
order: 2
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

### options 图层 配置

<description> _layer options_ \_ **可选** </description>

`markdown:docs/common/layer/options.md`

### source 图层数据

<description> _sourceOption_ **必选** _default:_ `0`</description>

数据源配置项

- data 支持 geojson、csv、json
- parser 数据解析配置项
- transforms 数据处理配置项

```jsx
<PointLayer
  source={{
    data: [],
    parser: {
      type: 'geojson',
    },
    transforms: [],
  }}
/>
```

### color 图层颜色

<description> _attributeOption_ **必选** _default:_ `0`</description>

### shape 图形形状

<description> _attributeOption_ **必选** _default:_ `0`</description>

### size 图形大小

<description> _attributeOption_ **必选** </description>

### select 选中高亮

<description> _interaction option_ **可选** </description>

### active 滑过高亮

<description> _interaction option_ **可选** </description>

### animate 动画

<description> _animate Option_ **可选** </description>

### style 样式

<description> _styleOption_ **可选** </description>

`markdown:docs/common/layer/layer_style.md`

### scale 度量

<description> _scale Option_ **可选** </description>

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

### onLayerLoaded 图层回调

<description> _Function_ **可选** </description>

获取图层对象方法

### attribute Option

color, size, shape 等图形映射通道，通过下面参数配置

- field 映射字段，如果是常量设置为 null
- values 映射值 支持 常量，数组，回调函数，如果 values 为数组或回调需要设置 field 字段

### scale Option

### interaction option

active，select 配置项

**option**

- color 设置交互的颜色，指滑过或者选中的

```jsx
<PointLayer
  active={{
    option: {
      color: 'red',
    },
  }}
/>
```

## 获取 layer 对象

### onLayerLoaded

回调函数获取 layer, scene 对象

```javascript
onLayerLoaded = (layer, scene) => {};
```

### Context API

```jsx
import { LayerContext } from '@antv/l7-react';
<LayerContext.Consumer>
  {(layer, scene) => {
    // use `scene` here
  }}
</LayerContext.Consumer>;
```

## Layer 示例

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
