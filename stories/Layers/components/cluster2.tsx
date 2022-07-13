import { PointLayer, Scene, Source } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import data1 from '../data/cluster1.json';
import data2 from '../data/cluster2.json';
export default class Point3D extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 3.0,
      map: new GaodeMap({
        style: 'light',
        center: [-121.24357, 37.58264],
        pitch: 0,
        zoom: 10.45,
      }),
    });
    scene.on('loaded', () => {
      const fontFamily = 'iconfont';
      const fontPath =
        '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
      scene.addFontFace(fontFamily, fontPath);
      scene.addIconFont('icon1', '&#xe6d4;');
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/87e40417-a5da-4fdb-8313-c796ea15f982.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const dataSource = new Source(data, {
            parser: {
              type: 'csv',
              x: 'lng',
              y: 'lat',
            },
            cluster: true,
          });
          const pointLayer = new PointLayer({
            autoFit: true,
          })
            .source(dataSource)
            .shape('circle')
            .scale('point_count', {
              type: 'quantile',
            })
            .size('point_count', [5, 10, 15, 20, 25])
            .active(true)
            .color('rgb(73,167,86)')
            .style({
              opacity: 1,
              strokeWidth: 1,
              stroke: '#333',
            });

          const pointLayerText = new PointLayer({
            autoFit: true,
          })
            .source(dataSource)
            .shape('point_count', 'text')
            .size(15)
            .active(true)
            .color('#fff')
            .style({
              opacity: 1,
              strokeWidth: 0,
              stroke: '#fff',
            });

          scene.addLayer(pointLayer);
          scene.addLayer(pointLayerText);
        });
    });
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
