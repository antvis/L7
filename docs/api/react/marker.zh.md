---
title: Marker 组件
order: 3
---

`markdown:docs/common/style.md`

## Marker Props

| prop name      | Type              | Default | Description       |
| -------------- | ----------------- | ------- | ----------------- |
| option         | `string`          | `null`  | marker 配置项     |
| lnglat         | `Array | Object`  | `null`  | marker 经纬度位置 |
| onMarkerLoaded | `Function`        | `null`  | layer 回调函数    |
| children       | `React.ReactNode` | `null`  | 子组件            |

### option

| prop name | Type         | Default | Description                                                                    |
| --------- | ------------ | ------- | ------------------------------------------------------------------------------ |
| color     | `string`     | `blue`  | marker 配置项                                                                  |
| anchor    | `string`     | `null`  | center, top, top-left, top-right, bottom, bottom-left,bottom-right,left, right |
| offsets   | `Array[x,y]` | `null`  | marker 位置偏移                                                                |
| extData   | `object`     | `null`  | marker 属性数据                                                                |

## Maker 事件

通过 onMarkerLoaded 方法获取 Marker 实例监听

## 实例

```jsx
import { Marker} from '@antv/l7-react'
<Marker
 lnglat={[120,32]}
/>

```
