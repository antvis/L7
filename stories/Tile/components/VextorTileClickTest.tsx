// @ts-ignore
import { PointLayer, Scene, LineLayer, PolygonLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox, Map } from '@antv/l7-maps';
import * as React from 'react';
export default class GaodeMapComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public currentSelectPID: number = -1;
  public alllayers: ILayer[] = [];
  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        center: [120.11, 30.264701434772807],
        zoom: 3,
      }),
    });

    const lineLayer = new LineLayer({ zIndex: 7 })
      .source('http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf', {
        parser: {
          type: 'mvt',
          tileSize: 256,
          zoomOffset: 0,
          extent: [-180, -85.051129, 179, 85.051129],
        },
      })
      .shape('line')
      .color('#f00')
      .style({
        tileLayerName: ['city'],
      })
      .size(10);

    const polygonlayer = new PolygonLayer({ zIndex: 7 })
      .source('http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf', {
        parser: {
          type: 'mvt',
          tileSize: 256,
          zoomOffset: 0,
          extent: [-180, -85.051129, 179, 85.051129],
        },
      })
      .shape('line')
      .color('#f00')
      .style({
        tileLayerName: ['city'],
        opacity: 0.5,
      })
      .size(10);

    scene.on('loaded', () => {
      scene.addLayer(lineLayer);
      scene.addLayer(polygonlayer);
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
