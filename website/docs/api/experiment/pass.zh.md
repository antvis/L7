---
title: 后处理模块
order: 10
---

后处理（Post-Process Effect）是 3D 渲染常见的处理效果，是一种对渲染之后的画面进行再加工的技术，一般用于实现各种特效。L7 的后处理模块为用户提供了一些常见的后处理效果，同时也提供了标准规范，允许用户自定义后处理效果。

🌟 需要注意的是，使用后处理通常会产生额外的性能消耗，用户应该根据项目的实际情况合理使用后处理。

## 使用

```jsx
const layer = new LineLayer({
  enableMultiPassRenderer: true,
  passes: [
    [
      'bloom',
      {
        bloomBaseRadio: 0.8,
        bloomRadius: 2,
        bloomIntensity: 1
      }
    ]
  ]
}).source(data)
  .size('ELEV', h => [ h % 50 === 0 ? 1.0 : 0.5, (h - 1300) * 0.2 ])
  .shape('line')
  .scale('ELEV', {
    type: 'quantize'
  })
  .color('ELEV', [
    '#094D4A',
    ...
  ]);
scene.addLayer(layer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PIXmQ6m1C10AAAAAAAAAAAAAARQnAQ' />

### 开启后处理

为了开启图层的后处理能力，我们需要在初始化图层的时候配置 enableMultiPassRenderer 为 true，同时传入该图层作用的处理效果配置。

```javascript
let pointLayer = new PointLayer({
  zIndex: 1,
  enableMultiPassRenderer: false,
  passes: [
    [
      'bloom',
      {
        bloomBaseRadio: 0.95,
        bloomRadius: 4,
        bloomIntensity: 1.1,
      },
    ],
  ],
});
```

- enableMultiPassRenderer 配置该图层是否开始后处理能力
- passes 后处理配置列表  
  🌟 passes 需要根据一定的规则配置

### 单图层后处理

传统的后处理渲染往往会对场景中所有的对象做统一的后处理，而许多时候我们只需要对场景中的一部分内容做后处理。L7 的后处理模块天然支持以图层为单位进行后处理，这使的用户对 L7 场景内容的处理有更高的自由度。

### update pass options

用户在初始化完图层对象之后，若想调整后处理效果的参数，可以直接使用 style 方法

```javascript
layer.style({
  passes: [
    [
      'colorHalftone',
      {
        // 更新 cenrter 的位置
        center: [newX, newY],
      },
    ],
  ],
});
scene.render();
```

### setMultiPass(enableMultiPassRenderer: boolean, passes?: pass[])

为了方便用户切换后处理的状态（开启、关闭后处理），我们为用户提供了专门的方法

```javascript
// 当前图层存在 multiPass，我们需要关闭时
// 直接关闭
layer.setMultiPass(false);
// 关闭的同时清除 passes
layer.setMultiPass(false, []);

// 当前图层不存在 multiPass，我们需要开启时
// 图层初始化时已经传入 passes
const layer = new PolygonLayer({
  zIndex: 0,
  enableMultiPassRenderer: false,
  passes: [
    [
      'bloom',
      {
        bloomBaseRadio: 0.5,
        bloomRadius: 20,
        bloomIntensity: 1,
      },
    ],
  ],
});
layer.setMultiPass(true);

// 图层初始化时没有传入 passes
layer.setMultiPass(true, [
  [
    'bloom',
    {
      bloomRadius: 10,
      bloomIntensity: 1,
    },
  ],
]);
```

### 后处理链路

passes 可以传入多种后处理，普通渲染的结果是第一个后处理的输入，前一种后处理的输出是后一个后处理的输入，最后的结果输出到屏幕。

### 预制的后处理

L7 的后处理模块预置了几种后处理效果，因此用户可以直接在 passes 中配置使用。

#### bloom

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I3FCSo-gZR4AAAAAAAAAAAAAARQnAQ' />

```javascript
const bloomPass = [
  'bloom',
  {
    bloomBaseRadio: 0.5,
    bloomRadius: 20,
    bloomIntensity: 1,
  },
];
```

辉光后处理

- bloomBaseRadio  
  设置保持图形原本样式的比例，值在 0 - 1 之间，值为 1 时完全保存本身的样式
- bloomRadius
  设置 bloom 的半径，值越大，bloom 范围越大
- bloomIntensity
  设置 bloom 的强度，值越大，辉光越强

#### blurV/blurH

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*NrNGSIQuZ4oAAAAAAAAAAAAAARQnAQ' />

垂直方向模糊/水平方向模糊

```javascript
const blurVPass = [
  'blurV',
  {
    blurRadius: 5,
  },
];
const blurHPass = [
  'blurH',
  {
    blurRadius: 5,
  },
];
```

- blurRadius
  设置模糊半径

#### colorHalftone

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*QstwSr4dj20AAAAAAAAAAAAAARQnAQ' />

colorHalftone

```javascript
const colorHalftonePass = [
  'colorHalftone',
  {
    angle: 0,
    size: 8,
    centerX: 0.5,
    centerY: 0.5,
  },
];
```

- angle
  设置角度
- size
  设置大小
- centerX
  设置中心点 X
- centerY
  设置中心点 Y

#### hexagonalPixelate

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*IQOMQrbDQ5IAAAAAAAAAAAAAARQnAQ' />

六边形像素

```javascript
const hexagonalPixelatePass = [
  'hexagonalPixelate',
  {
    scale: 10,
    centerX: 0.5,
    centerY: 0.5,
  },
];
```

- scale
  设置缩放
- centerX
  设置中心点 X
- centerY
  设置中心点 Y

#### ink

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*IpogQbe-5K4AAAAAAAAAAAAAARQnAQ' />

ink

```javascript
const inkPass = [
  'ink',
  {
    strength: 1,
  },
];
```

- strength
  设置强度

#### noise

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*6lcVS7YFrvUAAAAAAAAAAAAAARQnAQ' />

噪声

```javascript
const noisePass = [
  'noise',
  {
    amount: 1,
  },
];
```

- amount
  设置噪点数量

### 自定义后处理

用户通过 L7 定义的标准可以轻松的自定义后处理效果。

```javascript
import { BasePostProcessingPass, PolygonLayer, Scene } from '@antv/l7';

interface IDotScreenEffectConfig {
  center: [number, number]; // pattern 圆心
  angle: number; // dot 旋转角度
  size: number; // dot 尺寸
}

class DotScreenEffect extends BasePostProcessingPass<IDotScreenEffectConfig> {
  protected setupShaders() {
    this.shaderModuleService.registerModule('dotScreenEffect', {
      vs: this.quad,
      fs: `
      varying vec2 v_UV;

      uniform sampler2D u_Texture;
      uniform vec2 u_ViewportSize : [1.0, 1.0];
      uniform vec2 u_Center : [0.5, 0.5];
      uniform float u_Angle : 1;
      uniform float u_Size : 3;

      float pattern(vec2 texSize, vec2 texCoord) {
        float scale = 3.1415 / u_Size;
        float s = sin(u_Angle), c = cos(u_Angle);
        vec2 tex = texCoord * texSize - u_Center * texSize;
        vec2 point = vec2(
          c * tex.x - s * tex.y,
          s * tex.x + c * tex.y
        ) * scale;
        return (sin(point.x) * sin(point.y)) * 4.0;
      }
      vec4 dotScreen_filterColor(vec4 color, vec2 texSize, vec2 texCoord) {
        float average = (color.r + color.g + color.b) / 3.0;
        return vec4(vec3(average * 10.0 - 5.0 + pattern(texSize, texCoord)), color.a);
      }

      void main() {
        gl_FragColor = vec4(texture2D(u_Texture, v_UV));
        gl_FragColor = dotScreen_filterColor(gl_FragColor, u_ViewportSize, v_UV);
      }
      `,
    });
    const { vs, fs, uniforms } = this.shaderModuleService.getModule('dotScreenEffect');
    const { width, height } = this.rendererService.getViewportSize();
    return {
      vs,
      fs,
      uniforms: {
        ...uniforms,
        u_ViewportSize: [width, height],
      },
    };
  }
}

// 注册自定义后处理效果
scene.registerPostProcessingPass(DotScreenEffect, 'dotScreenEffect');
const layer = new PolygonLayer({
  enableMultiPassRenderer: true,
  passes: [
    [
      'dotScreenEffect',
      {
        size: 8,
        angle: 1,
      },
    ],
  ],
});
```
