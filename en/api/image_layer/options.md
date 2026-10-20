---
title: "Options"
description: "Options"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/image_layer/options/"
---

[Resource index](/llms.txt)

### name

_string_ **optional** _default:_ 自动数字编号

设置图层名称,可根据 name 获取 layer

```javascript
scene.getLayerByName(name);
```

### visible

_bool_ **optional** _default:_ true

图层是否可见

### zIndex

_int_ **optional** _default:_ 0

图层绘制顺序，数值大绘制在上层，可以控制图层绘制的上下层级

L7 采用队列渲染的机制，所有的图层在内部保存在一个数组中，每一帧的渲染会将图层数组按照 zIndex 的值进行排序，然后遍历数组，将符合条件的图层渲染到场景中

### minZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最小缩放等级

### maxZoom

_number_ **optional** _default:_ Mapbox （0-24） 高德 （2-19)

图层显示最大缩放等级

### autoFit

_bool_ **optional** _default:_ false

layer 初始化完成之后，地图是否自动缩放到图层范围

### pickingBuffer

_bool_ **optional** _default:_ 0

图层拾取缓存机制，如 1px 宽度的线鼠标很难拾取(点击)到, 通过设置该参数可扩大拾取的范围（放大图层对象的尺寸）

### blend

_string_ **optional** _default:_ 'normal'

图层元素混合效果

- normal 正常效果 默认 发生遮挡的时候，只会显示前面的图层的颜色
- additive 叠加模式 发生遮挡的时候，显示前后图层颜色的叠加
- subtractive 相减模式 发生遮挡的时候，显示前后图层颜色的相减
- max 最大值 发生遮挡的时候，显示图层颜色 rgb 的最大值

### enablePropagation

_boolean_ **optional** _default:_ 'false'
图层事件，默认只响应最上层图层，设置为true 将允许事件透传

⚠️ mask、maskfence 不推荐使用，一下配置 2.14.x 之后版本生效

模板图层：用做模板的图层，PointLayer、LineLayer、PolygonLayer 都可以作为模板
掩模图层：被模板切割的图层

### enableRelativeCoordinates

图层使用相对坐标系，缩放等级大于 20,室内场景

### maskLayers

掩模图层生效

_array Layer_ **optional** _default:_ []

### enableMask

掩模图层生效

是否开启掩模，默认开启 maskLayers 不为空时生效

_bool_ **optional** _default:_ true

### maskInside

    掩模图层生效

_boolean_ **optional** _default:_ true

用来描述当前图层的内容与掩模边界显示。

- `true` 在掩模内部显示
- `false` 在掩模外部显示

### maskOpetation 掩模方式

模板图层生效
_枚举_ **optional** _default:_ and
maskLayers 为多个时失效，需要在模板图层设置

- or 交集
- and 并集

使用示例

```ts
const polygonLayer = new Polygon();
const rasterLayer = new Raster({
  // 栅格图层使用polygon 掩模
  maskLayers: [polygonLayer],
  enableMask: true,
  maskInside: true,
});
```
