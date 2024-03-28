---
title: 后处理模块
order: 10
---

Post-Process Effect is a common processing effect in 3D rendering. It is a technology for reprocessing the rendered images and is generally used to achieve various special effects. L7's post-processing module provides users with some common post-processing effects, and also provides standard specifications to allow users to customize post-processing effects.

🌟 It should be noted that using post-processing usually results in additional performance consumption. Users should use post-processing reasonably according to the actual situation of the project.

## use

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

### Turn on post-processing

In order to enable the post-processing capability of the layer, we need to configure enableMultiPassRenderer to true when initializing the layer, and also pass in the processing effect configuration of the layer.

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

- enableMultiPassRenderer configures whether the layer starts post-processing capabilities
- passes post-processing configuration list\
  🌟 passes need to be configured according to certain rules

### Single layer post-processing

Traditional post-processing rendering often performs unified post-processing on all objects in the scene, but many times we only need to post-process a part of the scene. L7’s post-processing module naturally supports post-processing on a layer-by-layer basis, which gives users a higher degree of freedom in processing L7 scene content.

### update pass options

After the user initializes the layer object, if he wants to adjust the parameters of the post-processing effect, he can directly use the style method.

```javascript
layer.style({ passes: [ [ 'color Halftone', { // Update the position of center center: [newX, newY], }, ], ],
});
scene.render();
```

### setMultiPass(enableMultiPassRenderer: boolean, passes?: pass\[])

In order to facilitate users to switch the state of post-processing (on or off post-processing), we provide users with a special method

```javascript
// MultiPass exists in the current layer and we need to close it
//Close directly
layer.setMultiPass(false);
// Clear passes while closing
layer.setMultiPass(false, []);

// MultiPass does not exist in the current layer, when we need to enable it
// passes have been passed in during layer initialization
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

// No passes are passed in when initializing the layer
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

### Post-processing link

passes can pass in a variety of post-processing. The result of ordinary rendering is the input of the first post-processing, the output of the previous post-processing is the input of the next post-processing, and the final result is output to the screen.

### Prefabricated post-processing

L7's post-processing module presets several post-processing effects, so users can configure and use them directly in passes.

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

Glow post-processing

- bloomBaseRadio\
  Set the proportion that maintains the original style of the graphic. The value is between 0 and 1. When the value is 1, the original style is completely preserved.
- bloomRadius
  Set the radius of bloom. The larger the value, the larger the bloom range.
- bloomIntensity
  Set the intensity of bloom. The larger the value, the stronger the glow.

#### blurv

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*NrNGSIQuZ4oAAAAAAAAAAAAAARQnAQ' />

Vertical Blur/Horizontal Blur

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
  Set blur radius

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
  Set angle
- size
  Set size
- centerX
  Set center point X
- centerY
  Set center point Y

#### hexagonalPixelate

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*IQOMQrbDQ5IAAAAAAAAAAAAAARQnAQ' />

hexagonal pixels

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
  Set zoom
- centerX
  Set center point X
- centerY
  Set center point Y

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
  Set intensity

#### noise

<img width="40%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*6lcVS7YFrvUAAAAAAAAAAAAAARQnAQ' />

noise

```javascript
const noisePass = [
  'noise',
  {
    amount: 1,
  },
];
```

- amount
  Set the amount of noise

### Custom post-processing

Users can easily customize post-processing effects through L7-defined standards.

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
