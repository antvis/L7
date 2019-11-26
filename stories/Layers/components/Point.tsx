import { PointLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import data from '../data/data.json';
export default class Point3D extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 1,
      }),
    });
    const pointLayer = new PointLayer({
      enablePicking: true,
      enableHighlight: true,
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene4', pickedFeature.feature.name);
      },
    });
    pointLayer
      .source(data)
      .color('name', [
        '#FFF5B8',
        '#FFDC7D',
        '#FFAB5C',
        '#F27049',
        '#D42F31',
        '#730D1C',
      ])
      .shape('subregion', [
        'circle',
        'triangle',
        'square',
        'pentagon',
        'hexagon',
        'octogon',
        'hexagram',
        'rhombus',
        'vesica',
      ])
      .size('scalerank', [5, 10])
      .style({
        opacity: 1.0,
      });
    scene.addLayer(pointLayer);
    scene.render();
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
