import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import data from '../data/data.json';
export default class Point3D extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
        style: 'light',
        center: [-121.24357, 37.58264],
        pitch: 0,
        zoom: 6.45,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6c4bb5f2-850b-419d-afc4-e46032fc9f94.csv',
      )
        .then((res) => res.text())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data.slice(0, 1000), {
              parser: {
                type: 'csv',
                x: 'Longitude',
                y: 'Latitude',
              },
            })
            .shape('circle')
            .size(16)
            .active(true)
            .select({
              color: 'red',
            })
            .color('Magnitude', [
              '#0A3663',
              '#1558AC',
              '#3771D9',
              '#4D89E5',
              '#64A5D3',
              '#72BED6',
              '#83CED6',
              '#A6E1E0',
              '#B8EFE2',
              '#D7F9F0',
            ])
            .style({
              opacity: 1,
              strokeWidth: 0,
              stroke: '#fff',
            });

          scene.addLayer(pointLayer);
          this.scene = scene;
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
