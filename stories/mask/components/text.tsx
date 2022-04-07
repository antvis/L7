import {
  LineLayer,
  Scene,
  MaskLayer,
  PolygonLayer,
  PointLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class MaskPoints extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [105, 32],
        pitch: 0,
        zoom: 4,
      }),
    });
    this.scene = scene;
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [112.8515625, 47.635783590864854],
                  [117.59765625, 38.54816542304656],
                  [125.15625000000001, 45.02695045318546],
                ],
              ],
              [
                [
                  [88.681640625, 40.17887331434696],
                  [100.37109375, 35.460669951495305],
                  [89.82421875, 29.53522956294847],
                ],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [116.71874999999999, 30.221101852485987],
                  [113.90625, 24.686952411999155],
                  [123.48632812499999, 23.725011735951796],
                  [122.08007812499999, 28.22697003891834],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const mask1 = new MaskLayer({})
        .source(data)
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.3,
        });

      const mask2 = new MaskLayer({})
        .source(data2)
        .shape('fill')
        .color('#ff0')
        .style({
          opacity: 0.3,
        });

      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // const pointLayer = new PointLayer({ mask: true })
          const pointLayer = new PointLayer({ mask: true, maskInside: false })
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
          scene.addMask(mask1, pointLayer.id);
          scene.addMask(mask2, pointLayer.id);
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
