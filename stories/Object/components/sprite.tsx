import { GeometryLayer, Scene, IMapService } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Mapbox({
        pitch: 40,
        style: 'dark',
        center: [120, 30],
        zoom: 6,
      }),
    });
    this.scene = scene;

    let layer = new GeometryLayer()
      // .source([{ lng: 120, lat: 30 }], {
      //   parser: {
      //     type: 'json',
      //     x: 'lng',
      //     y: 'lat',
      //   },
      // })
      .shape('sprite')
      .size(20)
      .style({
        // opacity: 0.3,
        mapTexture:
          'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zLQwQKBSagYAAAAAAAAAAAAAARQnAQ', // snow
        // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*w2SFSZJp4nIAAAAAAAAAAAAAARQnAQ', // rain
        // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*bq1cS7ADjR4AAAAAAAAAAAAAARQnAQ', // blub
        center: [120, 30],
        // spriteAnimate: 'up',
        spriteCount: 60,
        spriteRadius: 10,
        spriteTop: 2500000,
        spriteUpdate: 10000,
        spriteScale: 0.8,

        // spriteTop: 1000,
        // spriteUpdate: 5,
        // spriteBottom: -10,
        // spriteScale: 0.6,
      })
      .active(true)
      .color('#f00');

    scene.on('loaded', () => {
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
