// @ts-nocheck
import { Scene, PolygonLayer, PointLayer, Map } from '@antv/l7-mini';
// import { Scene } from '@antv/l7';
// import { PolygonLayer, PointLayer } from '@antv/l7-layers';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [105, 32],
        pitch: 0,
        zoom: 3,
      }),
    });
    // scene.setBgColor('#000');
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
        // 'https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/choropleth-data/country/100000_country_province.json'
      )
        .then((res) => res.json())
        .then((data) => {
          let layer = new PolygonLayer({ blend: 'normal' }) // autoFit: true
            .source(data)
            // .size('name', [0, 10000, 50000, 30000, 100000])
            .size(1)
            // .color('name1', [
            //   '#2E8AE6',
            //   '#69D1AB',
            //   '#DAF291',
            //   '#FFD591',
            //   '#FF7A45',
            //   '#CF1D49',
            // ])
            .color('#000')
            // .shape('fill')
            .shape('line')
            // .select(true)
            .style({
              opacity: 0.8,
              // opacityLinear: {
              //   enable: true,
              //   dir: 'in', // in - out
              // },
            });

          layer.setBottomColor('#f00');

          // let layer2 = new PolygonLayer({ blend: 'normal' })
          //   .source(data)
          //   .size(1)
          //   .color('name', [
          //     '#2E8AE6',
          //     '#69D1AB',
          //     '#DAF291',
          //     '#FFD591',
          //     '#FF7A45',
          //     '#CF1D49',
          //   ])
          //   .shape('line')
          //   .select(true)
          //   .style({
          //     opacity: 1.0,
          //   });

          scene.addLayer(layer);
          // scene.addLayer(layer2);
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
      ></div>
    );
  }
}
