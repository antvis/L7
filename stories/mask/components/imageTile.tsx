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
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [120.16021728515624, 30.259660295442085],
                  [120.15987396240234, 30.25313608393673],
                  [120.16605377197266, 30.253729211980726],
                  [120.1658821105957, 30.258474107402265],
                ],
              ],
              [
                [
                  [120.1703453063965, 30.258474107402265],
                  [120.17086029052733, 30.254174055663515],
                  [120.17583847045898, 30.254915457324778],
                  [120.17446517944336, 30.258474107402265],
                ],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [120.16536712646484, 30.26336704072365],
                  [120.16777038574219, 30.2657392842738],
                  [120.17086029052733, 30.26232916614846],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonlayer = new MaskLayer({})
        .source(data)
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer);

      const polygonlayer2 = new MaskLayer({})
        .source(data2)
        .shape('fill')
        .color('#ff0')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer2);

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
