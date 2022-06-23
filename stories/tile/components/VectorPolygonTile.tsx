import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

const cacheColors = {};
export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      map: new GaodeMap({
        // map: new Mapbox({
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        center: [-100, 37],

        style: 'dark',
        zoom: 4,
        // zooms: [3.5, 19],
        // maxZoom: 25,
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {
      const tileSource = new Source(
        // 'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        'http://localhost:3000/a.mbtiles/{z}/{x}/{y}.pbf',
        // http://localhost:3000/a.mbtiles/5/8/12.pbf
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 8,
            // extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      );

      const layer = new PolygonLayer({
        featureId: 'ALAND10',
        sourceLayer: 'a',
      });
      // console.log(layer)
      layer
        .source(tileSource)
        // .color('COLOR')
        // .color('#f00')
        // .color('v', v => '#ff0')
        .color('ALAND10', (v) => {
          // // @ts-ignore
          // if(cacheColors[v]) {
          //   // @ts-ignore
          //   return cacheColors[v];
          // } else {
          //   const c = this.getColor();
          //   // @ts-ignore
          //   cacheColors[v] = c
          //   return c;
          // }

          return this.getColor();
        });

      // layer.on('click', (e) => {
      //   console.log(e);
      //   // console.log(e.feature[0].coordinates)
      //   // console.log(turf.featureCollection(e.feature[0].coordinates))
      // });
      // layer.on('mousemove', e => console.log(e))
      // layer.on('mouseup', e => console.log(e))
      // layer.on('unmousemove', e => console.log(e))
      // layer.on('mouseenter', e => console.log(e))
      // layer.on('mouseout', e => console.log(e))
      // layer.on('mousedown', e => console.log(e))
      // layer.on('contextmenu', e => console.log(e))

      // layer.on('unclick', e => { console.log(e) })
      // layer.on('unmousemove', e => { console.log(e) })
      // layer.on('unmouseup', e => { console.log(e) })
      // layer.on('unmousedown', e => { console.log(e) })
      // layer.on('uncontextmenu', e => console.log(e))

      this.scene.addLayer(layer);
    });
  }

  getColor() {
    const colors = [
      '#f7f4f9',
      '#e7e1ef',
      '#d4b9da',
      '#c994c7',
      '#df65b0',
      '#e7298a',
      '#ce1256',
      '#980043',
      '#67001f',
    ];
    return colors[Math.floor(Math.random() * 10)];
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
