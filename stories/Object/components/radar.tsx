import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_polygon extends React.Component {
  private scene: Scene;
  public componentWillUnmount() {
    this.scene.destroy();
  }
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        center: [120, 30],
        zoom: 13,
      }),
    });
    this.scene = scene;

    const layer = new PointLayer()
      .source(
        [
          {
            lng: 120,
            lat: 30,
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
      .shape('radar')
      .size(100)
      .color('#d00')
      .style({
        // rotation: 90
        speed: 5,
      })
      .animate(true);

    scene.on('loaded', () => {
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
      />
    );
  }
}
