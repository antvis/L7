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
      stencil: true,
      // map: new GaodeMap({
      map: new Mapbox({
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        // center: [120, 30],
        // style: 'normal',
        // zoom: 6,
        // zooms: [0, 25],
        // maxZoom: 25,
        center: [120, 30],
        style: 'blank',
        zoom: 2,
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {
      // const point = new PointLayer({ zIndex: 7 })
      //   .source(
      //     [
      //       {
      //         lng: 120,
      //         lat: 30,
      //       },
      //     ],
      //     {
      //       parser: {
      //         type: 'json',
      //         x: 'lng',
      //         y: 'lat',
      //       },
      //     },
      //   )
      //   .shape('circle')
      //   .color('#ff0')
      //   // .active(true)
      //   .select(true)
      //   .size(10);

      // this.scene.addLayer(point);

      // this.scene.on('zoom', () => console.log(this.scene.getZoom()));

      const layer = new LineLayer({
        featureId: 'COLOR',
        sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
        // coord: 'offset'
      });
      layer
        .source(
          // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          // 'http://localhost:3000/file3.mbtiles/{z}/{x}/{y}.pbf',
          'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
          // 'http://localhost:3000/woods.mbtiles/{z}/{x}/{y}.pbf',
          // 'http://localhost:3000/zhoushan.mbtiles/{z}/{x}/{y}.pbf',
          // 'http://localhost:3000/woods.mbtiles/14/13779/5999.pbf'
          // 'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          // 'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/{z}/{x}/{y}.vector.pbf?sku=101lazXpJZeM7&access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          {
            parser: {
              type: 'mvt',
              tileSize: 256,
              zoomOffset: 0,
              maxZoom: 9,
              extent: [-180, -85.051129, 179, 85.051129],
            },
          },
        )
        .color('COLOR')
        .size(2)
        // .size('v', v => 5)
        // .color('#f00')
        // .color('v', v => '#ff0')
        // .color('COLOR', ['#f00', '#ff0', '#00f', '#0ff'])
        .style({
          // color: "#ff0"
          // opacity: 0.4,
        })
        .select(true);
      // .active(true)

      // layer.on('click', e => { console.log(e) })
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

      layer.on('click', () => {
        // @ts-ignore
        layer.tileLayer.children.map((l) => {
          console.log(l.isVisible());
        });
      });

      // setTimeout(() => {
      //   layer.size(5);
      //   this.scene.render();
      // }, 4000);
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
