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
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const pointsData = await response.json();

    const scene = new Scene({
      id: document.getElementById('map') as HTMLDivElement,
      map: new GaodeMap({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'dark',
        zoom: 0,
      }),
    });
    scene.on('loaded', () => {
      const pointLayer = new PointLayer({})
        .source(pointsData, {
          cluster: false,
        })
        .scale({
          size: {
            type: 'power',
            field: 'mag',
          },
          color: {
            type: 'linear',
            field: 'mag',
          },
        })
        .shape('circle')
        .size('mag', [2, 8, 14, 20, 26, 32, 40])
        .animate(false)
        .active(true)
        .color('mag', ['red', 'blue', 'yellow', 'green'])
        .style({
          opacity: 0.5,
          strokeWidth: 1,
        });
      scene.addLayer(pointLayer);
      const hander = () => {
        console.log('click');

      };
      scene.on('click', hander);
      this.scene = scene;
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
