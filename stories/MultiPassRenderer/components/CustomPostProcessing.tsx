// @ts-ignore
import { BasePostProcessingPass, PolygonLayer, Scene } from '@antv/l7';
import { Mapbox, GaodeMap, GaodeMapV2 } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

interface IDotScreenEffectConfig {
  center: [number, number]; // pattern 圆心
  angle: number; // dot 旋转角度
  size: number; // dot 尺寸
}

class DotScreenEffect extends BasePostProcessingPass<IDotScreenEffectConfig> {
  protected setupShaders() {
    // @ts-ignore
    this.shaderModuleService.registerModule('dotScreenEffect', {
      // @ts-ignore
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

    // @ts-ignore
    const { vs, fs, uniforms } = this.shaderModuleService.getModule(
      'dotScreenEffect',
    );
    // @ts-ignore
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

// tslint:disable-next-line:max-classes-per-file
export default class CustomPostProcessing extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    if (this.gui) {
      this.gui.destroy();
    }
    if (this.$stats) {
      document.body.removeChild(this.$stats);
    }
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      // map: new Mapbox({
      //   style: 'mapbox://styles/mapbox/streets-v9',
      //   center: [110.19382669582967, 50.258134],
      //   pitch: 0,
      //   zoom: 3,
      // }),
      map: new GaodeMap({
        // style: 'mapbox://styles/mapbox/streets-v9',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 3,
      }),
    });

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

    layer
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .active(true)
      .shape('fill')
      .style({
        opacity: 0.8,
      });

    scene.addLayer(layer);

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      size: 8,
      angle: 1,
      centerX: 0.5,
      centerY: 0.5,
    };
    const pointFolder = gui.addFolder('DotScreen 配置');
    pointFolder.add(styleOptions, 'size', 0, 10).onChange((size: number) => {
      layer.style({
        passes: [
          [
            'dotScreenEffect',
            {
              size,
            },
          ],
        ],
      });
      scene.render();
    });
    pointFolder.add(styleOptions, 'angle', 0, 10).onChange((angle: number) => {
      layer.style({
        passes: [
          [
            'dotScreenEffect',
            {
              angle,
            },
          ],
        ],
      });
      scene.render();
    });
    pointFolder
      .add(styleOptions, 'centerX', 0, 1)
      .onChange((centerX: number) => {
        layer.style({
          passes: [
            [
              'dotScreenEffect',
              {
                center: [centerX, styleOptions.centerY],
              },
            ],
          ],
        });
        scene.render();
      });
    pointFolder
      .add(styleOptions, 'centerY', 0, 1)
      .onChange((centerY: number) => {
        layer.style({
          passes: [
            [
              'dotScreenEffect',
              {
                center: [styleOptions.centerX, centerY],
              },
            ],
          ],
        });
        scene.render();
      });
    pointFolder.open();
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
