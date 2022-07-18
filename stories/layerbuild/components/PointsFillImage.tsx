// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PointTest extends React.Component {
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

    scene.addImage(
      'img',
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*rd3kTp1VFxIAAAAAAAAAAAAAARQnAQ',
    );
    const imageData = [
      {
        lng: 120,
        lat: 30,
        img: 'img',
      },
    ];

    const layer = new PointLayer({ layerType: 'fillImage' })
      .source(imageData, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .size(15)
      .shape('img', ['img'])
      .active({
        color: '#f00',
        mix: 0.5,
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
      ></div>
    );
  }
}
