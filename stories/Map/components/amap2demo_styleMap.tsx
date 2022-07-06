import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
export default class Amap2demo_styleMap extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [112, 30.267069],
        pitch: 0,
        style: 'dark',
        zoom: 6,
      }),
    });
    this.scene = scene;
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/450b2d95-006c-4bad-8269-15729269e142.json',
      )
        .then((res) => res.json())
        .then((data) => {
          let layer = new PointLayer({}) // blend: "additive"
            .source(data, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .color('color')
            // .color('#f00')
            .size('value', (v) => 5 + 15 * v)
            .style({
              // blur: 2.5,

              stroke: 'strokeColor',
              // stroke: ['strokeColor', (d: any) => {
              //   return d
              // }],

              strokeWidth: 'strokeWidth',
              // strokeWidth: 0,
              // strokeWidth: ["strokeWidth", (d: any) => {
              //   return d * 2
              // }],
              strokeOpacity: [
                'strokeOpacity',
                (d: any) => {
                  return d * 2;
                },
              ],

              opacity: 'opacity',
            })
            .active(true);
          scene.addLayer(layer);
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
        />
      </>
    );
  }
}
