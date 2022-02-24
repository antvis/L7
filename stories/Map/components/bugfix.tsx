// @ts-nocheck
import React from 'react';
import { Scene, GaodeMap, GaodeMapV2, PointLayer } from '@antv/l7';

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        s: '海南',
        m: '东方',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.218258, 30.298216],
      },
    },
    {
      type: 'Feature',
      properties: {
        s: '海南',
        m: '海口',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.137195, 30.304203],
      },
    },
    {
      type: 'Feature',
      properties: {
        s: '广东',
        m: '珠海',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.052108, 30.296719],
      },
    },
    {
      type: 'Feature',
      properties: {
        s: '广东',
        m: '徐闻',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.20906, 30.201379],
      },
    },
    {
      type: 'Feature',
      properties: {
        s: '海南',
        m: '琼海',
      },
      geometry: {
        type: 'Point',
        coordinates: [120.119373, 30.1824],
      },
    },
  ],
};

const img = {
  海南:
    'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
  广东:
    'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
};

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: [120.2, 30.2],
        zoom: 9,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      Object.keys(img).forEach((key) => {
        scene.addImage(key, img[key]);
      });
      const imageLayer = new PointLayer({
        name: 'image',
      });

      imageLayer
        .source(data)
        // @ts-ignore
        .size(20)
        // @ts-ignore
        .shape('s', (s) => s)
        .fitBounds();

      const textLayer = new PointLayer({
        name: 'image',
      });

      textLayer
        .source(data)
        // @ts-ignore
        .size(20)
        .color('#000000')
        // @ts-ignore
        .shape('m', 'text')
        .style({
          stroke: '#ffffff',
          strokeWidth: 2,
          textOffset: [0, -40],
        });

      scene.addLayer(textLayer);

      scene.addLayer(imageLayer);

      [textLayer, imageLayer].forEach((layer) => {
        layer.on('click', () => {
          alert();
        });
      });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
