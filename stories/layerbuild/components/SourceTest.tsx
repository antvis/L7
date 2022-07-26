// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  private scene: Scene;
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
    });
    this.scene = scene;

    // 检测方案
    // https://www.yuque.com/antv/l7/cpkdtl
    // this.test1();
    // this.test2();
    // this.test3();
    // this.test4();
    // this.test5();
    // this.test6();
    // this.test7();
    // this.test8();
    // this.test9();
    this.test10();
  }

  private test1() {
    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    this.scene.addLayer(layer);
  }

  private test2() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    const layer = new PointLayer();
    layer.source(source);
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    this.scene.addLayer(layer);
  }

  private test3() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    source.on('sourceUpdate', () => {
      const layer = new PointLayer();
      layer.source(source);
      layer
        .shape('circle')
        .size(10)
        .color('#f00');
      this.scene.addLayer(layer);
    });
  }

  private test4() {
    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    layer.setData([
      {
        lng: 120,
        lat: 30,
      },
      {
        lng: 130,
        lat: 30,
      },
    ]);
    this.scene.addLayer(layer);
  }

  private test5() {
    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    this.scene.addLayer(layer);
    setTimeout(() => {
      layer.setData([
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ]);
    }, 2000);
  }

  private test6() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    layer.source(source);
    this.scene.addLayer(layer);
  }

  private test7() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    this.scene.addLayer(layer);
    setTimeout(() => {
      layer.source(source);
      this.scene.render();
    }, 2000);
  }

  private test8() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );

    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    source.on('sourceUpdate', () => {
      layer.source(source);
    });
    this.scene.addLayer(layer);
  }

  private test9() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );

    const layer = new PointLayer();
    layer.source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    source.on('sourceUpdate', () => {
      setTimeout(() => {
        layer.source(source);
      }, 2000);
    });
    this.scene.addLayer(layer);
  }

  private test10() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
        {
          lng: 130,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );

    const layer = new PointLayer();
    layer
      .shape('circle')
      .size(10)
      .color('#f00');
    source.on('sourceUpdate', () => {
      setTimeout(() => {
        layer.source(source);
      }, 2000);
    });
    this.scene.addLayer(layer);
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
      ></div>
    );
  }
}
