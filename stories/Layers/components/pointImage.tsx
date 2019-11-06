import { PointImageLayer, PointLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';
import data from '../data/data.json';
export default class PointImage extends React.Component {
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
    const pointLayer = new PointImageLayer({});
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*kzTMQqS2QdUAAAAAAAAAAABkARQnAQ',
    );
    pointLayer
      .source(data)
      .shape('00')
      .size(30);
    const pointLayer2 = new PointLayer({})
      .source(data)
      .shape('circle')
      .size(8)
      .color('red')
      .style({
        opacity: 1.0,
        strokeWidth: 2,
        strokeColor: '#fff',
      });
    scene.addLayer(pointLayer2);
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
