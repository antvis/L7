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

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      // map: new GaodeMap({
      map: new Mapbox({
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        center: [120, 30],
        style: 'normal',
        zoom: 6,
        zooms: [0, 25],
        maxZoom: 25,
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {
      const point = new PointLayer({ zIndex: 7 })
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
        .shape('circle')
        .color('#ff0')
        // .active(true)
        .select(true)
        .size(10);

      this.scene.addLayer(point);

      // this.scene.on('zoom', () => console.log(this.scene.getZoom()));

      const layer = new PolygonLayer({
        featureId: 'COLOR',
        sourceLayer: 'ecoregions2',
      });
      const tileSource = new Source(
        'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      );
      layer
        .source(tileSource)
        // .color('COLOR')
        .color('#f00')
        // .color('v', v => '#ff0')
        // .color('COLOR', ['#f00', '#ff0', '#00f', '#0ff'])
        .style({
          // color: "#ff0"
          opacity: 0.6,
        })
        // .select(true);
        .active(true);

      layer.on('click', (e) => {
        console.log(e);
        // console.log(e.feature[0].coordinates)
        // console.log(turf.featureCollection(e.feature[0].coordinates))
      });
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

      // setTimeout(() => {
      //   layer.style({
      //     opacity: 0.3,
      //   });
      //   this.scene.render();
      // }, 3000);
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
