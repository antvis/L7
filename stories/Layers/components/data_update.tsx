import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { $window } from '@antv/l7-utils';
import * as React from 'react';
// @ts-ignore
export default class DataUpdate extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'light',
        pitch: 0,
        center: [120.19382669582967, 30.258134],
        zoom: 11,
      }),
    });
    this.scene = scene;
    const radius = 0.1;

    function pointOnCircle(angle: number) {
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [
                120.19382669582967 + Math.cos(angle) * radius,
                30.258134 + Math.sin(angle) * radius,
              ],
            },
          },
        ],
      };
    }
    const layer = new PointLayer({})
      .source(pointOnCircle(0))
      .shape('circle')
      .size(15) // default 1
      .active(false)
      .color('#2F54EB')
      .style({
        stroke: '#fff',
        strokeWidth: 2,
        opacity: 1,
      });
    scene.addLayer(layer);
    layer.setData(pointOnCircle(1000));
    this.scene = scene;
    function animateMarker(timestamp: number) {
      layer.setData(pointOnCircle(timestamp / 1000));
      scene.render();
      $window.requestAnimationFrame(animateMarker);
    }
    animateMarker(0);
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
      />
    );
  }
}
