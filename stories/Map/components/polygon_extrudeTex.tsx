import { PolygonLayer, Scene, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_polygon_extrude extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120, 29.732983],
        zoom: 6.2,
        pitch: 60,
      }),
    });
    this.scene = scene;

    fetch('https://geo.datav.aliyun.com/areas_v3/bound/330000.json')
      .then((res) => res.json())
      .then((data) => {
        const provincelayer = new PolygonLayer({})
          .source(data)
          .size(150000)
          .shape('extrude')
          .color('#0DCCFF')
          .active({
            color: 'rgb(255,255,255)',
            mix: 0.5,
          })
          .style({
            heightfixed: true,
            // pickLight: true,
            raisingHeight: 200000,
            mapTexture:
              'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*SOUKQJpw1FYAAAAAAAAAAAAAARQnAQ',
            // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ'
            // opacity: 0.8,
            sourceColor: '#f00',
            targetColor: '#ff0',

            // topsurface: false,
            // sidesurface: false
          });

        scene.addLayer(provincelayer);
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
