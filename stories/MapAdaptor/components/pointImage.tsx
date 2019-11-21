import '!style-loader!css-loader!./css/l7.css';
import { Marker, Popup, Scale, Zoom } from '@l7/component';
import { Point } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';
import data from './data.json';
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
      style: 'mapbox://styles/mapbox/dark-v10',
      zoom: 1,
    });
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*kzTMQqS2QdUAAAAAAAAAAABkARQnAQ',
    );
    const pointLayer = new Point({});

    // console.log(zoomControl);
    //
    pointLayer
      .source(data)
      // .color('blue')
      .shape('00')
      .size(40);
    scene.addLayer(pointLayer);
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
