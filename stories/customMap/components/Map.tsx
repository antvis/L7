import { Scene, PolygonLayer, PointLayer, Map } from '@antv/l7-mini';
// import { Scene } from '@antv/l7';
// import { PolygonLayer, PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        hash: true,
        center: [105, 32],
        pitch: 0,
        zoom: 3,
      }),
    });
    // scene.setBgColor('#000');

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new PolygonLayer({ blend: 'normal',  }) // autoFit: true
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
          .shape('fill')
          .select(true)
          .style({
            opacity: 0.8,
            opacityLinear: {
              enable: true,
              dir: 'in', // in - out
            },
          });
        scene.addLayer(layer);
        
        scene.fitBounds([
          [48.073279,3.067261],
          [160.573279,54.003394]
        ])

        const layer2 = new PolygonLayer({ blend: 'normal' })
          .source(data)
          .size(1)
          .color('name', [
            '#2E8AE6',
            '#69D1AB',
            '#DAF291',
            '#FFD591',
            '#FF7A45',
            '#CF1D49',
          ])
          .shape('line')
          .select(true)
          .style({
            opacity: 1.0,
          });
        scene.addLayer(layer2);
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
      ></div>
    );
  }
}
