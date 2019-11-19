// tslint:disable-next-line:no-submodule-imports
import '!style-loader!css-loader!../../assets/css/l7.css';
import { Marker } from '@l7/component';
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class MarkerComponent extends React.Component {
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
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [110.19382669582967, 30.258134],
      pitch: 0,
      zoom: 3,
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
      .shape('fill')
      .style({
        opacity: 0.3,
      });
    scene.addLayer(layer);
    scene.render();
    scene.on('loaded', () => {
      new Marker()
        .setLnglat({
          lng: 120.19382669582967,
          lat: 30.258134,
        })
        .addTo(scene);
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
