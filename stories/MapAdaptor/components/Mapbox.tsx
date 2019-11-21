// @ts-ignore
import '!style-loader!css-loader!./css/l7.css';
import { Marker, Popup, Scale, Zoom } from '@l7/component';
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class Mapbox extends React.Component {
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
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [110.19382669582967, 30.258134],
      pitch: 0,
      zoom: 3,
    });
    this.scene = scene;
    const layer = new PolygonLayer({});

    layer
      .source(await response.json())
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', () => {
        return 'yellow';
      })
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);
    scene.render();
    scene.on('loaded', () => {
      const zoomControl = new Zoom({
        position: 'bottomright',
      });
      const scaleControl = new Scale();
      const popup = new Popup({
        offsets: [0, 20],
      })
        .setLnglat({
          lng: 120.19382669582967,
          lat: 30.258134,
        })
        .setText('hello')
        .addTo(scene);

      const maker = new Marker();
      maker
        .setLnglat({
          lng: 120.19382669582967,
          lat: 30.258134,
        })
        .addTo(scene);
      scene.addControl(zoomControl);
      scene.addControl(scaleControl);
      // layer.fitBounds();
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
