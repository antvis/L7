// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { GeometryLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 90,
        style: 'dark',
        center: [ 120, 30 ],
        zoom: 6
      }),
    });

    scene.on('loaded', () => {
      const layer = new GeometryLayer()
        .shape('sprite')
        .size(10)
        .style({
          opacity: 0.3,
          mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*w2SFSZJp4nIAAAAAAAAAAAAAARQnAQ', // rain
          center: [ 120, 30 ],
          spriteCount: 120,
          spriteRadius: 10,
          spriteTop: 2500000,
          spriteUpdate: 20000,
          spriteScale: 0.6
        });
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
