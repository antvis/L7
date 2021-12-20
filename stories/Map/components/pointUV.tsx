// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class PointUV extends React.Component {
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
        pitch: 40,
        // style: 'normal',
        zoom: 20,
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // subtractive = 'subtractive',
    // min = 'min',
    // max = 'max',
    // none = 'none',
    const layer = new PointLayer({ depth: false })
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
      .shape('cylinder')
      .color('#0ff')
      .size([5, 5, 100])
      .style({
        opacity: 0.6,

        sourceColor: 'red',
        targetColor: 'yellow',

        opacityLinear: {
          enable: true, // true - false
          dir: 'up', // up - down
        },

        lightEnable: false,
      });
    layer.on('click', () => console.log('click'));
    scene.addLayer(layer);
    scene.render();
    this.scene = scene;
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
