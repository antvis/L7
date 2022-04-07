import {
  LineLayer,
  Scene,
  MaskLayer,
  PolygonLayer,
  PointLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class MaskPoints extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
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
    const maskData = {
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

    scene.on('loaded', () => {
      // let points = new PointLayer({ zIndex: 2, mask: true, maskInside: false }) // maskInside: true
      let points = new PolygonLayer({
        mask: true,
        maskfence: maskData,
        maskOpacity: 0.3,
      })
        // let points = new PolygonLayer({ mask: true, maskInside: false })
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [120.13429641723633, 30.22836979266676],
                    [120.19214630126953, 30.22836979266676],
                    [120.19214630126953, 30.276265423522855],
                    [120.13429641723633, 30.276265423522855],
                    [120.13429641723633, 30.22836979266676],
                  ],
                ],
              },
            },
          ],
        })
        // .shape('circle')
        // .shape('text', 'test')
        // .shape('00')
        // .shape('extrude') // fill
        .shape('fill') // fill
        .size(10)
        .color('#0ff')
        .active(true);
      scene.addLayer(points);
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
