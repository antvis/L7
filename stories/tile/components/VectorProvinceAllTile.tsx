import * as React from 'react';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
  Popup
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
      map: new GaodeMap({
      // map: new Mapbox({
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        center: [120, 29],
        // style: 'normal',
        style: 'light',
        zoom: 7,
        zooms: [4, 19],
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {

      const tileSource = new Source(
        // 'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
        'http://localhost:3000/zhejiang.mbtiles/{z}/{x}/{y}.pbf',
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

      const linelayer = new LineLayer({
        zIndex: 1,
        featureId: 'adcode',
        sourceLayer: 'zhejiang', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        .color('#f00')
        .size(1)
      this.scene.addLayer(linelayer);

      const polygonlayer = new PolygonLayer({
        featureId: 'adcode',
        sourceLayer: 'zhejiang', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        .color('color')
        .style({
          opacity: 0.8,
        })
        .active(true);
      this.scene.addLayer(polygonlayer);

      const popup = new Popup({
        offsets: [0, 0],
        closeButton: false,
      }).setHTML(`<span></span>`);
      this.scene.addPopup(popup);

      polygonlayer.on('mousemove', e => {
        const { feature, lngLat } = e
        if(lngLat && feature.properties?.population) {
          popup.setLnglat(lngLat).setHTML(`
          <span>${feature.properties.name}人口为 ${feature.properties?.population} 万</span>
          `);
        }
      })

      const pointlayer = new PointLayer()
        .source([
          {lng: 120.153576, lat: 30.287459, name: '杭州市'},
          {lng: 121.549792, lat: 29.868388, name: '宁波市'},
          {lng: 120.672111, lat: 28.000575, name: '温州市'},
          {lng: 120.750865, lat: 30.762653, name: '嘉兴市'},
          {lng: 120.102398, lat: 30.867198, name: '湖州市'},
          {lng: 120.582112, lat: 29.997117, name: '绍兴市'},
          {lng: 119.759516, lat: 29.089524, name: '金华市'},
          {lng: 118.87263, lat: 28.941708, name: '衢州市'},
          {lng: 122.106863, lat: 30.016028, name: '舟山市'},
          {lng: 121.428599, lat: 28.661378, name: '台州市'},
          {lng: 119.921786, lat: 28.451993, name: '丽水市'}
        ], {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('name', 'text')
        .color('#f00')
        .size(16)
        .style({
          stroke: '#fff',
          strokeWidth: 1,
        });

      this.scene.addLayer(pointlayer);
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
