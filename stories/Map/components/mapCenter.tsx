// @ts-ignore
import { PointLayer, Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.107846, 30.267069],
        pitch: 0,
        style: 'dark',
        zoom: 20,
        animateEnable: false,
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // subtractive = 'subtractive',
    // min = 'min',
    // max = 'max',
    // none = 'none',
    // blend: 'additive'

    let layer = new PointLayer({ zIndex: 2, blend: 'additive' })
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: 121.107,
            lat: 30.267069,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .color('#1990FF')
      .size(40)
      .style({
        stroke: '#f00',
        strokeWidth: 3,
        strokeOpacity: 1,
      })
      .animate(true)
      .active({ color: '#ff0' });

    this.scene = scene;

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
    let c = 1
    layer.on('click', () => {
      // @ts-ignore
      c==1?scene.setEnableRender(false):scene.setEnableRender(true)
      c = 0
    });
    layer.on('contextmenu', () => console.log('contextmenu'));
    // layer.on('mousemove', (e) => {
    //   console.log(e.feature);
    // });
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
