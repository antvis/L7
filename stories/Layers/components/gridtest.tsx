import { HeatmapLayer, Marker, PointLayer, Scene, IPoint } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';
export default class HexagonLayerDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;
  private gui: dat.GUI;

  public componentWillUnmount() {
    this.scene.destroy();
    if (this.gui) {
      this.gui.destroy();
    }
  }
  public async componentDidMount() {
    const testPoint: [number, number] = [113.868222, 22.506306];

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: testPoint,
        pitch: 0,
        zoom: 17,
        token: '8e2254ff173dbf7ff5029e9c9df20bc3',
      }),
    });

    scene.on('loaded', () => {
      // 网格热力图
      const testList = [{ lng: testPoint[0], lat: testPoint[1], lev: 1 }];
      const layer = new HeatmapLayer({})
        .source(testList, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
          transforms: [
            {
              type: 'grid',
              size: 100,
              field: 'lev',
              method: 'sum',
            },
          ],
        })
        .shape('circle')
        .style({
          coverage: 1,
        })
        .color('count', ['#0B0030', '#6BD5A0'].reverse());
      scene.addLayer(layer);

      // marker
      // @ts-ignore
      const marker = new Marker().setLnglat(testPoint);
      scene.addMarker(marker);
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
