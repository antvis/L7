// @ts-ignore
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class Mixed extends React.Component {
  private scene1: Scene;
  private scene2: Scene;
  private scene3: Scene;
  private scene4: Scene;

  public componentWillUnmount() {
    this.scene1.destroy();
    this.scene2.destroy();
    this.scene3.destroy();
    this.scene4.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );

    const scene1 = new Scene({
      center: [110.19382669582967, 50.258134],
      id: 'map1',
      pitch: 0,
      style: 'light',
      type: 'amap',
      zoom: 3,
    });
    const scene2 = new Scene({
      center: [110.19382669582967, 50.258134],
      id: 'map2',
      pitch: 0,
      style: 'dark',
      type: 'amap',
      zoom: 3,
    });

    const scene3 = new Scene({
      id: 'map3',
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [110.19382669582967, 50.258134],
      pitch: 0,
      zoom: 2,
    });

    const scene4 = new Scene({
      id: 'map4',
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [110.19382669582967, 50.258134],
      pitch: 0,
      zoom: 2,
    });

    this.scene1 = scene1;
    this.scene2 = scene2;
    this.scene3 = scene3;
    this.scene4 = scene4;
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
    scene1.addLayer(layer);
    scene1.render();
    scene2.render();
    scene3.render();
    scene4.render();
    // scene.on('loaded', () => {
    //   const zoomControl = new Zoom({
    //     position: 'bottomright',
    //   });
    //   const scaleControl = new Scale();
    //   const popup = new Popup({
    //     offsets: [0, 20],
    //   })
    //     .setLnglat({
    //       lng: 120.19382669582967,
    //       lat: 30.258134,
    //     })
    //     .setText('hello')
    //     .addTo(scene);

    //   const maker = new Marker();
    //   maker
    //     .setLnglat({
    //       lng: 120.19382669582967,
    //       lat: 30.258134,
    //     })
    //     .addTo(scene);
    //   scene.addControl(zoomControl);
    //   scene.addControl(scaleControl);
    //   // layer.fitBounds();
    // });
  }

  public render() {
    return (
      <>
        <div
          id="map1"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '50%',
            bottom: '50%',
          }}
        />
        <div
          id="map2"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            right: 0,
            bottom: '50%',
          }}
        />
        <div
          id="map3"
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: '50%',
            bottom: 0,
          }}
        />
        <div
          id="map4"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
