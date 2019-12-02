import { PointLayer, Scene } from '@antv/l7';
import * as React from 'react';
import data from '../data/data.json';
export default class Point3D extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      center: [120.19382669582967, 30.258134],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 1,
    });
    const pointLayer = new PointLayer({});
    const p1 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [83.671875, 44.84029065139799],
          },
        },
      ],
    };
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
      .size('scalerank', [2, 4, 6, 8, 10]);
    scene.addLayer(pointLayer);
    console.log(pointLayer);
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
