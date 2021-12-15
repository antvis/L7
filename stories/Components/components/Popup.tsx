// @ts-ignore
import { PolygonLayer, Popup, Scene } from '@antv/l7';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PopupComponent extends React.Component {
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
      map: new GaodeMap({
        style: 'mapbox://styles/mapbox/streets-v9',
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
      .shape('fill')
      .style({
        opacity: 0.3,
      });
    scene.addLayer(layer);
    const popup = new Popup({
      offsets: [0, 20],
    })
      .setLnglat({
        lng: 120.19382669582967,
        lat: 30.258134,
      })
      .setText('hello this is test text');
    scene.addPopup(popup);
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
