// @ts-ignore
import { PolygonLayer, Scene, Zoom } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

import * as React from 'react';

export default class ZoomComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const data = await response.json();
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    this.scene = scene;
    const layer = new PolygonLayer({});

    layer
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
      .shape('name', 'text')
      .size(10)
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
    const zoomControl = new Zoom({
      position: 'bottomright',
    });
    scene.addControl(zoomControl);
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
