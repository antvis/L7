import { vec2, vec3 } from 'gl-matrix';
// @ts-ignore
import { ILngLat, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMap2 } from '@antv/l7-maps';
import * as React from 'react';

import { mat4 } from 'gl-matrix';

export default class Amap2demo_text extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap2({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'light',
        zoom: 3,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      console.log('event test');

      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data.list, {
              parser: {
                type: 'json',
                x: 'j',
                y: 'w',
              },
            })
            .shape('m', 'text')
            .size(12)
            .color('w', ['#0e0030', '#0e0030', '#0e0030'])
            .style({
              textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
              textOffset: [0, 0], // 文本相对锚点的偏移量 [水平, 垂直]
              spacing: 2, // 字符间距
              padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
              stroke: '#ffffff', // 描边颜色
              strokeWidth: 0.3, // 描边宽度
              strokeOpacity: 1.0,
              // textAllowOverlap: true
            });

          scene.addLayer(pointLayer);
        });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
