---
title: Layer 组件
order: 2
---

## Scene Props

| prop name   | Type               | Default | Description                             |
| ----------- | ------------------ | ------- | --------------------------------------- |
| option      | `Object`           |         | layer 配置项                            |
| source      |                    |         | 数据源配置项                            |
| color       | `attributeOption`  |         | 颜色通道                                |
| shape       | `attributeOption`  |         | 图层形状属性                            |
| size        | `attributeOption`  |         | 图层大小属性                            |
| style       | `Object`           |         | 图层样式                                |
| scale       | `Object`           |         | 图层度量                                |
| filter      | `Function`         |         | 图层数据过滤方法                        |
| select      | `boolean` `Object` |         | 图层选中高亮                            |
| active      | `boolean` `Object` | `false` | 图层 hover 高亮                         |
| onLayerLoad | `Function`         |         | 图层添加完成后回调，用于获取 layer 对象 |

### attributeOption

color, size, shape 等图形映射通道，通过下面参数配置

- field 映射字段，如果是常量设置为 null
- values 映射值 支持 常量，数组，回调函数，如果 values 为数组或回调需要设置 field 字段

### sourceOption

数据源配置项

- data 支持 geojson、csv、json
- parser 数据解析配置项
- transforms 数据处理配置项

具体配置项

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
/>;
```
