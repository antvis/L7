// @ts-ignore
import { PointLayer, Scene, ILayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class ShapeUpdate extends React.Component {
  // @ts-ignore
  private scene: Scene;
  public pointLayer: ILayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.107846, 30.267069],
        pitch: 40,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });

    this.pointLayer = new PointLayer()
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
      // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
      // .shape('circle')
      .shape('vesica')
      // .shape('cylinder')
      .color('blue')
      .size(20)
      // .size([10, 10, 50])
      .style({
        stroke: '#fff',
        storkeWidth: 2,
        // offsets: [100, 100],
      });
    scene.addLayer(this.pointLayer);
    scene.render();
    this.scene = scene;
  }

  public updateShape() {
    this.pointLayer
      .shape('cylinder')
      // .shape('hexagon')
      // .shape('triangle')
      // .shape('hexagram')
      .size([10, 10, 50]);

    // .shape('triangle')

    this.scene.render();
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
        <button
          onClick={() => {
            this.updateShape();
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 10,
          }}
        >
          update shape
        </button>
      </>
    );
  }
}
