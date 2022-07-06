import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      // stencil: true,
      map: new GaodeMap({
        center: [121, 29.4],
        // pitch: 60,
        // style: 'normal',
        zoom: 6.5,
        style: 'blank',
      }),
    });

    // this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      fetch(
        // 'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
        'https://gw.alipayobjects.com/os/bmw-prod/ecd1aaac-44c0-4232-b66c-c0ced76d5c7d.json',
      )
        .then((res) => res.json())
        .then((data) => {
          // const provincelayer = new PolygonLayer({})
          //   .source(data)
          //   .size(-150000)
          //   .shape('extrude')
          //   .color('#0DCCFF')
          //   // .active({
          //   //   color: 'rgb(100,230,255)'
          //   // })
          //   .style({
          //     heightfixed: true,
          //     // pickLight: true,
          //     // raisingHeight: 200000,
          //     opacity: 0.8,
          //     topsurface: false,
          //     targetColor: '#a1d99b',
          //     sourceColor: '#00441b',
          //   });

          // this.scene.addLayer(provincelayer);

          const layer = new RasterLayer({
            zIndex: 1,
            mask: true,
            maskfence: data,
          });
          layer
            .source(
              [
                'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                'http://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                'http://webst03.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                'http://webst04.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
              ],
              {
                parser: {
                  type: 'rasterTile',
                  tileSize: 256,
                  zoomOffset: 0,
                  extent: [-180, -85.051129, 179, 85.051129],
                },
              },
            )
            .style({
              // opacity: 0.5,
            });

          this.scene.addLayer(layer);
        });
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
