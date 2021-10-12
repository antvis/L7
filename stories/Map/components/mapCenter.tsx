// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
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
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });

    const layer = new PointLayer()
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
          {
            lng: 120.107846,
            lat: 30.267069,
          },
          {
            lng: 38.54,
            lat: 77.02,
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
      // .shape('normal')
      .color('blue')
      .size(10)
      .style({
        stroke: '#fff',
        storkeWidth: 2,
        // offsets: [100, 100],
      });
    layer.on('click', () => console.log('click'));
    scene.addLayer(layer);
    scene.render();
    this.scene = scene;

    setTimeout(() => {
      console.log(this.scene.panBy(10, 10));
    }, 1000);
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
