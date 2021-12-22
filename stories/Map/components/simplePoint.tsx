// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class SimplePoint extends React.Component {
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
        // style: 'dark',
        zoom: 15,
      }),
    });
    // normal = 'normal',
    // additive = 'additive',
    // subtractive = 'subtractive',
    // min = 'min',
    // max = 'max',
    // none = 'none',
    // blend: 'additive'

    let layer = new PointLayer({ blend: 'additive' })
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: 121.1,
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
      .shape('simple')
      .color('#800')
      .size(15)
      .style({
        stroke: '#f00',
        strokeOpacity: 0.5,
        // strokeWidth: 10,
        // opacity: 0.5,
      })
      .active({ color: '#00f' });

    this.scene = scene;

    scene.on('loaded', () => {
      scene.addLayer(layer);
      console.log(scene.getPointSizeRange());
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
