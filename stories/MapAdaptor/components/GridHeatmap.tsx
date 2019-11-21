import { HeatMapLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class GridHeatMap extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/c3f8bda2-081b-449d-aa9f-9413b779205b.json',
    );
    const scene = new Scene({
      center: [116.49434030056, 39.868073421167621],
      id: 'map',
      pitch: 0,
      type: 'amap',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 16,
    });
    const layer = new HeatMapLayer({});
    layer
      .source(await response.json(), {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
        transforms: [
          {
            type: 'grid',
            size: 50,
            field: 'count',
            method: 'sum',
          },
        ],
      })
      .size('sum', (value: number) => {
        return value;
      })
      .shape('circle')
      .style({
        coverage: 0.5,
        angle: 0,
        opacity: 1,
      })
      .color('count', [
        '#002466',
        '#105CB3',
        '#2894E0',
        '#CFF6FF',
        '#FFF5B8',
        '#FFAB5C',
        '#F27049',
        '#730D1C',
      ]);
    scene.addLayer(layer);
    scene.render();
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
