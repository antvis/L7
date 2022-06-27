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
        center: [-95, 37],
        // style: 'dark',
        zoom: 4.2,
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
            zoomOffset: -1,
            maxZoom: 8,
            // extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      );

      // const line = new LineLayer({
      //   featureId: 'ALAND10',
      //   sourceLayer: 'a',
      // })
      //   .source(tileSource)
      //   // .size(0.4)
      //   .size(1)
      //   .color('#f00');
      // this.scene.addLayer(line);

      const layer = new PolygonLayer({
        featureId: 'ALAND10',
        sourceLayer: 'a',
      })
        .source(tileSource)
        .style({
          // opacity: 0.6,
        })
        .color(
          'ALAND10',
          // [
          //   '#ffffd9',
          //   '#edf8b1',
          //   '#c7e9b4',
          //   '#7fcdbb',
          //   '#41b6c4',
          //   '#1d91c0',
          //   '#225ea8',
          //   '#253494',
          //   '#081d58',
          // ].reverse(),
          // [ '#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15' ]
          [
            '#227BA2',
            '#1B9CD0',
            '#22BAED',
            '#61C9FF',
            '#8AD4FF',
            '#ABDFFF',
            '#C9E9FF',
            '#F2EAEA',
            '#FFC5AC',
            '#FF895D',
            '#FFA884',
            '#FF6836',
            '#F3470D',
            '#D13808',
            '#A4300C',
          ],
        )
        .scale('ALAND10', {
          type: 'quantize',
          domain: [0, 2000000000],
        });

      this.scene.addLayer(layer);
    });
  }

  getColor() {
    const colors = ['#fdbe85', '#fd8d3c', '#e6550d', '#a63603'];
    return colors[Math.floor(Math.random() * 4)];
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
