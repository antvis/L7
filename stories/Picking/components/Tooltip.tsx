// @ts-ignore
import { PolygonLayer, Popup, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class Tooltip extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    const layer = new PolygonLayer();
    layer
      .source(await response.json())
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
      .select(true)
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);
    layer.on('click', (e) => {
      const popup = new Popup({
        offsets: [0, 0],
      })
        .setLnglat(e.lngLat)
        .setText(e.feature.properties.name);
      scene.addPopup(popup);
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
        }}
      />
    );
  }
}
