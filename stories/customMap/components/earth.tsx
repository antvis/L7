// @ts-ignore
import { Scene } from '@antv/l7';
import { PolygonLayer, EarthLayer } from '@antv/l7-layers';
import { Earth } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Earth({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
      }),
    });

    const polygonlayer = new PolygonLayer({
      name: '01',
    })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [91.845703125, 27.527758206861886],
                  [116.630859375, 27.527758206861886],
                  [116.630859375, 36.80928470205937],
                  [91.845703125, 36.80928470205937],
                  [91.845703125, 27.527758206861886],
                ],
              ],
            },
          },
        ],
      })
      .color('#2E8AE6')
      .shape('fill')
      .style({
        opacity: 1.0,
      });
    // .animate(true)

    const layer = new EarthLayer({
      name: '01',
    })
      .source(
        // [
        //   {
        //     lng: 121.107846,
        //     lat: 30.267069
        //   },
        // ],{
        //   parser: {
        //     type: 'json',
        //     x: 'lng',
        //     y: 'lat',
        //   },
        // 'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [121.168, 30.2828, 121.384, 30.4219],
          },
        },
      )
      .color('#2E8AE6')
      .shape('fill')
      .style({
        opacity: 1.0,
        radius: 40,
      })
      .animate(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      // scene.addLayer(polygonlayer)
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
      />
    );
  }
}
