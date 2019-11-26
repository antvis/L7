import { PointLayer, Scene } from '@antv/l7';
import { AMap, Mapbox } from '@antv/l7-maps';
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
      id: 'map',
      map: new AMap({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'light',
        zoom: 3,
      }),
      // map: new Mapbox({
      //   center: [120.19382669582967, 30.258134],
      //   pitch: 0,
      //   style: 'mapbox://styles/mapbox/streets-v9',
      //   zoom: 1,
      // }),
    });
    const pointLayer = new PointLayer({})
      .source(pointsData)
      .shape('circle')
      .size('mag', [1, 25])
      .color('mag', (mag) => {
        return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
      })
      .style({
        opacity: 0.3,
        strokeWidth: 1,
      });
    scene.addLayer(pointLayer);
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
        }}
      />
    );
  }
}
