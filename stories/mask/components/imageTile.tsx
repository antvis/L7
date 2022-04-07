import {
  LineLayer,
  Scene,
  MaskLayer,
  PolygonLayer,
  ImageTileLayer,
  ImageLayer,
} from '@antv/l7';
import { GaodeMap, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class ImageTile extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      // stencil: true,
      map: new Map({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 15,
        style: 'dark',
      }),
    });
    this.scene = scene;
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
    scene.on('loaded', () => {
      // 暂时不支持
      // let points = new PointLayer({ zIndex: 2, mask: true, maskInside: false }) // maskInside: true
      const layer = new ImageTileLayer({});
      layer
        .source(
          'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'imagetile',
            },
          },
        )
        .style({
          resolution: 'low', // low height
          // resolution: 'height'
          maxSourceZoom: 17,
        });

      scene.addLayer(layer);
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
        />
      </>
    );
  }
}
