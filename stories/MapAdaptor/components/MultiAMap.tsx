// @ts-ignore
import { PolygonLayer } from '@l7/layers';
// @ts-ignore
import { Scene } from '@l7/scene';
import * as React from 'react';

export default class MultiAMap extends React.Component {
  private scene1: Scene;
  private scene2: Scene;

  public componentWillUnmount() {
    this.scene1.destroy();
    this.scene2.destroy();
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
    // const layer = new PolygonLayer({});

    // layer
    //   .source(await response.json())
    //   .size('name', [0, 10000, 50000, 30000, 100000])
    //   .color('name', [
    //     '#2E8AE6',
    //     '#69D1AB',
    //     '#DAF291',
    //     '#FFD591',
    //     '#FF7A45',
    //     '#CF1D49',
    //   ])
    //   .shape('fill')
    //   .style({
    //     opacity: 0.8,
    //   });
    // scene.addLayer(layer);
    scene1.render();
    scene2.render();
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
