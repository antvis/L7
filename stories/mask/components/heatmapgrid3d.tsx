import {
  LineLayer,
  Scene,
  MaskLayer,
  HeatmapLayer,
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
        style: 'light',
        pitch: 56.499,
        center: [114.07737552216226, 22.542656745583486],
        rotation: 39.19,
        zoom: 12.47985,
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
                  [113.94058227539062, 22.67484735118852],
                  [113.83895874023438, 22.62415215809042],
                  [113.9447021484375, 22.55187920514417],
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
                  [114.11087036132811, 22.669778674332314],
                  [114.02847290039062, 22.59372606392931],
                  [114.11636352539062, 22.485912942320958],
                  [114.22622680664062, 22.51255695405145],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonlayer = new MaskLayer({})
        .source(data)
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer);

      const polygonlayer2 = new MaskLayer({})
        .source(data2)
        .shape('fill')
        .color('#ff0')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer2);
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // const layer = new HeatmapLayer({ mask: true })
          const layer = new HeatmapLayer({ mask: true, maskInside: false })
            .source(data, {
              transforms: [
                {
                  type: 'grid',
                  size: 100,
                  field: 'h12',
                  method: 'sum',
                },
              ],
            })
            .size('sum', [0, 600])
            .shape('cylinder')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
            })
            .color(
              'sum',
              [
                '#094D4A',
                '#146968',
                '#1D7F7E',
                '#289899',
                '#34B6B7',
                '#4AC5AF',
                '#5FD3A6',
                '#7BE39E',
                '#A1EDB8',
                '#CEF8D6',
              ].reverse(),
            );
          scene.addLayer(layer);
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
