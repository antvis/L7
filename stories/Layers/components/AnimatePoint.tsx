import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import data from '../data/data.json';
export default class AnimatePoint extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: document.getElementById('map') as HTMLDivElement,
      map: new Mapbox({
        pitch: 0,
        style: 'dark',
        center: [112, 23.69],
        zoom: 2.5,
        plugin: ['AMap.ToolBar'],
      }),
    });

    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv',
    )
      .then((res) => res.text())
      .then((data) => {
        const pointLayer = new PointLayer({})
          .source(data, {
            parser: {
              type: 'csv',
              x: 'Longitude',
              y: 'Latitude',
            },
          })
          .shape('circle')
          .active(true)
          .animate(true)
          .size(40)
          .color('#ffa842')
          .style({
            opacity: 1,
            offsets: [40, 40],
          });
        const pointLayer2 = new PointLayer({})
          .source(data, {
            parser: {
              type: 'csv',
              x: 'Longitude',
              y: 'Latitude',
            },
          })
          .shape('circle')
          .active(true)
          .animate(true)
          .size(10)
          .color('#f00')
          .style({
            opacity: 1,
          });

        scene.addLayer(pointLayer);
        scene.addLayer(pointLayer2);
      });

    this.scene = scene;
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
          // transform: 'scale(1.5)',
        }}
      />
    );
  }
}
