// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class MultiGaodeMap extends React.Component {
  private scene1: Scene;
  private scene2: Scene;

  public componentWillUnmount() {
    this.scene1.destroy();
    this.scene2.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
    );
    const data = await response.json();
    const scene1 = new Scene({
      id: 'map1',
      map: new GaodeMap({
        center: [121.435159, 31.256971],
        zoom: 14.89,
        style: 'light',
      }),
    });
    const scene2 = new Scene({
      id: 'map2',
      map: new GaodeMap({
        center: [121.435159, 31.256971],
        zoom: 14.89,
        style: 'dark',
      }),
    });

    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude',
        },
      })
      .shape('name', [
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
      .size('unit_price', [10, 25])
      .active(true)
      .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
      .style({
        opacity: 0.3,
        strokeWidth: 2,
      });

    const pointLayer2 = new PointLayer({})
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude',
        },
      })
      .shape('name', [
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
      .size('unit_price', [10, 25])
      .active(true)
      .color('#5B8FF9')
      .style({
        opacity: 0.3,
        strokeWidth: 2,
      });
    // scene1.on('loaded', () => {
    scene1.addLayer(pointLayer);
    // });
    // scene2.on('loaded', () => {
    scene2.addLayer(pointLayer2);
    // });

    this.scene1 = scene1;
    this.scene2 = scene2;
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
            bottom: 0,
          }}
        />
        <div
          id="map2"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
