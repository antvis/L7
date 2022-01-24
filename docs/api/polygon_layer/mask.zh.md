---
title: 蒙层
order: 2
---

`markdown:docs/common/style.md`

## 使用

```javascript
import { MaskLayer } from '@antv/l7';
let layer = new MaskLayer()
  .source(data);

scene.addLayer(layer);
```

### shape

maskLayer 默认 shape 为 'fill'，可不调用

```javascript
layer.shape('fill');
```

### color

设置颜色值

### size 

maskLayer 无 size 不需要设置 size

### style 配置

- opacity 默认为 0，若需要显示的观察 maskLayer 则可以将 opacity 设置 > 0

```javascript
style({
  opacity: 0.5
});
```

### scene

为了支持 maskLayer，我们在创建 scene 的时候需要配置 stencil 为 true

```javascript
const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new GaodeMap({
    center: [120.165, 30.26],
    pitch: 0,
    zoom: 2,
    style: 'dark',
  }),
});
```

### 其他图层

若要让 maskLayer 生效，需要被裁剪的图层需要配置裁剪参数

- mask: boolean 是否开启裁剪 默认为 false
- maskInside: boolean 是否在 maskLayer 内部显示 默认为 true

```javascript
const layer = new RasterLayer({ mask: true });
```


[在线案例](../../../examples/raster/basic#dem)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*jhWWS6dhKhYAAAAAAAAAAAAAARQnAQ">


`markdown:docs/common/layer/base.md`
