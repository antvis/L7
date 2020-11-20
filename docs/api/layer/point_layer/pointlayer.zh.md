---
title: PointLayer
order: 0
---
`markdown:docs/common/style.md`

## 简介

点数据的展示，数据源支持 JSON,GeoJSON,CSV 三种数据格式。

shape 支持

**3D 类型 柱图**

```
'cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'

```

**2D 符号图**

```
'circle', 'square', 'hexagon', 'triangle'，  'pentagon',  'octogon', 'hexagram','rhombus',  'vesica',

```

## source

点数据类型，根据经纬点绘制图形,目前支持三种数据结构

- [GeoJSON]('../../../../source/geojson/#point')
- [CSV](../../../../source/csv/#parser)
- [JSON](../../../../source/json/#点数据)

**图片标注**

通过 `Scene.addImage()` 可以添加图片资源，

### 代码示例

#### 基本图形显示示例

```javascript
import { PointLayer } from '@antv/l7';

const layer = PointLayer({
  zIndex: 2,
})
  .source(data.list, {
    type: 'array',
    x: 'j',
    y: 'w',
  })
  .shape('cylinder')
  .size('t', (level) => {
    return [4, 4, level + 40];
  })
  .color('t', [
    '#002466',
    '#105CB3',
    '#2894E0',
    '#CFF6FF',
    '#FFF5B8',
    '#FFAB5C',
    '#F27049',
    '#730D1C',
  ]);
```

#### 符号图

使用图片添加地图标注

```javascript
scene.addImage(
  'local',
  'https://gw.alipayobjects.com/zos/rmsportal/xZXhTxbglnuTmZEwqQrE.png',
);

const layer = new PointLayer({
  zIndex: 4,
})
  .source(city)
  .size(20.0)
  .shape('local')
  .color('#0D408C');
```
`markdown:docs/common/layer/base.md`
