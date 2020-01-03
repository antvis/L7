// @ts-ignore
import { Marker, PolygonLayer, Scene } from '@antv/l7';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
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
      map: new GaodeMap({
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
      .active(true)
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
        opacity: 0.8,
      });
    scene.addLayer(layer);
    const marker = new Marker().setLnglat({
      lng: 120.19382669582967,
      lat: 30.258134,
    });
    marker.on('click', (e) => {
      console.log(e);
    });

    scene.addMarker(marker);
    scene.on('loaded', () => {
      // @ts-ignore
      const marker1 = new AMap.Marker({
        map: scene.map,
        position: [113.800646, 34.796227],
        shadow: '#000',
        label: {
          content: '站点',
          direction: 'top',
        },
      });
      marker1.on('click', () => {
        alert(1111);
        console.log('选中的点', 1111);
      });
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
