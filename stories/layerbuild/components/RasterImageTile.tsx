// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { RasterLayer } from '@antv/l7-layers';
import { Map } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [105.732421875, 32.24997445586331],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });

    scene.on('loaded', () => {
      const layer = new RasterLayer({}).source(
        'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,
            zoomOffset: 0,
            updateStrategy: 'overlap',
          },
        },
      );

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
      ></div>
    );
  }
}
