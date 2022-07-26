---
title: 路径图
order: 1
---

`markdown:docs/common/style.md`
用一组首尾不闭合的点坐标对来定位的线图层，通常用来表示轨迹，线路，道路等

## 使用

```javascript
import { LineLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/gallery/animate#animate_path)

### shape

shape 设置成 line 即可绘制路线图

- line

### size

路径图线的 size 支持两个维度

- width 宽度
- height 高度

```javascript
layer.size([2, 10]); // 绘制宽度为2，高度为10的路径

layer.size('height', []);
```

🌟 通过设置第二个参数我们可以得到等高线图

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*p6LsTp3M144AAAAAAAAAAABkARQnAQ'>

[在线案例](../../../examples/line/isoline#ele)

✨ 当用户在传入数据的第三个值可以用于表示当前点的高度，通过在 source 中传入的第三个参数我们可以的高度不等的线图层

### style

#### raisingHeight: number

线图层的抬升高度，高度值和地图缩放层级无关。

[在线案例](/zh/examples/polygon/3d#floatMap)

#### heightfixed: boolean

线图层的高度是否和地图缩放层级无关，默认为 false。

[在线案例](/zh/examples/line/isoline#ele)

#### arrow: IArrowOption

线图层支持配置箭头

```javascript
// 配置箭头 IArrowOption
layer.style({
  arrow: {
    enable: true, // 是否开启箭头、默认为 false
    arrowWidth: 2, // 箭头的宽度、默认值为 2、与线的 size 相关
    arrowHeight: 3, // 箭头的高度、默认值为 3、与线的 size 相关
    tailWidth: 1, // 配置箭头的时候支持设置线尾部的宽度
  },
});
```

[在线案例](/zh/examples/line/path#arrow)

<img width="40%" style="display: block;margin: 0 auto;" alt="参数" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Muz8TLM2a0kAAAAAAAAAAAAAARQnAQ'/>

为了构造箭头，我们会在处理数据的时候插入多余的节点用于构造节点（为了不增加额外的消耗，普通线不会进行插入操作）。

<img width="40%" style="display: block;margin: 0 auto;" alt="原理" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FL4mT4RCfIgAAAAAAAAAAAAAARQnAQ'/>

如上图所示，对于配置箭头的线，我们插入额外的顶点用于构建箭头，同时我们会在顶点着色器中对新插入的顶点以及原有的顶点进行一定的偏移，让构建我们需要的箭头形状。

✨ 由于线图层在配置箭头/不配置箭头的这两种情况对顶点的处理不同，因此我们在切换这两种情况的时候需要重构线图层对象。

`markdown:docs/api/line_layer/features/vertexHeight.zh.md`

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/dash.zh.md`

`markdown:docs/api/line_layer/features/border.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`

`markdown:docs/api/line_layer/features/animate.zh.md`
